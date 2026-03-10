'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, authApi, User, UserProfile, profileApi } from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (initData: string) => Promise<void>;
  devLogin: (role?: 'customer' | 'courier' | 'partner' | 'admin') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка авторизации при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = api.getToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await profileApi.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (initData: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.loginWithTelegram(initData);
      
      if (response.success && response.data) {
        api.setToken(response.data.token);
        
        // Получаем полный профиль
        const profileResponse = await profileApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  // Dev-режим авторизации (только для разработки!)
  const devLogin = async (role: 'customer' | 'courier' | 'partner' | 'admin' = 'customer') => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('devLogin is only available in development mode');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post<{ user: User; token: string }>('/auth/dev-login', { role });

      if (response.success && response.data) {
        api.setToken(response.data.token);

        const profileResponse = await profileApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
        }
      }
    } catch (error) {
      console.error('Dev login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await profileApi.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        devLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
