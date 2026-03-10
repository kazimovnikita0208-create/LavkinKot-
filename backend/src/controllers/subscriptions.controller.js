const subscriptionsService = require('../services/subscriptions.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/subscriptions/plans
 * Получение тарифных планов
 */
const getPlans = asyncHandler(async (req, res) => {
  const plans = await subscriptionsService.getPlans();
  
  res.json({
    success: true,
    data: plans
  });
});

/**
 * GET /api/subscriptions/me
 * Получение текущей подписки пользователя
 */
const getMySubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionsService.getUserSubscription(req.user.id);
  
  res.json({
    success: true,
    data: subscription
  });
});

/**
 * POST /api/subscriptions/activate
 * Активация подписки
 */
const activateSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionsService.activateSubscription(req.body, req.user.id);
  
  res.status(201).json({
    success: true,
    data: subscription
  });
});

/**
 * GET /api/subscriptions/transactions
 * Получение истории транзакций
 */
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await subscriptionsService.getTransactions(req.user.id);
  
  res.json({
    success: true,
    data: transactions
  });
});

module.exports = {
  getPlans,
  getMySubscription,
  activateSubscription,
  getTransactions
};
