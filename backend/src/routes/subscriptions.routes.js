const { Router } = require('express');
const subscriptionsController = require('../controllers/subscriptions.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validator.middleware');
const { activateSubscriptionSchema } = require('../utils/validators');

const router = Router();

/**
 * GET /api/subscriptions/plans
 * Получение тарифных планов (публичный)
 */
router.get('/plans', 
  subscriptionsController.getPlans
);

/**
 * GET /api/subscriptions/me
 * Получение текущей подписки пользователя
 */
router.get('/me', 
  authMiddleware,
  subscriptionsController.getMySubscription
);

/**
 * POST /api/subscriptions/activate
 * Активация подписки
 */
router.post('/activate', 
  authMiddleware,
  validateBody(activateSubscriptionSchema),
  subscriptionsController.activateSubscription
);

/**
 * GET /api/subscriptions/transactions
 * Получение истории транзакций
 */
router.get('/transactions', 
  authMiddleware,
  subscriptionsController.getTransactions
);

module.exports = router;
