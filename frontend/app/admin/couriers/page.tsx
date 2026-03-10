'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity,
  Package,
  DollarSign,
  Clock,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { useAdminCouriers } from '@/hooks/useAdmin';
import { AdminCourier, adminApi, AdminCourierStats } from '@/lib/api';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function CourierCard({ courier }: { courier: AdminCourier }) {
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<AdminCourierStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const onShift = !!courier.active_shift;
  const fullName = [courier.first_name, courier.last_name].filter(Boolean).join(' ') || `@${courier.username}` || `ID ${courier.id.slice(0, 8)}`;

  const loadStats = async () => {
    if (stats) { setShowStats(!showStats); return; }
    setLoadingStats(true);
    try {
      const res = await adminApi.getCourierStats(courier.id);
      if (res.data) setStats(res.data);
      setShowStats(true);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
      border: `1px solid ${onShift ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 162, 97, 0.2)'}`,
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: onShift ? 'rgba(76, 175, 80, 0.15)' : 'rgba(148, 163, 184, 0.1)',
              border: `1px solid ${onShift ? 'rgba(76, 175, 80, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Truck style={{ width: 18, height: 18, color: onShift ? '#4CAF50' : '#94A3B8' }} strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>{fullName}</p>
              {courier.username && (
                <p style={{ fontSize: 11, color: '#94A3B8' }}>@{courier.username}</p>
              )}
            </div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: onShift ? '#4CAF50' : '#94A3B8',
            background: onShift ? 'rgba(76, 175, 80, 0.15)' : 'rgba(148, 163, 184, 0.1)',
            padding: '3px 10px', borderRadius: 8,
            border: `1px solid ${onShift ? 'rgba(76, 175, 80, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`,
          }}>
            {onShift ? 'На линии' : 'Не в смене'}
          </span>
        </div>

        {/* Краткая инфо */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {courier.phone && (
              <span style={{ fontSize: 11, color: '#94A3B8' }}>{courier.phone}</span>
            )}
            <span style={{ fontSize: 11, color: '#94A3B8' }}>с {formatDate(courier.created_at)}</span>
          </div>
          <button
            onClick={loadStats}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 8,
              background: 'rgba(244, 162, 97, 0.1)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              color: '#F4A261', fontSize: 11, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {loadingStats
              ? <RefreshCw className="animate-spin-custom" style={{ width: 12, height: 12 }} />
              : <Activity style={{ width: 12, height: 12 }} />
            }
            Статистика
          </button>
        </div>

        {/* Текущая смена */}
        {onShift && courier.active_shift && (
          <div style={{
            marginTop: 10,
            padding: '8px 12px', borderRadius: 10,
            background: 'rgba(76, 175, 80, 0.08)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#4CAF50' }}>{courier.active_shift.deliveries_count}</p>
              <p style={{ fontSize: 10, color: '#94A3B8' }}>доставок</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#4CAF50' }}>{formatMoney(courier.active_shift.total_earnings)} ₽</p>
              <p style={{ fontSize: 10, color: '#94A3B8' }}>заработано</p>
            </div>
          </div>
        )}
      </div>

      {/* Полная статистика */}
      {showStats && stats && (
        <div style={{
          borderTop: '1px solid rgba(244, 162, 97, 0.15)',
          padding: '12px 16px',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
        }}>
          <div style={{ background: 'rgba(244, 162, 97, 0.08)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Package style={{ width: 12, height: 12, color: '#F4A261' }} />
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Всего доставок</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{stats.totalDeliveries}</p>
          </div>
          <div style={{ background: 'rgba(244, 162, 97, 0.08)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <DollarSign style={{ width: 12, height: 12, color: '#F4A261' }} />
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Заработано</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{formatMoney(stats.totalEarnings)} ₽</p>
          </div>
          <div style={{ background: 'rgba(244, 162, 97, 0.08)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Clock style={{ width: 12, height: 12, color: '#F4A261' }} />
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Смен</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{stats.totalShifts}</p>
          </div>
          <div style={{ background: 'rgba(244, 162, 97, 0.08)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Activity style={{ width: 12, height: 12, color: '#F4A261' }} />
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Доставок/смена</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{stats.avgDeliveriesPerShift}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCouriersContent() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { couriers, isLoading, error, totalPages, total, refetch } = useAdminCouriers(page);

  const filtered = search.trim()
    ? couriers.filter((c) => {
        const q = search.toLowerCase();
        return (
          [c.first_name, c.last_name].join(' ').toLowerCase().includes(q) ||
          (c.username ?? '').toLowerCase().includes(q) ||
          (c.phone ?? '').includes(q)
        );
      })
    : couriers;

  const onShiftCount = couriers.filter(c => !!c.active_shift).length;

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

          <div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>Курьеры</h1>
            {!isLoading && (
              <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
                {onShiftCount} на линии / {total} всего
              </p>
            )}
          </div>

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

        {/* Поиск */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(45, 79, 94, 0.5)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 14, padding: '10px 14px', marginBottom: 16,
        }}>
          <Search style={{ width: 16, height: 16, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, телефону…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: 14 }}
          />
        </div>

        {/* Ошибка */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF4444',
          }}>
            {error}
          </div>
        )}

        {/* Лоадер */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <RefreshCw className="animate-spin-custom" style={{ width: 28, height: 28, color: '#F4A261' }} />
          </div>
        )}

        {/* Пустое состояние */}
        {!isLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <Truck style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
            <p style={{ color: '#94A3B8', fontSize: 15, fontWeight: 600 }}>Курьеров не найдено</p>
          </div>
        )}

        {/* Список */}
        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((courier) => (
              <CourierCard key={courier.id} courier={courier} />
            ))}
          </div>
        )}

        {/* Пагинация */}
        {totalPages > 1 && !isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(45, 79, 94, 0.5)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft style={{ width: 18, height: 18, color: '#F4A261' }} />
            </button>
            <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(45, 79, 94, 0.5)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              <ChevronRight style={{ width: 18, height: 18, color: '#F4A261' }} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminCouriersPage() {
  return (
    <AdminGuard>
      <AdminCouriersContent />
    </AdminGuard>
  );
}
