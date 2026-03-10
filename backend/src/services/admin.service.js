const { supabase } = require('../config/supabase');
const { calculateOffset, paginateResponse, startOfDay } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorHandler.middleware');
const { notifyOrderStatusChange, notifyCourierAssigned } = require('../utils/notifications');

class AdminService {
  /**
   * Получение всех заказов
   */
  async getAllOrders({ status, shop_id, from_date, to_date, page = 1, limit = 20 }) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        profile:profiles!orders_profile_id_fkey(id, first_name, last_name, phone, telegram_id),
        shop:shops(id, name),
        courier:profiles!orders_courier_id_fkey(id, first_name, last_name),
        order_items(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (shop_id) {
      query = query.eq('shop_id', shop_id);
    }
    
    if (from_date) {
      query = query.gte('created_at', from_date);
    }
    
    if (to_date) {
      query = query.lte('created_at', to_date);
    }
    
    const offset = calculateOffset(page, limit);
    query = query.range(offset, offset + limit - 1);
    
    const { data: orders, error, count } = await query;
    
    if (error) throw error;
    return paginateResponse(orders, count, page, limit);
  }
  
  /**
   * Редактирование заказа
   */
  async updateOrder(orderId, data) {
    // Получаем старый заказ для сравнения статуса
    const { data: oldOrder } = await supabase
      .from('orders')
      .select('status, order_number, profile_id, courier_id, shop:shops(name), delivery_street, delivery_house')
      .eq('id', orderId)
      .single();

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;

    // Отправляем уведомление при смене статуса
    if (oldOrder && data.status && data.status !== oldOrder.status) {
      // Получаем telegram_id покупателя
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', oldOrder.profile_id)
        .single();

      if (profile?.telegram_id) {
        notifyOrderStatusChange({
          telegramId: profile.telegram_id,
          orderNumber: oldOrder.order_number,
          status: data.status,
          orderId,
        }).catch(() => {}); // fire-and-forget
      }

      // Уведомляем курьера при назначении
      if (data.status === 'courier_assigned' && data.courier_id) {
        const { data: courier } = await supabase
          .from('profiles')
          .select('telegram_id')
          .eq('id', data.courier_id)
          .single();

        if (courier?.telegram_id) {
          notifyCourierAssigned({
            courierTelegramId: courier.telegram_id,
            orderNumber: oldOrder.order_number,
            shopName: oldOrder.shop?.name || 'Магазин',
            deliveryAddress: `${oldOrder.delivery_street}, ${oldOrder.delivery_house}`,
          }).catch(() => {}); // fire-and-forget
        }
      }
    }

    return order;
  }
  
  /**
   * Получение всех пользователей
   */
  async getAllUsers({ role, search, page = 1, limit = 20 }) {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (role) {
      query = query.eq('role', role);
    }
    
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,username.ilike.%${search}%`);
    }
    
    const offset = calculateOffset(page, limit);
    query = query.range(offset, offset + limit - 1);
    
    const { data: users, error, count } = await query;
    
    if (error) throw error;
    return paginateResponse(users, count, page, limit);
  }
  
  /**
   * Изменение роли пользователя
   */
  async updateUserRole(userId, { role, shop_id }) {
    const updateData = {
      role,
      updated_at: new Date().toISOString()
    };
    
    // Если назначаем партнёра - привязываем магазин
    if (role === 'partner' && shop_id) {
      updateData.shop_id = shop_id;
    }
    
    // Если убираем роль партнёра - отвязываем магазин
    if (role !== 'partner') {
      updateData.shop_id = null;
    }
    
    const { data: user, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return user;
  }
  
  /**
   * Получение всех магазинов
   */
  async getAllShops({ category, is_active, search, page = 1, limit = 20 }) {
    let query = supabase
      .from('shops')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    const offset = calculateOffset(page, limit);
    query = query.range(offset, offset + limit - 1);
    
    const { data: shops, error, count } = await query;
    
    if (error) throw error;
    return paginateResponse(shops, count, page, limit);
  }
  
  /**
   * Редактирование магазина
   */
  async updateShop(shopId, data) {
    const { data: shop, error } = await supabase
      .from('shops')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) throw error;
    return shop;
  }
  
  /**
   * Создание магазина
   */
  async createShop(data) {
    // Генерируем slug из названия
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const { data: shop, error } = await supabase
      .from('shops')
      .insert({
        ...data,
        slug: `${slug}-${Date.now()}`
      })
      .select()
      .single();
    
    if (error) throw error;
    return shop;
  }
  
  /**
   * Получение всех курьеров
   */
  async getAllCouriers({ is_active, search, page = 1, limit = 20 }) {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        active_shift:courier_shifts(id, started_at, deliveries_count, total_earnings)
      `, { count: 'exact' })
      .eq('role', 'courier')
      .order('created_at', { ascending: false });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }
    
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }
    
    const offset = calculateOffset(page, limit);
    query = query.range(offset, offset + limit - 1);
    
    const { data: couriers, error, count } = await query;
    
    if (error) throw error;
    
    // Фильтруем только активные смены
    couriers.forEach(courier => {
      if (courier.active_shift) {
        courier.active_shift = courier.active_shift.find(s => s.ended_at === null);
      }
    });
    
    return paginateResponse(couriers, count, page, limit);
  }
  
  /**
   * Статистика курьера
   */
  async getCourierStats(courierId) {
    const { data: shifts } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .order('started_at', { ascending: false });
    
    const totalDeliveries = shifts?.reduce((sum, s) => sum + s.deliveries_count, 0) || 0;
    const totalEarnings = shifts?.reduce((sum, s) => sum + parseFloat(s.total_earnings), 0) || 0;
    const totalShifts = shifts?.length || 0;
    
    return {
      totalDeliveries,
      totalEarnings,
      totalShifts,
      avgDeliveriesPerShift: totalShifts > 0 ? Math.round(totalDeliveries / totalShifts) : 0,
      recentShifts: shifts?.slice(0, 10) || []
    };
  }
  
  /**
   * Общая статистика
   */
  async getOverviewStats() {
    const today = startOfDay();

    // Все 8 запросов запускаем параллельно
    const [
      { count: totalUsers },
      { count: todayUsers },
      { count: totalOrders },
      { data: todayOrdersData },
      { data: deliveredOrders },
      { count: totalPartners },
      { count: totalCouriers },
      { count: activeCouriers },
      { count: totalShops },
      { count: activeShops },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total, status').gte('created_at', today.toISOString()),
      supabase.from('orders').select('total').eq('status', 'delivered'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'partner'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'courier'),
      supabase.from('courier_shifts').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('shops').select('*', { count: 'exact', head: true }),
      supabase.from('shops').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    const todayOrders = todayOrdersData?.length || 0;
    const todayRevenue = todayOrdersData
      ?.filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
    const totalRevenue = deliveredOrders
      ?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;

    return {
      users:    { total: totalUsers || 0, today: todayUsers || 0 },
      orders:   { total: totalOrders || 0, today: todayOrders },
      revenue:  { total: totalRevenue, today: todayRevenue },
      partners: totalPartners || 0,
      couriers: { total: totalCouriers || 0, active: activeCouriers || 0 },
      shops:    { total: totalShops || 0, active: activeShops || 0 },
    };
  }
  
  /**
   * Заявки партнёров — неактивные магазины, ожидающие подтверждения
   */
  async getPartnerApplications({ page = 1, limit = 20 }) {
    const offset = calculateOffset(page, limit);

    const { data: shops, error, count } = await supabase
      .from('shops')
      .select(`
        *,
        owner:profiles!shops_owner_id_fkey(id, first_name, last_name, phone, username, telegram_id)
      `, { count: 'exact' })
      .eq('is_active', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return paginateResponse(shops || [], count || 0, page, limit);
  }

  /**
   * Одобрение заявки партнёра — активирует магазин и назначает владельца партнёром
   */
  async approvePartnerApplication(shopId) {
    // Получаем магазин с владельцем
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('*, owner:profiles!shops_owner_id_fkey(id)')
      .eq('id', shopId)
      .single();

    if (shopError || !shop) throw new AppError('Shop not found', 404);

    // Активируем магазин
    const { data: updatedShop, error: updateError } = await supabase
      .from('shops')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', shopId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Назначаем владельцу роль partner, если он указан
    if (shop.owner?.id) {
      await supabase
        .from('profiles')
        .update({ role: 'partner', shop_id: shopId, updated_at: new Date().toISOString() })
        .eq('id', shop.owner.id);
    }

    return updatedShop;
  }

  /**
   * Отклонение заявки — деактивирует магазин (оставляем в БД, просто помечаем)
   */
  async rejectPartnerApplication(shopId) {
    const { data: shop, error } = await supabase
      .from('shops')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', shopId)
      .select()
      .single();

    if (error) throw error;
    return shop;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Акции (admin)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Все акции (включая неактивные)
   */
  async getAllPromotions({ page = 1, limit = 30 }) {
    const offset = calculateOffset(page, limit);
    const { data: promotions, error, count } = await supabase
      .from('promotions')
      .select('*, shop:shops(id, name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return paginateResponse(promotions || [], count || 0, page, limit);
  }

  /**
   * Создание акции
   */
  async createPromotion(data) {
    const { data: promotion, error } = await supabase
      .from('promotions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return promotion;
  }

  /**
   * Обновление акции (включая переключение is_active)
   */
  async updatePromotion(promotionId, data) {
    const { data: promotion, error } = await supabase
      .from('promotions')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', promotionId)
      .select()
      .single();

    if (error) throw error;
    return promotion;
  }

  /**
   * Удаление акции
   */
  async deletePromotion(promotionId) {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', promotionId);

    if (error) throw error;
    return { deleted: true };
  }
}

module.exports = new AdminService();
