-- ЛавкинКот: RLS политики
-- Версия: 1.0.0
-- Дата: 22.01.2026

-- =====================================================
-- RLS для profiles
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Публичный SELECT для сервиса (service_role обходит RLS)
CREATE POLICY "Service role can do anything on profiles"
  ON profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для shops
-- =====================================================
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shops"
  ON shops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can do anything on shops"
  ON shops
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для products
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products in stock"
  ON products FOR SELECT
  USING (in_stock = true);

CREATE POLICY "Service role can do anything on products"
  ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для promotions
-- =====================================================
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  USING (
    is_active = true 
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
  );

CREATE POLICY "Service role can do anything on promotions"
  ON promotions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для subscription_plans
-- =====================================================
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can do anything on subscription_plans"
  ON subscription_plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для customer_subscriptions
-- =====================================================
ALTER TABLE customer_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything on customer_subscriptions"
  ON customer_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для orders
-- =====================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything on orders"
  ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для order_items
-- =====================================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything on order_items"
  ON order_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для subscription_transactions
-- =====================================================
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything on subscription_transactions"
  ON subscription_transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для courier_shifts
-- =====================================================
ALTER TABLE courier_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything on courier_shifts"
  ON courier_shifts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS для status_history
-- =====================================================
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything on status_history"
  ON status_history
  FOR ALL
  USING (true)
  WITH CHECK (true);
