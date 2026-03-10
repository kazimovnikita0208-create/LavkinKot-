'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Truck,
  RefreshCw,
  Store,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { useAdminStats } from '@/hooks/useAdmin';

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} млн ₽`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)} тыс ₽`;
  return `${value} ₽`;
}

function MetricRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid rgba(244, 162, 97, 0.08)',
    }}>
      <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 500 }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 15, color: '#FFFFFF', fontWeight: 800 }}>{value}</span>
        {sub && <p style={{ fontSize: 11, color: '#4CAF50', marginTop: 2 }}>+{sub} сегодня</p>}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
      border: '1px solid rgba(244, 162, 97, 0.2)',
      borderRadius: 16,
      padding: '16px 18px',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Icon style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2} />
        <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function AdminAnalyticsContent() {
  const router = useRouter();
  const { stats, isLoading, error, refetch } = useAdminStats();

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 24 }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{
        padding: '14px 16px',
        position: 'sticky', top: 0, zIndex: 20,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>Аналитика</h1>

          <button onClick={refetch} style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(45, 79, 94, 0.5)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <RefreshCw
              style={{ width: 18, height: 18, color: '#F4A261' }}
              className={isLoading ? 'animate-spin-custom' : ''}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF4444',
          }}>
            {error}
          </div>
        )}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <RefreshCw className="animate-spin-custom" style={{ width: 32, height: 32, color: '#F4A261' }} />
          </div>
        )}

        {!isLoading && stats && (
          <>
            {/* Выручка */}
            <Section title="Выручка" icon={DollarSign}>
              <MetricRow
                label="Всего выручка"
                value={formatMoney(stats.revenue.total)}
                sub={formatMoney(stats.revenue.today)}
              />
              <MetricRow
                label="Заказов всего"
                value={String(stats.orders.total)}
                sub={String(stats.orders.today)}
              />
              {stats.orders.total > 0 && (
                <MetricRow
                  label="Средний чек"
                  value={formatMoney(Math.round(stats.revenue.total / stats.orders.total))}
                />
              )}
            </Section>

            {/* Пользователи */}
            <Section title="Пользователи" icon={Users}>
              <MetricRow
                label="Всего пользователей"
                value={String(stats.users.total)}
                sub={String(stats.users.today)}
              />
              <MetricRow label="Партнёры" value={String(stats.partners)} />
              <MetricRow
                label="Курьеры"
                value={String(stats.couriers.total)}
                sub={`${stats.couriers.active} сейчас на линии`}
              />
            </Section>

            {/* Магазины */}
            <Section title="Магазины" icon={Store}>
              <MetricRow label="Всего магазинов" value={String(stats.shops.total)} />
              <MetricRow label="Активных" value={String(stats.shops.active)} />
              {stats.shops.total > 0 && (
                <MetricRow
                  label="Активность"
                  value={`${Math.round((stats.shops.active / stats.shops.total) * 100)}%`}
                />
              )}
            </Section>

            {/* Операции */}
            <Section title="Операции" icon={TrendingUp}>
              <MetricRow label="Курьеры на линии" value={String(stats.couriers.active)} />
              <MetricRow label="Заказов сегодня" value={String(stats.orders.today)} />
            </Section>

            {/* Заглушка для будущей аналитики */}
            <div style={{
              background: 'rgba(244, 162, 97, 0.05)',
              border: '1px dashed rgba(244, 162, 97, 0.3)',
              borderRadius: 16,
              padding: '20px 18px',
              textAlign: 'center',
              marginTop: 4,
            }}>
              <BarChart3 style={{ width: 32, height: 32, color: 'rgba(244, 162, 97, 0.4)', margin: '0 auto 10px' }} strokeWidth={1.5} />
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
                Графики по дням, конверсии и сравнительная аналитика — в следующей версии
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <AdminGuard>
      <AdminAnalyticsContent />
    </AdminGuard>
  );
}
