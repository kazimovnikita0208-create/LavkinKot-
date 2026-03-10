const adminService = require('../services/admin.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/admin/orders
 * Получение всех заказов
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const result = await adminService.getAllOrders(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * PATCH /api/admin/orders/:id
 * Редактирование заказа
 */
const updateOrder = asyncHandler(async (req, res) => {
  const order = await adminService.updateOrder(req.params.id, req.body);
  
  res.json({
    success: true,
    data: order
  });
});

/**
 * GET /api/admin/users
 * Получение всех пользователей
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * PATCH /api/admin/users/:id/role
 * Изменение роли пользователя
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body);
  
  res.json({
    success: true,
    data: user
  });
});

/**
 * GET /api/admin/shops
 * Получение всех магазинов
 */
const getAllShops = asyncHandler(async (req, res) => {
  const result = await adminService.getAllShops(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * PATCH /api/admin/shops/:id
 * Редактирование магазина
 */
const updateShop = asyncHandler(async (req, res) => {
  const shop = await adminService.updateShop(req.params.id, req.body);
  
  res.json({
    success: true,
    data: shop
  });
});

/**
 * POST /api/admin/shops
 * Создание магазина
 */
const createShop = asyncHandler(async (req, res) => {
  const shop = await adminService.createShop(req.body);
  
  res.status(201).json({
    success: true,
    data: shop
  });
});

/**
 * GET /api/admin/couriers
 * Получение всех курьеров
 */
const getAllCouriers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllCouriers(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * GET /api/admin/couriers/:id/stats
 * Статистика курьера
 */
const getCourierStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getCourierStats(req.params.id);
  
  res.json({
    success: true,
    data: stats
  });
});

/**
 * GET /api/admin/stats/overview
 * Общая статистика
 */
const getOverviewStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getOverviewStats();
  
  res.json({
    success: true,
    data: stats
  });
});

/**
 * GET /api/admin/partners
 * Заявки партнёров
 */
const getPartnerApplications = asyncHandler(async (req, res) => {
  const result = await adminService.getPartnerApplications(req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * POST /api/admin/partners/:id/approve
 * Одобрить заявку партнёра (активировать магазин)
 */
const approvePartner = asyncHandler(async (req, res) => {
  const shop = await adminService.approvePartnerApplication(req.params.id);
  
  res.json({
    success: true,
    data: shop
  });
});

/**
 * POST /api/admin/partners/:id/reject
 * Отклонить заявку партнёра
 */
const rejectPartner = asyncHandler(async (req, res) => {
  const shop = await adminService.rejectPartnerApplication(req.params.id);
  
  res.json({
    success: true,
    data: shop
  });
});

/**
 * GET /api/admin/promotions
 */
const getAllPromotions = asyncHandler(async (req, res) => {
  const result = await adminService.getAllPromotions(req.query);
  res.json({ success: true, ...result });
});

/**
 * POST /api/admin/promotions
 */
const createPromotion = asyncHandler(async (req, res) => {
  const promotion = await adminService.createPromotion(req.body);
  res.status(201).json({ success: true, data: promotion });
});

/**
 * PATCH /api/admin/promotions/:id
 */
const updatePromotion = asyncHandler(async (req, res) => {
  const promotion = await adminService.updatePromotion(req.params.id, req.body);
  res.json({ success: true, data: promotion });
});

/**
 * DELETE /api/admin/promotions/:id
 */
const deletePromotion = asyncHandler(async (req, res) => {
  await adminService.deletePromotion(req.params.id);
  res.json({ success: true, data: { deleted: true } });
});

module.exports = {
  getAllOrders,
  updateOrder,
  getAllUsers,
  updateUserRole,
  getAllShops,
  updateShop,
  createShop,
  getAllCouriers,
  getCourierStats,
  getOverviewStats,
  getPartnerApplications,
  approvePartner,
  rejectPartner,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
