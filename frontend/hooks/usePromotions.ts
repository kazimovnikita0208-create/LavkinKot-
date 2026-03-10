'use client';

import { useState, useEffect } from 'react';
import { promotionsApi, Promotion } from '@/lib/api';

interface UsePromotionsResult {
  promotions: Promotion[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePromotions(shopId?: string): UsePromotionsResult {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await promotionsApi.getPromotions(shopId);
      
      if (response.success && response.data) {
        setPromotions(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch promotions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [shopId]);

  return { promotions, isLoading, error, refetch: fetchPromotions };
}
