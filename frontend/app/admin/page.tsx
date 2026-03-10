'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Settings,
  BarChart3,
  ShoppingBag,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { useAdminStats } from '@/hooks/useAdmin';

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent = false,
  highlight,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  accent?: boolean;
  highlight?: string;
}) {
  return (
    <div style={{
      background: accent
        ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid ${accent ? 'rgba(244, 162, 97, 0.3)' : 'rgba(244, 162, 97, 0.2)'}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: accent ? '0 4px 16px rgba(244, 162, 97, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.2)',
    }}>
      <Icon style={{ width: 24, height: 24, color: accent ? '#F4A261' : '#94A3B8', marginBottom: 8 }} strokeWidth={2} />
      <p style={{
        fontSize: 22,
        fontWeight: 900,
        color: '#FFFFFF',
        marginBottom: 2,
        letterSpacing: '-0.02em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>{value}</p>
      {highlight && (
        <p style={{ fontSize: 11, color: '#4CAF50', fontWeight: 700, marginBottom: 2 }}>
          +{highlight} сегодня
        </p>
      )}
      <p style={{
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>{label}</p>
    </div>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const { stats, isLoading, error, refetch } = useAdminStats();

  const menuItems = [
    {
      id: 'users',
      title: 'Пользователи',
      subtitle: stats ? `${stats.users.total} всего` : '—',
      icon: Users,
      path: '/admin/users',
    },
    {
      id: 'partners',
      title: 'Партнёры',
      subtitle: stats ? `${stats.partners} партнёров` : '—',
      icon: Store,
      path: '/admin/partners',
    },
    {
      id: 'couriers',
      title: 'Курьеры',
      subtitle: stats ? `${stats.couriers.active} на линии` : '—',
      icon: Truck,
      path: '/admin/couriers',
    },
    {
      id: 'orders',
      title: 'Заказы',
      subtitle: stats ? `${stats.orders.today} сегодня` : '—',
      icon: Package,
      path: '/admin/orders',
    },
    {
      id: 'analytics',
      title: 'Аналитика',
      subtitle: 'Отчёты и статистика',
      icon: BarChart3,
      path: '/admin/analytics',
    },
    {
      id: 'settings',
      title: 'Настройки',
      subtitle: 'Конфигурация системы',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{
      backgroundColor: '#1A2F3A',
      position: 'relative',
      paddingBottom: 16,
    }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{
        padding: '14px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/profile')}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{
            fontSize: 20, fontWeight: 900, color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Админ панель
          </h1>

          <button
            onClick={refetch}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RefreshCw
              style={{ width: 18, height: 18, color: '#F4A261' }}
              className={isLoading ? 'animate-spin-custom' : ''}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: 13,
            color: '#EF4444',
          }}>
            {error}
          </div>
        )}

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          <StatCard
            icon={DollarSign}
            value={stats ? formatMoney(stats.revenue.total) : '—'}
            label="Выручка"
            accent
            highlight={stats ? formatMoney(stats.revenue.today) : undefined}
          />
          <StatCard
            icon={ShoppingBag}
            value={stats ? stats.orders.total : '—'}
            label="Всего заказов"
            highlight={stats ? String(stats.orders.today) : undefined}
          />
          <StatCard
            icon={Users}
            value={stats ? stats.users.total : '—'}
            label="Пользователей"
            highlight={stats ? String(stats.users.today) : undefined}
          />
          <StatCard
            icon={TrendingUp}
            value={stats ? stats.couriers.active : '—'}
            label="Курьеров на линии"
          />
        </div>

        {/* Магазины */}
        {stats && (
          <div style={{
            background: 'rgba(45, 79, 94, 0.4)',
            border: '1px solid rgba(244, 162, 97, 0.15)',
            borderRadius: 14,
            padding: '12px 16px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Store style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2} />
              <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 600 }}>Магазины</span>
            </div>
            <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
              {stats.shops.active} активных / {stats.shops.total} всего
            </span>
          </div>
        )}

        {/* Меню разделов */}
        <h2 style={{
          fontSize: 18, fontWeight: 800, color: '#FFFFFF',
          marginBottom: 16, letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          Управление
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(244, 162, 97, 0.2)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)',
                      border: '1px solid rgba(244, 162, 97, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{
                        fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 2,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{item.subtitle}</p>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
