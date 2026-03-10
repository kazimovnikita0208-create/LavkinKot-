const { supabase } = require('../config/supabase');
const { AppError } = require('../middlewares/errorHandler.middleware');
const { addDays } = require('../utils/helpers');

class SubscriptionsService {
  /**
   * Получение всех тарифных планов
   * @returns {Array} - Список планов
   */
  async getPlans() {
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return plans;
  }
  
  /**
   * Получение плана по ID
   * @param {string} planId - ID плана
   * @returns {Object} - План
   */
  async getPlanById(planId) {
    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return plan;
  }
  
  /**
   * Получение активной подписки пользователя
   * @param {string} userId - ID пользователя
   * @returns {Object|null} - Подписка или null
   */
  async getUserSubscription(userId) {
    const { data: subscription, error } = await supabase
      .from('customer_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('profile_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return subscription || null;
  }
  
  /**
   * Активация подписки
   * @param {Object} data - Данные для активации
   * @param {string} userId - ID пользователя
   * @returns {Object} - Созданная подписка
   */
  async activateSubscription(data, userId) {
    const { planId } = data;
    
    // Получаем план
    const plan = await this.getPlanById(planId);
    
    if (!plan) {
      throw new AppError('Plan not found', 404);
    }
    
    // Проверяем есть ли уже активная подписка
    const existingSubscription = await this.getUserSubscription(userId);
    
    if (existingSubscription) {
      throw new AppError('User already has active subscription', 400);
    }
    
    // Рассчитываем дату истечения
    const startDate = new Date();
    const expiresAt = addDays(startDate, plan.duration_days);
    
    // Создаем подписку
    const { data: subscription, error: subError } = await supabase
      .from('customer_subscriptions')
      .insert({
        profile_id: userId,
        plan_id: planId,
        status: 'active',
        deliveries_remaining: plan.deliveries_limit,
        deliveries_used: 0,
        started_at: startDate.toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .single();
    
    if (subError) throw subError;
    
    // Записываем транзакцию покупки
    await supabase
      .from('subscription_transactions')
      .insert({
        subscription_id: subscription.id,
        profile_id: userId,
        type: 'purchase',
        amount: plan.price,
        description: `Purchased ${plan.name} subscription`
      });
    
    return subscription;
  }
  
  /**
   * Получение истории транзакций
   * @param {string} userId - ID пользователя
   * @returns {Array} - Список транзакций
   */
  async getTransactions(userId) {
    const { data: transactions, error } = await supabase
      .from('subscription_transactions')
      .select(`
        *,
        subscription:customer_subscriptions(
          id,
          plan:subscription_plans(name)
        ),
        order:orders(id, order_number)
      `)
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return transactions;
  }
  
  /**
   * Проверка и обновление истекших подписок
   */
  async checkExpiredSubscriptions() {
    const { error } = await supabase
      .from('customer_subscriptions')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString());
    
    if (error) throw error;
  }
}

module.exports = new SubscriptionsService();
