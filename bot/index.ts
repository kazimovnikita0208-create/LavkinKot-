import { Bot, InlineKeyboard, webhookCallback } from 'grammy';
import dotenv from 'dotenv';

dotenv.config();

// Получаем токен бота из переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://lavkin-kot.ru';

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN не указан в переменных окружения!');
}

// Создаём экземпляр бота
const bot = new Bot(BOT_TOKEN);

// Команда /start
bot.command('start', async (ctx) => {
  const userName = ctx.from?.first_name || 'друг';
  
  // Создаём inline-клавиатуру с кнопкой WebApp
  const keyboard = new InlineKeyboard()
    .webApp('🛒 Открыть ЛавкинКот', WEB_APP_URL);

  await ctx.reply(
    `Привет, ${userName}! 👋\n\n` +
    `Добро пожаловать в *ЛавкинКот* — сервис доставки продуктов и еды в Самаре! 🐱\n\n` +
    `🏪 Магазины\n` +
    `🍎 Фруктовые лавки\n` +
    `🥐 Пекарни\n` +
    `🍕 Рестораны\n\n` +
    `Нажми кнопку ниже, чтобы начать покупки:`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  );
});

// Команда /help
bot.command('help', async (ctx) => {
  await ctx.reply(
    `*ЛавкинКот — Помощь* 🐱\n\n` +
    `📱 *Как пользоваться:*\n` +
    `1. Нажмите кнопку "Открыть ЛавкинКот"\n` +
    `2. Выберите магазин или категорию\n` +
    `3. Добавьте товары в корзину\n` +
    `4. Оформите заказ\n\n` +
    `💳 *Подписка:*\n` +
    `Купите подписку и получите лимит доставок на месяц!\n\n` +
    `📞 *Поддержка:*\n` +
    `Напишите нам: @lavkinkot_support`,
    {
      parse_mode: 'Markdown',
    }
  );
});

// Команда /menu - показать меню с WebApp
bot.command('menu', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .webApp('🛒 Открыть магазин', WEB_APP_URL);

  await ctx.reply('Нажмите кнопку, чтобы открыть приложение:', {
    reply_markup: keyboard,
  });
});

// Обработка данных из WebApp
bot.on('message:web_app_data', async (ctx) => {
  const data = ctx.message.web_app_data?.data;
  
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      console.log('Получены данные из WebApp:', parsedData);
      
      // Здесь можно обрабатывать данные от WebApp
      // Например, подтверждение заказа
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

// Обработка текстовых сообщений
bot.on('message:text', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .webApp('🛒 Открыть ЛавкинКот', WEB_APP_URL);

  await ctx.reply(
    'Чтобы сделать заказ, откройте приложение по кнопке ниже 👇',
    { reply_markup: keyboard }
  );
});

// Обработка ошибок
bot.catch((err) => {
  console.error('Ошибка бота:', err);
});

// Запуск бота
async function start() {
  console.log('🐱 ЛавкинКот бот запускается...');
  
  // Устанавливаем команды бота
  await bot.api.setMyCommands([
    { command: 'start', description: '🚀 Начать' },
    { command: 'menu', description: '🛒 Открыть магазин' },
    { command: 'help', description: '❓ Помощь' },
  ]);

  // Устанавливаем кнопку Menu с WebApp
  await bot.api.setChatMenuButton({
    menu_button: {
      type: 'web_app',
      text: '🛒 Магазин',
      web_app: { url: WEB_APP_URL },
    },
  });

  console.log('✅ Команды и меню настроены');
  
  // Запускаем polling
  await bot.start({
    onStart: (botInfo) => {
      console.log(`✅ Бот @${botInfo.username} запущен!`);
      console.log(`🌐 WebApp URL: ${WEB_APP_URL}`);
    },
  });
}

start();

// Экспорт для webhook (если нужно)
export { bot, webhookCallback };


