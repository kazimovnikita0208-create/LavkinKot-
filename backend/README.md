# 🐱 ЛавкинКот Backend

Backend API для сервиса доставки продуктов ЛавкинКот.

## 🚀 Технологии

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js 4.x
- **База данных:** Supabase (PostgreSQL)
- **Авторизация:** Telegram initData + JWT
- **Валидация:** Joi
- **Process Manager:** PM2

## 📋 Требования

- Node.js 18+ (рекомендуется 20 LTS)
- npm или yarn
- Supabase (cloud или self-hosted)

## ⚡ Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка окружения

Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

Заполните переменные:

```env
# Server
NODE_ENV=development
PORT=4000

# Supabase
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram
BOT_TOKEN=your-telegram-bot-token

# JWT
JWT_SECRET=your-jwt-secret-key-at-least-32-characters

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Миграции базы данных

Выполните SQL миграции в Supabase:

```bash
# Через psql
psql -h your-supabase-host -p 5432 -U postgres -d postgres -f migrations/001_initial_schema.sql
psql -h your-supabase-host -p 5432 -U postgres -d postgres -f migrations/002_rls_policies.sql
psql -h your-supabase-host -p 5432 -U postgres -d postgres -f migrations/003_seed_data.sql
```

Или через Supabase Studio → SQL Editor.

### 4. Запуск

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

**PM2:**

```bash
pm2 start ecosystem.config.js
```

## 📁 Структура проекта

```
backend/
├── src/
│   ├── index.js              # Entry point
│   ├── app.js                # Express app setup
│   │
│   ├── config/
│   │   ├── env.js            # Environment variables
│   │   ├── supabase.js       # Supabase client
│   │   └── constants.js      # Constants
│   │
│   ├── routes/
│   │   ├── index.js          # Main router
│   │   ├── auth.routes.js
│   │   ├── shops.routes.js
│   │   ├── products.routes.js
│   │   ├── orders.routes.js
│   │   ├── subscriptions.routes.js
│   │   ├── profile.routes.js
│   │   ├── partner.routes.js
│   │   ├── courier.routes.js
│   │   └── admin.routes.js
│   │
│   ├── controllers/
│   │   └── *.controller.js
│   │
│   ├── services/
│   │   └── *.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validator.middleware.js
│   │   ├── telegram.middleware.js
│   │   └── errorHandler.middleware.js
│   │
│   └── utils/
│       ├── telegram.js
│       ├── jwt.js
│       ├── validators.js
│       └── helpers.js
│
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_seed_data.sql
│
├── .env.example
├── .gitignore
├── ecosystem.config.js
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Авторизация (`/api/auth`)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/telegram` | Авторизация через Telegram | - |
| GET | `/me` | Текущий пользователь | ✓ |
| POST | `/logout` | Выход | ✓ |

### Магазины (`/api/shops`)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/` | Список магазинов | - |
| GET | `/:id` | Детали магазина | - |
| GET | `/:id/products` | Товары магазина | - |
| GET | `/:id/categories` | Категории товаров | - |

### Товары (`/api/products`)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/` | Поиск товаров | - |
| GET | `/popular` | Популярные товары | - |
| GET | `/:id` | Детали товара | - |
| GET | `/:id/recommended` | Рекомендации | - |

### Заказы (`/api/orders`)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/` | Создание заказа | ✓ |
| GET | `/` | Мои заказы | ✓ |
| GET | `/:id` | Детали заказа | ✓ |
| GET | `/:id/status` | Статус заказа | ✓ |
| POST | `/:id/cancel` | Отмена заказа | ✓ |

### Подписки (`/api/subscriptions`)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/plans` | Тарифные планы | - |
| GET | `/me` | Моя подписка | ✓ |
| POST | `/activate` | Активация | ✓ |
| GET | `/transactions` | История | ✓ |

### Профиль (`/api/profile`)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/` | Мой профиль | ✓ |
| PATCH | `/` | Обновить профиль | ✓ |
| PATCH | `/address` | Обновить адрес | ✓ |
| GET | `/stats` | Статистика | ✓ |

### Партнёр (`/api/partner`)

Требуется роль: `partner`

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/shop` | Мой магазин |
| PATCH | `/shop` | Обновить магазин |
| GET | `/products` | Товары магазина |
| POST | `/products` | Создать товар |
| PATCH | `/products/:id` | Обновить товар |
| DELETE | `/products/:id` | Удалить товар |
| GET | `/orders` | Заказы магазина |
| POST | `/orders/:id/accept` | Принять заказ |
| POST | `/orders/:id/ready` | Заказ готов |
| GET | `/analytics` | Аналитика |

### Курьер (`/api/courier`)

Требуется роль: `courier`

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/shift/start` | Начать смену |
| POST | `/shift/end` | Завершить смену |
| GET | `/shift/current` | Текущая смена |
| GET | `/orders` | Мои заказы |
| POST | `/orders/:id/assign` | Взять заказ |
| POST | `/orders/:id/pickup` | Забрал заказ |
| POST | `/orders/:id/deliver` | Доставил |
| GET | `/stats` | Статистика |

### Администратор (`/api/admin`)

Требуется роль: `admin`

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/orders` | Все заказы |
| PATCH | `/orders/:id` | Редактировать заказ |
| GET | `/users` | Все пользователи |
| PATCH | `/users/:id/role` | Изменить роль |
| GET | `/shops` | Все магазины |
| POST | `/shops` | Создать магазин |
| PATCH | `/shops/:id` | Редактировать магазин |
| GET | `/couriers` | Все курьеры |
| GET | `/couriers/:id/stats` | Статистика курьера |
| GET | `/stats/overview` | Общая статистика |

## 🔒 Авторизация

Backend использует Telegram initData для первичной авторизации и JWT для последующих запросов.

### Процесс авторизации:

1. Frontend отправляет `initData` из Telegram WebApp
2. Backend валидирует подпись с помощью `BOT_TOKEN`
3. Создаётся/обновляется пользователь в БД
4. Возвращается JWT токен

### Использование токена:

```
Authorization: Bearer <jwt-token>
```

## 🛡️ Роли

- **customer** — обычный пользователь
- **partner** — владелец магазина
- **courier** — курьер
- **admin** — администратор

## 📝 Статусы заказов

```
created → accepted → preparing → ready → 
courier_assigned → picked_up → in_transit → delivered
                                         ↘ cancelled
```

## 🧪 Development

### Пропуск валидации Telegram (для тестов):

```env
SKIP_TELEGRAM_VALIDATION=true
```

### Health Check:

```
GET /health
```

## 📦 Зависимости

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "joi": "^17.11.0",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1"
}
```

## 📄 Лицензия

MIT
