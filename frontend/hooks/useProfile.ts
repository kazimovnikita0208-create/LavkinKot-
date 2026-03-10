'use client';

import { useState, useEffect, useCallback } from 'react';
import { profileApi, UserProfile, UserStats, api } from '@/lib/api';

interface UseProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!api.getToken()) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await profileApi.getProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(new Error('Failed to fetch profile'));
      }
    } catch (err) {
      console.error('useProfile error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      const response = await profileApi.updateProfile(data);
      if (response.success && response.data) {
        setProfile(response.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('updateProfile error:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile, updateProfile };
}

interface UseProfileStatsResult {
  stats: UserStats | null;
  isLoading: boolean;
  error: Error | null;
}

export function useProfileStats(): UseProfileStatsResult {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!api.getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await profileApi.getStats();
        
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('useProfileStats error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
