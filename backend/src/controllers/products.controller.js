const productsService = require('../services/products.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/products
 * Поиск товаров
 */
const searchProducts = asyncHandler(async (req, res) => {
  const result = await productsService.searchProducts(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * GET /api/products/popular
 * Получение популярных товаров
 */
const getPopularProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const products = await productsService.getPopularProducts(limit);
  
  res.json({
    success: true,
    data: products
  });
});

/**
 * GET /api/products/:id
 * Получение товара по ID
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productsService.getProductById(req.params.id);
  
  res.json({
    success: true,
    data: product
  });
});

/**
 * GET /api/products/:id/recommended
 * Получение рекомендованных товаров
 */
const getRecommendedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const products = await productsService.getRecommendedProducts(req.params.id, limit);
  
  res.json({
    success: true,
    data: products
  });
});

module.exports = {
  searchProducts,
  getPopularProducts,
  getProductById,
  getRecommendedProducts
};
