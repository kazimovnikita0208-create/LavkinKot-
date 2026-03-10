# 🐱 ЛавкинКот — Telegram Bot

Telegram бот для открытия MiniApp доставки продуктов и еды.

## 🚀 Быстрый старт

### 1. Создание бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Введите название бота: `ЛавкинКот`
4. Введите username бота: `lavkinkot_bot` (или свой вариант)
5. Скопируйте полученный **токен**

### 2. Настройка переменных окружения

Создайте файл `.env` в папке `bot/`:

```env
# Telegram Bot Token (получить у @BotFather)
BOT_TOKEN=your_bot_token_here

# URL вашего веб-приложения (должен быть HTTPS!)
WEB_APP_URL=https://lavkin-kot.ru
```

### 3. Установка зависимостей

```bash
cd bot
npm install
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

### 5. Сборка и запуск в продакшене

```bash
npm run build
npm start
```

## 📱 Настройка WebApp

### Важно: HTTPS обязателен!

Telegram требует HTTPS для WebApp. Для локальной разработки используйте:

#### Вариант 1: ngrok (рекомендуется для разработки)

```bash
# Установите ngrok
npm install -g ngrok

# Запустите туннель (если Next.js на порту 3000)
ngrok http 3000
```

Скопируйте HTTPS URL (например, `https://abc123.ngrok.io`) и используйте его в `WEB_APP_URL`.

#### Вариант 2: Cloudflare Tunnel

```bash
# Установите cloudflared
# Для Windows: winget install Cloudflare.cloudflared

cloudflared tunnel --url http://localhost:3000
```

#### Вариант 3: Локальный SSL (mkcert)

```bash
# Установка mkcert
# Windows: choco install mkcert

mkcert -install
mkcert localhost
```

## 🔧 Команды бота

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие + кнопка открытия WebApp |
| `/menu` | Кнопка открытия магазина |
| `/help` | Справка по использованию |

## 📁 Структура

```
bot/
├── index.ts        # Основной код бота
├── package.json    # Зависимости
├── tsconfig.json   # Конфигурация TypeScript
├── .env            # Переменные окружения (создать!)
└── README.md       # Документация
```

## 🎨 Кастомизация

### Изменение кнопки меню

Кнопка меню настраивается в `index.ts`:

```typescript
await bot.api.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: '🛒 Магазин',  // Текст кнопки
    web_app: { url: WEB_APP_URL },
  },
});
```

### Добавление новых команд

```typescript
bot.command('mycommand', async (ctx) => {
  await ctx.reply('Ответ на команду');
});
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  bot:
    build: .
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
      - WEB_APP_URL=${WEB_APP_URL}
    restart: unless-stopped
```

## 🔗 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [grammY Documentation](https://grammy.dev/)
- [BotFather](https://t.me/BotFather)

## ❓ FAQ

### Почему кнопка WebApp не работает?

1. Убедитесь, что URL использует HTTPS
2. Проверьте, что сайт доступен из интернета
3. Проверьте консоль бота на наличие ошибок

### Как тестировать локально?

Используйте ngrok или Cloudflare Tunnel для создания HTTPS туннеля к локальному серверу.

### Как обновить кнопку меню?

Перезапустите бота — кнопка обновится автоматически при запуске.


