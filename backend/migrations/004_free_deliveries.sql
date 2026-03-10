-- Миграция: добавление бесплатных доставок для новых пользователей
-- Версия: 1.0.1
-- Дата: 24.01.2026

-- Добавляем поле для бесплатных доставок в profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_deliveries_remaining INT DEFAULT 1;

-- Обновляем существующих пользователей без бесплатных доставок
UPDATE profiles SET free_deliveries_remaining = 1 WHERE free_deliveries_remaining IS NULL;
