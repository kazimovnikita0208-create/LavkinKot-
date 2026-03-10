# 🐱 ЛавкинКот - План разработки Backend

> Backend на Node.js + Express.js + Supabase для сервиса доставки продуктов

**Дата создания:** 22.01.2026  
**Технологии:** JavaScript, Node.js, Express.js, Supabase (PostgreSQL), Telegram Bot API

---

## 📋 Оглавление

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Схема базы данных Supabase](#схема-базы-данных-supabase)
3. [API эндпоинты](#api-эндпоинты)
4. [Структура backend проекта](#структура-backend-проекта)
5. [Аутентификация через Telegram](#аутентификация-через-telegram)
6. [Логика основных модулей](#логика-основных-модулей)
7. [Развертывание на VPS](#развертывание-на-vps)
8. [Пошаговый план разработки](#пошаговый-план-разработки)

---

## 🏗 Обзор архитектуры

### Технологический стек

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **Runtime** | Node.js 20 LTS | Серверная среда выполнения |
| **Framework** | Express.js 4.x | API сервер |
| **База данных** | Supabase (PostgreSQL) | Хранение данных, аутентификация |
| **Язык** | JavaScript (ES6+) | Основной язык разработки |
| **Auth** | Telegram initData + JWT | Авторизация пользователей |
| **Storage** | Supabase Storage | Хранение изображений товаров |
| **Deploy** | PM2 + Nginx | Процесс-менеджер и reverse proxy |

### Архитектурная схема

```
┌──────────────────────────────────────────────────┐
│         Telegram MiniApp (Frontend)              │
│              Next.js + React                     │
└────────────────┬─────────────────────────────────┘
                 │ HTTPS REST API
                 ▼
┌──────────────────────────────────────────────────┐
│          Express.js API Server                   │
│  ┌─────────────┐  ┌──────────────────────────┐   │
│  │   Routes    │  │    Middlewares           │   │
│  │  /api/...   │  │ - auth.js                │   │
│  └─────────────┘  │ - telegram.js            │   │
│  ┌─────────────┐  │ - validator.js           │   │
│  │ Controllers │  │ - errorHandler.js        │   │
│  │  *.controller│  └──────────────────────────┘   │
│  └─────────────┘  ┌──────────────────────────┐   │
│  ┌─────────────┐  │      Services            │   │
│  │  Services   │  │  - auth.service.js       │   │
│  │  *.service  │  │  - orders.service.js     │   │
│  └─────────────┘  │  - subscriptions.service │   │
└────────────────┬──└──────────────────────────┘───┘
                 │ Supabase JS Client
                 ▼
┌──────────────────────────────────────────────────┐
│          Supabase (Self-hosted)                  │
│  ┌─────────────┐  ┌──────────────────────────┐   │
│  │ PostgreSQL  │  │   Supabase Storage       │   │
│  │   + RLS     │  │   (Images)               │   │
│  └─────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 🗄 Схема базы данных Supabase

### 1. Таблица `profiles` — Пользователи

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  default_address TEXT,
  default_district VARCHAR(50) DEFAULT 'Октябрьский',
  default_street VARCHAR(255),
  default_house VARCHAR(50),
  default_entrance VARCHAR(20),
  default_floor VARCHAR(20),
  default_apartment VARCHAR(50),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'partner', 'courier', 'admin')),
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_profiles_telegram_id ON profiles(telegram_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_shop_id ON profiles(shop_id);

-- RLS Policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (telegram_id = current_setting('app.telegram_id', true)::bigint);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (telegram_id = current_setting('app.telegram_id', true)::bigint);
```

---

### 2. Таблица `shops` — Магазины

```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('store', 'bakery', 'fruit', 'restaurant')),
  description TEXT,
  address TEXT,
  image_url TEXT,
  cover_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INT DEFAULT 0,
  min_order_amount INT DEFAULT 0, -- в рублях
  delivery_time VARCHAR(50) DEFAULT '30-45 мин',
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB DEFAULT '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-20:00", "sunday": "10:00-20:00"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_shops_category ON shops(category);
CREATE INDEX idx_shops_is_active ON shops(is_active);
CREATE INDEX idx_shops_slug ON shops(slug);

-- RLS Policy
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shops"
  ON shops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Partners can update own shop"
  ON shops FOR UPDATE
  USING (
    id IN (
      SELECT shop_id FROM profiles 
      WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
      AND role = 'partner'
    )
  );
```

---

### 3. Таблица `products` — Товары

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  composition TEXT,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image_url TEXT,
  weight VARCHAR(50),
  in_stock BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_is_popular ON products(is_popular);

-- RLS Policy
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products in stock"
  ON products FOR SELECT
  USING (in_stock = true);

CREATE POLICY "Partners can manage own shop products"
  ON products FOR ALL
  USING (
    shop_id IN (
      SELECT shop_id FROM profiles 
      WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
      AND role = 'partner'
    )
  );
```

---

### 4. Таблица `promotions` — Акции

```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percent INT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_promotions_shop_id ON promotions(shop_id);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(starts_at, ends_at);

-- RLS Policy
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  USING (
    is_active = true 
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
  );
```

---

### 5. Таблица `orders` — Заказы

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE RESTRICT,
  status VARCHAR(30) DEFAULT 'created' CHECK (status IN (
    'created', 'accepted', 'preparing', 'ready', 
    'courier_assigned', 'picked_up', 'in_transit', 
    'delivered', 'cancelled'
  )),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Адрес доставки
  delivery_district VARCHAR(50) NOT NULL,
  delivery_street VARCHAR(255) NOT NULL,
  delivery_house VARCHAR(50) NOT NULL,
  delivery_entrance VARCHAR(20),
  delivery_floor VARCHAR(20),
  delivery_apartment VARCHAR(50) NOT NULL,
  delivery_comment TEXT,
  
  -- Дата и время доставки
  delivery_date DATE NOT NULL,
  delivery_time_slot VARCHAR(20) NOT NULL, -- "10:00 - 12:00"
  
  -- Опции
  leave_at_door BOOLEAN DEFAULT false,
  
  -- Телефон
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Оплата
  payment_method VARCHAR(20) DEFAULT 'subscription' CHECK (payment_method IN ('subscription', 'one_time')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  
  -- Курьер
  courier_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  estimated_delivery_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_orders_profile_id ON orders(profile_id);
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_courier_id ON orders(courier_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);

-- RLS Policy
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (profile_id = (
    SELECT id FROM profiles 
    WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
  ));

CREATE POLICY "Partners can view shop orders"
  ON orders FOR SELECT
  USING (shop_id IN (
    SELECT shop_id FROM profiles 
    WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
    AND role = 'partner'
  ));

CREATE POLICY "Couriers can view assigned orders"
  ON orders FOR SELECT
  USING (courier_id = (
    SELECT id FROM profiles 
    WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
    AND role = 'courier'
  ));
```

---

### 6. Таблица `order_items` — Товары в заказе

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL, -- snapshot
  product_price DECIMAL(10,2) NOT NULL, -- snapshot
  product_weight VARCHAR(50), -- snapshot
  quantity INT NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL
);

-- Индексы
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- RLS Policy
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items of their orders"
  ON order_items FOR SELECT
  USING (order_id IN (
    SELECT id FROM orders 
    WHERE profile_id = (
      SELECT id FROM profiles 
      WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
    )
  ));
```

---

### 7. Таблица `subscription_plans` — Тарифные планы

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  deliveries_limit INT NOT NULL,
  duration_days INT NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed данные
INSERT INTO subscription_plans (name, slug, description, deliveries_limit, duration_days, price, sort_order) VALUES
('Стандарт', 'standard', 'Идеально для небольших заказов', 5, 30, 1499.00, 1),
('Плюс', 'plus', 'Для тех, кто заказывает регулярно', 7, 45, 1699.00, 2),
('Премиум', 'premium', 'Максимальная выгода', 10, 60, 1999.00, 3);

-- RLS Policy
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);
```

---

### 8. Таблица `customer_subscriptions` — Подписки клиентов

```sql
CREATE TABLE customer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  deliveries_remaining INT NOT NULL,
  deliveries_used INT DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_customer_subscriptions_profile_id ON customer_subscriptions(profile_id);
CREATE INDEX idx_customer_subscriptions_status ON customer_subscriptions(status);
CREATE INDEX idx_customer_subscriptions_expires_at ON customer_subscriptions(expires_at);

-- RLS Policy
ALTER TABLE customer_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON customer_subscriptions FOR SELECT
  USING (profile_id = (
    SELECT id FROM profiles 
    WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
  ));
```

---

### 9. Таблица `subscription_transactions` — Транзакции подписок

```sql
CREATE TABLE subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES customer_subscriptions(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'renewal', 'refund', 'delivery_used')),
  amount DECIMAL(10,2),
  deliveries_delta INT, -- для delivery_used: -1
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_subscription_transactions_subscription_id ON subscription_transactions(subscription_id);
CREATE INDEX idx_subscription_transactions_profile_id ON subscription_transactions(profile_id);
CREATE INDEX idx_subscription_transactions_type ON subscription_transactions(type);
CREATE INDEX idx_subscription_transactions_created_at ON subscription_transactions(created_at DESC);
```

---

### 10. Таблица `courier_shifts` — Смены курьеров

```sql
CREATE TABLE courier_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  deliveries_count INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Индексы
CREATE INDEX idx_courier_shifts_courier_id ON courier_shifts(courier_id);
CREATE INDEX idx_courier_shifts_is_active ON courier_shifts(is_active);
CREATE INDEX idx_courier_shifts_started_at ON courier_shifts(started_at DESC);

-- RLS Policy
ALTER TABLE courier_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couriers can view own shifts"
  ON courier_shifts FOR SELECT
  USING (courier_id = (
    SELECT id FROM profiles 
    WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
    AND role = 'courier'
  ));
```

---

### 11. Таблица `status_history` — История изменения статусов

```sql
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_status_history_order_id ON status_history(order_id);
CREATE INDEX idx_status_history_created_at ON status_history(created_at DESC);
```

---

## 🔌 API эндпоинты

### Авторизация

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/auth/telegram` | Авторизация через Telegram initData | - |
| GET | `/api/auth/me` | Получение текущего пользователя | ✓ |
| POST | `/api/auth/logout` | Выход | ✓ |

---

### Магазины

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/shops` | Список магазинов (фильтры: category, search) | - |
| GET | `/api/shops/:id` | Детали магазина | - |
| GET | `/api/shops/:id/products` | Товары магазина (фильтр по категории) | - |

---

### Товары

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/products` | Поиск товаров | - |
| GET | `/api/products/:id` | Детали товара | - |
| GET | `/api/products/popular` | Популярные товары | - |

---

### Акции

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/promotions` | Активные акции | - |
| GET | `/api/promotions/:id` | Детали акции | - |

---

### Заказы (Клиент)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/orders` | Создание заказа (checkout) | ✓ |
| GET | `/api/orders` | Мои заказы | ✓ |
| GET | `/api/orders/:id` | Детали заказа | ✓ |
| GET | `/api/orders/:id/status` | Статус заказа (для polling) | ✓ |
| POST | `/api/orders/:id/cancel` | Отмена заказа | ✓ |

---

### Подписки

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/subscriptions/plans` | Доступные тарифы | - |
| GET | `/api/subscriptions/me` | Моя подписка | ✓ |
| POST | `/api/subscriptions/activate` | Активация подписки | ✓ |
| GET | `/api/subscriptions/transactions` | История транзакций | ✓ |

---

### Профиль

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/profile` | Мой профиль | ✓ |
| PATCH | `/api/profile` | Обновить профиль | ✓ |
| PATCH | `/api/profile/address` | Обновить адрес по умолчанию | ✓ |

---

### Партнёр

| Метод | Эндпоинт | Описание | Auth | Role |
|-------|----------|----------|------|------|
| GET | `/api/partner/shop` | Мой магазин | ✓ | partner |
| PATCH | `/api/partner/shop` | Обновить магазин | ✓ | partner |
| GET | `/api/partner/products` | Товары моего магазина | ✓ | partner |
| POST | `/api/partner/products` | Создать товар | ✓ | partner |
| PATCH | `/api/partner/products/:id` | Обновить товар | ✓ | partner |
| DELETE | `/api/partner/products/:id` | Удалить товар | ✓ | partner |
| POST | `/api/partner/products/:id/image` | Загрузить изображение товара | ✓ | partner |
| GET | `/api/partner/orders` | Заказы магазина | ✓ | partner |
| POST | `/api/partner/orders/:id/accept` | Принять заказ | ✓ | partner |
| POST | `/api/partner/orders/:id/ready` | Заказ готов | ✓ | partner |
| GET | `/api/partner/analytics` | Статистика магазина | ✓ | partner |

---

### Курьер

| Метод | Эндпоинт | Описание | Auth | Role |
|-------|----------|----------|------|------|
| POST | `/api/courier/shift/start` | Начать смену | ✓ | courier |
| POST | `/api/courier/shift/end` | Завершить смену | ✓ | courier |
| GET | `/api/courier/shift/current` | Текущая смена | ✓ | courier |
| GET | `/api/courier/orders` | Мои заказы | ✓ | courier |
| POST | `/api/courier/orders/:id/pickup` | Забрал заказ | ✓ | courier |
| POST | `/api/courier/orders/:id/deliver` | Доставил заказ | ✓ | courier |
| GET | `/api/courier/stats` | Статистика курьера | ✓ | courier |

---

### Администратор

| Метод | Эндпоинт | Описание | Auth | Role |
|-------|----------|----------|------|------|
| GET | `/api/admin/orders` | Все заказы (с фильтрами) | ✓ | admin |
| PATCH | `/api/admin/orders/:id` | Редактировать заказ | ✓ | admin |
| GET | `/api/admin/users` | Все пользователи | ✓ | admin |
| PATCH | `/api/admin/users/:id/role` | Изменить роль пользователя | ✓ | admin |
| GET | `/api/admin/shops` | Все магазины | ✓ | admin |
| PATCH | `/api/admin/shops/:id` | Редактировать магазин | ✓ | admin |
| GET | `/api/admin/couriers` | Все курьеры | ✓ | admin |
| GET | `/api/admin/couriers/:id/stats` | Статистика курьера | ✓ | admin |
| GET | `/api/admin/stats/overview` | Общая статистика | ✓ | admin |
| GET | `/api/admin/partners` | Заявки партнёров | ✓ | admin |
| POST | `/api/admin/partners/:id/approve` | Одобрить заявку партнёра | ✓ | admin |

---

## 📁 Структура backend проекта

```
backend/
├── src/
│   ├── index.js                      # Entry point
│   ├── app.js                        # Express app setup
│   │
│   ├── config/
│   │   ├── env.js                    # Environment variables
│   │   ├── supabase.js               # Supabase client config
│   │   └── constants.js              # Constants
│   │
│   ├── routes/
│   │   ├── index.js                  # Main router
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
│   │   ├── auth.controller.js
│   │   ├── shops.controller.js
│   │   ├── products.controller.js
│   │   ├── orders.controller.js
│   │   ├── subscriptions.controller.js
│   │   ├── profile.controller.js
│   │   ├── partner.controller.js
│   │   ├── courier.controller.js
│   │   └── admin.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── shops.service.js
│   │   ├── products.service.js
│   │   ├── orders.service.js
│   │   ├── subscriptions.service.js
│   │   ├── profile.service.js
│   │   ├── partner.service.js
│   │   ├── courier.service.js
│   │   └── admin.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── telegram.middleware.js    # Telegram initData validation
│   │   ├── role.middleware.js        # Role-based access control
│   │   ├── validator.middleware.js   # Request validation
│   │   └── errorHandler.middleware.js
│   │
│   └── utils/
│       ├── telegram.js               # Telegram helpers
│       ├── jwt.js                    # JWT helpers
│       ├── validators.js             # Validation schemas
│       └── helpers.js                # Common helpers
│
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_seed_data.sql
│
├── .env.example
├── .env
├── .gitignore
├── package.json
├── ecosystem.config.js               # PM2 config
└── README.md
```

---

## 🔐 Аутентификация через Telegram

### Принцип работы

1. **Frontend** отправляет `initData` из Telegram WebApp
2. **Backend** валидирует `initData` используя `BOT_TOKEN`
3. Если валидация успешна - создаем/обновляем пользователя в БД
4. Генерируем JWT токен и возвращаем клиенту
5. Клиент сохраняет JWT и использует его в дальнейших запросах

### Код валидации Telegram initData

**`src/utils/telegram.js`**

```javascript
const crypto = require('crypto');

/**
 * Валидация Telegram initData
 * @param {string} initData - Строка initData из Telegram WebApp
 * @param {string} botToken - Токен Telegram бота
 * @returns {Object|null} - Данные пользователя или null
 */
function validateTelegramInitData(initData, botToken) {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return null;
    }
    
    urlParams.delete('hash');
    
    // Сортируем параметры
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Создаём secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    // Проверяем подпись
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    if (calculatedHash !== hash) {
      console.log('Invalid hash');
      return null;
    }
    
    // Проверяем auth_date (не старше 24 часов)
    const authDate = parseInt(urlParams.get('auth_date') || '0');
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime - authDate > 86400) {
      console.log('initData expired');
      return null;
    }
    
    // Парсим данные пользователя
    const userDataString = urlParams.get('user');
    if (!userDataString) {
      return null;
    }
    
    const user = JSON.parse(userDataString);
    return user;
    
  } catch (error) {
    console.error('Telegram initData validation error:', error);
    return null;
  }
}

module.exports = {
  validateTelegramInitData
};
```

---

### JWT токены

**`src/utils/jwt.js`**

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '7d'; // 7 дней

/**
 * Генерация JWT токена
 * @param {Object} payload - Данные для токена
 * @returns {string} - JWT токен
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

/**
 * Верификация JWT токена
 * @param {string} token - JWT токен
 * @returns {Object|null} - Payload или null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};
```

---

### Auth Middleware

**`src/middlewares/auth.middleware.js`**

```javascript
const { verifyToken } = require('../utils/jwt');
const { supabase } = require('../config/supabase');

/**
 * Middleware для проверки JWT токена
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Получаем пользователя из БД
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', payload.sub)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (!user.is_active) {
      return res.status(403).json({ error: 'User is inactive' });
    }
    
    // Добавляем пользователя в request
    req.user = user;
    
    // Устанавливаем RLS context для Supabase
    await supabase.rpc('set_app_context', {
      telegram_id: user.telegram_id
    });
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { authMiddleware };
```

---

### Role Middleware

**`src/middlewares/role.middleware.js`**

```javascript
/**
 * Middleware для проверки роли пользователя
 * @param {Array<string>} allowedRoles - Разрешённые роли
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

module.exports = { roleMiddleware };
```

---

## 🔧 Логика основных модулей

### 1. Auth Service

**`src/services/auth.service.js`**

```javascript
const { supabase } = require('../config/supabase');
const { validateTelegramInitData } = require('../utils/telegram');
const { generateToken } = require('../utils/jwt');

class AuthService {
  /**
   * Авторизация через Telegram
   * @param {string} initData - Telegram initData
   * @returns {Object} - { user, token }
   */
  async loginWithTelegram(initData) {
    const botToken = process.env.BOT_TOKEN;
    
    // Валидация initData
    const telegramUser = validateTelegramInitData(initData, botToken);
    
    if (!telegramUser) {
      throw new Error('Invalid Telegram data');
    }
    
    // Проверяем существует ли пользователь
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single();
    
    let user;
    
    if (existingUser) {
      // Обновляем данные пользователя
      const { data: updatedUser, error } = await supabase
        .from('profiles')
        .update({
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_id', telegramUser.id)
        .select()
        .single();
      
      if (error) throw error;
      user = updatedUser;
    } else {
      // Создаем нового пользователя
      const { data: newUser, error } = await supabase
        .from('profiles')
        .insert({
          telegram_id: telegramUser.id,
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          role: 'customer'
        })
        .select()
        .single();
      
      if (error) throw error;
      user = newUser;
    }
    
    // Генерируем JWT токен
    const token = generateToken({
      sub: user.id,
      telegram_id: user.telegram_id,
      role: user.role
    });
    
    return { user, token };
  }
  
  /**
   * Получение текущего пользователя
   * @param {string} userId - ID пользователя
   * @returns {Object} - Пользователь
   */
  async getCurrentUser(userId) {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return user;
  }
}

module.exports = new AuthService();
```

---

### 2. Orders Service

**`src/services/orders.service.js`**

```javascript
const { supabase } = require('../config/supabase');

class OrdersService {
  /**
   * Создание заказа
   * @param {Object} orderData - Данные заказа
   * @param {string} userId - ID пользователя
   * @returns {Object} - Созданный заказ
   */
  async createOrder(orderData, userId) {
    const {
      shopId,
      items, // [{ productId, quantity }]
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
      paymentMethod,
      customerPhone,
      leaveAtDoor
    } = orderData;
    
    // Получаем информацию о товарах
    const productIds = items.map(item => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    if (productsError) throw productsError;
    
    // Рассчитываем стоимость
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      return {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_weight: product.weight,
        quantity: item.quantity,
        total: itemTotal
      };
    });
    
    // Стоимость доставки
    let deliveryFee = 0;
    
    if (paymentMethod === 'subscription') {
      // Проверяем активную подписку
      const { data: subscription } = await supabase
        .from('customer_subscriptions')
        .select('*')
        .eq('profile_id', userId)
        .eq('status', 'active')
        .gte('deliveries_remaining', 1)
        .gte('expires_at', new Date().toISOString())
        .single();
      
      if (!subscription) {
        throw new Error('No active subscription found');
      }
      
      deliveryFee = 0;
    } else {
      // Разовая доставка
      deliveryFee = 350; // Фиксированная стоимость
    }
    
    const total = subtotal + deliveryFee;
    
    // Создаем заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: userId,
        shop_id: shopId,
        status: 'created',
        subtotal,
        delivery_fee: deliveryFee,
        total,
        delivery_district: deliveryAddress.district,
        delivery_street: deliveryAddress.street,
        delivery_house: deliveryAddress.house,
        delivery_entrance: deliveryAddress.entrance,
        delivery_floor: deliveryAddress.floor,
        delivery_apartment: deliveryAddress.apartment,
        delivery_date: deliveryDate,
        delivery_time_slot: deliveryTimeSlot,
        leave_at_door: leaveAtDoor,
        customer_phone: customerPhone,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'subscription' ? 'paid' : 'pending'
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Создаем элементы заказа
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);
    
    if (itemsError) throw itemsError;
    
    // Если оплата по подписке - списываем доставку
    if (paymentMethod === 'subscription') {
      await this.useSubscriptionDelivery(userId, order.id);
    }
    
    // Добавляем запись в историю статусов
    await supabase
      .from('status_history')
      .insert({
        order_id: order.id,
        status: 'created',
        changed_by: userId,
        notes: 'Order created'
      });
    
    return order;
  }
  
  /**
   * Списание доставки из подписки
   * @param {string} userId - ID пользователя
   * @param {string} orderId - ID заказа
   */
  async useSubscriptionDelivery(userId, orderId) {
    // Получаем активную подписку
    const { data: subscription, error: subError } = await supabase
      .from('customer_subscriptions')
      .select('*')
      .eq('profile_id', userId)
      .eq('status', 'active')
      .gte('deliveries_remaining', 1)
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (subError || !subscription) {
      throw new Error('No active subscription');
    }
    
    // Уменьшаем количество оставшихся доставок
    const { error: updateError } = await supabase
      .from('customer_subscriptions')
      .update({
        deliveries_remaining: subscription.deliveries_remaining - 1,
        deliveries_used: subscription.deliveries_used + 1
      })
      .eq('id', subscription.id);
    
    if (updateError) throw updateError;
    
    // Записываем транзакцию
    await supabase
      .from('subscription_transactions')
      .insert({
        subscription_id: subscription.id,
        profile_id: userId,
        type: 'delivery_used',
        deliveries_delta: -1,
        order_id: orderId,
        description: `Delivery used for order ${orderId}`
      });
  }
  
  /**
   * Получение заказов пользователя
   * @param {string} userId - ID пользователя
   * @returns {Array} - Список заказов
   */
  async getUserOrders(userId) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        shop:shops(id, name, image_url),
        order_items(*)
      `)
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return orders;
  }
  
  /**
   * Получение деталей заказа
   * @param {string} orderId - ID заказа
   * @param {string} userId - ID пользователя
   * @returns {Object} - Заказ
   */
  async getOrderById(orderId, userId) {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        shop:shops(id, name, image_url, address, phone),
        order_items(
          *,
          product:products(id, name, image_url)
        ),
        courier:profiles!courier_id(id, first_name, last_name, phone),
        status_history(*)
      `)
      .eq('id', orderId)
      .eq('profile_id', userId)
      .single();
    
    if (error) throw error;
    return order;
  }
  
  /**
   * Отмена заказа
   * @param {string} orderId - ID заказа
   * @param {string} userId - ID пользователя
   */
  async cancelOrder(orderId, userId) {
    // Проверяем что заказ принадлежит пользователю
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('profile_id', userId)
      .single();
    
    if (orderError || !order) {
      throw new Error('Order not found');
    }
    
    // Можно отменить только если статус created или accepted
    if (!['created', 'accepted'].includes(order.status)) {
      throw new Error('Cannot cancel order at this stage');
    }
    
    // Обновляем статус
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    // Если оплата была по подписке - возвращаем доставку
    if (order.payment_method === 'subscription') {
      await this.refundSubscriptionDelivery(userId, orderId);
    }
    
    // Добавляем в историю
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: 'cancelled',
        changed_by: userId,
        notes: 'Order cancelled by customer'
      });
  }
  
  /**
   * Возврат доставки в подписку
   * @param {string} userId - ID пользователя
   * @param {string} orderId - ID заказа
   */
  async refundSubscriptionDelivery(userId, orderId) {
    // Находим транзакцию списания
    const { data: transaction } = await supabase
      .from('subscription_transactions')
      .select('*')
      .eq('order_id', orderId)
      .eq('type', 'delivery_used')
      .single();
    
    if (!transaction) return;
    
    // Возвращаем доставку
    const { error: updateError } = await supabase
      .from('customer_subscriptions')
      .update({
        deliveries_remaining: supabase.raw('deliveries_remaining + 1'),
        deliveries_used: supabase.raw('deliveries_used - 1')
      })
      .eq('id', transaction.subscription_id);
    
    if (updateError) throw updateError;
    
    // Записываем транзакцию возврата
    await supabase
      .from('subscription_transactions')
      .insert({
        subscription_id: transaction.subscription_id,
        profile_id: userId,
        type: 'refund',
        deliveries_delta: 1,
        order_id: orderId,
        description: `Delivery refunded for cancelled order ${orderId}`
      });
  }
}

module.exports = new OrdersService();
```

---

### 3. Subscriptions Service

**`src/services/subscriptions.service.js`**

```javascript
const { supabase } = require('../config/supabase');

class SubscriptionsService {
  /**
   * Получение всех тарифных планов
   * @returns {Array} - Список планов
   */
  async getPlans() {
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return plans;
  }
  
  /**
   * Получение активной подписки пользователя
   * @param {string} userId - ID пользователя
   * @returns {Object|null} - Подписка или null
   */
  async getUserSubscription(userId) {
    const { data: subscription, error } = await supabase
      .from('customer_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('profile_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return subscription || null;
  }
  
  /**
   * Активация подписки
   * @param {Object} data - Данные для активации
   * @param {string} userId - ID пользователя
   * @returns {Object} - Созданная подписка
   */
  async activateSubscription(data, userId) {
    const { planId } = data;
    
    // Получаем план
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();
    
    if (planError || !plan) {
      throw new Error('Plan not found');
    }
    
    // Проверяем есть ли уже активная подписка
    const existingSubscription = await this.getUserSubscription(userId);
    
    if (existingSubscription) {
      throw new Error('User already has active subscription');
    }
    
    // Рассчитываем дату истечения
    const startDate = new Date();
    const expiresAt = new Date(startDate);
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days);
    
    // Создаем подписку
    const { data: subscription, error: subError } = await supabase
      .from('customer_subscriptions')
      .insert({
        profile_id: userId,
        plan_id: planId,
        status: 'active',
        deliveries_remaining: plan.deliveries_limit,
        deliveries_used: 0,
        started_at: startDate.toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .single();
    
    if (subError) throw subError;
    
    // Записываем транзакцию покупки
    await supabase
      .from('subscription_transactions')
      .insert({
        subscription_id: subscription.id,
        profile_id: userId,
        type: 'purchase',
        amount: plan.price,
        description: `Purchased ${plan.name} subscription`
      });
    
    return subscription;
  }
  
  /**
   * Получение истории транзакций
   * @param {string} userId - ID пользователя
   * @returns {Array} - Список транзакций
   */
  async getTransactions(userId) {
    const { data: transactions, error } = await supabase
      .from('subscription_transactions')
      .select(`
        *,
        subscription:customer_subscriptions(
          id,
          plan:subscription_plans(name)
        ),
        order:orders(id, order_number)
      `)
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return transactions;
  }
}

module.exports = new SubscriptionsService();
```

---

### 4. Courier Service

**`src/services/courier.service.js`**

```javascript
const { supabase } = require('../config/supabase');

class CourierService {
  /**
   * Начать смену
   * @param {string} courierId - ID курьера
   * @returns {Object} - Смена
   */
  async startShift(courierId) {
    // Проверяем есть ли уже активная смена
    const { data: activeShift } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .eq('is_active', true)
      .single();
    
    if (activeShift) {
      throw new Error('Shift already active');
    }
    
    // Создаем новую смену
    const { data: shift, error } = await supabase
      .from('courier_shifts')
      .insert({
        courier_id: courierId,
        started_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return shift;
  }
  
  /**
   * Завершить смену
   * @param {string} courierId - ID курьера
   * @returns {Object} - Смена
   */
  async endShift(courierId) {
    // Получаем активную смену
    const { data: shift, error: shiftError } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .eq('is_active', true)
      .single();
    
    if (shiftError || !shift) {
      throw new Error('No active shift found');
    }
    
    // Обновляем смену
    const { data: updatedShift, error } = await supabase
      .from('courier_shifts')
      .update({
        ended_at: new Date().toISOString(),
        is_active: false
      })
      .eq('id', shift.id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedShift;
  }
  
  /**
   * Получить текущую смену
   * @param {string} courierId - ID курьера
   * @returns {Object|null} - Смена или null
   */
  async getCurrentShift(courierId) {
    const { data: shift, error } = await supabase
      .from('courier_shifts')
      .select('*')
      .eq('courier_id', courierId)
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return shift || null;
  }
  
  /**
   * Получить заказы курьера
   * @param {string} courierId - ID курьера
   * @returns {Array} - Список заказов
   */
  async getCourierOrders(courierId) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        shop:shops(id, name, address),
        order_items(*)
      `)
      .or(`courier_id.eq.${courierId},status.in.(ready)`)
      .in('status', ['ready', 'courier_assigned', 'picked_up', 'in_transit'])
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return orders;
  }
  
  /**
   * Забрать заказ
   * @param {string} orderId - ID заказа
   * @param {string} courierId - ID курьера
   */
  async pickupOrder(orderId, courierId) {
    // Обновляем заказ
    const { error } = await supabase
      .from('orders')
      .update({
        courier_id: courierId,
        status: 'picked_up'
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // Добавляем в историю
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: 'picked_up',
        changed_by: courierId,
        notes: 'Order picked up by courier'
      });
  }
  
  /**
   * Доставить заказ
   * @param {string} orderId - ID заказа
   * @param {string} courierId - ID курьера
   */
  async deliverOrder(orderId, courierId) {
    // Обновляем заказ
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'delivered'
      })
      .eq('id', orderId)
      .eq('courier_id', courierId);
    
    if (error) throw error;
    
    // Обновляем смену (увеличиваем счетчик доставок)
    const shift = await this.getCurrentShift(courierId);
    
    if (shift) {
      await supabase
        .from('courier_shifts')
        .update({
          deliveries_count: shift.deliveries_count + 1,
          total_earnings: shift.total_earnings + 200 // Фиксированная оплата за доставку
        })
        .eq('id', shift.id);
    }
    
    // Добавляем в историю
    await supabase
      .from('status_history')
      .insert({
        order_id: orderId,
        status: 'delivered',
        changed_by: courierId,
        notes: 'Order delivered'
      });
  }
  
  /**
   * Получить статистику курьера
   * @param {string} courierId - ID курьера
   * @returns {Object} - Статистика
   */
  async getCourierStats(courierId) {
    // Статистика за сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todayShifts } = await supabase
      .from('courier_shifts')
      .select('deliveries_count, total_earnings')
      .eq('courier_id', courierId)
      .gte('started_at', today.toISOString());
    
    const todayDeliveries = todayShifts?.reduce((sum, shift) => sum + shift.deliveries_count, 0) || 0;
    const todayEarnings = todayShifts?.reduce((sum, shift) => sum + parseFloat(shift.total_earnings), 0) || 0;
    
    // Общая статистика
    const { data: allShifts } = await supabase
      .from('courier_shifts')
      .select('deliveries_count, total_earnings')
      .eq('courier_id', courierId);
    
    const totalDeliveries = allShifts?.reduce((sum, shift) => sum + shift.deliveries_count, 0) || 0;
    const totalEarnings = allShifts?.reduce((sum, shift) => sum + parseFloat(shift.total_earnings), 0) || 0;
    
    // Средний рейтинг (заглушка, т.к. рейтинги не реализованы)
    const rating = 4.9;
    
    return {
      todayDeliveries,
      todayEarnings,
      totalDeliveries,
      totalEarnings,
      rating
    };
  }
}

module.exports = new CourierService();
```

---

## 🚀 Развертывание на VPS

### Требования к серверу

- **ОС**: Ubuntu 20.04/22.04 LTS
- **RAM**: минимум 2GB (рекомендуется 4GB)
- **Disk**: минимум 20GB SSD
- **CPU**: минимум 2 ядра

---

### Шаг 1: Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Nginx
sudo apt install -y nginx

# Установка Git
sudo apt install -y git
```

---

### Шаг 2: Установка Supabase (Self-hosted)

**Вариант 1: Docker (рекомендуется)**

```bash
# Установка Docker
sudo apt install -y docker.io docker-compose

# Клонирование Supabase
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Копирование .env.example
cp .env.example .env

# Редактирование .env (изменить пароли и ключи)
nano .env

# Запуск Supabase
sudo docker-compose up -d

# Проверка статуса
sudo docker-compose ps
```

**Важные переменные в `.env`:**

```env
POSTGRES_PASSWORD=your-super-secret-password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=... (генерируется автоматически)
SERVICE_ROLE_KEY=... (генерируется автоматически)
```

**Supabase будет доступен по адресу:**

- Studio: `http://your-vps-ip:3000`
- API: `http://your-vps-ip:8000`
- PostgreSQL: `your-vps-ip:5432`

---

### Шаг 3: Развертывание Backend

```bash
# Создание директории проекта
mkdir -p /var/www/lavkinkot-backend
cd /var/www/lavkinkot-backend

# Клонирование репозитория (или загрузка кода)
git clone <your-repo-url> .

# Установка зависимостей
npm install

# Создание .env файла
nano .env
```

**Содержимое `.env`:**

```env
# Server
NODE_ENV=production
PORT=4000

# Supabase
SUPABASE_URL=http://your-vps-ip:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram
BOT_TOKEN=your-telegram-bot-token

# JWT
JWT_SECRET=your-jwt-secret-key

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

---

### Шаг 4: Миграции базы данных

```bash
# Подключаемся к PostgreSQL
psql -h your-vps-ip -p 5432 -U postgres

# Выполняем миграции
\i migrations/001_initial_schema.sql
\i migrations/002_rls_policies.sql
\i migrations/003_seed_data.sql
```

Или через Supabase Studio:
1. Открыть `http://your-vps-ip:3000`
2. SQL Editor → Новый запрос
3. Скопировать и выполнить каждую миграцию

---

### Шаг 5: Настройка PM2

**Создать `ecosystem.config.js`:**

```javascript
module.exports = {
  apps: [{
    name: 'lavkinkot-backend',
    script: './src/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

**Запуск:**

```bash
# Создать папку для логов
mkdir -p logs

# Запуск приложения
pm2 start ecosystem.config.js

# Сохранить процессы для автозапуска
pm2 save
pm2 startup

# Проверка статуса
pm2 status
pm2 logs lavkinkot-backend
```

---

### Шаг 6: Настройка Nginx

**Создать конфигурацию:**

```bash
sudo nano /etc/nginx/sites-available/lavkinkot-backend
```

**Содержимое:**

```nginx
server {
    listen 80;
    server_name api.your-domain.ru;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Активация:**

```bash
# Создать символическую ссылку
sudo ln -s /etc/nginx/sites-available/lavkinkot-backend /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

---

### Шаг 7: SSL сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d api.your-domain.ru

# Автообновление сертификата
sudo certbot renew --dry-run
```

---

### Шаг 8: Настройка Firewall

```bash
# Установка UFW
sudo apt install -y ufw

# Разрешить SSH
sudo ufw allow 22/tcp

# Разрешить HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Разрешить порты Supabase (только для внутреннего доступа)
# sudo ufw allow from your-backend-ip to any port 8000

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

---

## 📝 Пошаговый план разработки

### Фаза 1: Настройка инфраструктуры (1-2 дня)

- [ ] Настроить VPS (Ubuntu, Node.js, PM2, Nginx)
- [ ] Установить Supabase в Docker
- [ ] Настроить базу данных
- [ ] Выполнить миграции
- [ ] Создать seed данные

---

### Фаза 2: Базовая структура Backend (2-3 дня)

- [ ] Создать структуру проекта
- [ ] Настроить Express.js
- [ ] Настроить Supabase JS Client
- [ ] Создать базовые middlewares (auth, error handler)
- [ ] Настроить роутинг

---

### Фаза 3: Авторизация (2 дня)

- [ ] Реализовать валидацию Telegram initData
- [ ] Реализовать генерацию JWT токенов
- [ ] Создать auth middleware
- [ ] Создать role middleware
- [ ] Протестировать авторизацию

---

### Фаза 4: API Магазинов и Товаров (3 дня)

- [ ] Реализовать получение списка магазинов
- [ ] Реализовать фильтрацию по категориям
- [ ] Реализовать получение товаров магазина
- [ ] Реализовать поиск товаров
- [ ] Реализовать акции
- [ ] Протестировать все эндпоинты

---

### Фаза 5: API Заказов (4-5 дней)

- [ ] Реализовать создание заказа
- [ ] Реализовать расчет стоимости
- [ ] Реализовать списание доставки из подписки
- [ ] Реализовать получение списка заказов
- [ ] Реализовать отслеживание заказа
- [ ] Реализовать отмену заказа
- [ ] Реализовать историю статусов
- [ ] Протестировать весь флоу заказа

---

### Фаза 6: API Подписок (2-3 дня)

- [ ] Реализовать получение тарифных планов
- [ ] Реализовать активацию подписки
- [ ] Реализовать получение текущей подписки
- [ ] Реализовать историю транзакций
- [ ] Протестировать подписки

---

### Фаза 7: API Профиля (1-2 дня)

- [ ] Реализовать получение профиля
- [ ] Реализовать обновление профиля
- [ ] Реализовать сохранение адреса по умолчанию
- [ ] Протестировать профиль

---

### Фаза 8: API Партнёра (3-4 дня)

- [ ] Реализовать управление магазином
- [ ] Реализовать CRUD товаров
- [ ] Реализовать загрузку изображений (Supabase Storage)
- [ ] Реализовать получение заказов магазина
- [ ] Реализовать изменение статусов заказов
- [ ] Реализовать аналитику
- [ ] Протестировать панель партнёра

---

### Фаза 9: API Курьера (3 дня)

- [ ] Реализовать управление сменами
- [ ] Реализовать получение доступных заказов
- [ ] Реализовать принятие заказа
- [ ] Реализовать изменение статусов доставки
- [ ] Реализовать статистику курьера
- [ ] Протестировать панель курьера

---

### Фаза 10: API Администратора (2-3 дня)

- [ ] Реализовать управление пользователями
- [ ] Реализовать управление ролями
- [ ] Реализовать управление заказами
- [ ] Реализовать управление магазинами
- [ ] Реализовать статистику
- [ ] Протестировать админ-панель

---

### Фаза 11: Интеграция с Frontend (2-3 дня)

- [ ] Настроить CORS
- [ ] Обновить все API endpoints в frontend
- [ ] Протестировать все флоу
- [ ] Исправить баги

---

### Фаза 12: Оптимизация и деплой (2-3 дня)

- [ ] Оптимизация запросов к БД
- [ ] Добавление индексов
- [ ] Настройка кеширования
- [ ] Настройка логирования
- [ ] Финальное тестирование
- [ ] Деплой на production

---

## 📦 Зависимости (package.json)

```json
{
  "name": "lavkinkot-backend",
  "version": "1.0.0",
  "description": "Backend для ЛавкинКот",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "multer": "^1.4.5-lts.1",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🎯 Итого

**Общее время разработки:** 25-35 дней (1-1.5 месяца)

**Основные технологии:**
- Node.js 20 + Express.js
- Supabase (PostgreSQL + Storage)
- JWT для авторизации
- Telegram initData валидация
- PM2 для процесс-менеджмента
- Nginx как reverse proxy

**Следующие шаги:**
1. Настроить VPS и Supabase
2. Создать структуру backend проекта
3. Реализовать авторизацию
4. Постепенно добавлять API модули
5. Интегрировать с frontend
6. Тестировать и деплоить

---

**Версия документа:** 1.0  
**Дата:** 22.01.2026
