'use client';

import { useEffect } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DevRoleSwitcher } from '@/components/DevRoleSwitcher';
import { initTelegramSDK } from '@/lib/telegram';
import { ReactNode } from 'react';

function TelegramInit() {
  useEffect(() => {
    initTelegramSDK();
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <TelegramInit />
        {children}
        <DevRoleSwitcher />
      </CartProvider>
    </AuthProvider>
  );
}
