'use client';

import { useState, useEffect } from 'react';
import { subscriptionsApi, SubscriptionPlan, CustomerSubscription, SubscriptionTransaction, api } from '@/lib/api';

interface UseSubscriptionPlansResult {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: Error | null;
}

export function useSubscriptionPlans(): UseSubscriptionPlansResult {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await subscriptionsApi.getPlans();
        
        if (response.success && response.data) {
          setPlans(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch subscription plans'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, isLoading, error };
}

interface UseMySubscriptionResult {
  subscription: CustomerSubscription | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMySubscription(): UseMySubscriptionResult {
  const [subscription, setSubscription] = useState<CustomerSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    if (!api.getToken()) {
      setIsLoading(false);
      setSubscription(null);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await subscriptionsApi.getMySubscription();
      
      if (response.success) {
        setSubscription(response.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return { subscription, isLoading, error, refetch: fetchSubscription };
}

interface UseSubscriptionTransactionsResult {
  transactions: SubscriptionTransaction[];
  isLoading: boolean;
  error: Error | null;
}

export function useSubscriptionTransactions(): UseSubscriptionTransactionsResult {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await subscriptionsApi.getTransactions();
        
        if (response.success && response.data) {
          setTransactions(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, isLoading, error };
}
