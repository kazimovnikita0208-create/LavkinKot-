const { supabase } = require('../config/supabase');
const { validateTelegramInitData } = require('../utils/telegram');
const { generateToken } = require('../utils/jwt');
const config = require('../config/env');
const { AppError } = require('../middlewares/errorHandler.middleware');

class AuthService {
  /**
   * Авторизация через Telegram
   * @param {string} initData - Telegram initData
   * @returns {Object} - { user, token }
   */
  async loginWithTelegram(initData) {
    // Валидация initData
    let telegramUser;
    
    if (config.nodeEnv === 'development' && process.env.SKIP_TELEGRAM_VALIDATION === 'true') {
      // В development режиме извлекаем без валидации
      const urlParams = new URLSearchParams(initData);
      const userDataString = urlParams.get('user');
      if (userDataString) {
        telegramUser = JSON.parse(userDataString);
      }
    } else {
      telegramUser = validateTelegramInitData(initData, config.botToken);
    }
    
    if (!telegramUser) {
      throw new AppError('Invalid Telegram data', 401);
    }
    
    // Проверяем существует ли пользователь
    const { data: existingUser, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single();
    
    let user;
    
    if (existingUser) {
      // Обновляем данные пользователя
      const { data: updatedUser, error } = await supabase
        .from('profiles')
        .update({
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_id', telegramUser.id)
        .select()
        .single();
      
      if (error) throw error;
      user = updatedUser;
    } else {
      // Создаем нового пользователя с 1 бесплатной доставкой
      const { data: newUser, error } = await supabase
        .from('profiles')
        .insert({
          telegram_id: telegramUser.id,
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          role: 'customer',
          free_deliveries_remaining: 1
        })
        .select()
        .single();
      
      if (error) throw error;
      user = newUser;
    }
    
    // Генерируем JWT токен
    const token = generateToken({
      sub: user.id,
      telegram_id: user.telegram_id,
      role: user.role
    });
    
    return { user, token };
  }
  
  /**
   * Получение текущего пользователя
   * @param {string} userId - ID пользователя
   * @returns {Object} - Пользователь
   */
  async getCurrentUser(userId) {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return user;
  }
  
  /**
   * Получение пользователя с подпиской
   * @param {string} userId - ID пользователя
   * @returns {Object} - Пользователь с подпиской
   */
  async getUserWithSubscription(userId) {
    const { data: user, error } = await supabase
      .from('profiles')
      .select(`
        *,
        subscription:customer_subscriptions(
          *,
          plan:subscription_plans(*)
        )
      `)
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    // Фильтруем только активную подписку
    if (user.subscription) {
      user.subscription = user.subscription.find(
        sub => sub.status === 'active' && new Date(sub.expires_at) > new Date()
      );
    }
    
    return user;
  }
  
  /**
   * Dev-режим авторизации (только для разработки!)
   * Создаёт или возвращает тестового пользователя с нужной ролью
   * @param {string} role - Роль: customer | courier | partner | admin
   * @returns {Object} - { user, token }
   */
  async devLogin(role = 'customer') {
    const validRoles = ['customer', 'courier', 'partner', 'admin'];
    if (!validRoles.includes(role)) {
      throw new AppError(`Invalid role. Use one of: ${validRoles.join(', ')}`, 400);
    }

    // У каждой роли свой фиксированный telegram_id для удобства
    const roleTelegramIds = {
      customer: 100000001,
      courier:  100000002,
      partner:  100000003,
      admin:    100000004,
    };

    const roleNames = {
      customer: { first: 'Тестовый', last: 'Клиент',   username: 'dev_customer' },
      courier:  { first: 'Тестовый', last: 'Курьер',   username: 'dev_courier'  },
      partner:  { first: 'Тестовый', last: 'Партнёр',  username: 'dev_partner'  },
      admin:    { first: 'Тестовый', last: 'Админ',    username: 'dev_admin'    },
    };

    const telegramId = roleTelegramIds[role];
    const names = roleNames[role];

    // Ищем существующего dev-пользователя для этой роли
    let { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (user) {
      // Если роль изменилась — обновляем
      if (user.role !== role) {
        const updateData = { role, updated_at: new Date().toISOString() };

        // Для партнёра подбираем shop_id
        if (role === 'partner') {
          const { data: shop } = await supabase
            .from('shops')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single();
          if (shop) updateData.shop_id = shop.id;
        } else {
          updateData.shop_id = null;
        }

        const { data: updated } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single();
        if (updated) user = updated;
      }
    } else {
      // Создаём нового dev-пользователя
      const insertData = {
        telegram_id: telegramId,
        username: names.username,
        first_name: names.first,
        last_name: names.last,
        phone: '+7 (900) 000-00-0' + Object.keys(roleTelegramIds).indexOf(role),
        role,
        default_district: 'Октябрьский',
        default_street: 'ул. Тестовая',
        default_house: '1',
        default_apartment: String(Object.keys(roleTelegramIds).indexOf(role) + 1),
        free_deliveries_remaining: 3,
      };

      // Для партнёра назначаем первый активный магазин
      if (role === 'partner') {
        const { data: shop } = await supabase
          .from('shops')
          .select('id')
          .eq('is_active', true)
          .limit(1)
          .single();
        if (shop) insertData.shop_id = shop.id;
      }

      const { data: newUser, error } = await supabase
        .from('profiles')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      user = newUser;
    }

    const token = generateToken({
      sub: user.id,
      telegram_id: user.telegram_id,
      role: user.role
    });

    return { user, token };
  }
}

module.exports = new AuthService();
