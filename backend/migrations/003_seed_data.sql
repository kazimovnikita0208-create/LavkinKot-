-- ЛавкинКот: Начальные данные
-- Версия: 1.0.0
-- Дата: 22.01.2026

-- =====================================================
-- Тарифные планы подписок
-- =====================================================
INSERT INTO subscription_plans (name, slug, description, deliveries_limit, duration_days, price, sort_order) VALUES
('Стандарт', 'standard', 'Идеально для небольших заказов. 5 бесплатных доставок в месяц.', 5, 30, 1499.00, 1),
('Плюс', 'plus', 'Для тех, кто заказывает регулярно. 7 доставок за 45 дней.', 7, 45, 1699.00, 2),
('Премиум', 'premium', 'Максимальная выгода! 10 доставок за 60 дней.', 10, 60, 1999.00, 3)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Демо магазины
-- =====================================================
INSERT INTO shops (name, slug, category, description, address, image_url, rating, reviews_count, min_order_amount, delivery_time) VALUES
(
  'Продукты 24',
  'produkty-24',
  'store',
  'Свежие продукты с доставкой на дом. Молочные продукты, мясо, овощи, фрукты и многое другое.',
  'ул. Ленина, 42',
  '/images/shops/produkty24.jpg',
  4.8,
  156,
  500,
  '30-45 мин'
),
(
  'Пекарня У Моста',
  'pekarnya-u-mosta',
  'bakery',
  'Свежая выпечка каждый день. Хлеб, булочки, торты, пирожные на заказ.',
  'ул. Мира, 15',
  '/images/shops/bakery.jpg',
  4.9,
  89,
  300,
  '25-35 мин'
),
(
  'Фруктовый рай',
  'fruktovyj-raj',
  'fruit',
  'Свежие фрукты и овощи напрямую от фермеров. Экзотические фрукты, сезонные овощи.',
  'ул. Садовая, 7',
  '/images/shops/fruits.jpg',
  4.7,
  203,
  400,
  '35-50 мин'
),
(
  'Ресторан Домашний',
  'restoran-domashnij',
  'restaurant',
  'Домашняя кухня с доставкой. Супы, горячие блюда, салаты, десерты.',
  'пр. Победы, 28',
  '/images/shops/restaurant.jpg',
  4.6,
  312,
  600,
  '40-55 мин'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Демо товары для магазина "Продукты 24"
-- =====================================================
DO $$
DECLARE
  shop_uuid UUID;
BEGIN
  SELECT id INTO shop_uuid FROM shops WHERE slug = 'produkty-24';
  
  IF shop_uuid IS NOT NULL THEN
    INSERT INTO products (shop_id, category, name, description, price, old_price, weight, in_stock, is_popular, sort_order) VALUES
    -- Молочные продукты
    (shop_uuid, 'Молочные продукты', 'Молоко 3.2%', 'Молоко пастеризованное, жирность 3.2%', 89.00, NULL, '1 л', true, true, 1),
    (shop_uuid, 'Молочные продукты', 'Кефир 2.5%', 'Кефир натуральный, жирность 2.5%', 79.00, NULL, '1 л', true, false, 2),
    (shop_uuid, 'Молочные продукты', 'Сметана 20%', 'Сметана домашняя, жирность 20%', 129.00, NULL, '400 г', true, true, 3),
    (shop_uuid, 'Молочные продукты', 'Творог 9%', 'Творог зернёный, жирность 9%', 169.00, 199.00, '500 г', true, false, 4),
    (shop_uuid, 'Молочные продукты', 'Масло сливочное', 'Масло сливочное 82.5%', 249.00, NULL, '200 г', true, true, 5),
    
    -- Мясо
    (shop_uuid, 'Мясо', 'Куриная грудка', 'Филе куриной грудки охлаждённое', 349.00, NULL, '1 кг', true, true, 1),
    (shop_uuid, 'Мясо', 'Фарш говяжий', 'Фарш из говядины охлаждённый', 459.00, NULL, '1 кг', true, false, 2),
    (shop_uuid, 'Мясо', 'Свинина шея', 'Свиная шея охлаждённая', 399.00, 449.00, '1 кг', true, false, 3),
    
    -- Овощи
    (shop_uuid, 'Овощи', 'Помидоры', 'Помидоры свежие, Россия', 189.00, NULL, '1 кг', true, true, 1),
    (shop_uuid, 'Овощи', 'Огурцы', 'Огурцы свежие, тепличные', 149.00, NULL, '1 кг', true, true, 2),
    (shop_uuid, 'Овощи', 'Картофель', 'Картофель молодой, Россия', 59.00, NULL, '1 кг', true, false, 3),
    (shop_uuid, 'Овощи', 'Морковь', 'Морковь мытая, Россия', 49.00, NULL, '1 кг', true, false, 4),
    
    -- Напитки
    (shop_uuid, 'Напитки', 'Сок апельсиновый', 'Сок апельсиновый, 100%', 129.00, NULL, '1 л', true, false, 1),
    (shop_uuid, 'Напитки', 'Вода минеральная', 'Вода минеральная негазированная', 49.00, NULL, '1.5 л', true, false, 2)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- Демо товары для магазина "Пекарня У Моста"
-- =====================================================
DO $$
DECLARE
  shop_uuid UUID;
BEGIN
  SELECT id INTO shop_uuid FROM shops WHERE slug = 'pekarnya-u-mosta';
  
  IF shop_uuid IS NOT NULL THEN
    INSERT INTO products (shop_id, category, name, description, price, old_price, weight, in_stock, is_popular, sort_order) VALUES
    -- Хлеб
    (shop_uuid, 'Хлеб', 'Батон белый', 'Классический белый батон, хрустящая корочка', 45.00, NULL, '400 г', true, true, 1),
    (shop_uuid, 'Хлеб', 'Хлеб бородинский', 'Ржаной хлеб с кориандром', 59.00, NULL, '500 г', true, true, 2),
    (shop_uuid, 'Хлеб', 'Чиабатта', 'Итальянский хлеб с хрустящей корочкой', 89.00, NULL, '300 г', true, false, 3),
    
    -- Выпечка
    (shop_uuid, 'Выпечка', 'Круассан', 'Классический французский круассан', 79.00, NULL, '100 г', true, true, 1),
    (shop_uuid, 'Выпечка', 'Булочка с маком', 'Сдобная булочка с маковой начинкой', 59.00, NULL, '120 г', true, false, 2),
    (shop_uuid, 'Выпечка', 'Пирожок с яблоком', 'Пирожок печёный с яблочной начинкой', 69.00, NULL, '150 г', true, true, 3),
    
    -- Торты
    (shop_uuid, 'Торты', 'Наполеон', 'Классический торт Наполеон', 1590.00, NULL, '1 кг', true, true, 1),
    (shop_uuid, 'Торты', 'Медовик', 'Медовый торт со сметанным кремом', 1390.00, NULL, '1 кг', true, false, 2)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- Демо акции
-- =====================================================
DO $$
DECLARE
  shop_uuid UUID;
BEGIN
  SELECT id INTO shop_uuid FROM shops WHERE slug = 'produkty-24';
  
  IF shop_uuid IS NOT NULL THEN
    INSERT INTO promotions (shop_id, title, description, discount_percent, is_active) VALUES
    (shop_uuid, 'Скидка 15% на молочку', 'Скидка на все молочные продукты при заказе от 1000₽', 15, true),
    (shop_uuid, 'Бесплатная доставка', 'Бесплатная доставка при заказе от 2000₽', NULL, true);
  END IF;
  
  SELECT id INTO shop_uuid FROM shops WHERE slug = 'pekarnya-u-mosta';
  
  IF shop_uuid IS NOT NULL THEN
    INSERT INTO promotions (shop_id, title, description, discount_percent, is_active) VALUES
    (shop_uuid, '2 круассана по цене 1', 'Акция на круассаны каждую среду', 50, true);
  END IF;
END $$;

-- =====================================================
-- Демо администратор (telegram_id нужно заменить на реальный)
-- =====================================================
-- INSERT INTO profiles (telegram_id, username, first_name, role) VALUES
-- (123456789, 'admin', 'Администратор', 'admin')
-- ON CONFLICT (telegram_id) DO NOTHING;
