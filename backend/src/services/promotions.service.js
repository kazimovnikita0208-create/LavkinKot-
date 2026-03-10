const { supabase } = require('../config/supabase');

class PromotionsService {
  /**
   * Получение активных акций
   * @param {string} shopId - ID магазина (опционально)
   * @returns {Array} - Список акций
   */
  async getActivePromotions(shopId = null) {
    const now = new Date().toISOString();
    
    let query = supabase
      .from('promotions')
      .select(`
        *,
        shop:shops(id, name, slug)
      `)
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('created_at', { ascending: false });
    
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    
    const { data: promotions, error } = await query;
    
    if (error) throw error;
    return promotions;
  }
  
  /**
   * Получение акции по ID
   * @param {string} promotionId - ID акции
   * @returns {Object} - Акция
   */
  async getPromotionById(promotionId) {
    const { data: promotion, error } = await supabase
      .from('promotions')
      .select(`
        *,
        shop:shops(id, name, slug, image_url)
      `)
      .eq('id', promotionId)
      .single();
    
    if (error) throw error;
    return promotion;
  }
}

module.exports = new PromotionsService();
