const partnerService = require('../services/partner.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/partner/shop
 * Получение магазина партнёра
 */
const getShop = asyncHandler(async (req, res) => {
  const shop = await partnerService.getPartnerShop(req.user.id);
  
  res.json({
    success: true,
    data: shop
  });
});

/**
 * PATCH /api/partner/shop
 * Обновление магазина
 */
const updateShop = asyncHandler(async (req, res) => {
  const shop = await partnerService.updatePartnerShop(req.user.id, req.body);
  
  res.json({
    success: true,
    data: shop
  });
});

/**
 * GET /api/partner/products
 * Получение товаров магазина
 */
const getProducts = asyncHandler(async (req, res) => {
  const result = await partnerService.getPartnerProducts(req.user.id, req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * POST /api/partner/products
 * Создание товара
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await partnerService.createProduct(req.user.id, req.body);
  
  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * PATCH /api/partner/products/:id
 * Обновление товара
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await partnerService.updateProduct(req.user.id, req.params.id, req.body);
  
  res.json({
    success: true,
    data: product
  });
});

/**
 * DELETE /api/partner/products/:id
 * Удаление товара
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await partnerService.deleteProduct(req.user.id, req.params.id);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

/**
 * GET /api/partner/orders
 * Получение заказов магазина
 */
const getOrders = asyncHandler(async (req, res) => {
  const result = await partnerService.getPartnerOrders(req.user.id, req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * POST /api/partner/orders/:id/accept
 * Принять заказ
 */
const acceptOrder = asyncHandler(async (req, res) => {
  await partnerService.acceptOrder(req.user.id, req.params.id);
  
  res.json({
    success: true,
    message: 'Order accepted'
  });
});

/**
 * POST /api/partner/orders/:id/ready
 * Заказ готов
 */
const markOrderReady = asyncHandler(async (req, res) => {
  await partnerService.markOrderReady(req.user.id, req.params.id);
  
  res.json({
    success: true,
    message: 'Order marked as ready'
  });
});

/**
 * GET /api/partner/analytics
 * Аналитика магазина
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await partnerService.getPartnerAnalytics(req.user.id);
  
  res.json({
    success: true,
    data: analytics
  });
});

module.exports = {
  getShop,
  updateShop,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  acceptOrder,
  markOrderReady,
  getAnalytics
};
