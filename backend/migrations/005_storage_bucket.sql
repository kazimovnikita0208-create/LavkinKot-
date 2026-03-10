-- ЛавкинКот: Настройка Storage для изображений
-- Версия: 1.0.0
-- Дата: 24.01.2026

-- =====================================================
-- Создание bucket для изображений
-- =====================================================

-- ВАЖНО: Этот SQL нужно выполнить в Supabase SQL Editor
-- Bucket создаётся через Storage API, но политики настраиваются через SQL

-- Создаём bucket через SQL (если поддерживается)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB лимит
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- Политики доступа к Storage
-- =====================================================

-- Политика: Публичный доступ на чтение
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Политика: Авторизованные пользователи могут загружать
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Политика: Владельцы могут обновлять свои файлы
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE
USING (bucket_id = 'images');

-- Политика: Владельцы могут удалять свои файлы
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE
USING (bucket_id = 'images');
