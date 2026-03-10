const { supabase } = require('../config/supabase');
const { ORDER_STATUS, COURIER_EARNING_PER_DELIVERY } = require('../config/constants');
const { startOfDay } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorHandler.middleware');

class CourierService {
  /**
   * Начать смену
   * @param {string} courierId - ID курьера
   * @returns {Object} - Смена
   */
  async startShift(courierId) {
    // Проверяем есть ли уже активная смена
    const { data: activeShift } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .eq('is_active', true)
      .single();
    
    if (activeShift) {
      throw new AppError('Shift already active', 400);
    }
    
    // Создаем новую смену
    const { data: shift, error } = await supabase
      .from('courier_shifts')
      .insert({
        courier_id: courierId,
        started_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return shift;
  }
  
  /**
   * Завершить смену
   * @param {string} courierId - ID курьера
   * @returns {Object} - Смена
   */
  async endShift(courierId) {
    // Получаем активную смену
    const { data: shift, error: shiftError } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .eq('is_active', true)
      .single();
    
    if (shiftError || !shift) {
      throw new AppError('No active shift found', 404);
    }
    
    // Обновляем смену
    const { data: updatedShift, error } = await supabase
      .from('courier_shifts')
      .update({
        ended_at: new Date().toISOString(),
        is_active: false
      })
      .eq('id', shift.id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedShift;
  }
  
  /**
   * Получить текущую смену
   * @param {string} courierId - ID курьера
   * @returns {Object|null} - Смена или null
   */
  async getCurrentShift(courierId) {
    const { data: shift, error } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return shift || null;
  }
  
  /**
   * Получить заказы курьера (назначенные + доступные)
   * @param {string} courierId - ID курьера
   * @returns {Array} - Список заказов
   */
  async getCourierOrders(courierId) {
    // Проверяем что курьер на смене
    const shift = await this.getCurrentShift(courierId);
    
    if (!shift) {
      throw new AppError('You must be on shift to see orders', 400);
    }
    
    // Получаем заказы: мои назначенные + готовые к доставке
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        shop:shops(id, name, address),
        order_items(*)
      `)
      .or(`courier_id.eq.${courierId},and(status.eq.ready,courier_id.is.null)`)
      .in('status', [
        ORDER_STATUS.READY,
        ORDER_STATUS.COURIER_ASSIGNED,
        ORDER_STATUS.PICKED_UP,
        ORDER_STATUS.IN_TRANSIT
      ])
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return orders;
  }
  
  /**
   * Взять заказ
   * @param {string} orderId - ID заказа
   * @param {string} courierId - ID курьера
   */
  async assignOrder(orderId, courierId) {
    // Проверяем что курьер на смене
    const shift = await this.getCurrentShift(courierId);
    
    if (!shift) {
      throw new AppError('You must be on shift to take orders', 400);
    }
    
    // Проверяем заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }
    
    if (order.status !== ORDER_STATUS.READY) {
      throw new AppError('Order is not ready for pickup', 400);
    }
    
    if (order.courier_id && order.courier_id !== courierId) {
      throw new AppError('Order already assigned to another courier', 400);
    }
    
    // Назначаем курьера
    const { error } = await supabase
      .from('orders')
      .update({
        courier_id: courierId,
        status: ORDER_STATUS.COURIER_ASSIGNED,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: ORDER_STATUS.COURIER_ASSIGNED,
        changed_by: courierId,
        notes: 'Courier assigned'
      });
    
    return { success: true };
  }
  
  /**
   * Забрать заказ
   * @param {string} orderId - ID заказа
   * @param {string} courierId - ID курьера
   */
  async pickupOrder(orderId, courierId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('courier_id', courierId)
      .single();
    
    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }
    
    if (![ORDER_STATUS.READY, ORDER_STATUS.COURIER_ASSIGNED].includes(order.status)) {
      throw new AppError('Order cannot be picked up', 400);
    }
    
    const { error } = await supabase
      .from('orders')
      .update({
        status: ORDER_STATUS.PICKED_UP,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: ORDER_STATUS.PICKED_UP,
        changed_by: courierId,
        notes: 'Order picked up by courier'
      });
    
    return { success: true };
  }
  
  /**
   * Доставить заказ
   * @param {string} orderId - ID заказа
   * @param {string} courierId - ID курьера
   */
  async deliverOrder(orderId, courierId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('courier_id', courierId)
      .single();
    
    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }
    
    if (![ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT].includes(order.status)) {
      throw new AppError('Order cannot be delivered', 400);
    }
    
    // Обновляем заказ
    const { error } = await supabase
      .from('orders')
      .update({
        status: ORDER_STATUS.DELIVERED,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // Обновляем смену
    const shift = await this.getCurrentShift(courierId);
    
    if (shift) {
      await supabase
        .from('courier_shifts')
        .update({
          deliveries_count: shift.deliveries_count + 1,
          total_earnings: parseFloat(shift.total_earnings) + COURIER_EARNING_PER_DELIVERY
        })
        .eq('id', shift.id);
    }
    
    // Добавляем в историю
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: ORDER_STATUS.DELIVERED,
        changed_by: courierId,
        notes: 'Order delivered'
      });
    
    return { success: true };
  }
  
  /**
   * Получить статистику курьера
   * @param {string} courierId - ID курьера
   * @returns {Object} - Статистика
   */
  async getCourierStats(courierId) {
    const today = startOfDay();
    
    // Статистика за сегодня
    const { data: todayShifts } = await supabase
      .from('courier_shifts')
      .select('deliveries_count, total_earnings')
      .eq('courier_id', courierId)
      .gte('started_at', today.toISOString());
    
    const todayDeliveries = todayShifts?.reduce((sum, shift) => sum + shift.deliveries_count, 0) || 0;
    const todayEarnings = todayShifts?.reduce((sum, shift) => sum + parseFloat(shift.total_earnings), 0) || 0;
    
    // Общая статистика
    const { data: allShifts } = await supabase
      .from('courier_shifts')
      .select('deliveries_count, total_earnings')
      .eq('courier_id', courierId);
    
    const totalDeliveries = allShifts?.reduce((sum, shift) => sum + shift.deliveries_count, 0) || 0;
    const totalEarnings = allShifts?.reduce((sum, shift) => sum + parseFloat(shift.total_earnings), 0) || 0;
    
    // Текущая смена
    const currentShift = await this.getCurrentShift(courierId);
    
    // Средний рейтинг (заглушка)
    const rating = 4.9;
    
    return {
      todayDeliveries,
      todayEarnings,
      totalDeliveries,
      totalEarnings,
      rating,
      isOnShift: !!currentShift,
      currentShift
    };
  }
}

module.exports = new CourierService();
