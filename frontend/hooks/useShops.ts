'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopsApi, Shop, Product } from '@/lib/api';

interface UseShopsOptions {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseShopsResult {
  shops: Shop[];
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

export function useShops(options: UseShopsOptions = {}): UseShopsResult {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseShopsResult['pagination']>(null);

  const { category, search, page, limit } = options;

  const fetchShops = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await shopsApi.getShops({ category, search, page, limit });
      
      if (response.success) {
        setShops(response.data || []);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            totalPages: response.pagination.totalPages,
            hasNext: response.pagination.hasNext,
            hasPrev: response.pagination.hasPrev,
          });
        }
      } else {
        setError(new Error('Failed to fetch shops'));
      }
    } catch (err) {
      console.error('useShops error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch shops'));
    } finally {
      setIsLoading(false);
    }
  }, [category, search, page, limit]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return { shops, isLoading, error, pagination, refetch: fetchShops };
}

interface UseShopResult {
  shop: Shop | null;
  isLoading: boolean;
  error: Error | null;
}

export function useShop(shopId: string): UseShopResult {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await shopsApi.getShopById(shopId);
        
        if (response.success && response.data) {
          setShop(response.data);
        } else {
          setError(new Error('Shop not found'));
        }
      } catch (err) {
        console.error('useShop error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch shop'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  return { shop, isLoading, error };
}

interface UseShopProductsOptions {
  category?: string;
  page?: number;
  limit?: number;
}

interface UseShopProductsResult {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useShopProducts(shopId: string, options: UseShopProductsOptions = {}): UseShopProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { category, page, limit } = options;

  const fetchData = useCallback(async () => {
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        shopsApi.getShopProducts(shopId, { category, page, limit }),
        shopsApi.getShopCategories(shopId),
      ]);
      
      if (productsResponse.success) {
        setProducts(productsResponse.data || []);
      }
      
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }
    } catch (err) {
      console.error('useShopProducts error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch shop products'));
    } finally {
      setIsLoading(false);
    }
  }, [shopId, category, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, categories, isLoading, error, refetch: fetchData };
}
