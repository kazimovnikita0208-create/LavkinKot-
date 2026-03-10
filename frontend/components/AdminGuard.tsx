'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldOff } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/profile');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto flex items-center justify-center" style={{ backgroundColor: '#1A2F3A' }}>
        <Loader2 className="animate-spin-custom" style={{ width: 32, height: 32, color: '#F4A261' }} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#1A2F3A', padding: 24 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ShieldOff style={{ width: 40, height: 40, color: '#EF4444' }} strokeWidth={1.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Нет доступа
          </p>
          <p style={{
            fontSize: 14,
            color: '#94A3B8',
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Этот раздел доступен только администраторам
          </p>
        </div>
        <button
          onClick={() => router.replace('/profile')}
          style={{
            marginTop: 8,
            padding: '12px 28px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #F4A261, #E8955A)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Вернуться в профиль
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
