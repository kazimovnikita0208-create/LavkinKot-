import { Bot, InlineKeyboard, InputFile, webhookCallback } from 'grammy';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://lavkinkot.ru';

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN не указан в переменных окружения!');
}

const bot = new Bot(BOT_TOKEN);

// ─── /start ──────────────────────────────────────────────────────────────────
bot.command('start', async (ctx) => {
  const userName = ctx.from?.first_name || 'друг';

  const acceptKeyboard = new InlineKeyboard()
    .text('✅ Ознакомился(ась) с политиками', 'accept_policies');

  // Приветственное сообщение
  await ctx.reply(
    `Привет, ${userName}! 👋\n\n` +
    `Добро пожаловать в *ЛавкинКот* — сервис доставки продуктов и еды в Самаре! 🐱\n\n` +
    `Перед началом работы просим вас ознакомиться с нашими документами:\n\n` +
    `📄 *Политика конфиденциальности* — как мы обрабатываем ваши данные\n` +
    `📋 *Пользовательское соглашение* — условия использования сервиса\n\n` +
    `Документы прикреплены ниже. После ознакомления нажмите кнопку:`,
    { parse_mode: 'Markdown' }
  );

  // После компиляции __dirname = dist/, поэтому поднимаемся на уровень выше к docs/
  const docsDir = path.join(__dirname, '..', 'docs');
  const privacyPath = path.join(docsDir, 'privacy_policy.txt');
  const termsPath = path.join(docsDir, 'terms_of_service.txt');

  await ctx.replyWithDocument(
    new InputFile(fs.createReadStream(privacyPath), 'Политика_конфиденциальности.txt'),
    { caption: '📄 Политика конфиденциальности' }
  );

  await ctx.replyWithDocument(
    new InputFile(fs.createReadStream(termsPath), 'Пользовательское_соглашение.txt'),
    {
      caption: '📋 Пользовательское соглашение',
      reply_markup: acceptKeyboard,
    }
  );
});

// ─── Callback: пользователь ознакомился с политиками ─────────────────────────
bot.callbackQuery('accept_policies', async (ctx) => {
  await ctx.answerCallbackQuery();

  // Убираем кнопку из предыдущего сообщения
  await ctx.editMessageReplyMarkup({ reply_markup: new InlineKeyboard() });

  const openAppKeyboard = new InlineKeyboard()
    .webApp('🛒 Открыть приложение', WEB_APP_URL);

  await ctx.reply(
    `✅ *Спасибо за подтверждение!*\n\n` +
    `Вы приняли условия использования сервиса «ЛавкинКот».\n\n` +
    `Теперь вы можете делать заказы из магазинов, пекарен, ресторанов и фруктовых лавок Самары 🐱\n\n` +
    `Нажмите кнопку ниже, чтобы открыть приложение:`,
    {
      parse_mode: 'Markdown',
      reply_markup: openAppKeyboard,
    }
  );
});

// ─── /menu ───────────────────────────────────────────────────────────────────
bot.command('menu', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .webApp('🛒 Открыть магазин', WEB_APP_URL);

  await ctx.reply('Нажмите кнопку, чтобы открыть приложение:', {
    reply_markup: keyboard,
  });
});

// ─── /help ───────────────────────────────────────────────────────────────────
bot.command('help', async (ctx) => {
  await ctx.reply(
    `*ЛавкинКот — Помощь* 🐱\n\n` +
    `📱 *Как пользоваться:*\n` +
    `1. Нажмите кнопку "Открыть ЛавкинКот"\n` +
    `2. Выберите магазин или категорию\n` +
    `3. Добавьте товары в корзину\n` +
    `4. Оформите заказ\n\n` +
    `📞 *Поддержка:*\n` +
    `Напишите нам: @lavkinkot_support`,
    { parse_mode: 'Markdown' }
  );
});

// ─── Данные из WebApp ─────────────────────────────────────────────────────────
bot.on('message:web_app_data', async (ctx) => {
  const data = ctx.message.web_app_data?.data;

  if (data) {
    try {
      const parsedData = JSON.parse(data);

      if (parsedData.type === 'order_created') {
        await ctx.reply(
          `✅ *Заказ #${parsedData.orderNumber} создан!*\n\n` +
          `Сумма: ${parsedData.total} ₽\n` +
          `Адрес: ${parsedData.address}\n\n` +
          `Ожидайте подтверждения от магазина.`,
          { parse_mode: 'Markdown' }
        );
      }
    } catch (error) {
      console.error('Ошибка парсинга данных WebApp:', error);
    }
  }
});

// ─── Прочие текстовые сообщения ───────────────────────────────────────────────
bot.on('message:text', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .webApp('🛒 Открыть ЛавкинКот', WEB_APP_URL);

  await ctx.reply(
    'Чтобы сделать заказ, откройте приложение по кнопке ниже 👇',
    { reply_markup: keyboard }
  );
});

// ─── Обработка ошибок ─────────────────────────────────────────────────────────
bot.catch((err) => {
  console.error('Ошибка бота:', err);
});

// ─── Запуск ───────────────────────────────────────────────────────────────────
async function start() {
  console.log('🐱 ЛавкинКот бот запускается...');

  await bot.api.setMyCommands([
    { command: 'start', description: '🚀 Начать' },
    { command: 'menu', description: '🛒 Открыть магазин' },
    { command: 'help', description: '❓ Помощь' },
  ]);

  await bot.api.setChatMenuButton({
    menu_button: {
      type: 'web_app',
      text: '🛒 Магазин',
      web_app: { url: WEB_APP_URL },
    },
  });

  console.log('✅ Команды и меню настроены');

  await bot.start({
    onStart: (botInfo) => {
      console.log(`✅ Бот @${botInfo.username} запущен!`);
      console.log(`🌐 WebApp URL: ${WEB_APP_URL}`);
    },
  });
}

start();

export { bot, webhookCallback };
