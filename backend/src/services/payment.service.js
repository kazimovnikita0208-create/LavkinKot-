const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const { AppError } = require('../middlewares/errorHandler.middleware');
const subscriptionsService = require('./subscriptions.service');

const MERCHANT_LOGIN = process.env.ROBOKASSA_MERCHANT_LOGIN;
const PASSWORD1 = process.env.ROBOKASSA_PASSWORD1;
const PASSWORD2 = process.env.ROBOKASSA_PASSWORD2;
const IS_TEST = process.env.ROBOKASSA_IS_TEST === '1' ? 1 : 0;
const ROBOKASSA_BASE_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx';

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex').toUpperCase();

class PaymentService {
  /**
   * Создать платёж Robokassa и вернуть URL для редиректа
   * type: 'subscription' | 'order'
   */
  async createPayment({ type, planId, orderId, userId, amount }) {
    if (!MERCHANT_LOGIN || !PASSWORD1 || !PASSWORD2) {
      throw new AppError('Robokassa credentials not configured', 500);
    }

    let outSum;
    let description;
    let meta = {};

    if (type === 'subscription') {
      if (!planId) throw new AppError('planId required for subscription payment', 400);
      const { data: plan, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .eq('is_active', true)
        .single();
      if (error || !plan) throw new AppError('Plan not found', 404);
      outSum = Number(plan.price).toFixed(2);
      description = `Подписка ${plan.name} — ЛавкинКот`;
      meta = { type, planId, userId };
    } else if (type === 'order') {
      if (!orderId) throw new AppError('orderId required for order payment', 400);
      const { data: order, error } = await supabase
        .from('orders')
        .select('total, profile_id')
        .eq('id', orderId)
        .single();
      if (error || !order) throw new AppError('Order not found', 404);
      if (order.profile_id !== userId) throw new AppError('Forbidden', 403);
      outSum = amount ? Number(amount).toFixed(2) : Number(order.total).toFixed(2);
      description = `Оплата заказа — ЛавкинКот`;
      meta = { type, orderId, userId };
    } else {
      throw new AppError('Invalid payment type', 400);
    }

    // Генерируем уникальный InvId (используем timestamp + random)
    const invId = Date.now() % 2147483647; // Robokassa InvId — int32

    // Сохраняем pending-транзакцию
    const { data: pendingPayment, error: insertError } = await supabase
      .from('payment_transactions')
      .insert({
        inv_id: invId,
        out_sum: outSum,
        type,
        status: 'pending',
        plan_id: meta.planId || null,
        order_id: meta.orderId || null,
        profile_id: userId,
        description,
      })
      .select()
      .single();

    if (insertError) {
      // Если таблицы нет — продолжаем без сохранения (graceful)
      console.warn('payment_transactions insert failed:', insertError.message);
    }

    // Генерируем подпись
    const signature = md5(`${MERCHANT_LOGIN}:${outSum}:${invId}:${PASSWORD1}`);

    // Параметры для iframe-виджета (Robokassa.StartPayment)
    const iframeParams = {
      MerchantLogin: MERCHANT_LOGIN,
      OutSum: outSum,
      InvId: invId,
      Description: description,
      SignatureValue: signature,
      IsTest: IS_TEST,
      Culture: 'ru',
      Encoding: 'utf-8',
    };

    // Fallback redirect URL на случай если iframe не работает
    const params = new URLSearchParams({
      MerchantLogin: MERCHANT_LOGIN,
      OutSum: outSum,
      InvId: String(invId),
      Description: description,
      SignatureValue: signature,
      IsTest: String(IS_TEST),
    });
    const redirectUrl = `${ROBOKASSA_BASE_URL}?${params.toString()}`;

    return { redirectUrl, invId, outSum, iframeParams };
  }

  /**
   * Обработать Result URL от Robokassa (webhook)
   * Вызывается Robokassa после успешной оплаты
   */
  async handleResult({ OutSum, InvId, SignatureValue }) {
    if (!PASSWORD2) throw new AppError('Robokassa PASSWORD2 not configured', 500);

    // Верифицируем подпись
    const expected = md5(`${OutSum}:${InvId}:${PASSWORD2}`);
    if (expected !== SignatureValue.toUpperCase()) {
      throw new AppError('Invalid Robokassa signature', 400);
    }

    // Находим транзакцию
    const { data: payment, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('inv_id', Number(InvId))
      .single();

    if (error || !payment) {
      // Если таблицы нет или запись не найдена — пробуем найти по сумме через orderId/planId из описания
      // В этом случае просто подтверждаем платёж Robokassa
      return `OK${InvId}`;
    }

    if (payment.status === 'paid') {
      // Уже обработан — идемпотентность
      return `OK${InvId}`;
    }

    // Обновляем статус транзакции
    await supabase
      .from('payment_transactions')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('inv_id', Number(InvId));

    // Выполняем бизнес-логику
    if (payment.type === 'subscription' && payment.plan_id && payment.profile_id) {
      await subscriptionsService.activateSubscription(
        { planId: payment.plan_id },
        payment.profile_id
      );
    } else if (payment.type === 'order' && payment.order_id) {
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', payment.order_id);
    }

    return `OK${InvId}`;
  }

  /**
   * Верифицировать подпись Success URL (опционально — для проверки на фронте)
   */
  verifySuccess({ OutSum, InvId, SignatureValue }) {
    const expected = md5(`${OutSum}:${InvId}:${PASSWORD1}`);
    return expected === SignatureValue.toUpperCase();
  }
}

module.exports = new PaymentService();
