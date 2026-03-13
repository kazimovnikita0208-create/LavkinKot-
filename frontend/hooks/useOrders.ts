'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi, Order, CreateOrderData, api } from '@/lib/api';

interface UseOrdersOptions {
  status?: string;
  page?: number;
  limit?: number;
}

interface UseOrdersResult {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  refetch: () => Promise<void>;
}

export function useOrders(options: UseOrdersOptions = {}): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseOrdersResult['pagination']>(null);

  const { status, page, limit } = options;

  const fetchOrders = useCallback(async () => {
    if (!api.getToken()) {
      setIsLoading(false);
      setOrders([]);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await ordersApi.getOrders({ status, page, limit });
      
      if (response.success) {
        setOrders(response.data || []);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            totalPages: response.pagination.totalPages,
            hasNext: response.pagination.hasNext,
            hasPrev: response.pagination.hasPrev,
          });
        }
      }
    } catch (err) {
      console.error('useOrders error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setIsLoading(false);
    }
  }, [status, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, pagination, refetch: fetchOrders };
}

interface UseOrderResult {
  order: Order | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Статусы при которых заказ считается активным (нужен поллинг)
const ACTIVE_STATUSES = new Set(['created', 'confirmed', 'preparing', 'ready', 'delivering', 'in_transit']);
const POLL_INTERVAL_MS = 8000; // 8 секунд

export function useOrder(orderId: string): UseOrderResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) { setIsLoading(false); return; }

    try {
      setError(null);
      const response = await ordersApi.getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(new Error('Order not found'));
      }
    } catch (err) {
      if (!order) setError(err instanceof Error ? err : new Error('Failed to fetch order'));
    } finally {
      setIsLoading(false);
    }
  }, [orderId, order]);

  useEffect(() => {
    fetchOrder();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Автообновление статуса для активных заказов
  useEffect(() => {
    if (!order) return;
    if (!ACTIVE_STATUSES.has(order.status)) return;

    const interval = setInterval(async () => {
      try {
        const response = await ordersApi.getOrderStatus(orderId);
        if (response.success && response.data && response.data.status !== order.status) {
          // Статус изменился — перезагружаем полные данные
          const full = await ordersApi.getOrderById(orderId);
          if (full.success && full.data) setOrder(full.data);
        }
      } catch { /* тихо */ }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [order?.status, orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { order, isLoading, error, refetch: fetchOrder };
}

interface UseCreateOrderResult {
  createOrder: (data: CreateOrderData) => Promise<Order | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateOrder(): UseCreateOrderResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createOrder = async (data: CreateOrderData): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ordersApi.createOrder(data);
      
      if (response.success && response.data) {
        return response.data;
      }
      setError(new Error('Failed to create order'));
      return null;
    } catch (err) {
      console.error('createOrder error:', err);
      setError(err instanceof Error ? err : new Error('Failed to create order'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createOrder, isLoading, error };
}

export function useCancelOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ordersApi.cancelOrder(orderId);
      return response.success;
    } catch (err) {
      console.error('cancelOrder error:', err);
      setError(err instanceof Error ? err : new Error('Failed to cancel order'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { cancelOrder, isLoading, error };
}
