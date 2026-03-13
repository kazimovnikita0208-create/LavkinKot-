-- Таблица настроек приложения (вместо JSON-файла в контейнере)
CREATE TABLE IF NOT EXISTS app_settings (
  key   VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Дефолтные значения
INSERT INTO app_settings (key, value) VALUES
  ('min_order_amount', '300'),
  ('delivery_fee', '150'),
  ('free_delivery_from', '1500')
ON CONFLICT (key) DO NOTHING;

-- RLS: только service_role может писать, публичное чтение
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read app_settings" ON app_settings
  FOR SELECT USING (true);

CREATE POLICY "Service role write app_settings" ON app_settings
  FOR ALL USING (auth.role() = 'service_role');
