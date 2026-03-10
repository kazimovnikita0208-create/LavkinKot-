'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Store,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { adminApi, AdminShop } from '@/lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

interface ShopWithOwner extends AdminShop {
  owner?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    username: string | null;
    telegram_id: number;
  } | null;
}

function ApplicationCard({
  shop,
  onApprove,
  onReject,
}: {
  shop: ShopWithOwner;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const ownerName = shop.owner
    ? [shop.owner.first_name, shop.owner.last_name].filter(Boolean).join(' ') ||
      (shop.owner.username ? `@${shop.owner.username}` : `TG ${shop.owner.telegram_id}`)
    : null;

  const handleApprove = async () => {
    setLoading('approve');
    try { await onApprove(shop.id); } finally { setLoading(null); }
  };

  const handleReject = async () => {
    setLoading('reject');
    try { await onReject(shop.id); } finally { setLoading(null); }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
      border: '1px solid rgba(244, 162, 97, 0.2)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Обложка */}
      {(shop.cover_url || shop.image_url) && (
        <div style={{ height: 100, overflow: 'hidden', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shop.cover_url || shop.image_url || ''}
            alt={shop.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            background: 'linear-gradient(to top, rgba(26, 47, 58, 0.9), transparent)',
          }} />
        </div>
      )}

      <div style={{ padding: '14px 16px' }}>
        {/* Шапка */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>{shop.name}</p>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>{shop.category} · Подана {formatDate(shop.created_at)}</p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#F59E0B',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 8, padding: '3px 10px',
          }}>
            На рассмотрении
          </span>
        </div>

        {/* Детали */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {shop.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin style={{ width: 14, height: 14, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{shop.address}</span>
            </div>
          )}
          {ownerName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User style={{ width: 14, height: 14, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>{ownerName}</span>
            </div>
          )}
          {shop.owner?.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone style={{ width: 14, height: 14, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{shop.owner.phone}</span>
            </div>
          )}
          {shop.description && (
            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginTop: 2 }}>
              {shop.description}
            </p>
          )}
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleReject}
            disabled={!!loading}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading === 'reject'
              ? <RefreshCw className="animate-spin-custom" style={{ width: 14, height: 14 }} />
              : <XCircle style={{ width: 14, height: 14 }} />
            }
            Отклонить
          </button>
          <button
            onClick={handleApprove}
            disabled={!!loading}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12,
              background: 'rgba(76, 175, 80, 0.15)',
              border: '1px solid rgba(76, 175, 80, 0.4)',
              color: '#4CAF50', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading === 'approve'
              ? <RefreshCw className="animate-spin-custom" style={{ width: 14, height: 14 }} />
              : <CheckCircle style={{ width: 14, height: 14 }} />
            }
            Одобрить
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPartnersContent() {
  const router = useRouter();
  const [applications, setApplications] = useState<ShopWithOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getPartnerApplications({ page, limit: 20 });
      setApplications((res.data as ShopWithOwner[]) ?? []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (shopId: string) => {
    await adminApi.approvePartner(shopId);
    await load();
  };

  const handleReject = async (shopId: string) => {
    await adminApi.rejectPartner(shopId);
    await load();
  };

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
            <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>Заявки</h1>
            {!isLoading && (
              <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>{total} на рассмотрении</p>
            )}
          </div>

          <button onClick={load} style={{
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
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <RefreshCw className="animate-spin-custom" style={{ width: 28, height: 28, color: '#F4A261' }} />
          </div>
        )}

        {!isLoading && applications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <Store style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
            <p style={{ color: '#94A3B8', fontSize: 15, fontWeight: 600 }}>Новых заявок нет</p>
            <p style={{ color: '#64748B', fontSize: 13, marginTop: 6 }}>
              Здесь появятся магазины, ожидающие активации
            </p>
          </div>
        )}

        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {applications.map((shop) => (
              <ApplicationCard
                key={shop.id}
                shop={shop}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

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
                cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft style={{ width: 18, height: 18, color: '#F4A261' }} />
            </button>
            <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(45, 79, 94, 0.5)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1,
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

export default function AdminPartnersPage() {
  return (
    <AdminGuard>
      <AdminPartnersContent />
    </AdminGuard>
  );
}
