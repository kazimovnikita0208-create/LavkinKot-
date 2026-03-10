-- Таблица для хранения транзакций Robokassa
-- Нужна для верификации webhook и идемпотентной обработки платежей

CREATE TABLE IF NOT EXISTS payment_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inv_id       BIGINT UNIQUE NOT NULL,              -- InvId в Robokassa (уникальный номер счёта)
  out_sum      DECIMAL(10,2) NOT NULL,              -- Сумма платежа
  type         VARCHAR(20) NOT NULL CHECK (type IN ('subscription', 'order')),
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  plan_id      UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
  order_id     UUID REFERENCES orders(id) ON DELETE SET NULL,
  profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description  TEXT,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_inv_id     ON payment_transactions(inv_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_profile_id ON payment_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status     ON payment_transactions(status);

-- RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Только backend (service key) может INSERT/UPDATE
-- Пользователи могут читать свои транзакции
CREATE POLICY "Users can view own payment transactions"
  ON payment_transactions FOR SELECT
  USING (profile_id IN (
    SELECT id FROM profiles
    WHERE telegram_id = current_setting('app.telegram_id', true)::bigint
  ));
