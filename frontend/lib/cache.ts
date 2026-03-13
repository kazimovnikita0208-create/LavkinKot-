/**
 * Stale-while-revalidate кэш на основе sessionStorage.
 * Данные показываются МГНОВЕННО из кэша, обновляются в фоне.
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 минут

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export function cacheGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`swr_${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    // Возвращаем даже устаревшие данные (stale) — обновление произойдёт в фоне
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttl = DEFAULT_TTL) {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, expires: Date.now() + ttl };
    sessionStorage.setItem(`swr_${key}`, JSON.stringify(entry));
  } catch {
    // sessionStorage может быть недоступен
  }
}

export function cacheIsStale(key: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = sessionStorage.getItem(`swr_${key}`);
    if (!raw) return true;
    const entry: CacheEntry<unknown> = JSON.parse(raw);
    return Date.now() > entry.expires;
  } catch {
    return true;
  }
}

export function cacheClear(prefix?: string) {
  if (typeof window === 'undefined') return;
  if (!prefix) {
    sessionStorage.clear();
    return;
  }
  const keys = Object.keys(sessionStorage).filter(k => k.startsWith(`swr_${prefix}`));
  keys.forEach(k => sessionStorage.removeItem(k));
}
