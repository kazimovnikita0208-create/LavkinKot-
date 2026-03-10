# ЛавкинКот — Roadmap до продакшена

> **Дата составления:** 08.03.2026  
> **Текущая готовность:** ~60%  
> **Цель:** Полноценный production-ready запуск

---

## Обзор блоков

| Блок | Название | Приоритет | Оценка | Статус |
|------|----------|-----------|--------|--------|
| [Блок 1](#блок-1--критично-перед-запуском) | Критично перед запуском | 🔴 Критично | ~40ч | ⬜ Не начато |
| [Блок 2](#блок-2--первый-месяц-после-запуска) | Первый месяц после запуска | 🟡 Высокий | ~35ч | ⬜ Не начато |
| [Блок 3](#блок-3--полировка-ux) | Полировка UX | 🟢 Средний | ~25ч | ⬜ Не начато |

**Итого:** ~100 часов до полной готовности

---

## Блок 1 — Критично перед запуском

> Без этих задач запускать в продакшен нельзя. Все задачи взаимонезависимы — можно делать параллельно.

### 1.1 Персистентность корзины

**Проблема:** `CartContext` хранит корзину только в памяти React. При закрытии WebApp или перезагрузке страницы корзина полностью сбрасывается.

**Решение:** Синхронизировать состояние корзины с `localStorage`.

**Затронутые файлы:**
- `frontend/contexts/CartContext.tsx` — добавить инициализацию из `localStorage` и `useEffect` для сохранения при каждом изменении

**Задачи:**
- [ ] При инициализации контекста читать корзину из `localStorage`
- [ ] При каждом изменении корзины (`addItem`, `removeItem`, `updateQuantity`, `clearCart`) сохранять в `localStorage`
- [ ] Обработать `JSON.parse` ошибки (повреждённый localStorage)
- [ ] При `clearCart` после оформления заказа — очищать и `localStorage`
- [ ] Проверить: при закрытии и открытии WebApp товары сохраняются

**Оценка:** 2 часа

---

### 1.2 Интеграция @telegram-apps/sdk

**Проблема:** Пакет `@telegram-apps/sdk` отсутствует в зависимостях. Без него: нет кнопки "Назад" (BackButton), нет синхронизации темы, нет haptic feedback, нет корректной SafeArea для разных устройств.

**Затронутые файлы:**
- `frontend/package.json` — добавить зависимость
- `frontend/lib/telegram.ts` — **создать** обёртку над SDK (сейчас файл отсутствует)
- `frontend/hooks/useTelegram.ts` — **создать** хук для использования в компонентах
- `frontend/app/layout.tsx` — инициализировать SDK в корневом layout
- `frontend/contexts/AuthContext.tsx` — использовать `initData` из SDK вместо прямого обращения к `window.Telegram`
- Каждая страница — добавить `BackButton` там, где нужна навигация назад

**Задачи:**
- [ ] Установить `@telegram-apps/sdk` (или `@telegram-apps/sdk-react`)
- [ ] Создать `frontend/lib/telegram.ts` — инициализация SDK, экспорт утилит
- [ ] Создать `frontend/hooks/useTelegram.ts` — хук с: `hapticFeedback`, `backButton`, `themeParams`, `initData`, `mainButton`
- [ ] Инициализировать SDK в `layout.tsx` через `init()` из SDK
- [ ] Применить `themeParams` для синхронизации цветовой схемы Telegram
- [ ] Добавить `BackButton` на страницы: `/shop/[id]`, `/product/[id]`, `/cart`, `/checkout`, `/order/[id]`, `/profile/*`, `/partner/*`, `/courier`, `/admin/*`
- [ ] Добавить haptic feedback при: добавлении в корзину, оформлении заказа, смене статуса (партнёр/курьер)
- [ ] Обернуть всё в проверку `isTMA()` — чтобы работало и в браузере (dev-режим)

**Оценка:** 6 часов

---

### 1.3 Error states и Empty states

**Проблема:** При ошибке API или пустых данных пользователь видит белый/пустой экран без объяснений. Это критично для UX и удержания пользователей.

**Затронутые файлы:**
- `frontend/components/ui/` — **создать** компоненты: `ErrorState.tsx`, `EmptyState.tsx`, `Skeleton.tsx`
- Все страницы с данными из API: `page.tsx`, `shop/[id]/page.tsx`, `product/[id]/page.tsx`, `profile/orders/page.tsx`, `partner/orders/page.tsx`, `courier/page.tsx`, `admin/orders/page.tsx`

**Задачи:**

**Компоненты:**
- [ ] `EmptyState` — иконка + заголовок + подзаголовок + опциональная кнопка действия
- [ ] `ErrorState` — иконка ошибки + сообщение + кнопка "Попробовать снова" (callback `onRetry`)
- [ ] `Skeleton` — компонент с shimmer-анимацией, варианты: `SkeletonCard`, `SkeletonText`, `SkeletonAvatar`
- [ ] `PageLoader` — полноэкранный загрузчик для первоначальной загрузки страниц

**Применить на страницах:**
- [ ] Главная (`/`) — skeleton для магазинов и акций, error state при падении API
- [ ] Магазин (`/shop/[id]`) — skeleton для товаров, empty state "Нет товаров в этой категории"
- [ ] Корзина (`/cart`) — empty state "Корзина пуста" с кнопкой "Перейти в каталог"
- [ ] История заказов (`/profile/orders`) — empty state "Заказов ещё нет"
- [ ] Панель курьера (`/courier`) — empty state "Нет доступных заказов"
- [ ] Панель партнёра (`/partner/orders`) — empty state "Новых заказов нет"
- [ ] Все страницы — глобальный error boundary в `layout.tsx`

**Оценка:** 8 часов

---

### 1.4 UI Kit базовые компоненты

**Проблема:** В плане предусмотрен UI Kit с переиспользуемыми компонентами (`Button`, `Card`, `Input`, `Badge`, `Modal`). Сейчас каждая страница имеет собственные inline-стили кнопок и карточек — это создаёт visual inconsistency и затрудняет поддержку.

**Затронутые файлы:**
- `frontend/components/ui/Button.tsx` — **создать**
- `frontend/components/ui/Card.tsx` — **создать**
- `frontend/components/ui/Input.tsx` — **создать**
- `frontend/components/ui/Badge.tsx` — **создать**
- `frontend/components/ui/Modal.tsx` — **создать**
- `frontend/components/ui/index.ts` — обновить экспорты

**Задачи:**
- [ ] `Button` — варианты: `primary` (синий), `accent` (оранжевый), `secondary` (серый), `ghost` (прозрачный), `destructive` (красный); размеры: `sm`, `md`, `lg`; состояния: `loading`, `disabled`
- [ ] `Card` — белая карточка с border-radius и тенью; варианты: `default`, `flat`
- [ ] `Input` — текстовое поле с label, placeholder, error message, иконкой; типы: `text`, `tel`, `number`
- [ ] `Badge` — статусные бейджи с цветами для статусов заказа
- [ ] `Modal` / `BottomSheet` — нижняя шторка (характерна для мобильных), backdrop blur, анимация slide-up
- [ ] Применить `Button` на всех страницах взамен inline-стилей кнопок
- [ ] Цветовые токены по брендбуку из `DEVELOPMENT_PLAN.md` — определить в `tailwind.config` или CSS-переменных

**Оценка:** 8 часов

---

### 1.5 Базовые тесты

**Проблема:** Нулевое тестовое покрытие. Без тестов любое изменение может сломать бизнес-критичную логику (списание доставки, отмена заказа, авторизация).

**Затронутые файлы (новые):**
- `backend/src/__tests__/utils/telegram.test.js`
- `backend/src/__tests__/services/orders.service.test.js`
- `backend/src/__tests__/services/subscriptions.service.test.js`
- `backend/src/__tests__/services/auth.service.test.js`
- `backend/src/__tests__/api/auth.test.js`
- `backend/src/__tests__/api/orders.test.js`
- `backend/package.json` — добавить jest

**Задачи:**

**Unit тесты (backend services):**
- [ ] Установить `jest`, `supertest` в backend
- [ ] `telegram.test.js` — валидация HMAC-подписи, истёкший `auth_date`, неверный hash
- [ ] `auth.service.test.js` — `loginWithTelegram`, `getUserWithSubscription`, `devLogin`
- [ ] `orders.service.test.js` — создание заказа, отмена, возврат доставки, проверка лимита
- [ ] `subscriptions.service.test.js` — активация подписки, повторная активация (ошибка), списание доставки

**Интеграционные тесты (API endpoints):**
- [ ] `auth.test.js` — `POST /api/auth/telegram`, `GET /api/auth/me` с валидным/невалидным JWT
- [ ] `orders.test.js` — создание заказа, отмена, проверка прав доступа

**Оценка:** 12 часов

---

### 1.6 Docker и production-конфигурация

**Проблема:** Деплой полностью ручной. Нет `Dockerfile`, нет `docker-compose.prod.yml`, нет воспроизводимой среды.

**Новые файлы:**
- `docker/Dockerfile.backend`
- `docker/Dockerfile.frontend`
- `docker/docker-compose.prod.yml`
- `docker/nginx.conf`
- `.env.example` (в корне)
- `.gitignore` (в корне)

**Задачи:**
- [ ] `Dockerfile.backend` — multi-stage build: установка зависимостей → production образ Node 20 Alpine
- [ ] `Dockerfile.frontend` — multi-stage build: сборка Next.js → standalone output → production образ
- [ ] `docker-compose.prod.yml` — сервисы: `backend` (порт 4000), `frontend` (порт 3000), `nginx` (80/443)
- [ ] `nginx.conf` — reverse proxy: `/api/*` → backend, `/*` → frontend; SSL-заглушки под Let's Encrypt
- [ ] `next.config.ts` — включить `output: 'standalone'` для Docker
- [ ] `.env.example` — все обязательные переменные с описаниями, без реальных значений
- [ ] `.gitignore` — исключить `.env*`, `node_modules`, `.next`, `logs`
- [ ] Проверить локальную сборку через `docker-compose`

**Оценка:** 6 часов

---

### Итог Блока 1

| Задача | Оценка | Зависимости |
|--------|--------|-------------|
| 1.1 Персистентность корзины | 2ч | — |
| 1.2 @telegram-apps/sdk | 6ч | — |
| 1.3 Error / Empty states | 8ч | 1.4 (UI Kit) |
| 1.4 UI Kit компоненты | 8ч | — |
| 1.5 Базовые тесты | 12ч | — |
| 1.6 Docker + production | 6ч | — |
| **Итого** | **~42ч** | |

---

## Блок 2 — Первый месяц после запуска

> Запуск возможен без этих задач, но они критичны для коммерческой успешности и стабильности.

### 2.1 Платёжный шлюз

**Проблема:** Подписка активируется без реального платежа — заглушка в `subscriptions.service.js`. Монетизация не работает.

**Варианты:**
- **Telegram Payments** — встроен в Telegram, нативный UX, комиссия ~1.8% (через провайдера)
- **ЮKassa** — популярен в РФ, поддерживает карты, СБП, ЮMoney

**Рекомендация:** Telegram Payments через провайдера ЮKassa (нативно в Telegram, не требует редиректа).

**Затронутые файлы:**
- `backend/src/services/subscriptions.service.js` — реализовать реальное списание
- `backend/src/routes/subscriptions.routes.js` — добавить webhook-эндпоинт для подтверждения оплаты
- `backend/src/controllers/subscriptions.controller.js` — обработать `pre_checkout_query` и `successful_payment`
- `bot/index.ts` — обработать события платежей от Telegram
- `frontend/app/profile/subscription/page.tsx` — интеграция кнопки оплаты через Telegram Invoice

**Задачи:**
- [ ] Зарегистрировать провайдера в BotFather (`/mypayments`)
- [ ] Реализовать `POST /api/payments/invoice` — генерация Telegram invoice для выбранного плана
- [ ] В боте обработать `pre_checkout_query` — валидация + подтверждение `answerPreCheckoutQuery`
- [ ] В боте обработать `successful_payment` — вызов `activateSubscription` на бэкенде
- [ ] Сохранять `telegram_payment_charge_id` в транзакции для возможного возврата
- [ ] Реализовать возврат через `refundStarPayment` при отмене подписки (если применимо)
- [ ] Тест в режиме тестовых платежей Telegram

**Оценка:** 10 часов

---

### 2.2 CI/CD — GitHub Actions

**Проблема:** Деплой ручной. При каждом изменении нужно вручную подключаться к серверу и перезапускать сервисы.

**Новые файлы:**
- `.github/workflows/ci.yml` — запуск тестов на каждый PR
- `.github/workflows/deploy.yml` — деплой на VPS при merge в `main`

**Задачи:**
- [ ] Инициализировать git-репозиторий (`git init` в корне проекта)
- [ ] Создать `.gitignore` (если не создан в 1.6)
- [ ] Создать remote-репозиторий на GitHub
- [ ] `ci.yml` — jobs: `lint` (ESLint), `test` (Jest backend), `build` (Next.js build check)
- [ ] `deploy.yml` — при push в `main`: SSH на VPS → `git pull` → `docker-compose build` → `docker-compose up -d --no-deps`
- [ ] Добавить GitHub Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, все `.env` переменные
- [ ] Настроить deploy-ключ на VPS (SSH key без passphrase для автодеплоя)
- [ ] Уведомление в Telegram при успешном/неуспешном деплое

**Оценка:** 6 часов

---

### 2.3 Мониторинг и логирование

**Проблема:** В продакшене нет видимости в ошибки и производительность. Любой баг будет обнаружен только от пользователя.

**Инструменты:**
- **Sentry** — отслеживание ошибок (фронтенд + бэкенд), бесплатный план достаточен для MVP
- **Winston** — структурированные логи на бэкенде (уже есть `logs/` в PM2, но без структуры)
- **Telegram-уведомления** — критические ошибки → сообщение в admin-чат

**Затронутые файлы:**
- `backend/src/utils/logger.js` — **создать** Winston logger
- `backend/src/middlewares/errorHandler.middleware.js` — логировать все 5xx ошибки
- `backend/src/app.js` — подключить request logging (morgan или кастомный)
- `frontend/lib/sentry.ts` — **создать** инициализацию Sentry
- `frontend/app/layout.tsx` — обернуть в Sentry ErrorBoundary
- `frontend/next.config.ts` — подключить `@sentry/nextjs`

**Задачи:**
- [ ] Установить `winston`, `winston-daily-rotate-file` в backend
- [ ] Создать `logger.js` — уровни: `error`, `warn`, `info`, `debug`; файлы: `logs/error.log`, `logs/combined.log`
- [ ] Обновить `errorHandler` — логировать стек ошибок для 5xx
- [ ] Добавить request logging — метод, путь, статус, время ответа
- [ ] Зарегистрироваться на sentry.io, создать два проекта: `lavkinkot-frontend`, `lavkinkot-backend`
- [ ] Установить `@sentry/nextjs` в frontend, `@sentry/node` в backend
- [ ] Настроить Sentry в обоих проектах с DSN из переменных окружения
- [ ] Настроить алерты в Sentry — email + Telegram webhook при новых ошибках
- [ ] Настроить уведомление в Telegram при падении PM2 процесса

**Оценка:** 6 часов

---

### 2.4 Refresh Token

**Проблема:** JWT выдаётся на 7 дней без возможности обновления. После истечения пользователь должен заново авторизоваться через Telegram. В Telegram WebApp это неочевидно и создаёт плохой UX.

**Затронутые файлы:**
- `backend/src/utils/jwt.js` — добавить `generateRefreshToken`, `verifyRefreshToken`
- `backend/src/routes/auth.routes.js` — добавить `POST /api/auth/refresh`
- `backend/src/controllers/auth.controller.js` — реализовать обновление токена
- `backend/migrations/006_refresh_tokens.sql` — **создать** таблицу для хранения refresh-токенов
- `frontend/lib/api.ts` — добавить автоматическое обновление токена при 401 ответе
- `frontend/contexts/AuthContext.tsx` — хранить refresh token, вызывать refresh при истечении access token

**Задачи:**
- [ ] Создать таблицу `refresh_tokens` (id, profile_id, token_hash, expires_at, revoked)
- [ ] Access token: сократить до 1 часа; Refresh token: 30 дней
- [ ] `POST /api/auth/refresh` — принять refresh token, вернуть новую пару токенов, инвалидировать старый
- [ ] `POST /api/auth/logout` — инвалидировать refresh token в БД
- [ ] В `api.ts` — interceptor: при 401 → попытка refresh → повтор оригинального запроса → если опять 401 → logout
- [ ] Хранить refresh token в `localStorage` отдельно от access token

**Оценка:** 8 часов

---

### 2.5 Реальный поиск и фильтрация

**Проблема:** Поиск на главной странице (`SearchBar`) визуально есть, но не работает — не отправляет запросы к API. Пользователь не может найти нужный товар или магазин.

**Затронутые файлы:**
- `frontend/components/ui/SearchBar.tsx` — добавить `onChange`, debounce
- `frontend/app/page.tsx` — передать поисковый запрос в хуки
- `frontend/hooks/useShops.ts` — передавать `search` параметр
- `frontend/hooks/useProducts.ts` — передавать `search` параметр
- `frontend/app/shop/[id]/page.tsx` — поиск по товарам внутри магазина

**Задачи:**
- [ ] Добавить debounce (300мс) к поисковому полю — использовать `useMemo` или кастомный `useDebounce` хук
- [ ] При вводе в поиск — передавать `search` параметр в API-запросы
- [ ] Показывать skeleton во время загрузки результатов
- [ ] При пустых результатах — показать `EmptyState` "Ничего не найдено"
- [ ] При очистке поиска — вернуться к исходному списку
- [ ] Поиск внутри магазина по товарам

**Оценка:** 4 часа

---

### Итог Блока 2

| Задача | Оценка | Зависимости |
|--------|--------|-------------|
| 2.1 Платёжный шлюз | 10ч | Блок 1 завершён |
| 2.2 CI/CD | 6ч | 1.6 Docker |
| 2.3 Мониторинг | 6ч | 1.6 Docker |
| 2.4 Refresh Token | 8ч | — |
| 2.5 Поиск и фильтрация | 4ч | 1.3 Empty states |
| **Итого** | **~34ч** | |

---

## Блок 3 — Полировка UX

> Эти задачи делают приложение ощущающимся как нативное — то, что отличает хороший MiniApp от великолепного.

### 3.1 Framer Motion — анимации и переходы

**Проблема:** Framer Motion установлен (`^12.26.2`), но не используется для переходов между страницами и микроанимаций.

**Затронутые файлы:**
- `frontend/app/layout.tsx` — настроить `AnimatePresence` для page transitions
- `frontend/components/home/ShopCard.tsx` — анимация появления карточек (stagger)
- `frontend/components/home/PromotionsRow.tsx` — анимация карусели
- `frontend/components/ui/FloatingCartButton.tsx` — анимация счётчика при добавлении товара
- `frontend/app/cart/page.tsx` — анимация добавления/удаления позиций
- `frontend/app/order/[id]/page.tsx` — анимация таймлайна статусов

**Задачи:**
- [ ] Page transitions — `motion.div` с `initial/animate/exit` в layout + `AnimatePresence`
- [ ] Staggered list — карточки магазинов и товаров появляются поочерёдно
- [ ] Cart counter bounce — при изменении количества товаров кнопка "трясётся"
- [ ] Cart item slide-out — при удалении позиции из корзины она уезжает влево
- [ ] Order timeline — статусы появляются с анимацией при смене
- [ ] BottomSheet slide-up — шторка появляется снизу с `spring` анимацией
- [ ] Button press — тактильный отклик scale при нажатии (через `whileTap`)
- [ ] Skeleton shimmer — анимация загрузки skeleton-компонентов

**Оценка:** 8 часов

---

### 3.2 Pull-to-refresh

**Проблема:** Пользователи привыкли обновлять данные свайпом вниз. Особенно критично на странице курьера (новые заказы) и партнёра.

**Затронутые файлы:**
- `frontend/hooks/usePullToRefresh.ts` — **создать** хук
- `frontend/app/courier/page.tsx` — применить
- `frontend/app/partner/orders/page.tsx` — применить
- `frontend/app/profile/orders/page.tsx` — применить
- `frontend/app/order/[id]/page.tsx` — применить

**Задачи:**
- [ ] Создать `usePullToRefresh(onRefresh: () => Promise<void>)` — через touch events или `Telegram.WebApp.onEvent('viewportChanged')`
- [ ] Показывать индикатор загрузки при свайпе вниз
- [ ] Интегрировать с хуками данных (`refetch` из `useOrders`, `useCourier` и т.д.)
- [ ] Haptic feedback при успешном обновлении

**Оценка:** 4 часа

---

### 3.3 Telegram MainButton

**Проблема:** Telegram WebApp имеет встроенную главную кнопку внизу экрана (MainButton) — нативный CTA для ключевых действий. Не используется.

**Затронутые файлы:**
- `frontend/hooks/useTelegram.ts` — добавить `mainButton` в хук (зависит от 1.2)
- `frontend/app/cart/page.tsx` — "Оформить заказ" через MainButton
- `frontend/app/checkout/page.tsx` — "Подтвердить заказ" через MainButton
- `frontend/app/product/[id]/page.tsx` — "Добавить в корзину" через MainButton

**Задачи:**
- [ ] Обертка `useMainButton(text, onClick, options)` — показывать/скрывать при mount/unmount страницы
- [ ] На странице корзины: показывать если есть товары, текст "Оформить заказ — {сумма}₽"
- [ ] На странице товара: "Добавить в корзину" или "В корзине — перейти"
- [ ] На странице оформления: "Подтвердить заказ"
- [ ] При loading состоянии — `showProgress(true)` на кнопке

**Оценка:** 4 часа

---

### 3.4 Оптимизация производительности

**Проблема:** Некоторые страницы могут медленно загружаться из-за waterfall-запросов и отсутствия кэширования.

**Затронутые файлы:**
- `frontend/lib/api.ts` — добавить простое кэширование (SWR-паттерн или Map)
- `frontend/hooks/*.ts` — добавить `staleTime` паттерн
- `frontend/app/page.tsx` — параллелизовать запросы (промисы уже параллельны?)
- `frontend/next.config.ts` — настроить image optimization если нужно

**Задачи:**
- [ ] Аудит: проверить есть ли waterfall API-запросов через DevTools Network
- [ ] Добавить in-memory кэш в `api.ts` — TTL 60 секунд для магазинов и товаров
- [ ] На главной — запросы к shops, promotions запускать параллельно через `Promise.all`
- [ ] Ленивая загрузка тяжёлых компонентов (`dynamic` в Next.js)
- [ ] Проверить размер JS bundle: `next build` → анализ через `@next/bundle-analyzer`

**Оценка:** 4 часа

---

### 3.5 Полировка форм и валидация на фронтенде

**Проблема:** Форма оформления заказа (checkout) и форма профиля не имеют клиентской валидации — ошибки приходят только от бэкенда после отправки.

**Затронутые файлы:**
- `frontend/app/checkout/page.tsx` — добавить валидацию полей
- `frontend/app/profile/page.tsx` — валидация телефона, имени
- `frontend/components/ui/Input.tsx` — показывать inline error (зависит от 1.4)

**Задачи:**
- [ ] Checkout: обязательные поля — адрес, подъезд, этаж, квартира; формат телефона +7XXXXXXXXXX
- [ ] Валидация в реальном времени при `onBlur`
- [ ] Блокировать кнопку "Оформить" пока не заполнены обязательные поля
- [ ] Показывать красные ошибки под полями с понятными текстами на русском
- [ ] Сохранять черновик адреса в `localStorage` — не терять при случайном закрытии

**Оценка:** 4 часа

---

### 3.6 Нотификации о статусе заказа

**Проблема:** Пользователь должен узнавать об изменении статуса заказа через Telegram, а не только через polling в браузере.

**Затронутые файлы:**
- `bot/index.ts` — добавить функции отправки уведомлений
- `backend/src/services/orders.service.js` — вызывать уведомление при смене статуса
- `backend/src/services/courier.service.js` — уведомлять при назначении курьера
- `backend/src/utils/notifications.js` — **создать** утилиту для отправки через Bot API

**Задачи:**
- [ ] Создать `backend/src/utils/notifications.js` — отправка сообщений через `sendMessage` Bot API
- [ ] При `accepted` → уведомить клиента "Ваш заказ принят магазином"
- [ ] При `courier_assigned` → "Курьер уже едет к вам!"
- [ ] При `delivered` → "Заказ доставлен! Приятного аппетита 🎉" + запрос оценки
- [ ] При отмене → "Заказ отменён. Доставка возвращена на подписку"
- [ ] Форматировать сообщения с emoji, номером заказа, ссылкой на трекинг

**Оценка:** 4 часа

---

### Итог Блока 3

| Задача | Оценка | Зависимости |
|--------|--------|-------------|
| 3.1 Framer Motion анимации | 8ч | 1.3 Empty states, 1.4 UI Kit |
| 3.2 Pull-to-refresh | 4ч | 1.2 Telegram SDK |
| 3.3 Telegram MainButton | 4ч | 1.2 Telegram SDK |
| 3.4 Оптимизация производительности | 4ч | — |
| 3.5 Валидация форм | 4ч | 1.4 UI Kit (Input) |
| 3.6 Нотификации о статусе | 4ч | — |
| **Итого** | **~28ч** | |

---

## Общая сводка и порядок выполнения

```
Неделя 1   [1.4 UI Kit] → [1.3 Error/Empty States]          ~16ч
Неделя 2   [1.1 Корзина] [1.2 Telegram SDK] [1.6 Docker]    ~14ч  
Неделя 3   [1.5 Тесты]                                       ~12ч
────────────────────────────────────────────────────────────
           🚀 ЗАПУСК MVP
────────────────────────────────────────────────────────────
Неделя 4   [2.4 Refresh Token] [2.5 Поиск]                  ~12ч
Неделя 5   [2.1 Платёжный шлюз]                             ~10ч
Неделя 6   [2.2 CI/CD] [2.3 Мониторинг]                    ~12ч
────────────────────────────────────────────────────────────
           📈 СТАБИЛЬНАЯ ВЕРСИЯ
────────────────────────────────────────────────────────────
Неделя 7   [3.1 Анимации] [3.3 MainButton]                  ~12ч
Неделя 8   [3.2 Pull-to-refresh] [3.5 Валидация форм]        ~8ч
Неделя 9   [3.4 Оптимизация] [3.6 Нотификации]              ~8ч
────────────────────────────────────────────────────────────
           ✅ ПОЛНАЯ ВЕРСИЯ
```

---

## Чек-лист прогресса

### Блок 1 — Критично перед запуском
- [ ] **1.1** Корзина сохраняется в localStorage
- [ ] **1.2** @telegram-apps/sdk подключён, BackButton работает на всех страницах
- [ ] **1.3** Error state и Empty state на всех страницах с данными
- [ ] **1.4** UI Kit: Button, Card, Input, Badge, Modal созданы и применены
- [ ] **1.5** Jest тесты: utils/telegram, services/auth, services/orders, services/subscriptions
- [ ] **1.6** Docker: Dockerfile.backend, Dockerfile.frontend, docker-compose.prod.yml, nginx.conf

### Блок 2 — Первый месяц
- [ ] **2.1** Telegram Payments интегрирован, тестовые платежи работают
- [ ] **2.2** GitHub Actions: CI (lint + test) и CD (автодеплой на VPS)
- [ ] **2.3** Winston логи + Sentry для фронтенда и бэкенда
- [ ] **2.4** Refresh token: access 1ч + refresh 30д, автообновление в api.ts
- [ ] **2.5** Поиск с debounce работает, показывает empty state при нет результатов

### Блок 3 — Полировка UX
- [ ] **3.1** Page transitions + stagger animations + cart button bounce
- [ ] **3.2** Pull-to-refresh на страницах с realtime данными
- [ ] **3.3** Telegram MainButton на cart/checkout/product страницах
- [ ] **3.4** Параллельные запросы, in-memory кэш, bundle размер проверен
- [ ] **3.5** Клиентская валидация форм с inline ошибками
- [ ] **3.6** Telegram-уведомления при смене статуса заказа

---

## Критические зависимости (граф)

```
1.4 UI Kit
    └──► 1.3 Error/Empty States
              └──► 3.1 Animations
                   └──► (полировка)

1.2 Telegram SDK
    ├──► 3.2 Pull-to-refresh
    └──► 3.3 MainButton

1.6 Docker
    ├──► 2.2 CI/CD
    └──► 2.3 Мониторинг

1.5 Тесты
    └──► 2.2 CI/CD (тесты запускаются в pipeline)
```

---

## Технический долг (не блокирует, но важно)

| Проблема | Описание | Приоритет |
|----------|----------|-----------|
| Backend на JS | Бэкенд написан на JavaScript вместо TypeScript из плана — нет type safety | Низкий |
| Нет репозитория `deliveries` | В плане была отдельная таблица `deliveries`, в реализации — поля в `orders` | Не критично |
| Подписка списывается при создании | По плану — при доставке, по факту — при создании заказа | Среднее (бизнес-решение) |
| Нет Zustand | React Context без persist — состояние не выживает при reload | Решается в 1.1 |
| Нет React Query | Нет автоматического refetch, retry, caching | Решается в 3.4 частично |

---

> **Версия:** 1.0  
> **Дата:** 08.03.2026  
> **Следующее обновление:** после завершения Блока 1
