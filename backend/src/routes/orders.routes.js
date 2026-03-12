const { Router } = require('express');
const ordersController = require('../controllers/orders.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody, validateQuery } = require('../middlewares/validator.middleware');
const { createOrderSchema, createBatchOrderSchema, ordersQuerySchema } = require('../utils/validators');

const router = Router();

// Все маршруты требуют авторизации
router.use(authMiddleware);

/**
 * POST /api/orders/batch
 * Создание заказов из нескольких магазинов (один чекаут)
 * ВАЖНО: должен быть ДО /:id чтобы 'batch' не интерпретировался как id
 */
router.post('/batch',
  validateBody(createBatchOrderSchema),
  ordersController.createBatchOrder
);

/**
 * POST /api/orders
 * Создание заказа
 */
router.post('/', 
  validateBody(createOrderSchema),
  ordersController.createOrder
);

/**
 * GET /api/orders
 * Получение заказов пользователя
 */
router.get('/', 
  validateQuery(ordersQuerySchema),
  ordersController.getOrders
);

/**
 * GET /api/orders/:id
 * Получение деталей заказа
 */
router.get('/:id', 
  ordersController.getOrderById
);

/**
 * GET /api/orders/:id/status
 * Получение статуса заказа
 */
router.get('/:id/status', 
  ordersController.getOrderStatus
);

/**
 * POST /api/orders/:id/cancel
 * Отмена заказа
 */
router.post('/:id/cancel', 
  ordersController.cancelOrder
);

module.exports = router;
