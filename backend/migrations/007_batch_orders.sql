-- Добавляем batch_id в таблицу orders
-- Заказы из одного чекаута (из разных магазинов) связаны одним batch_id
ALTER TABLE orders ADD COLUMN IF NOT EXISTS batch_id UUID NULL;

-- Индекс для быстрого поиска всех заказов одного чекаута
CREATE INDEX IF NOT EXISTS idx_orders_batch_id ON orders(batch_id) WHERE batch_id IS NOT NULL;

-- Добавляем delivery_time_slot если колонка ещё не string (на случай если тип не тот)
-- Колонка уже должна существовать из миграции 001, просто убедимся
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'delivery_time_slot'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_time_slot VARCHAR(20);
  END IF;
END $$;
