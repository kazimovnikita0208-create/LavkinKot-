'use client';

import { useState, useEffect } from 'react';
import { productsApi, Product } from '@/lib/api';

interface UseProductsOptions {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface UseProductsResult {
  products: Product[];
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

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseProductsResult['pagination']>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsApi.getProducts(options);
      
      if (response.success && response.data) {
        setProducts(response.data);
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
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.search, options.category, options.page, options.limit]);

  return { products, isLoading, error, pagination, refetch: fetchProducts };
}

interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: Error | null;
}

export function useProduct(productId: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsApi.getProductById(productId);
        
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
}

export function usePopularProducts(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsApi.getPopularProducts(limit);
        
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch popular products'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, isLoading, error };
}

export function useRecommendedProducts(productId: string, limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsApi.getRecommendedProducts(productId, limit);
        
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recommended products'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [productId, limit]);

  return { products, isLoading, error };
}
