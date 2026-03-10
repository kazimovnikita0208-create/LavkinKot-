'use client';

import { useState, useEffect } from 'react';

/**
 * Задерживает обновление значения на указанное время (мс).
 * Используется для поиска, чтобы не отправлять запрос при каждом символе.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
