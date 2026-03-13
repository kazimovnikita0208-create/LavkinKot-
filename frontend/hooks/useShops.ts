'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopsApi, Shop, Product } from '@/lib/api';
import { cacheGet, cacheSet, cacheIsStale } from '@/lib/cache';

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
  const { category, search, page, limit } = options;
  const cacheKey = `shops_${category || ''}_${search || ''}_${page || 1}_${limit || 20}`;

  const [shops, setShops] = useState<Shop[]>(() => cacheGet<Shop[]>(cacheKey) || []);
  const [isLoading, setIsLoading] = useState(() => !cacheGet<Shop[]>(cacheKey));
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseShopsResult['pagination']>(null);

  const fetchShops = useCallback(async () => {
    try {
      setError(null);
      const response = await shopsApi.getShops({ category, search, page, limit });

      if (response.success) {
        const data = response.data || [];
        setShops(data);
        cacheSet(cacheKey, data);
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
      if (shops.length === 0) {
        setError(err instanceof Error ? err : new Error('Failed to fetch shops'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [category, search, page, limit, cacheKey, shops.length]);

  useEffect(() => {
    // Если кэш устарел — фетчим, иначе показываем кэш и фетчим в фоне тихо
    if (cacheIsStale(cacheKey)) {
      setIsLoading(shops.length === 0);
      fetchShops();
    } else {
      // Данные свежие — обновляем в фоне без спиннера
      fetchShops();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return { shops, isLoading, error, pagination, refetch: fetchShops };
}

interface UseShopResult {
  shop: Shop | null;
  isLoading: boolean;
  error: Error | null;
}

export function useShop(shopId: string): UseShopResult {
  const cacheKey = `shop_${shopId}`;
  const [shop, setShop] = useState<Shop | null>(() => cacheGet<Shop>(cacheKey));
  const [isLoading, setIsLoading] = useState(() => !cacheGet<Shop>(cacheKey));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shopId) { setIsLoading(false); return; }

    const fetchShop = async () => {
      try {
        setError(null);
        const response = await shopsApi.getShopById(shopId);
        if (response.success && response.data) {
          setShop(response.data);
          cacheSet(cacheKey, response.data);
        }
      } catch (err) {
        if (!shop) setError(err instanceof Error ? err : new Error('Failed to fetch shop'));
      } finally {
        setIsLoading(false);
      }
    };

    if (cacheIsStale(cacheKey)) fetchShop();
    else { fetchShop(); } // тихое фоновое обновление
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const { category, page, limit } = options;
  const cacheKey = `shop_products_${shopId}_${category || ''}_${page || 1}`;

  const [products, setProducts] = useState<Product[]>(() => cacheGet<Product[]>(cacheKey) || []);
  const [categories, setCategories] = useState<string[]>(() => cacheGet<string[]>(`shop_cats_${shopId}`) || []);
  const [isLoading, setIsLoading] = useState(() => !cacheGet<Product[]>(cacheKey));
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!shopId) { setIsLoading(false); return; }

    try {
      setError(null);
      const [productsResponse, categoriesResponse] = await Promise.all([
        shopsApi.getShopProducts(shopId, { category, page, limit }),
        shopsApi.getShopCategories(shopId),
      ]);

      if (productsResponse.success) {
        const data = productsResponse.data || [];
        setProducts(data);
        cacheSet(cacheKey, data);
      }

      if (categoriesResponse.success) {
        const cats = categoriesResponse.data || [];
        setCategories(cats);
        cacheSet(`shop_cats_${shopId}`, cats);
      }
    } catch (err) {
      if (products.length === 0) {
        setError(err instanceof Error ? err : new Error('Failed to fetch shop products'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [shopId, category, page, limit, cacheKey, products.length]);

  useEffect(() => {
    if (cacheIsStale(cacheKey)) setIsLoading(products.length === 0);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return { products, categories, isLoading, error, refetch: fetchData };
}
