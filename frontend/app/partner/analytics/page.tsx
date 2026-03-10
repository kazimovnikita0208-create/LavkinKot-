'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Package,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Trophy,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerAnalytics } from '@/hooks';

export default function PartnerAnalyticsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { analytics, isLoading: analyticsLoading } = usePartnerAnalytics();

  // Проверка роли
  if (!authLoading && user?.role !== 'partner') {
    router.push('/partner');
    return null;
  }

  const isLoading = authLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBackground />
        <Loader2 style={{ width: 48, height: 48, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/partner')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Аналитика</h1>

          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>

        {/* Основная статистика - Сегодня */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}>
          {/* Выручка сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(69, 160, 73, 0.15) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 14,
            padding: 14,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(76, 175, 80, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <DollarSign style={{ width: 20, height: 20, color: '#4CAF50' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Выручка сегодня</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#4CAF50' }}>
              {(analytics?.todayRevenue || 0).toLocaleString('ru-RU')}₽
            </p>
          </div>

          {/* Заказы сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 14,
            padding: 14,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <ShoppingBag style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Заказов сегодня</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#F4A261' }}>
              {analytics?.todayOrdersCount || 0}
            </p>
          </div>
        </div>

        {/* Статистика за неделю */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(21, 101, 192, 0.1) 100%)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
          borderRadius: 14,
          padding: 14,
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Calendar style={{ width: 18, height: 18, color: '#2196F3' }} strokeWidth={2.5} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>За последние 7 дней</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>Выручка</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#2196F3' }}>
                {(analytics?.weekRevenue || 0).toLocaleString('ru-RU')}₽
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>Заказов</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
                {analytics?.weekOrdersCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Всего */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}>
          {/* Всего выручка */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 14,
            padding: 14,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <TrendingUp style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Всего выручка</p>
            <p style={{ fontSize: 18, fontWeight: 900, color: '#F4A261' }}>
              {(analytics?.totalRevenue || 0).toLocaleString('ru-RU')}₽
            </p>
          </div>

          {/* Всего заказов */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 14,
            padding: 14,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Package style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Всего заказов</p>
            <p style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
              {analytics?.totalOrders || 0}
            </p>
          </div>
        </div>

        {/* Заказы по статусам */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', marginBottom: 14 }}>
            Заказы по статусам
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock style={{ width: 14, height: 14, color: '#FFC107' }} strokeWidth={2.5} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Ожидают</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#FFC107', marginLeft: 'auto' }}>
                {(analytics?.ordersByStatus?.pending || 0) + (analytics?.ordersByStatus?.confirmed || 0)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package style={{ width: 14, height: 14, color: '#2196F3' }} strokeWidth={2.5} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Готовятся</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#2196F3', marginLeft: 'auto' }}>
                {analytics?.ordersByStatus?.preparing || 0}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle style={{ width: 14, height: 14, color: '#4CAF50' }} strokeWidth={2.5} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Доставлено</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#4CAF50', marginLeft: 'auto' }}>
                {analytics?.ordersByStatus?.delivered || 0}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle style={{ width: 14, height: 14, color: '#EF4444' }} strokeWidth={2.5} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Отменено</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#EF4444', marginLeft: 'auto' }}>
                {analytics?.ordersByStatus?.cancelled || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Показатели */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', marginBottom: 14 }}>
            Показатели
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Средний чек */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Средний чек</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#F4A261' }}>
                {analytics?.avgOrderValue || 0}₽
              </span>
            </div>

            {/* Товары */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Активных / Всего товаров</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF' }}>
                {analytics?.activeProducts || 0} / {analytics?.totalProducts || 0}
              </span>
            </div>

            {/* Выполнено заказов */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Выполнено заказов</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#4CAF50' }}>
                {analytics?.completedOrders || 0}
              </span>
            </div>

            {/* Рейтинг */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Рейтинг</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star style={{ width: 15, height: 15, color: '#FFC107', fill: '#FFC107' }} strokeWidth={0} />
                <span style={{ fontSize: 15, fontWeight: 900, color: '#FFC107' }}>
                  {(analytics?.rating || 0).toFixed(1)}
                </span>
                <span style={{ fontSize: 12, color: '#64748B' }}>({analytics?.reviewsCount || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Топ товары */}
        {analytics?.topProducts && analytics.topProducts.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Trophy style={{ width: 18, height: 18, color: '#FFC107' }} strokeWidth={2.5} />
              <h2 style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF' }}>
                Топ продаваемые товары
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analytics.topProducts.map((product: { id: string; name: string; totalSold: number; price: number }, index: number) => (
                <div key={product.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  padding: '8px 10px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 10,
                }}>
                  <span style={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: 8,
                    background: index === 0 ? 'linear-gradient(135deg, #FFC107, #FF9800)' 
                      : index === 1 ? 'linear-gradient(135deg, #9E9E9E, #757575)'
                      : index === 2 ? 'linear-gradient(135deg, #CD7F32, #A0522D)'
                      : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#FFFFFF',
                  }}>
                    {index + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      fontSize: 13, 
                      fontWeight: 700, 
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#64748B' }}>{product.price}₽</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#F4A261' }}>{product.totalSold}</p>
                    <p style={{ fontSize: 10, color: '#64748B' }}>продано</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
