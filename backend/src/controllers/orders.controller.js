const ordersService = require('../services/orders.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * POST /api/orders
 * Создание заказа
 */
const createOrder = asyncHandler(async (req, res) => {
  const order = await ordersService.createOrder(req.body, req.user.id);
  
  res.status(201).json({
    success: true,
    data: order
  });
});

/**
 * GET /api/orders
 * Получение заказов пользователя
 */
const getOrders = asyncHandler(async (req, res) => {
  const result = await ordersService.getUserOrders(req.user.id, req.query);
  
  res.json({
    success: true,
    ...result
  });
});

/**
 * GET /api/orders/:id
 * Получение деталей заказа
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await ordersService.getOrderById(req.params.id, req.user.id);
  
  res.json({
    success: true,
    data: order
  });
});

/**
 * GET /api/orders/:id/status
 * Получение статуса заказа
 */
const getOrderStatus = asyncHandler(async (req, res) => {
  const status = await ordersService.getOrderStatus(req.params.id, req.user.id);
  
  res.json({
    success: true,
    data: status
  });
});

/**
 * POST /api/orders/:id/cancel
 * Отмена заказа
 */
const cancelOrder = asyncHandler(async (req, res) => {
  await ordersService.cancelOrder(req.params.id, req.user.id);
  
  res.json({
    success: true,
    message: 'Order cancelled successfully'
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getOrderStatus,
  cancelOrder
};
