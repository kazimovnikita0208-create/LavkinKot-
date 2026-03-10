'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Search,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { useAdminOrders } from '@/hooks/useAdmin';
import { AdminOrder } from '@/lib/api';

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  pending:    { text: 'Ожидает',    color: '#94A3B8' },
  confirmed:  { text: 'Подтверждён', color: '#3B82F6' },
  preparing:  { text: 'Готовится',  color: '#F59E0B' },
  ready:      { text: 'Готов',      color: '#8B5CF6' },
  delivering: { text: 'В пути',     color: '#F4A261' },
  delivered:  { text: 'Доставлен',  color: '#4CAF50' },
  cancelled:  { text: 'Отменён',    color: '#EF4444' },
};

const STATUS_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'pending', label: 'Ожидают' },
  { key: 'preparing', label: 'Готовятся' },
  { key: 'delivering', label: 'В пути' },
  { key: 'delivered', label: 'Доставлены' },
  { key: 'cancelled', label: 'Отменены' },
];

const NEXT_STATUSES: Record<string, string[]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['preparing', 'cancelled'],
  preparing:  ['ready', 'cancelled'],
  ready:      ['delivering', 'cancelled'],
  delivering: ['delivered', 'cancelled'],
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function OrderCard({ order, onStatusChange }: { order: AdminOrder; onStatusChange: (id: string, status: string) => Promise<void> }) {
  const statusInfo = STATUS_LABELS[order.status] ?? { text: order.status, color: '#94A3B8' };
  const nextStatuses = NEXT_STATUSES[order.status] ?? [];
  const customerName = order.profile
    ? [order.profile.first_name, order.profile.last_name].filter(Boolean).join(' ') || `TG ${order.profile.telegram_id}`
    : '—';
  const courierName = order.courier
    ? [order.courier.first_name, order.courier.last_name].filter(Boolean).join(' ')
    : null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
      border: '1px solid rgba(244, 162, 97, 0.2)',
      borderRadius: 16,
      padding: 16,
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      {/* Заголовок */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
          <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: 15 }}>
            #{order.order_number}
          </span>
        </div>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: statusInfo.color,
          background: `${statusInfo.color}22`,
          padding: '3px 10px',
          borderRadius: 8,
          border: `1px solid ${statusInfo.color}44`,
        }}>
          {statusInfo.text}
        </span>
      </div>

      {/* Данные */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Клиент</span>
          <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>{customerName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Магазин</span>
          <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>{order.shop?.name ?? '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Адрес</span>
          <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>
            {order.delivery_street}, {order.delivery_house}, кв. {order.delivery_apartment}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Время</span>
          <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>{order.delivery_time_slot}</span>
        </div>
        {courierName && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Курьер</span>
            <span style={{ fontSize: 12, color: '#4CAF50', fontWeight: 600 }}>{courierName}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Сумма</span>
          <span style={{ fontSize: 13, color: '#F4A261', fontWeight: 800 }}>{order.total} ₽</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Создан</span>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{formatDate(order.created_at)} {formatTime(order.created_at)}</span>
        </div>
      </div>

      {/* Кнопки смены статуса */}
      {nextStatuses.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {nextStatuses.map((s) => {
            const info = STATUS_LABELS[s];
            const isCancelled = s === 'cancelled';
            return (
              <button
                key={s}
                onClick={() => onStatusChange(order.id, s)}
                style={{
                  flex: 1,
                  minWidth: 80,
                  padding: '7px 10px',
                  borderRadius: 10,
                  background: isCancelled ? 'rgba(239, 68, 68, 0.1)' : 'rgba(244, 162, 97, 0.1)',
                  border: `1px solid ${isCancelled ? 'rgba(239, 68, 68, 0.3)' : 'rgba(244, 162, 97, 0.3)'}`,
                  color: isCancelled ? '#EF4444' : '#F4A261',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {info?.text ?? s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminOrdersContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { orders, isLoading, error, totalPages, total, refetch, updateOrderStatus } = useAdminOrders(statusFilter, page);

  const filteredOrders = search.trim()
    ? orders.filter((o) => {
        const q = search.toLowerCase();
        const name = [o.profile?.first_name, o.profile?.last_name].join(' ').toLowerCase();
        return (
          String(o.order_number).includes(q) ||
          name.includes(q) ||
          (o.shop?.name ?? '').toLowerCase().includes(q)
        );
      })
    : orders;

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
            <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>Заказы</h1>
            {!isLoading && <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>{total} всего</p>}
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
          borderRadius: 14, padding: '10px 14px', marginBottom: 12,
        }}>
          <Search style={{ width: 16, height: 16, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по №, имени, магазину…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#FFFFFF', fontSize: 14,
            }}
          />
        </div>

        {/* Фильтры статуса */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setStatusFilter(f.key); setPage(1); }}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 10,
                border: `1px solid ${statusFilter === f.key ? '#F4A261' : 'rgba(244, 162, 97, 0.2)'}`,
                background: statusFilter === f.key ? 'rgba(244, 162, 97, 0.2)' : 'transparent',
                color: statusFilter === f.key ? '#F4A261' : '#94A3B8',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
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
        {!isLoading && filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <Package style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
            <p style={{ color: '#94A3B8', fontSize: 15, fontWeight: 600 }}>Заказов не найдено</p>
          </div>
        )}

        {/* Список заказов */}
        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
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

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <AdminOrdersContent />
    </AdminGuard>
  );
}
