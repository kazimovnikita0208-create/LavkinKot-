/**
 * Утилита для отправки Telegram-уведомлений пользователям через Bot API.
 * Используется при смене статуса заказа.
 */

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null;

/**
 * Отправить сообщение пользователю по telegram_id
 * @param {number|string} telegramId - Telegram ID пользователя
 * @param {string} text - Текст сообщения (поддерживает HTML)
 * @returns {Promise<void>}
 */
async function sendMessage(telegramId, text) {
  if (!TELEGRAM_API) {
    console.warn('[Notifications] TELEGRAM_BOT_TOKEN не задан — уведомление пропущено');
    return;
  }
  if (!telegramId) {
    console.warn('[Notifications] telegram_id не задан — уведомление пропущено');
    return;
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn('[Notifications] sendMessage failed:', data?.description || response.status);
    }
  } catch (e) {
    console.warn('[Notifications] sendMessage error:', e.message);
  }
}

/**
 * Уведомления при смене статуса заказа.
 * @param {{ telegramId: number, orderNumber: number, status: string, orderId: string }} params
 */
async function notifyOrderStatusChange({ telegramId, orderNumber, status, orderId }) {
  const frontendUrl = process.env.FRONTEND_URL || '';
  const orderLink = orderId ? `${frontendUrl}/order/${orderId}` : '';

  const messages = {
    accepted: `✅ <b>Заказ #${orderNumber} принят магазином</b>\n\nМагазин уже готовит ваш заказ. Курьер заберёт его совсем скоро!${orderLink ? `\n\n<a href="${orderLink}">Отследить заказ</a>` : ''}`,

    preparing: `👨‍🍳 <b>Заказ #${orderNumber} готовится</b>\n\nМагазин приступил к сборке вашего заказа.${orderLink ? `\n\n<a href="${orderLink}">Отследить заказ</a>` : ''}`,

    ready: `📦 <b>Заказ #${orderNumber} готов</b>\n\nВаш заказ собран и ожидает курьера.${orderLink ? `\n\n<a href="${orderLink}">Отследить заказ</a>` : ''}`,

    courier_assigned: `🚴 <b>Курьер уже едет к вам!</b>\n\nЗаказ #${orderNumber} передан курьеру. Ожидайте доставку.${orderLink ? `\n\n<a href="${orderLink}">Отследить заказ</a>` : ''}`,

    picked_up: `🛵 <b>Курьер забрал заказ #${orderNumber}</b>\n\nКурьер выехал! Скоро доставим.${orderLink ? `\n\n<a href="${orderLink}">Отследить заказ</a>` : ''}`,

    in_transit: `📍 <b>Заказ #${orderNumber} в пути</b>\n\nКурьер везёт ваш заказ. Будьте готовы к встрече!${orderLink ? `\n\n<a href="${orderLink}">Отследить заказ</a>` : ''}`,

    delivered: `🎉 <b>Заказ #${orderNumber} доставлен!</b>\n\nПриятного аппетита! Спасибо, что выбрали ЛавкинКот 🐱`,

    cancelled: `❌ <b>Заказ #${orderNumber} отменён</b>\n\nЕсли вы оплачивали доставку из подписки — она возвращена на счёт.`,
  };

  const text = messages[status];
  if (!text) return; // Не все статусы требуют уведомления

  await sendMessage(telegramId, text);
}

/**
 * Уведомление при назначении курьера (для самого курьера)
 * @param {{ courierTelegramId: number, orderNumber: number, shopName: string, deliveryAddress: string }} params
 */
async function notifyCourierAssigned({ courierTelegramId, orderNumber, shopName, deliveryAddress }) {
  const text = `📋 <b>Новый заказ #${orderNumber}</b>\n\n📍 Забрать из: <b>${shopName}</b>\n🏠 Доставить: ${deliveryAddress}`;
  await sendMessage(courierTelegramId, text);
}

module.exports = { sendMessage, notifyOrderStatusChange, notifyCourierAssigned };
