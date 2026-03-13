const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  initPayment,
  robokassaResult,
  robokassaSuccess,
  robokassaFail,
  getPaymentStatus,
} = require('../controllers/payment.controller');

const router = Router();

// Создать платёж — требует авторизацию
router.post('/robokassa/init', authMiddleware, initPayment);

// Проверить статус платежа (для polling из iframe)
router.get('/status/:invId', authMiddleware, getPaymentStatus);

// Webhook от Robokassa — без authMiddleware (Robokassa не отправляет JWT)
router.post('/robokassa/result', robokassaResult);

// Редиректы от Robokassa после оплаты
router.get('/robokassa/success', robokassaSuccess);
router.get('/robokassa/fail', robokassaFail);

module.exports = router;
