const { supabase } = require('../config/supabase');
const { ORDER_STATUS, ONE_TIME_DELIVERY_FEE } = require('../config/constants');
const { calculateOffset, paginateResponse } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorHandler.middleware');
const { notifyOrderStatusChange } = require('../utils/notifications');

class OrdersService {
  /**
   * Создание заказа
   * @param {Object} orderData - Данные заказа
   * @param {string} userId - ID пользователя
   * @returns {Object} - Созданный заказ
   */
  async createOrder(orderData, userId) {
    const {
      shop_id,
      items,
      delivery_street,
      delivery_house,
      delivery_entrance,
      delivery_floor,
      delivery_apartment,
      delivery_date,
      delivery_time_slot,
      contact_phone,
      use_subscription,
      leave_at_door,
      comment
    } = orderData;
    
    // Получаем информацию о товарах
    const productIds = items.map(item => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    if (productsError) throw productsError;
    
    // Проверяем что все товары найдены
    if (products.length !== productIds.length) {
      throw new AppError('Some products not found', 400);
    }
    
    // Проверяем что все товары из одного магазина
    const shopIds = [...new Set(products.map(p => p.shop_id))];
    if (shopIds.length > 1 || shopIds[0] !== shop_id) {
      throw new AppError('All products must be from the same shop', 400);
    }
    
    // Рассчитываем стоимость
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      
      if (!product.in_stock) {
        throw new AppError(`Product "${product.name}" is out of stock`, 400);
      }
      
      const price = item.price || parseFloat(product.price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      
      return {
        product_id: product.id,
        product_name: product.name,
        product_price: price,
        product_weight: product.weight,
        quantity: item.quantity,
        total: itemTotal
      };
    });
    
    // Определяем способ оплаты доставки
    let deliveryFee = 0;
    let paymentMethod = 'one_time';
    let useFreeDelivery = false;
    let useSubscriptionDelivery = false;
    
    if (use_subscription) {
      // Сначала проверяем бесплатные доставки
      const { data: profile } = await supabase
        .from('profiles')
        .select('free_deliveries_remaining')
        .eq('id', userId)
        .single();
      
      if (profile && profile.free_deliveries_remaining > 0) {
        deliveryFee = 0;
        paymentMethod = 'subscription';
        useFreeDelivery = true;
      } else {
        // Проверяем подписку
        const { data: subscription } = await supabase
          .from('customer_subscriptions')
          .select('*')
          .eq('profile_id', userId)
          .eq('status', 'active')
          .gte('deliveries_remaining', 1)
          .gte('expires_at', new Date().toISOString())
          .single();
        
        if (subscription) {
          deliveryFee = 0;
          paymentMethod = 'subscription';
          useSubscriptionDelivery = true;
        } else {
          throw new AppError('No free deliveries or active subscription available', 400);
        }
      }
    } else {
      deliveryFee = ONE_TIME_DELIVERY_FEE;
      paymentMethod = 'one_time';
    }
    
    const total = subtotal + deliveryFee;
    
    // Создаем заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: userId,
        shop_id: shop_id,
        status: ORDER_STATUS.CREATED,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        delivery_district: 'Октябрьский',
        delivery_street,
        delivery_house,
        delivery_entrance: delivery_entrance || null,
        delivery_floor: delivery_floor || null,
        delivery_apartment,
        delivery_comment: comment || null,
        delivery_date,
        delivery_time_slot: delivery_time_slot || '10:00 - 12:00',
        leave_at_door: leave_at_door || false,
        customer_phone: contact_phone,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'subscription' ? 'paid' : 'pending'
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Создаем элементы заказа
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);
    
    if (itemsError) throw itemsError;
    
    // Списываем доставку
    if (useFreeDelivery) {
      await this.useFreeDelivery(userId);
    } else if (useSubscriptionDelivery) {
      await this.useSubscriptionDelivery(userId, order.id);
    }
    
    // Добавляем запись в историю статусов
    await supabase
      .from('status_history')
      .insert({
        order_id: order.id,
        status: ORDER_STATUS.CREATED,
        changed_by: userId,
        notes: 'Order created'
      });
    
    return this.getOrderById(order.id, userId);
  }
  
  /**
   * Списание бесплатной доставки
   */
  async useFreeDelivery(userId) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('free_deliveries_remaining')
      .eq('id', userId)
      .single();
    
    if (error || !profile || profile.free_deliveries_remaining <= 0) {
      throw new AppError('No free deliveries available', 400);
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        free_deliveries_remaining: profile.free_deliveries_remaining - 1
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
  }
  
  /**
   * Списание доставки из подписки
   */
  async useSubscriptionDelivery(userId, orderId) {
    const { data: subscription, error: subError } = await supabase
      .from('customer_subscriptions')
      .select('*')
      .eq('profile_id', userId)
      .eq('status', 'active')
      .gte('deliveries_remaining', 1)
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (subError || !subscription) {
      throw new AppError('No active subscription', 400);
    }
    
    const { error: updateError } = await supabase
      .from('customer_subscriptions')
      .update({
        deliveries_remaining: subscription.deliveries_remaining - 1,
        deliveries_used: subscription.deliveries_used + 1
      })
      .eq('id', subscription.id);
    
    if (updateError) throw updateError;
    
    await supabase
      .from('subscription_transactions')
      .insert({
        subscription_id: subscription.id,
        profile_id: userId,
        type: 'delivery_used',
        deliveries_delta: -1,
        order_id: orderId,
        description: 'Delivery used for order'
      });
  }
  
  /**
   * Получение заказов пользователя
   */
  async getUserOrders(userId, { status, page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        shop:shops(id, name, image_url),
        order_items(*)
      `, { count: 'exact' })
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const offset = calculateOffset(page, limit);
    query = query.range(offset, offset + limit - 1);
    
    const { data: orders, error, count } = await query;
    
    if (error) throw error;
    
    return paginateResponse(orders, count, page, limit);
  }
  
  /**
   * Получение деталей заказа
   */
  async getOrderById(orderId, userId = null) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        shop:shops(id, name, image_url, address),
        order_items(
          *,
          product:products(id, name, image_url)
        ),
        courier:profiles!courier_id(id, first_name, last_name, phone),
        status_history(*)
      `)
      .eq('id', orderId);
    
    if (userId) {
      query = query.eq('profile_id', userId);
    }
    
    const { data: order, error } = await query.single();
    
    if (error) throw error;
    return order;
  }
  
  /**
   * Получение статуса заказа
   */
  async getOrderStatus(orderId, userId) {
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status, updated_at, courier:profiles!courier_id(first_name, phone)')
      .eq('id', orderId)
      .eq('profile_id', userId)
      .single();
    
    if (error) throw error;
    return order;
  }
  
  /**
   * Отмена заказа
   */
  async cancelOrder(orderId, userId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('profile_id', userId)
      .single();
    
    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }
    
    if (![ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED].includes(order.status)) {
      throw new AppError('Cannot cancel order at this stage', 400);
    }
    
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: ORDER_STATUS.CANCELLED,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    // Если оплата была по подписке - возвращаем доставку
    if (order.payment_method === 'subscription') {
      await this.refundSubscriptionDelivery(userId, orderId);
    }
    
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: ORDER_STATUS.CANCELLED,
        changed_by: userId,
        notes: 'Order cancelled by customer'
      });

    // Уведомление пользователю об отмене
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_id')
      .eq('id', userId)
      .single();

    if (profile?.telegram_id) {
      notifyOrderStatusChange({
        telegramId: profile.telegram_id,
        orderNumber: order.order_number,
        status: 'cancelled',
        orderId,
      }).catch(() => {});
    }
    
    return { success: true };
  }
  
  /**
   * Возврат доставки в подписку
   */
  async refundSubscriptionDelivery(userId, orderId) {
    const { data: transaction } = await supabase
      .from('subscription_transactions')
      .select('*')
      .eq('order_id', orderId)
      .eq('type', 'delivery_used')
      .single();
    
    if (!transaction) return;
    
    // Возвращаем доставку
    await supabase.rpc('increment_deliveries', {
      subscription_id: transaction.subscription_id
    });
    
    await supabase
      .from('subscription_transactions')
      .insert({
        subscription_id: transaction.subscription_id,
        profile_id: userId,
        type: 'refund',
        deliveries_delta: 1,
        order_id: orderId,
        description: 'Delivery refunded for cancelled order'
      });
  }
}

module.exports = new OrdersService();
