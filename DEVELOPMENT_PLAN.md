# 🐱 ЛавкинКот — План разработки Telegram MiniApp

> Telegram MiniApp для доставки продуктов и еды в Самаре с подписочной моделью

---

## 📋 Оглавление

1. [Обзор проекта](#обзор-проекта)
2. [Технологический стек](#технологический-стек)
3. [Архитектура приложения](#архитектура-приложения)
4. [Структура проекта](#структура-проекта)
5. [Схема базы данных](#схема-базы-данных)
6. [API эндпоинты](#api-эндпоинты)
7. [Фазы разработки](#фазы-разработки)
8. [UI/UX спецификация](#uiux-спецификация)
9. [Безопасность](#безопасность)
10. [DevOps и деплой](#devops-и-деплой)
11. [Тестирование](#тестирование)
12. [Риски и митигация](#риски-и-митигация)

---

## 🎯 Обзор проекта

### Бизнес-модель

**ЛавкинКот** — сервис доставки продуктов и еды с уникальной подписочной моделью:
- Клиенты приобретают подписку с лимитом доставок
- Подписка действует во всех партнёрских точках (магазины, фруктовые лавки, пекарни, рестораны)
- Доставка списывается только при статусе «Доставлен»

### Целевая аудитория

- Жители Самары
- Пользователи Telegram
- Семьи, регулярно заказывающие продукты и еду, а также люди (спортсмены) следящие за питанием

### Ключевые метрики MVP

| Метрика | Целевое значение |
|---------|------------------|
| Время загрузки главной | < 2 сек |
| Конверсия в заказ | > 5% |
| Успешных доставок | > 95% |
| Retention 7 дней | > 40% |

---

## 🛠 Технологический стек

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 14.x | App Router, SSR/SSG |
| TypeScript | 5.x | Типизация |
| Tailwind CSS | 3.x | Стилизация |
| @telegram-apps/sdk | latest | Telegram WebApp API |
| Zustand | 4.x | State management |
| React Query | 5.x | Server state |
| Framer Motion | 10.x | Анимации |

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| Node.js | 20 LTS | Runtime |
| Express.js | 4.x | API framework |
| TypeScript | 5.x | Типизация |
| Supabase JS | 2.x | DB client |
| Zod | 3.x | Валидация |
| jsonwebtoken | 9.x | JWT токены |

### База данных и инфраструктура

| Технология | Назначение |
|------------|------------|
| Supabase (self-hosted) | PostgreSQL + Auth + Storage |
| Nginx | Reverse proxy |
| Docker | Контейнеризация |
| Beget VPS | Хостинг |

---

## 🏗 Архитектура приложения

### Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                        Telegram Client                          │
│                    (WebApp / MiniApp)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │ initData
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  App Router  │  │   Zustand    │  │    React Query       │   │
│  │   (Pages)    │  │   (Client)   │  │   (Server State)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express.js Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Auth Layer   │  │  Controllers │  │     Services         │   │
│  │ (JWT+TG)     │  │              │  │  (Business Logic)    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Supabase Client (service_role)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (Self-hosted)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  PostgreSQL  │  │   Storage    │  │      RLS             │   │
│  │   + RLS      │  │  (Images)    │  │   Policies           │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Слоистая архитектура Backend

```
┌─────────────────────────────────────┐
│           Routes (Express)          │  ← HTTP endpoints
├─────────────────────────────────────┤
│           Middlewares               │  ← Auth, validation, logging
├─────────────────────────────────────┤
│           Controllers               │  ← Request/Response handling
├─────────────────────────────────────┤
│           Services                  │  ← Business logic
├─────────────────────────────────────┤
│           Repositories              │  ← Data access (Supabase)
├─────────────────────────────────────┤
│           Models/Types              │  ← TypeScript interfaces
└─────────────────────────────────────┘
```

---

## 📁 Структура проекта

> **Единое приложение** — фронтенд (Next.js) и бэкенд (Express.js) в одном репозитории

```
lavkin-kot/
├── src/
│   ├── app/                          # Next.js App Router (Frontend)
│   │   ├── (client)/                 # Клиентские страницы
│   │   │   ├── page.tsx              # Главная
│   │   │   ├── layout.tsx            # Layout для клиентских страниц
│   │   │   ├── shop/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── product/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── order/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── admin/                    # Админ-панель
│   │   │   ├── page.tsx              # Выбор роли
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── partner/
│   │   │   │   └── page.tsx
│   │   │   └── courier/
│   │   │       └── page.tsx
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   │
│   ├── components/                   # React компоненты
│   │   ├── ui/                       # Базовые UI компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/                   # Layout компоненты
│   │   │   ├── Header.tsx
│   │   │   ├── ProfileButton.tsx
│   │   │   ├── FloatingCart.tsx
│   │   │   └── SafeArea.tsx
│   │   ├── home/                     # Компоненты главной
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ShopCategories.tsx
│   │   │   ├── ProductCategories.tsx
│   │   │   ├── PromotionsCarousel.tsx
│   │   │   └── ShopsList.tsx
│   │   ├── shop/                     # Компоненты магазина
│   │   │   ├── ShopHeader.tsx
│   │   │   ├── ShopCategories.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── product/                  # Компоненты товара
│   │   │   ├── ProductImage.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   └── QuantitySelector.tsx
│   │   ├── cart/                     # Компоненты корзины
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── EmptyCart.tsx
│   │   ├── order/                    # Компоненты заказа
│   │   │   ├── OrderTimeline.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   └── OrderCard.tsx
│   │   ├── profile/                  # Компоненты профиля
│   │   │   ├── SubscriptionCard.tsx
│   │   │   ├── OrderHistory.tsx
│   │   │   └── ProfileSettings.tsx
│   │   └── admin/                    # Компоненты админки
│   │       ├── RoleSelector.tsx
│   │       ├── OrdersTable.tsx
│   │       ├── StatsCards.tsx
│   │       ├── CourierShiftToggle.tsx
│   │       └── PartnerOrders.tsx
│   │
│   ├── hooks/                        # React хуки
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useTelegram.ts
│   │   ├── useShops.ts
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   └── useSubscription.ts
│   │
│   ├── store/                        # Zustand stores
│   │   ├── cart.ts
│   │   ├── auth.ts
│   │   └── ui.ts
│   │
│   ├── lib/                          # Утилиты фронтенда
│   │   ├── api.ts                    # API клиент (fetch wrapper)
│   │   ├── telegram.ts               # Telegram SDK wrapper
│   │   ├── utils.ts                  # Общие утилиты
│   │   └── constants.ts              # Константы
│   │
│   ├── types/                        # TypeScript типы (общие)
│   │   ├── models.ts                 # Модели данных
│   │   ├── api.ts                    # Типы API
│   │   └── index.ts
│   │
│   └── mocks/                        # Моковые данные для разработки
│       ├── shops.ts
│       ├── products.ts
│       ├── orders.ts
│       └── promotions.ts
│
├── server/                           # Express.js Backend
│   ├── index.ts                      # Entry point
│   ├── app.ts                        # Express app setup
│   ├── config/
│   │   ├── env.ts                    # Environment variables
│   │   └── supabase.ts               # Supabase client
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── shops.routes.ts
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── courier.routes.ts
│   │   ├── subscription.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── shops.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── courier.controller.ts
│   │   ├── subscription.controller.ts
│   │   └── admin.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── shops.service.ts
│   │   ├── products.service.ts
│   │   ├── orders.service.ts
│   │   ├── courier.service.ts
│   │   ├── subscription.service.ts
│   │   └── admin.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── telegram.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   └── utils/
│       ├── telegram.ts               # TG initData validation
│       ├── jwt.ts
│       └── helpers.ts
│
├── supabase/
│   ├── migrations/                   # SQL миграции
│   │   ├── 00001_initial_schema.sql
│   │   ├── 00002_rls_policies.sql
│   │   └── ...
│   ├── seed/                         # Тестовые данные
│   │   └── seed.sql
│   └── config.toml
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── categories/
│   │   └── placeholders/
│   └── fonts/
│
├── docker/
│   ├── docker-compose.yml            # Локальная разработка
│   ├── docker-compose.prod.yml       # Production
│   ├── Dockerfile                    # Единый Dockerfile
│   └── nginx.conf
│
├── .env.example
├── .env.local                        # Локальные переменные
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗄 Схема базы данных

### ER-диаграмма (упрощённая)

```
┌──────────────────┐       ┌──────────────────┐
│     profiles     │       │      shops       │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ telegram_id      │       │ name             │
│ first_name       │       │ category         │
│ last_name        │       │ description      │
│ phone            │       │ image_url        │
│ role             │       │ rating           │
│ created_at       │       │ delivery_time    │
│ updated_at       │       │ is_active        │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         │                          │
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│ customer_subs    │       │    products      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ profile_id (FK)  │       │ shop_id (FK)     │
│ plan_id (FK)     │       │ category         │
│ remaining        │       │ name             │
│ starts_at        │       │ description      │
│ ends_at          │       │ price            │
│ status           │       │ image_url        │
└──────────────────┘       │ in_stock         │
                           └────────┬─────────┘
                                    │
┌──────────────────┐                │
│     orders       │◄───────────────┘
├──────────────────┤
│ id (PK)          │       ┌──────────────────┐
│ profile_id (FK)  │       │   order_items    │
│ shop_id (FK)     │       ├──────────────────┤
│ status           │◄──────│ id (PK)          │
│ total            │       │ order_id (FK)    │
│ delivery_address │       │ product_id (FK)  │
│ payment_method   │       │ quantity         │
│ created_at       │       │ price            │
└────────┬─────────┘       └──────────────────┘
         │
         ▼
┌──────────────────┐       ┌──────────────────┐
│   deliveries     │       │  courier_shifts  │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ order_id (FK)    │       │ courier_id (FK)  │
│ courier_id (FK)  │       │ started_at       │
│ status           │       │ ended_at         │
│ picked_at        │       │ deliveries_count │
│ delivered_at     │       └──────────────────┘
└──────────────────┘
```

### Таблицы и поля

#### 1. `profiles` — Пользователи

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  default_address TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'partner', 'courier', 'admin')),
  shop_id UUID REFERENCES shops(id),  -- для партнёров
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `shops` — Магазины/партнёры

```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('store', 'fruit', 'bakery', 'restaurant')),
  description TEXT,
  address TEXT,
  image_url TEXT,
  cover_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  min_order_amount INT DEFAULT 0,
  delivery_time VARCHAR(50),  -- "30-45 мин"
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `products` — Товары

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  composition TEXT,
  price INT NOT NULL,  -- в копейках
  old_price INT,
  image_url TEXT,
  weight VARCHAR(50),  -- "500 г"
  in_stock BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `promotions` — Акции

```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percent INT,
  promo_code VARCHAR(50),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `orders` — Заказы

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  profile_id UUID NOT NULL REFERENCES profiles(id),
  shop_id UUID NOT NULL REFERENCES shops(id),
  status VARCHAR(30) DEFAULT 'created' CHECK (status IN (
    'created', 'accepted', 'preparing', 'ready', 
    'courier_assigned', 'picked_up', 'in_transit', 
    'delivered', 'cancelled'
  )),
  subtotal INT NOT NULL,  -- сумма товаров в копейках
  delivery_fee INT DEFAULT 0,
  total INT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_entrance VARCHAR(20),
  delivery_floor VARCHAR(20),
  delivery_apartment VARCHAR(20),
  delivery_comment TEXT,
  payment_method VARCHAR(20) DEFAULT 'card' CHECK (payment_method IN ('card', 'cash')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  estimated_delivery_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `order_items` — Товары в заказе

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,  -- snapshot
  product_price INT NOT NULL,  -- snapshot
  quantity INT NOT NULL DEFAULT 1,
  total INT NOT NULL
);
```

#### 7. `deliveries` — Доставки

```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES profiles(id),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'
  )),
  assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  courier_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 8. `courier_shifts` — Смены курьеров

```sql
CREATE TABLE courier_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_id UUID NOT NULL REFERENCES profiles(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  deliveries_count INT DEFAULT 0,
  total_earnings INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
```

#### 9. `customer_subscription_plans` — Тарифы подписок

```sql
CREATE TABLE customer_subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  deliveries_limit INT NOT NULL,
  duration_days INT NOT NULL DEFAULT 30,
  price INT NOT NULL,  -- в копейках
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed данные
INSERT INTO customer_subscription_plans (name, slug, deliveries_limit, duration_days, price) VALUES
('Basic', 'basic', 100, 30, 99900),
('Business', 'business', 250, 30, 199900),
('Premium', 'premium', 500, 30, 349900);
```

#### 10. `customer_subscriptions` — Подписки клиентов

```sql
CREATE TABLE customer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  plan_id UUID NOT NULL REFERENCES customer_subscription_plans(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  deliveries_remaining INT NOT NULL,
  deliveries_used INT DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 11. `subscription_txns` — Транзакции подписок

```sql
CREATE TABLE subscription_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES customer_subscriptions(id),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'renewal', 'refund', 'delivery_used')),
  amount INT,  -- для purchase/renewal/refund
  deliveries_delta INT,  -- для delivery_used (-1)
  order_id UUID REFERENCES orders(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 12. `status_history` — История статусов заказов

```sql
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API эндпоинты

### Авторизация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/telegram` | Авторизация через Telegram initData |
| GET | `/api/auth/me` | Получение текущего пользователя |
| POST | `/api/auth/logout` | Выход |

### Магазины

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/shops` | Список магазинов (фильтры: category, search) |
| GET | `/api/shops/:id` | Детали магазина |
| GET | `/api/shops/:id/products` | Товары магазина |

### Товары

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/products` | Поиск товаров (фильтры: category, search, shop_id) |
| GET | `/api/products/:id` | Детали товара |
| GET | `/api/products/popular` | Популярные товары |

### Акции

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/promotions` | Активные акции |
| GET | `/api/promotions/:id` | Детали акции |

### Корзина и Заказы

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/orders` | Создание заказа (checkout) |
| GET | `/api/orders` | Мои заказы |
| GET | `/api/orders/:id` | Детали заказа |
| GET | `/api/orders/:id/status` | Статус заказа (polling) |
| POST | `/api/orders/:id/cancel` | Отмена заказа |

### Подписки

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/subscription/plans` | Доступные тарифы |
| GET | `/api/subscription/me` | Моя подписка |
| POST | `/api/subscription/activate` | Активация подписки (MVP: эмуляция) |

### Курьер

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/courier/shift/start` | Начать смену |
| POST | `/api/courier/shift/end` | Завершить смену |
| GET | `/api/courier/shift/current` | Текущая смена |
| GET | `/api/courier/orders` | Мои заказы |
| POST | `/api/courier/orders/:id/pickup` | Забрал заказ |
| POST | `/api/courier/orders/:id/deliver` | Доставил заказ |

### Партнёр

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/partner/shop` | Мой магазин |
| GET | `/api/partner/orders` | Заказы магазина |
| POST | `/api/partner/orders/:id/accept` | Принять заказ |
| POST | `/api/partner/orders/:id/ready` | Заказ готов |
| GET | `/api/partner/stats` | Статистика |

### Админ

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/admin/orders` | Все заказы (фильтры) |
| PATCH | `/api/admin/orders/:id` | Редактировать заказ |
| GET | `/api/admin/shops` | Все магазины |
| PATCH | `/api/admin/shops/:id` | Редактировать магазин |
| GET | `/api/admin/couriers` | Все курьеры |
| GET | `/api/admin/couriers/:id/stats` | Статистика курьера |
| GET | `/api/admin/stats/overview` | Общая статистика |
| GET | `/api/admin/subscriptions` | Все подписки |

---

## 📅 Фазы разработки

> **Стратегия:** Frontend-first подход — сначала создаём полноценный UI с моковыми данными, затем подключаем бэкенд.

---

### Phase 1: Настройка проекта и UI Kit (Неделя 1)

#### Спринт 1.1 — Инициализация и базовая конфигурация

| Задача | Описание | Оценка |
|--------|----------|--------|
| Создание Next.js проекта | App Router, TypeScript, Tailwind | 2h |
| Настройка Tailwind | Цвета, шрифты, тема по брендбуку | 3h |
| Настройка ESLint + Prettier | Линтеры и форматирование | 1h |
| Структура папок | Создание базовой структуры | 1h |
| Telegram SDK интеграция | Подключение @telegram-apps/sdk | 2h |
| useTelegram hook | Хук для работы с Telegram WebApp | 2h |
| Настройка Zustand | Stores для cart, auth, ui | 2h |
| React Query setup | QueryClient, провайдеры | 1h |
| Моковые данные | Создание файлов с тестовыми данными | 3h |

**Итого: ~17 часов**

#### Спринт 1.2 — UI Kit компоненты

| Задача | Описание | Оценка |
|--------|----------|--------|
| Button | Все варианты (primary, secondary, ghost, accent) | 2h |
| Card | Базовая карточка с вариантами | 2h |
| Input | Текстовые поля, textarea | 2h |
| Skeleton | Скелетоны для загрузки | 2h |
| Badge | Бейджи для статусов | 1h |
| Modal | Модальные окна | 2h |
| SafeArea | Обёртка для Telegram viewport | 1h |
| Header | Шапка с кнопкой профиля | 2h |
| FloatingCart | Плавающая кнопка корзины | 3h |

**Итого: ~17 часов**

---

### Phase 2: Клиентские страницы с моками (Неделя 2-3)

#### Спринт 2.1 — Главная страница

| Задача | Описание | Оценка |
|--------|----------|--------|
| Layout клиентской части | Базовый layout с SafeArea | 2h |
| SearchBar | Поиск с иконкой | 3h |
| ShopCategories | 4 большие кнопки категорий | 3h |
| ProductCategories | Горизонтальный скролл категорий | 3h |
| PromotionsCarousel | Карусель акций | 4h |
| ShopsList | Вертикальный список магазинов | 4h |
| ShopCard | Карточка магазина | 3h |
| Сборка главной страницы | Интеграция всех компонентов | 2h |

**Итого: ~24 часа**

#### Спринт 2.2 — Страницы магазина и товара

| Задача | Описание | Оценка |
|--------|----------|--------|
| ShopHeader | Шапка страницы магазина | 3h |
| ShopCategories (внутри магазина) | Табы/фильтры по категориям | 3h |
| ProductGrid | Сетка товаров | 3h |
| ProductCard (в списке) | Карточка товара с кнопкой "+" | 3h |
| Страница магазина /shop/[id] | Сборка страницы | 2h |
| ProductImage | Галерея/большое изображение товара | 3h |
| ProductInfo | Название, цена, описание, состав | 3h |
| QuantitySelector | Выбор количества (+/-) | 2h |
| AddToCartButton | Кнопка добавления в корзину | 2h |
| Страница товара /product/[id] | Сборка страницы | 2h |

**Итого: ~26 часов**

#### Спринт 2.3 — Корзина и оформление заказа

| Задача | Описание | Оценка |
|--------|----------|--------|
| Cart store (Zustand) | Логика корзины (add, remove, update) | 3h |
| CartItem | Элемент корзины с управлением | 3h |
| CartSummary | Итоговая сумма, кнопка оформления | 2h |
| EmptyCart | Пустая корзина | 1h |
| Страница корзины /cart | Сборка страницы | 2h |
| AddressInput | Поле ввода адреса | 3h |
| PaymentMethodSelector | Выбор способа оплаты | 2h |
| CheckoutSummary | Итог заказа перед подтверждением | 2h |
| Страница оформления /checkout | Сборка страницы | 3h |

**Итого: ~21 час**

#### Спринт 2.4 — Отслеживание заказа и профиль

| Задача | Описание | Оценка |
|--------|----------|--------|
| OrderTimeline | Визуальный таймлайн статусов | 4h |
| OrderDetails | Детали заказа (товары, адрес, сумма) | 3h |
| Страница заказа /order/[id] | Сборка страницы | 2h |
| OrderCard | Карточка заказа для списка | 2h |
| OrderHistory | Список заказов в профиле | 3h |
| SubscriptionCard | Информация о подписке | 3h |
| ProfileSettings | Базовые настройки | 2h |
| Страница профиля /profile | Сборка страницы | 2h |

**Итого: ~21 час**

---

### Phase 3: Админ-панель UI (Неделя 4)

#### Спринт 3.1 — Выбор роли и панели

| Задача | Описание | Оценка |
|--------|----------|--------|
| RoleSelector | Экран выбора роли (Админ/Партнёр/Курьер) | 3h |
| AccessDenied | Экран "Нет доступа" | 1h |
| Admin layout | Layout для админки | 2h |
| StatsCards | Карточки со статистикой | 3h |
| OrdersTable | Таблица заказов с фильтрами | 6h |
| Админ-дашборд /admin/dashboard | Сборка страницы | 3h |

**Итого: ~18 часов**

#### Спринт 3.2 — Панели партнёра и курьера

| Задача | Описание | Оценка |
|--------|----------|--------|
| PartnerOrders | Список заказов партнёра | 4h |
| PartnerStats | Статистика магазина | 3h |
| Панель партнёра /admin/partner | Сборка страницы | 2h |
| CourierShiftToggle | Кнопка старт/стоп смены | 3h |
| CourierOrders | Заказы курьера с действиями | 4h |
| CourierStats | Статистика курьера | 2h |
| Панель курьера /admin/courier | Сборка страницы | 2h |

**Итого: ~20 часов**

---

### Phase 4: Backend и интеграция (Неделя 5-7)

#### Спринт 4.1 — Настройка бэкенда и БД

| Задача | Описание | Оценка |
|--------|----------|--------|
| Настройка Express.js | TypeScript, структура, middleware | 4h |
| Supabase локальный инстанс | Docker, конфигурация | 4h |
| Схема БД (миграции) | Все таблицы | 6h |
| RLS политики | Настройка безопасности | 5h |
| Seed данные | Тестовые магазины, товары, пользователи | 3h |
| Supabase client config | Настройка service_role клиента | 2h |

**Итого: ~24 часа**

#### Спринт 4.2 — Авторизация и базовые API

| Задача | Описание | Оценка |
|--------|----------|--------|
| Telegram initData валидация | Утилита проверки подписи | 4h |
| JWT генерация/валидация | Утилиты для токенов | 3h |
| Auth middleware | Защита эндпоинтов | 3h |
| POST /api/auth/telegram | Эндпоинт авторизации | 4h |
| GET /api/auth/me | Получение текущего пользователя | 2h |
| API client (фронт) | Обновление lib/api.ts для реальных запросов | 3h |
| useAuth hook | Интеграция с бэкендом | 3h |

**Итого: ~22 часа**

#### Спринт 4.3 — API магазинов и товаров

| Задача | Описание | Оценка |
|--------|----------|--------|
| Shops service | Бизнес-логика магазинов | 3h |
| GET /api/shops | Список магазинов | 3h |
| GET /api/shops/:id | Детали магазина | 2h |
| GET /api/shops/:id/products | Товары магазина | 3h |
| Products service | Бизнес-логика товаров | 3h |
| GET /api/products | Поиск товаров | 3h |
| GET /api/products/:id | Детали товара | 2h |
| GET /api/promotions | Акции | 2h |
| useShops, useProducts hooks | Интеграция с React Query | 4h |

**Итого: ~25 часов**

#### Спринт 4.4 — API заказов и подписок

| Задача | Описание | Оценка |
|--------|----------|--------|
| Orders service | Бизнес-логика заказов | 5h |
| POST /api/orders | Создание заказа | 4h |
| GET /api/orders | Мои заказы | 2h |
| GET /api/orders/:id | Детали заказа | 2h |
| GET /api/orders/:id/status | Статус заказа | 2h |
| POST /api/orders/:id/cancel | Отмена заказа | 2h |
| Subscription service | Бизнес-логика подписок | 4h |
| GET /api/subscription/plans | Тарифы | 2h |
| GET /api/subscription/me | Моя подписка | 2h |
| POST /api/subscription/activate | Активация (эмуляция) | 3h |
| Проверка лимита доставок | При создании заказа | 3h |
| useOrders, useSubscription hooks | Интеграция | 4h |

**Итого: ~35 часов**

#### Спринт 4.5 — API курьера и партнёра

| Задача | Описание | Оценка |
|--------|----------|--------|
| Role middleware | Проверка ролей | 2h |
| Courier service | Бизнес-логика курьера | 4h |
| POST /api/courier/shift/start | Начать смену | 2h |
| POST /api/courier/shift/end | Завершить смену | 2h |
| GET /api/courier/orders | Заказы курьера | 3h |
| POST /api/courier/orders/:id/pickup | Забрал заказ | 2h |
| POST /api/courier/orders/:id/deliver | Доставил (+ списание доставки) | 3h |
| Partner service | Бизнес-логика партнёра | 3h |
| GET /api/partner/orders | Заказы магазина | 3h |
| POST /api/partner/orders/:id/accept | Принять заказ | 2h |
| POST /api/partner/orders/:id/ready | Заказ готов | 2h |
| Интеграция админки с API | Подключение всех панелей | 4h |

**Итого: ~32 часа**

#### Спринт 4.6 — Админские API

| Задача | Описание | Оценка |
|--------|----------|--------|
| Admin service | Бизнес-логика админа | 4h |
| GET /api/admin/orders | Все заказы с фильтрами | 4h |
| PATCH /api/admin/orders/:id | Редактирование заказа | 3h |
| GET /api/admin/shops | Все магазины | 2h |
| GET /api/admin/couriers | Все курьеры | 2h |
| GET /api/admin/stats/overview | Общая статистика | 4h |
| Интеграция админ-дашборда | Подключение к API | 3h |

**Итого: ~22 часа**

---

### Phase 5: Полировка и деплой (Неделя 8-9)

#### Спринт 5.1 — Полировка UI/UX

| Задача | Описание | Оценка |
|--------|----------|--------|
| Анимации переходов | Framer Motion page transitions | 4h |
| Анимации компонентов | Микровзаимодействия | 4h |
| Empty states | Пустые состояния везде | 3h |
| Error states | Обработка и отображение ошибок | 3h |
| Loading states | Финальная полировка скелетонов | 2h |
| Pull-to-refresh | Обновление по свайпу | 2h |
| Haptic feedback | Вибрация Telegram | 2h |
| Telegram theme sync | Синхронизация с темой Telegram | 2h |

**Итого: ~22 часа**

#### Спринт 5.2 — Тестирование

| Задача | Описание | Оценка |
|--------|----------|--------|
| Unit тесты (утилиты) | Тесты для telegram.ts, jwt.ts | 4h |
| Unit тесты (сервисы) | Тесты для services | 6h |
| Интеграционные тесты API | Тесты эндпоинтов | 6h |
| E2E тесты (основные флоу) | Playwright: checkout, order tracking | 8h |
| Ручное тестирование | Тест в реальном Telegram | 4h |

**Итого: ~28 часов**

#### Спринт 5.3 — DevOps и деплой

| Задача | Описание | Оценка |
|--------|----------|--------|
| Dockerfile | Единый образ (Next.js + Express) | 3h |
| docker-compose.prod.yml | Production конфигурация | 3h |
| Supabase на VPS | Установка и настройка | 6h |
| Nginx конфигурация | SSL, proxy | 3h |
| CI/CD (GitHub Actions) | Автодеплой | 4h |
| Переменные окружения | .env для production | 2h |
| Мониторинг | Базовые логи | 3h |
| Telegram Bot настройка | WebApp URL, Menu Button | 2h |

**Итого: ~26 часов**

---

### Общая оценка трудозатрат

| Фаза | Часы |
|------|------|
| Phase 1: Настройка проекта и UI Kit | 34h |
| Phase 2: Клиентские страницы с моками | 92h |
| Phase 3: Админ-панель UI | 38h |
| Phase 4: Backend и интеграция | 160h |
| Phase 5: Полировка и деплой | 76h |
| **Итого** | **~400 часов** |

При работе 8 часов/день: **~50 рабочих дней** (~10 недель / 2.5 месяца)

---

### Визуализация порядка разработки

```
Неделя 1     ████████████████████████████████  Phase 1: Настройка + UI Kit
Неделя 2-3   ████████████████████████████████  Phase 2: Клиентские страницы (моки)
             ████████████████████████████████
Неделя 4     ████████████████████████████████  Phase 3: Админ-панель UI (моки)
Неделя 5-7   ████████████████████████████████  Phase 4: Backend + Интеграция
             ████████████████████████████████
             ████████████████████████████████
Неделя 8-9   ████████████████████████████████  Phase 5: Полировка + Деплой
             ████████████████████████████████
```

---

## 🎨 UI/UX спецификация

### Цветовая палитра

```css
:root {
  /* Основные цвета */
  --color-primary: #26495C;        /* Глубокий синий */
  --color-primary-light: #3a6a85;  /* Светлее */
  --color-primary-dark: #1a3340;   /* Темнее */
  
  /* Акцентный цвет */
  --color-accent: #F4A261;         /* Тёплый оранжево-персиковый */
  --color-accent-light: #f7bc8a;
  --color-accent-dark: #e8894a;
  
  /* Нейтральные */
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-border: #E2E8F0;
  
  /* Текст */
  --color-text-primary: #1E293B;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;
  
  /* Семантические */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### Типографика

```css
:root {
  /* Font Family */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### Скругления и тени

```css
:root {
  /* Border Radius */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

### Отступы и сетка

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  
  /* Container */
  --container-padding: var(--space-4);
  --content-max-width: 428px;
}
```

### Компоненты

#### Button

```tsx
// Варианты кнопок
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

// Primary - основные действия
<Button variant="primary">Добавить в корзину</Button>
// background: var(--color-primary)
// color: white

// Accent - призыв к действию
<Button variant="accent">Оформить заказ</Button>
// background: var(--color-accent)
// color: var(--color-primary-dark)

// Secondary - второстепенные действия
<Button variant="secondary">Отмена</Button>
// background: var(--color-surface)
// border: var(--color-border)
// color: var(--color-text-primary)

// Ghost - текстовые кнопки
<Button variant="ghost">Подробнее</Button>
// background: transparent
// color: var(--color-primary)
```

#### Card

```tsx
// Карточки магазинов и товаров
<Card>
  <CardImage src={image} alt={name} />
  <CardContent>
    <CardTitle>{name}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardContent>
</Card>

// Стили
// background: white
// border-radius: var(--radius-xl)
// box-shadow: var(--shadow-md)
// overflow: hidden
```

---

## 🔐 Безопасность

### Telegram initData валидация

```typescript
// server/utils/telegram.ts
import crypto from 'crypto';

export function validateTelegramInitData(
  initData: string, 
  botToken: string
): TelegramUser | null {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
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
    return null;
  }
  
  // Проверяем auth_date (не старше 24 часов)
  const authDate = parseInt(urlParams.get('auth_date') || '0');
  if (Date.now() / 1000 - authDate > 86400) {
    return null;
  }
  
  return JSON.parse(urlParams.get('user') || '{}');
}
```

### RLS политики (примеры)

```sql
-- Profiles: пользователь видит только себя
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (telegram_id = current_setting('app.telegram_id')::bigint);

-- Orders: клиент видит только свои заказы
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (profile_id = (
    SELECT id FROM profiles 
    WHERE telegram_id = current_setting('app.telegram_id')::bigint
  ));

-- Orders: партнёр видит заказы своего магазина
CREATE POLICY "Partners can view shop orders"
  ON orders FOR SELECT
  USING (
    shop_id = (
      SELECT shop_id FROM profiles 
      WHERE telegram_id = current_setting('app.telegram_id')::bigint
      AND role = 'partner'
    )
  );

-- Products: все могут читать, партнёр может редактировать свои
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Partners can update own shop products"
  ON products FOR UPDATE
  USING (
    shop_id = (
      SELECT shop_id FROM profiles 
      WHERE telegram_id = current_setting('app.telegram_id')::bigint
      AND role = 'partner'
    )
  );
```

### JWT токены

```typescript
// Структура токена
interface JWTPayload {
  sub: string;          // profile.id
  telegram_id: number;
  role: UserRole;
  iat: number;
  exp: number;
}

// Время жизни
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '30d';
```

---

## 🚀 DevOps и деплой

### Dockerfile (единый для приложения)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/server ./server

USER nextjs

EXPOSE 3000 4000

CMD ["node", "server/index.js"]
```

### Docker Compose (Production)

```yaml
# docker/docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - BOT_TOKEN=${BOT_TOKEN}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app
    restart: unless-stopped

volumes:
  supabase_data:
```

### Nginx конфигурация

```nginx
# docker/nginx.conf
upstream nextjs {
    server app:3000;
}

upstream express {
    server app:4000;
}

server {
    listen 80;
    server_name lavkin-kot.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lavkin-kot.ru;

    ssl_certificate /etc/letsencrypt/live/lavkin-kot.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lavkin-kot.ru/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://express;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/lavkin-kot
            git pull origin main
            docker-compose -f docker/docker-compose.prod.yml build
            docker-compose -f docker/docker-compose.prod.yml up -d
```

---

## 🧪 Тестирование

### Структура тестов

```
__tests__/
├── unit/
│   ├── server/
│   │   ├── utils/
│   │   │   └── telegram.test.ts
│   │   └── services/
│   │       ├── auth.service.test.ts
│   │       ├── orders.service.test.ts
│   │       └── subscription.service.test.ts
│   └── components/
│       ├── Button.test.tsx
│       └── Cart.test.tsx
├── integration/
│   ├── api/
│   │   ├── auth.test.ts
│   │   ├── orders.test.ts
│   │   └── shops.test.ts
│   └── db/
│       └── rls.test.ts
└── e2e/
    ├── checkout.spec.ts
    ├── order-tracking.spec.ts
    └── admin.spec.ts
```

### Примеры тестов

```typescript
// __tests__/unit/server/utils/telegram.test.ts
describe('validateTelegramInitData', () => {
  it('should validate correct initData', () => {
    const initData = generateValidInitData(mockUser, BOT_TOKEN);
    const result = validateTelegramInitData(initData, BOT_TOKEN);
    expect(result).toEqual(mockUser);
  });

  it('should reject invalid hash', () => {
    const initData = 'user=...&hash=invalid';
    const result = validateTelegramInitData(initData, BOT_TOKEN);
    expect(result).toBeNull();
  });

  it('should reject expired auth_date', () => {
    const initData = generateExpiredInitData(mockUser, BOT_TOKEN);
    const result = validateTelegramInitData(initData, BOT_TOKEN);
    expect(result).toBeNull();
  });
});
```

```typescript
// __tests__/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete order successfully', async ({ page }) => {
    // Эмулируем Telegram WebApp
    await page.addInitScript(() => {
      window.Telegram = {
        WebApp: {
          initData: '...',
          // ...mock
        }
      };
    });

    await page.goto('/');
    
    // Переходим в магазин
    await page.click('[data-testid="shop-card-1"]');
    
    // Добавляем товар
    await page.click('[data-testid="add-to-cart-1"]');
    
    // Открываем корзину
    await page.click('[data-testid="floating-cart"]');
    
    // Оформляем заказ
    await page.click('[data-testid="checkout-button"]');
    await page.fill('[data-testid="address-input"]', 'ул. Пушкина, д. 10');
    await page.click('[data-testid="confirm-order"]');
    
    // Проверяем переход на страницу отслеживания
    await expect(page).toHaveURL(/\/order\/\w+/);
    await expect(page.locator('[data-testid="order-status"]')).toContainText('Создан');
  });
});
```

---

## ⚠️ Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Изменения Telegram WebApp API | Средняя | Высокое | Абстрагировать работу с API, следить за changelog |
| Проблемы с self-hosted Supabase | Средняя | Высокое | Регулярные бэкапы, мониторинг, план отката на cloud |
| Нагрузка при масштабировании | Низкая (MVP) | Среднее | Оптимизация запросов, индексы в БД |
| Отказ платёжного шлюза | Низкая | Высокое | MVP без реальных платежей, интеграция позже |
| Проблемы с доставкой (курьеры) | Средняя | Среднее | Ручное назначение админом, резервные курьеры |

---

## 📚 Полезные ссылки

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting)
- [Telegram Payments](https://core.telegram.org/bots/payments)
- [Express.js](https://expressjs.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)

---

## ✅ Чек-лист MVP

### Phase 1: Настройка и UI Kit
- [ ] Next.js проект создан и настроен
- [ ] Tailwind сконфигурирован по брендбуку
- [ ] Telegram SDK подключен
- [ ] Zustand stores созданы
- [ ] UI Kit компоненты готовы
- [ ] Моковые данные созданы

### Phase 2: Клиентские страницы (с моками)
- [ ] Главная страница готова
- [ ] Страница магазина готова
- [ ] Страница товара готова
- [ ] Корзина работает (локально)
- [ ] Страница оформления готова
- [ ] Страница отслеживания готова
- [ ] Профиль готов

### Phase 3: Админ-панель UI (с моками)
- [ ] Выбор роли работает
- [ ] Админ-дашборд готов
- [ ] Панель партнёра готова
- [ ] Панель курьера готова

### Phase 4: Backend и интеграция
- [ ] Express.js настроен
- [ ] Supabase развёрнут
- [ ] Схема БД создана
- [ ] RLS политики настроены
- [ ] Telegram авторизация работает
- [ ] API магазинов/товаров работает
- [ ] API заказов работает
- [ ] API подписок работает
- [ ] API курьера/партнёра работает
- [ ] API админа работает
- [ ] Фронтенд интегрирован с API

### Phase 5: Финализация
- [ ] UI отполирован
- [ ] Тесты написаны
- [ ] Production деплой выполнен
- [ ] Мониторинг настроен
- [ ] Telegram Bot настроен

---

> **Версия документа:** 2.0  
> **Дата обновления:** 12.01.2026  
> **Изменения:** Убран монорепо, frontend-first подход, единое приложение
