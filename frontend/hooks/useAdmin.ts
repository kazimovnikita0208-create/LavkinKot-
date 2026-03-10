import { useState, useEffect, useCallback } from 'react';
import {
  adminApi,
  AdminOverviewStats,
  AdminOrder,
  AdminUser,
  AdminCourier,
} from '@/lib/api';

// ─── Overview Stats ──────────────────────────────────────────────────────────

export function useAdminStats() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getStats();
      if (res.data) setStats(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки статистики');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, isLoading, error, refetch: fetch };
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useAdminOrders(statusFilter: string = 'all', page = 1) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: { status?: string; page: number; limit: number } = { page, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminApi.getOrders(params);
      setOrders((res.data as AdminOrder[]) ?? []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки заказов');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await adminApi.updateOrder(orderId, { status });
    await fetch();
  };

  return { orders, isLoading, error, totalPages, total, refetch: fetch, updateOrderStatus };
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function useAdminUsers(roleFilter: string = 'all', search = '', page = 1) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: { role?: string; search?: string; page: number; limit: number } = { page, limit: 20 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search.trim()) params.search = search.trim();
      const res = await adminApi.getUsers(params);
      setUsers((res.data as AdminUser[]) ?? []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки пользователей');
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateRole = async (userId: string, role: string, shopId?: string) => {
    await adminApi.updateUserRole(userId, role, shopId);
    await fetch();
  };

  return { users, isLoading, error, totalPages, total, refetch: fetch, updateRole };
}

// ─── Couriers ────────────────────────────────────────────────────────────────

export function useAdminCouriers(page = 1) {
  const [couriers, setCouriers] = useState<AdminCourier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getCouriers({ page, limit: 30 });
      setCouriers((res.data as AdminCourier[]) ?? []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки курьеров');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  return { couriers, isLoading, error, totalPages, total, refetch: fetch };
}
