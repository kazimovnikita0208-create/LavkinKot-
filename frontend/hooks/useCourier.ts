'use client';

import { useState, useEffect, useCallback } from 'react';
import { courierApi, CourierShift, CourierOrder, CourierStats } from '@/lib/api';

// Hook для смены курьера
export function useCourierShift() {
  const [shift, setShift] = useState<CourierShift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShift = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courierApi.getCurrentShift();
      if (response.success) {
        setShift(response.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch shift'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShift();
  }, [fetchShift]);

  const startShift = async () => {
    try {
      const response = await courierApi.startShift();
      if (response.success && response.data) {
        setShift(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start shift'));
      throw err;
    }
  };

  const endShift = async () => {
    try {
      const response = await courierApi.endShift();
      if (response.success) {
        setShift(null);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to end shift'));
      throw err;
    }
  };

  return {
    shift,
    isOnShift: !!shift,
    isLoading,
    error,
    startShift,
    endShift,
    refetch: fetchShift,
  };
}

// Hook для заказов курьера
export function useCourierOrders() {
  const [orders, setOrders] = useState<CourierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courierApi.getOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const assignOrder = async (orderId: string) => {
    try {
      await courierApi.assignOrder(orderId);
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  const pickupOrder = async (orderId: string) => {
    try {
      await courierApi.pickupOrder(orderId);
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  const deliverOrder = async (orderId: string) => {
    try {
      await courierApi.deliverOrder(orderId);
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    isLoading,
    error,
    assignOrder,
    pickupOrder,
    deliverOrder,
    refetch: fetchOrders,
  };
}

// Hook для статистики курьера
export function useCourierStats() {
  const [stats, setStats] = useState<CourierStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courierApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
