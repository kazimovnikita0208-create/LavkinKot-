'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { showBackButton, hapticLight, hapticMedium, hapticSuccess, hapticError, isTMA } from '@/lib/telegram';

/**
 * Хук для работы с Telegram BackButton.
 * Автоматически показывает кнопку "Назад" при монтировании страницы
 * и скрывает при размонтировании.
 *
 * @param onBack - callback при нажатии. По умолчанию — router.back()
 */
export function useTelegramBackButton(onBack?: () => void): void {
  const router = useRouter();

  useEffect(() => {
    const handleBack = onBack ?? (() => router.back());
    const cleanup = showBackButton(handleBack);
    return cleanup;
  }, [onBack, router]);
}

/**
 * Хук для haptic feedback.
 * Возвращает функции для разных типов вибрации.
 */
export function useHaptic() {
  return {
    light: useCallback(() => hapticLight(), []),
    medium: useCallback(() => hapticMedium(), []),
    success: useCallback(() => hapticSuccess(), []),
    error: useCallback(() => hapticError(), []),
  };
}

/**
 * Хук для проверки окружения Telegram.
 */
export function useTelegramEnv() {
  return {
    isTMA: isTMA(),
  };
}
