'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, AlertTriangle, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DevLoginPage() {
  const router = useRouter();
  const { devLogin, isAuthenticated, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDevLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await devLogin();
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err) {
      console.error('Dev login error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setSuccess(false);
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        
        {/* Предупреждение */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 12,
          marginBottom: 24,
        }}>
          <AlertTriangle style={{ width: 18, height: 18, color: '#EF4444' }} />
          <span style={{ fontSize: 12, color: '#FCA5A5', fontWeight: 600 }}>
            Только для разработки!
          </span>
        </div>

        {/* Логотип */}
        <div style={{ marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="ЛавкинКот" style={{ height: 80, width: 'auto' }} />
        </div>

        <h1 style={{ 
          fontSize: 24, 
          fontWeight: 900, 
          color: '#FFFFFF', 
          marginBottom: 12,
          textAlign: 'center',
        }}>
          Dev Авторизация
        </h1>

        <p style={{ 
          fontSize: 14, 
          color: '#94A3B8', 
          marginBottom: 32,
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Войдите как тестовый пользователь для проверки функционала
        </p>

        {/* Статус авторизации */}
        {isAuthenticated && user && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            width: '100%',
            maxWidth: 300,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Check style={{ width: 18, height: 18, color: '#4CAF50' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4CAF50' }}>Авторизован</span>
            </div>
            <p style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 600 }}>
              {user.first_name} {user.last_name}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8' }}>
              @{user.username || 'user'}
            </p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 24,
            width: '100%',
            maxWidth: 300,
          }}>
            <p style={{ fontSize: 13, color: '#FCA5A5' }}>{error}</p>
          </div>
        )}

        {/* Успех */}
        {success && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 24,
            width: '100%',
            maxWidth: 300,
          }}>
            <p style={{ fontSize: 13, color: '#4CAF50' }}>
              ✓ Авторизация успешна! Переход в профиль...
            </p>
          </div>
        )}

        {/* Кнопки */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          {!isAuthenticated ? (
            <button
              onClick={handleDevLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                color: '#FFFFFF',
                padding: '16px 24px',
                borderRadius: 14,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
                fontWeight: 800,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin-custom" style={{ width: 20, height: 20 }} />
              ) : (
                <LogIn style={{ width: 20, height: 20 }} />
              )}
              {isLoading ? 'Вход...' : 'Войти как тест-пользователь'}
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/profile')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                  color: '#FFFFFF',
                  padding: '16px 24px',
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                Перейти в профиль
              </button>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#FCA5A5',
                  padding: '14px 24px',
                  borderRadius: 14,
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Выйти
              </button>
            </>
          )}

          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#94A3B8',
              padding: '12px 24px',
              borderRadius: 14,
              border: '1px solid rgba(148, 163, 184, 0.3)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            На главную
          </button>
        </div>

        {/* Подсказка */}
        <p style={{ 
          fontSize: 11, 
          color: '#64748B', 
          marginTop: 32,
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 1.5,
        }}>
          Этот режим создаёт тестового пользователя с заполненным профилем для проверки всех функций приложения.
        </p>
      </main>

    </div>
  );
}
