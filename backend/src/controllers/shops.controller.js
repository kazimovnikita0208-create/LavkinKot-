const shopsService = require('../services/shops.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/shops
 * Получение списка магазинов
 */
const getShops = asyncHandler(async (req, res) => {
  const result = await shopsService.getShops(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * GET /api/shops/:id
 * Получение магазина по ID
 */
const getShopById = asyncHandler(async (req, res) => {
  const shop = await shopsService.getShopById(req.params.id);
  
  res.json({
    success: true,
    data: shop
  });
});

/**
 * GET /api/shops/:id/products
 * Получение товаров магазина
 */
const getShopProducts = asyncHandler(async (req, res) => {
  const result = await shopsService.getShopProducts(req.params.id, req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * GET /api/shops/:id/categories
 * Получение категорий товаров магазина
 */
const getShopCategories = asyncHandler(async (req, res) => {
  const categories = await shopsService.getShopCategories(req.params.id);
  
  res.json({
    success: true,
    data: categories
  });
});

module.exports = {
  getShops,
  getShopById,
  getShopProducts,
  getShopCategories
};
