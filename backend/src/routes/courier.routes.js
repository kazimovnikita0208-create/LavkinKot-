const { Router } = require('express');
const courierController = require('../controllers/courier.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { courierOnly } = require('../middlewares/role.middleware');

const router = Router();

// Все маршруты требуют авторизации и роли courier
router.use(authMiddleware);
router.use(courierOnly);

/**
 * POST /api/courier/shift/start
 * Начать смену
 */
router.post('/shift/start', 
  courierController.startShift
);

/**
 * POST /api/courier/shift/end
 * Завершить смену
 */
router.post('/shift/end', 
  courierController.endShift
);

/**
 * GET /api/courier/shift/current
 * Получить текущую смену
 */
router.get('/shift/current', 
  courierController.getCurrentShift
);

/**
 * GET /api/courier/orders
 * Получить заказы курьера
 */
router.get('/orders', 
  courierController.getOrders
);

/**
 * POST /api/courier/orders/:id/assign
 * Взять заказ
 */
router.post('/orders/:id/assign', 
  courierController.assignOrder
);

/**
 * POST /api/courier/orders/:id/pickup
 * Забрать заказ
 */
router.post('/orders/:id/pickup', 
  courierController.pickupOrder
);

/**
 * POST /api/courier/orders/:id/deliver
 * Доставить заказ
 */
router.post('/orders/:id/deliver', 
  courierController.deliverOrder
);

/**
 * GET /api/courier/stats
 * Статистика курьера
 */
router.get('/stats', 
  courierController.getStats
);

module.exports = router;
