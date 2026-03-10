/**
 * Telegram Mini App SDK обёртка
 * Безопасно инициализирует SDK только внутри Telegram WebApp.
 * В браузере (dev-режим) все методы работают как no-op.
 */

let _isTMA = false;

/**
 * Инициализировать Telegram SDK.
 * Вызывать один раз в корневом layout.tsx.
 */
export function initTelegramSDK(): void {
  if (typeof window === 'undefined') return;

  try {
    // Проверяем наличие Telegram WebApp
    if (window.Telegram?.WebApp?.initData) {
      _isTMA = true;
      // SDK v3 инициализируется автоматически при импорте компонентов
      // Но нам нужно явно сделать expand и настройки
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#1A2F3A');
      window.Telegram.WebApp.setBackgroundColor('#1A2F3A');
    }
  } catch (e) {
    console.warn('[Telegram SDK] Init failed:', e);
  }
}

/** Работает ли приложение внутри Telegram */
export function isTMA(): boolean {
  if (typeof window === 'undefined') return false;
  return _isTMA || Boolean(window.Telegram?.WebApp?.initData);
}

/** Haptic feedback: лёгкое касание */
export function hapticLight(): void {
  if (!isTMA()) return;
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
  } catch {}
}

/** Haptic feedback: среднее */
export function hapticMedium(): void {
  if (!isTMA()) return;
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
  } catch {}
}

/** Haptic feedback: успех */
export function hapticSuccess(): void {
  if (!isTMA()) return;
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  } catch {}
}

/** Haptic feedback: ошибка */
export function hapticError(): void {
  if (!isTMA()) return;
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
  } catch {}
}

/** Показать BackButton и задать обработчик */
export function showBackButton(onClick: () => void): () => void {
  if (!isTMA()) return () => {};
  try {
    const btn = window.Telegram?.WebApp?.BackButton;
    if (!btn) return () => {};
    btn.onClick(onClick);
    btn.show();
    return () => {
      btn.offClick(onClick);
      btn.hide();
    };
  } catch {
    return () => {};
  }
}

/** Скрыть BackButton */
export function hideBackButton(): void {
  if (!isTMA()) return;
  try {
    window.Telegram?.WebApp?.BackButton?.hide();
  } catch {}
}

/** Закрыть Mini App */
export function closeTelegramApp(): void {
  if (!isTMA()) return;
  try {
    window.Telegram?.WebApp?.close();
  } catch {}
}

/** Telegram initData строка (для авторизации) */
export function getInitData(): string {
  if (typeof window === 'undefined') return '';
  return window.Telegram?.WebApp?.initData || '';
}
