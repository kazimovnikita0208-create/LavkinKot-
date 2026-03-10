const { supabase } = require('../config/supabase');
const { calculateOffset, paginateResponse } = require('../utils/helpers');

class ShopsService {
  /**
   * Получение списка магазинов
   * @param {Object} params - Query параметры
   * @returns {Object} - Список магазинов с пагинацией
   */
  async getShops({ category, search, page = 1, limit = 20 }) {
    let query = supabase
      .from('shops')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    if (category) {
      query = query.eq('category', category);
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
   * Получение магазина по ID
   * @param {string} shopId - ID магазина
   * @returns {Object} - Магазин
   */
  async getShopById(shopId) {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return shop;
  }
  
  /**
   * Получение магазина по slug
   * @param {string} slug - Slug магазина
   * @returns {Object} - Магазин
   */
  async getShopBySlug(slug) {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return shop;
  }
  
  /**
   * Получение товаров магазина
   * @param {string} shopId - ID магазина
   * @param {Object} params - Query параметры
   * @returns {Object} - Список товаров с пагинацией
   */
  async getShopProducts(shopId, { category, search, page = 1, limit = 50 }) {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('shop_id', shopId)
      .eq('in_stock', true)
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
   * Получение категорий товаров магазина
   * @param {string} shopId - ID магазина
   * @returns {Array} - Список категорий
   */
  async getShopCategories(shopId) {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('shop_id', shopId)
      .eq('in_stock', true);
    
    if (error) throw error;
    
    // Получаем уникальные категории
    const categories = [...new Set(data.map(p => p.category))];
    return categories;
  }
}

module.exports = new ShopsService();
