-- ЛавкинКот: Начальная схема базы данных
-- Версия: 1.0.0
-- Дата: 22.01.2026

-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Таблица shops (магазины) - создаём первой для FK
-- =====================================================
CREATE TABLE IF NOT EXISTS shops (
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
  min_order_amount INT DEFAULT 0,
  delivery_time VARCHAR(50) DEFAULT '30-45 мин',
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB DEFAULT '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-20:00", "sunday": "10:00-20:00"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для shops
CREATE INDEX IF NOT EXISTS idx_shops_category ON shops(category);
CREATE INDEX IF NOT EXISTS idx_shops_is_active ON shops(is_active);
CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug);

-- =====================================================
-- Таблица profiles (пользователи)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
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

-- Индексы для profiles
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON profiles(telegram_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_shop_id ON profiles(shop_id);

-- =====================================================
-- Таблица products (товары)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
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

-- Индексы для products
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_popular ON products(is_popular);

-- =====================================================
-- Таблица promotions (акции)
-- =====================================================
CREATE TABLE IF NOT EXISTS promotions (
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

-- Индексы для promotions
CREATE INDEX IF NOT EXISTS idx_promotions_shop_id ON promotions(shop_id);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(starts_at, ends_at);

-- =====================================================
-- Таблица subscription_plans (тарифные планы)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
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

-- =====================================================
-- Таблица customer_subscriptions (подписки клиентов)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_subscriptions (
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

-- Индексы для customer_subscriptions
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_profile_id ON customer_subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_status ON customer_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_expires_at ON customer_subscriptions(expires_at);

-- =====================================================
-- Таблица orders (заказы)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
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
  delivery_time_slot VARCHAR(20) NOT NULL,
  
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

-- Индексы для orders
CREATE INDEX IF NOT EXISTS idx_orders_profile_id ON orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_courier_id ON orders(courier_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

-- =====================================================
-- Таблица order_items (товары в заказе)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  product_weight VARCHAR(50),
  quantity INT NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL
);

-- Индексы для order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- =====================================================
-- Таблица subscription_transactions (транзакции подписок)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES customer_subscriptions(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'renewal', 'refund', 'delivery_used')),
  amount DECIMAL(10,2),
  deliveries_delta INT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для subscription_transactions
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_subscription_id ON subscription_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_profile_id ON subscription_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_type ON subscription_transactions(type);
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_created_at ON subscription_transactions(created_at DESC);

-- =====================================================
-- Таблица courier_shifts (смены курьеров)
-- =====================================================
CREATE TABLE IF NOT EXISTS courier_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  deliveries_count INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Индексы для courier_shifts
CREATE INDEX IF NOT EXISTS idx_courier_shifts_courier_id ON courier_shifts(courier_id);
CREATE INDEX IF NOT EXISTS idx_courier_shifts_is_active ON courier_shifts(is_active);
CREATE INDEX IF NOT EXISTS idx_courier_shifts_started_at ON courier_shifts(started_at DESC);

-- =====================================================
-- Таблица status_history (история изменения статусов)
-- =====================================================
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для status_history
CREATE INDEX IF NOT EXISTS idx_status_history_order_id ON status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_at ON status_history(created_at DESC);

-- =====================================================
-- Функция для обновления updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Функция для инкремента доставок (используется при возврате)
-- =====================================================
CREATE OR REPLACE FUNCTION increment_deliveries(subscription_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE customer_subscriptions
  SET 
    deliveries_remaining = deliveries_remaining + 1,
    deliveries_used = deliveries_used - 1
  WHERE id = subscription_id;
END;
$$ language 'plpgsql';
