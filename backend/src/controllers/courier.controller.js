const courierService = require('../services/courier.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * POST /api/courier/shift/start
 * Начать смену
 */
const startShift = asyncHandler(async (req, res) => {
  const shift = await courierService.startShift(req.user.id);
  
  res.status(201).json({
    success: true,
    data: shift
  });
});

/**
 * POST /api/courier/shift/end
 * Завершить смену
 */
const endShift = asyncHandler(async (req, res) => {
  const shift = await courierService.endShift(req.user.id);
  
  res.json({
    success: true,
    data: shift
  });
});

/**
 * GET /api/courier/shift/current
 * Получить текущую смену
 */
const getCurrentShift = asyncHandler(async (req, res) => {
  const shift = await courierService.getCurrentShift(req.user.id);
  
  res.json({
    success: true,
    data: shift
  });
});

/**
 * GET /api/courier/orders
 * Получить заказы курьера
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await courierService.getCourierOrders(req.user.id);
  
  res.json({
    success: true,
    data: orders
  });
});

/**
 * POST /api/courier/orders/:id/assign
 * Взять заказ
 */
const assignOrder = asyncHandler(async (req, res) => {
  await courierService.assignOrder(req.params.id, req.user.id);
  
  res.json({
    success: true,
    message: 'Order assigned'
  });
});

/**
 * POST /api/courier/orders/:id/pickup
 * Забрать заказ
 */
const pickupOrder = asyncHandler(async (req, res) => {
  await courierService.pickupOrder(req.params.id, req.user.id);
  
  res.json({
    success: true,
    message: 'Order picked up'
  });
});

/**
 * POST /api/courier/orders/:id/deliver
 * Доставить заказ
 */
const deliverOrder = asyncHandler(async (req, res) => {
  await courierService.deliverOrder(req.params.id, req.user.id);
  
  res.json({
    success: true,
    message: 'Order delivered'
  });
});

/**
 * GET /api/courier/stats
 * Статистика курьера
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await courierService.getCourierStats(req.user.id);
  
  res.json({
    success: true,
    data: stats
  });
});

module.exports = {
  startShift,
  endShift,
  getCurrentShift,
  getOrders,
  assignOrder,
  pickupOrder,
  deliverOrder,
  getStats
};
