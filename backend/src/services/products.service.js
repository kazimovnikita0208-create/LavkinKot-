const { supabase } = require('../config/supabase');
const { calculateOffset, paginateResponse } = require('../utils/helpers');

class ProductsService {
  /**
   * Поиск товаров
   * @param {Object} params - Query параметры
   * @returns {Object} - Список товаров с пагинацией
   */
  async searchProducts({ search, category, in_stock = true, page = 1, limit = 20 }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        shop:shops(id, name, slug)
      `, { count: 'exact' })
      .order('name', { ascending: true });
    
    if (in_stock !== undefined) {
      query = query.eq('in_stock', in_stock);
    }
    
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
   * Получение товара по ID
   * @param {string} productId - ID товара
   * @returns {Object} - Товар
   */
  async getProductById(productId) {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        shop:shops(id, name, slug, image_url)
      `)
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return product;
  }
  
  /**
   * Получение популярных товаров
   * @param {number} limit - Количество товаров
   * @returns {Array} - Список популярных товаров
   */
  async getPopularProducts(limit = 10) {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        shop:shops(id, name, slug)
      `)
      .eq('is_popular', true)
      .eq('in_stock', true)
      .order('sort_order', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return products;
  }
  
  /**
   * Получение рекомендованных товаров
   * @param {string} productId - ID текущего товара
   * @param {number} limit - Количество товаров
   * @returns {Array} - Список рекомендованных товаров
   */
  async getRecommendedProducts(productId, limit = 6) {
    // Получаем текущий товар
    const { data: currentProduct } = await supabase
      .from('products')
      .select('shop_id, category')
      .eq('id', productId)
      .single();
    
    if (!currentProduct) return [];
    
    // Получаем похожие товары из того же магазина и категории
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', currentProduct.shop_id)
      .eq('category', currentProduct.category)
      .eq('in_stock', true)
      .neq('id', productId)
      .limit(limit);
    
    if (error) throw error;
    return products;
  }
}

module.exports = new ProductsService();
