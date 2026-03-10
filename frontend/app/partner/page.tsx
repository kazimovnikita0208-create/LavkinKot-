'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Store,
  Package,
  DollarSign,
  Settings,
  BarChart3,
  Clock,
  Star,
  Loader2
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerShop, usePartnerAnalytics } from '@/hooks';

export default function PartnerPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { shop, isLoading: shopLoading } = usePartnerShop();
  const { analytics, isLoading: analyticsLoading } = usePartnerAnalytics();

  // Проверка роли
  if (!authLoading && user?.role !== 'partner') {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <AnimatedBackground />
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}>
          <h2 style={{ color: '#EF4444', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            Доступ запрещён
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>
            Эта страница доступна только партнёрам
          </p>
          <button
            onClick={() => router.push('/profile')}
            style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Вернуться в профиль
          </button>
        </div>
      </div>
    );
  }

  const isLoading = authLoading || shopLoading || analyticsLoading;

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

  const menuItems = [
    { 
      id: 'products', 
      title: 'Товары', 
      subtitle: `${analytics?.activeProducts || 0} активных`,
      icon: Package, 
      color: '#F4A261',
      path: '/partner/products'
    },
    { 
      id: 'orders', 
      title: 'Заказы', 
      subtitle: `${analytics?.todayOrdersCount || 0} сегодня`,
      icon: Store, 
      color: '#F4A261',
      path: '/partner/orders'
    },
    { 
      id: 'analytics', 
      title: 'Аналитика', 
      subtitle: 'Отчеты и статистика',
      icon: BarChart3, 
      color: '#F4A261',
      path: '/partner/analytics'
    },
    { 
      id: 'settings', 
      title: 'Настройки магазина', 
      subtitle: 'Конфигурация',
      icon: Settings, 
      color: '#F4A261',
      path: '/partner/settings'
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
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/profile')}
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

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
            Панель партнёра
          </h1>

          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Название магазина */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.3)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              overflow: 'hidden',
            }}>
              {shop?.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shop.image_url} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : '🏪'}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
                {shop?.name || 'Мой магазин'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star style={{ width: 14, height: 14, color: '#FFD700', fill: '#FFD700' }} strokeWidth={0} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
                  {analytics?.rating?.toFixed(1) || '0.0'}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>
                  ({analytics?.reviewsCount || 0} отзывов)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          {/* Выручка сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 16,
            padding: 16,
          }}>
            <DollarSign style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
              {(analytics?.todayRevenue || 0).toLocaleString('ru-RU')}₽
            </p>
            <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Выручка сегодня</p>
          </div>

          {/* Заказы сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
          }}>
            <Package style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
              {analytics?.todayOrdersCount || 0}
            </p>
            <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Заказов сегодня</p>
          </div>

          {/* Товаров */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
          }}>
            <Store style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
              {analytics?.activeProducts || 0}
            </p>
            <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Активных товаров</p>
          </div>

          {/* Средний чек */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
          }}>
            <Clock style={{ width: 24, height: 24, color: '#4CAF50', marginBottom: 8 }} strokeWidth={2} />
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
              {analytics?.avgOrderValue || 0}₽
            </p>
            <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Средний чек</p>
          </div>
        </div>

        {/* Меню разделов */}
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
          Управление магазином
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                  border: '1px solid rgba(244, 162, 97, 0.2)',
                  borderRadius: 16,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)',
                      border: '1px solid rgba(244, 162, 97, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 24, height: 24, color: item.color }} strokeWidth={2} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>{item.title}</h3>
                      <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{item.subtitle}</p>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
