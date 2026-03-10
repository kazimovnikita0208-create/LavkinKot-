const { supabase } = require('../config/supabase');
const { AppError } = require('../middlewares/errorHandler.middleware');

class ProfileService {
  /**
   * Получение профиля пользователя
   * @param {string} userId - ID пользователя
   * @returns {Object} - Профиль
   */
  async getProfile(userId) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        subscription:customer_subscriptions(
          *,
          plan:subscription_plans(*)
        ),
        shop:shops(id, name, slug)
      `)
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    // Фильтруем только активную подписку
    if (profile.subscription && Array.isArray(profile.subscription)) {
      profile.subscription = profile.subscription.find(
        sub => sub.status === 'active' && new Date(sub.expires_at) > new Date()
      ) || null;
    }
    
    return profile;
  }
  
  /**
   * Обновление профиля
   * @param {string} userId - ID пользователя
   * @param {Object} data - Данные для обновления
   * @returns {Object} - Обновленный профиль
   */
  async updateProfile(userId, data) {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return profile;
  }
  
  /**
   * Обновление адреса по умолчанию
   * @param {string} userId - ID пользователя
   * @param {Object} address - Данные адреса
   * @returns {Object} - Обновленный профиль
   */
  async updateDefaultAddress(userId, address) {
    const updateData = {
      default_district: address.district,
      default_street: address.street,
      default_house: address.house,
      default_entrance: address.entrance || null,
      default_floor: address.floor || null,
      default_apartment: address.apartment,
      updated_at: new Date().toISOString()
    };
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return profile;
  }
  
  /**
   * Получение статистики пользователя
   * @param {string} userId - ID пользователя
   * @returns {Object} - Статистика
   */
  async getUserStats(userId) {
    // Количество заказов
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId);
    
    // Сумма заказов
    const { data: ordersSum } = await supabase
      .from('orders')
      .select('total')
      .eq('profile_id', userId)
      .eq('status', 'delivered');
    
    const totalSpent = ordersSum?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
    
    // Активная подписка
    const { data: subscription } = await supabase
      .from('customer_subscriptions')
      .select('*, plan:subscription_plans(name)')
      .eq('profile_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .single();
    
    return {
      ordersCount: ordersCount || 0,
      totalSpent,
      hasActiveSubscription: !!subscription,
      subscription: subscription || null
    };
  }
}

module.exports = new ProfileService();
