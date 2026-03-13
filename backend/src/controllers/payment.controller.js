const paymentService = require('../services/payment.service');
const { asyncHandler, AppError } = require('../middlewares/errorHandler.middleware');

/**
 * POST /api/payments/robokassa/init
 * Создать платёж и вернуть URL для редиректа на Robokassa
 */
const initPayment = asyncHandler(async (req, res) => {
  const { type, planId, orderId, amount } = req.body;
  const userId = req.user.id;

  const result = await paymentService.createPayment({ type, planId, orderId, userId, amount });

  res.json({ success: true, data: result });
});

/**
 * POST /api/payments/robokassa/result
 * ResultURL — вызывается Robokassa после успешной оплаты
 * Ответ должен быть строкой "OK{InvId}"
 */
const robokassaResult = asyncHandler(async (req, res) => {
  const { OutSum, InvId, SignatureValue } = req.body;

  if (!OutSum || !InvId || !SignatureValue) {
    return res.status(400).send('bad request');
  }

  const response = await paymentService.handleResult({ OutSum, InvId, SignatureValue });

  // Robokassa ожидает строку "OK{InvId}" при успехе
  res.send(response);
});

/**
 * GET /api/payments/robokassa/success
 * SuccessURL — Robokassa редиректит пользователя сюда после оплаты
 */
const robokassaSuccess = asyncHandler(async (req, res) => {
  const { OutSum, InvId, SignatureValue } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Определяем тип платежа из БД для правильного редиректа
  const { supabase } = require('../config/supabase');
  const { data: payment } = await supabase
    .from('payment_transactions')
    .select('type, plan_id, order_id')
    .eq('inv_id', Number(InvId))
    .single();

  let redirectPath = '/payment/success';
  if (payment) {
    if (payment.type === 'subscription') {
      redirectPath = `/payment/success?type=subscription`;
    } else if (payment.type === 'order' && payment.order_id) {
      redirectPath = `/payment/success?type=order&orderId=${payment.order_id}`;
    }
  }

  res.redirect(`${frontendUrl}${redirectPath}`);
});

/**
 * GET /api/payments/robokassa/fail
 * FailURL — Robokassa редиректит сюда при неуспешной оплате
 */
const robokassaFail = asyncHandler(async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/payment/fail`);
});

/**
 * GET /api/payments/status/:invId
 * Проверить статус платежа (для polling из iframe)
 */
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { invId } = req.params;
  const { supabase } = require('../config/supabase');

  const { data: payment, error } = await supabase
    .from('payment_transactions')
    .select('status, type, order_id, plan_id')
    .eq('inv_id', Number(invId))
    .single();

  if (error || !payment) {
    throw new AppError('Payment not found', 404);
  }

  res.json({ success: true, data: { status: payment.status, type: payment.type } });
});

module.exports = { initPayment, robokassaResult, robokassaSuccess, robokassaFail, getPaymentStatus };
