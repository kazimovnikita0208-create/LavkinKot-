const { supabase } = require('../config/supabase');
const { ORDER_STATUS } = require('../config/constants');
const { calculateOffset, paginateResponse, startOfDay, endOfDay } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorHandler.middleware');

class PartnerService {
  /**
   * Получение магазина партнёра
   * @param {string} userId - ID пользователя
   * @returns {Object} - Магазин
   */
  async getPartnerShop(userId) {
    // Получаем профиль с shop_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('shop_id')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile.shop_id) {
      throw new AppError('Shop not found', 404);
    }
    
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', profile.shop_id)
      .single();
    
    if (error) throw error;
    return shop;
  }
  
  /**
   * Обновление магазина партнёра
   * @param {string} userId - ID пользователя
   * @param {Object} data - Данные для обновления
   * @returns {Object} - Обновленный магазин
   */
  async updatePartnerShop(userId, data) {
    const shop = await this.getPartnerShop(userId);
    
    const { data: updatedShop, error } = await supabase
      .from('shops')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', shop.id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedShop;
  }
  
  /**
   * Получение товаров магазина партнёра
   * @param {string} userId - ID пользователя
   * @param {Object} params - Query параметры
   * @returns {Object} - Список товаров
   */
  async getPartnerProducts(userId, { category, search, page = 1, limit = 50 }) {
    const shop = await this.getPartnerShop(userId);
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('shop_id', shop.id)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    const offset = calculateOffset(page, limit);
    query = query.range(offset, offset + limit - 1);
    
    const { data: products, error, count } = await query;
    
    if (error) throw error;
    return paginateResponse(products, count, page, limit);
  }
  
  /**
   * Создание товара
   * @param {string} userId - ID пользователя
   * @param {Object} productData - Данные товара
   * @returns {Object} - Созданный товар
   */
  async createProduct(userId, productData) {
    const shop = await this.getPartnerShop(userId);
    
    console.log('Creating product with data:', JSON.stringify(productData, null, 2));
    
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        shop_id: shop.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create product error:', error);
      throw error;
    }
    
    console.log('Product created:', JSON.stringify(product, null, 2));
    return product;
  }
  
  /**
   * Обновление товара
   * @param {string} userId - ID пользователя
   * @param {string} productId - ID товара
   * @param {Object} productData - Данные товара
   * @returns {Object} - Обновленный товар
   */
  async updateProduct(userId, productId, productData) {
    const shop = await this.getPartnerShop(userId);
    
    // Проверяем что товар принадлежит магазину
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('shop_id', shop.id)
      .single();
    
    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }
    
    console.log('Updating product with data:', JSON.stringify(productData, null, 2));
    
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('Update product error:', error);
      throw error;
    }
    
    console.log('Product updated:', JSON.stringify(product, null, 2));
    return product;
  }
  
  /**
   * Удаление товара
   * @param {string} userId - ID пользователя
   * @param {string} productId - ID товара
   */
  async deleteProduct(userId, productId) {
    const shop = await this.getPartnerShop(userId);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('shop_id', shop.id);
    
    if (error) throw error;
    return { success: true };
  }
  
  /**
   * Получение заказов магазина
   * @param {string} userId - ID пользователя
   * @param {Object} params - Query параметры
   * @returns {Object} - Список заказов
   */
  async getPartnerOrders(userId, { status, page = 1, limit = 20 }) {
    const shop = await this.getPartnerShop(userId);
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        profile:profiles!orders_profile_id_fkey(id, first_name, last_name, phone),
        order_items(*),
        courier:profiles!orders_courier_id_fkey(id, first_name, last_name, phone)
      `, { count: 'exact' })
      .eq('shop_id', shop.id)
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
   * Принять заказ
   * @param {string} userId - ID пользователя
   * @param {string} orderId - ID заказа
   */
  async acceptOrder(userId, orderId) {
    const shop = await this.getPartnerShop(userId);
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('shop_id', shop.id)
      .single();
    
    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }
    
    if (order.status !== ORDER_STATUS.CREATED) {
      throw new AppError('Order cannot be accepted', 400);
    }
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: ORDER_STATUS.ACCEPTED,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: ORDER_STATUS.ACCEPTED,
        changed_by: userId,
        notes: 'Order accepted by partner'
      });
    
    return { success: true };
  }
  
  /**
   * Заказ готов
   * @param {string} userId - ID пользователя
   * @param {string} orderId - ID заказа
   */
  async markOrderReady(userId, orderId) {
    const shop = await this.getPartnerShop(userId);
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('shop_id', shop.id)
      .single();
    
    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }
    
    if (![ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING].includes(order.status)) {
      throw new AppError('Order cannot be marked as ready', 400);
    }
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: ORDER_STATUS.READY,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: ORDER_STATUS.READY,
        changed_by: userId,
        notes: 'Order ready for pickup'
      });
    
    return { success: true };
  }
  
  /**
   * Аналитика магазина
   * @param {string} userId - ID пользователя
   * @returns {Object} - Статистика
   */
  async getPartnerAnalytics(userId) {
    const shop = await this.getPartnerShop(userId);
    const today = startOfDay();
    
    // Дата неделю назад
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    
    // Заказы за сегодня
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('id, total, status')
      .eq('shop_id', shop.id)
      .gte('created_at', today.toISOString());
    
    const todayOrdersCount = todayOrders?.length || 0;
    const todayRevenue = todayOrders
      ?.filter(o => ['delivered', 'ready', 'delivering'].includes(o.status))
      .reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
    
    // Все заказы для статистики
    const { data: allOrders } = await supabase
      .from('orders')
      .select('id, total, status, created_at')
      .eq('shop_id', shop.id);
    
    const totalOrders = allOrders?.length || 0;
    
    // Заказы по статусам
    const ordersByStatus = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      delivering: 0,
      delivered: 0,
      cancelled: 0
    };
    
    allOrders?.forEach(order => {
      if (ordersByStatus.hasOwnProperty(order.status)) {
        ordersByStatus[order.status]++;
      }
    });
    
    // Выполненные заказы (для расчёта выручки)
    const completedOrders = allOrders?.filter(o => 
      ['delivered', 'ready', 'delivering'].includes(o.status)
    ) || [];
    
    const totalRevenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    
    // Средний чек (по выполненным заказам)
    const avgOrderValue = completedOrders.length > 0 
      ? totalRevenue / completedOrders.length 
      : 0;
    
    // Заказы за последние 7 дней
    const weekOrders = allOrders?.filter(o => 
      new Date(o.created_at) >= weekAgo
    ) || [];
    
    const weekRevenue = weekOrders
      .filter(o => ['delivered', 'ready', 'delivering'].includes(o.status))
      .reduce((sum, o) => sum + parseFloat(o.total), 0);
    
    // Активные товары
    const { count: activeProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .eq('in_stock', true);
    
    // Всего товаров
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id);
    
    // Топ продаваемые товары (из order_items)
    const { data: topProductsData } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        product:products(id, name, price, image_url)
      `)
      .in('order_id', (allOrders || []).map(o => o.id))
      .not('product', 'is', null);
    
    // Агрегация топ товаров
    const productSales = {};
    topProductsData?.forEach(item => {
      if (item.product) {
        const id = item.product_id;
        if (!productSales[id]) {
          productSales[id] = {
            id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url,
            totalSold: 0
          };
        }
        productSales[id].totalSold += item.quantity;
      }
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
    
    return {
      // Сегодня
      todayOrdersCount,
      todayRevenue: Math.round(todayRevenue),
      
      // За неделю
      weekOrdersCount: weekOrders.length,
      weekRevenue: Math.round(weekRevenue),
      
      // Всего
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      completedOrders: completedOrders.length,
      
      // Показатели
      avgOrderValue: Math.round(avgOrderValue),
      activeProducts: activeProducts || 0,
      totalProducts: totalProducts || 0,
      
      // Заказы по статусам
      ordersByStatus,
      
      // Топ товары
      topProducts,
      
      // Магазин
      rating: parseFloat(shop.rating) || 0,
      reviewsCount: shop.reviews_count || 0
    };
  }
}

module.exports = new PartnerService();
