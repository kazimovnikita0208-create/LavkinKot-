'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'customer' | 'courier' | 'partner' | 'admin';

const ROLES: { role: Role; label: string; emoji: string; path: string; color: string }[] = [
  { role: 'customer', label: 'Клиент',   emoji: '🛍️', path: '/',        color: '#3B82F6' },
  { role: 'courier',  label: 'Курьер',   emoji: '🚴', path: '/courier', color: '#10B981' },
  { role: 'partner',  label: 'Партнёр',  emoji: '🏪', path: '/partner', color: '#F59E0B' },
  { role: 'admin',    label: 'Админ',    emoji: '⚙️', path: '/admin',   color: '#EF4444' },
];

export function DevRoleSwitcher() {
  const { user, devLogin, logout, isLoading } = useAuth();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [switching, setSwitching] = useState<Role | null>(null);

  // Показываем только в development
  if (process.env.NODE_ENV !== 'development') return null;

  const currentRole = user?.role as Role | undefined;

  const handleSwitch = async (role: Role, path: string) => {
    if (switching) return;
    try {
      setSwitching(role);
      await devLogin(role);
      setExpanded(false);
      router.push(path);
    } catch (err) {
      console.error('Role switch failed:', err);
    } finally {
      setSwitching(null);
    }
  };

  const handleLogout = () => {
    logout();
    setExpanded(false);
    router.push('/');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        right: 12,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
        pointerEvents: 'none',
      }}
    >
      {/* Список ролей — раскрывается вверх */}
      {expanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            pointerEvents: 'all',
          }}
        >
          {ROLES.map(({ role, label, emoji, path, color }) => {
            const isActive = currentRole === role;
            const isLoadingThis = switching === role;

            return (
              <button
                key={role}
                onClick={() => handleSwitch(role, path)}
                disabled={isLoadingThis || isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 12,
                  border: `1.5px solid ${isActive ? color : 'rgba(255,255,255,0.15)'}`,
                  background: isActive
                    ? `${color}22`
                    : 'rgba(13, 27, 36, 0.92)',
                  color: isActive ? color : '#E2E8F0',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13,
                  cursor: isLoadingThis ? 'wait' : 'pointer',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap',
                  opacity: isLoadingThis ? 0.7 : 1,
                  transition: 'all 0.15s',
                  minWidth: 120,
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {isLoadingThis ? '⏳' : emoji}
                </span>
                <span>{isLoadingThis ? 'Вход...' : label}</span>
                {isActive && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: color,
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Выйти */}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 12px',
                borderRadius: 12,
                border: '1.5px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.1)',
                color: '#FCA5A5',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <span>🚪</span>
              <span>Выйти</span>
            </button>
          )}
        </div>
      )}

      {/* Кнопка-триггер */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: expanded
            ? 'rgba(244, 162, 97, 0.9)'
            : 'rgba(13, 27, 36, 0.88)',
          border: '1.5px solid rgba(244,162,97,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontSize: 18,
          pointerEvents: 'all',
          transition: 'all 0.2s',
          position: 'relative',
        }}
        title="Dev: переключить роль"
      >
        {expanded ? '✕' : '🔧'}
        {/* Индикатор текущей роли */}
        {currentRole && !expanded && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: ROLES.find((r) => r.role === currentRole)?.color ?? '#94A3B8',
              border: '2px solid #0D1B24',
              fontSize: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
      </button>

      {/* Подпись текущей роли */}
      {!expanded && currentRole && (
        <span
          style={{
            fontSize: 10,
            color: ROLES.find((r) => r.role === currentRole)?.color ?? '#94A3B8',
            fontWeight: 700,
            pointerEvents: 'none',
            textAlign: 'center',
            width: 44,
            letterSpacing: '0.03em',
          }}
        >
          {ROLES.find((r) => r.role === currentRole)?.label?.toUpperCase()}
        </span>
      )}
    </div>
  );
}
