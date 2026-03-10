const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  initPayment,
  robokassaResult,
  robokassaSuccess,
  robokassaFail,
} = require('../controllers/payment.controller');

const router = Router();

// Создать платёж — требует авторизацию
router.post('/robokassa/init', authMiddleware, initPayment);

// Webhook от Robokassa — без authMiddleware (Robokassa не отправляет JWT)
router.post('/robokassa/result', robokassaResult);

// Редиректы от Robokassa после оплаты
router.get('/robokassa/success', robokassaSuccess);
router.get('/robokassa/fail', robokassaFail);

module.exports = router;
