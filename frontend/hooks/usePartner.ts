'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  partnerApi, 
  PartnerShop, 
  Product, 
  PartnerOrder, 
  PartnerAnalytics,
  CreateProductData 
} from '@/lib/api';

// Hook для магазина партнёра
export function usePartnerShop() {
  const [shop, setShop] = useState<PartnerShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShop = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await partnerApi.getShop();
      if (response.success && response.data) {
        setShop(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch shop'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const updateShop = async (data: Partial<PartnerShop>) => {
    try {
      const response = await partnerApi.updateShop(data);
      if (response.success && response.data) {
        setShop(response.data);
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    shop,
    isLoading,
    error,
    updateShop,
    refetch: fetchShop,
  };
}

// Hook для товаров партнёра
export function usePartnerProducts(params?: { category?: string; search?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await partnerApi.getProducts({ ...params, page, limit: 50 });
      if (response.success && response.data) {
        setProducts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: CreateProductData) => {
    try {
      const response = await partnerApi.createProduct(data);
      if (response.success && response.data) {
        await fetchProducts();
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id: string, data: Partial<CreateProductData>) => {
    try {
      const response = await partnerApi.updateProduct(id, data);
      if (response.success && response.data) {
        setProducts(prev => prev.map(p => p.id === id ? response.data! : p));
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await partnerApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    products,
    isLoading,
    error,
    pagination,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}

// Hook для заказов партнёра
export function usePartnerOrders(status?: string) {
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await partnerApi.getOrders({ status, page, limit: 20 });
      if (response.success && response.data) {
        setOrders(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const acceptOrder = async (orderId: string) => {
    try {
      await partnerApi.acceptOrder(orderId);
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  const markOrderReady = async (orderId: string) => {
    try {
      await partnerApi.markOrderReady(orderId);
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    isLoading,
    error,
    pagination,
    acceptOrder,
    markOrderReady,
    refetch: fetchOrders,
  };
}

// Hook для аналитики партнёра
export function usePartnerAnalytics() {
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await partnerApi.getAnalytics();
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
