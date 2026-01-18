'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Settings,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function PartnerPage() {
  const router = useRouter();

  // Mock данные магазина партнера
  const shopStats = {
    shopName: 'Пекарня "Хлебница"',
    todayOrders: 24,
    todayRevenue: 12450,
    rating: 4.8,
    activeProducts: 48,
    avgDeliveryTime: '25 мин',
  };

  const menuItems = [
    { 
      id: 'products', 
      title: 'Товары', 
      subtitle: `${shopStats.activeProducts} активных`,
      icon: Package, 
      color: '#F4A261',
      path: '/partner/products'
    },
    { 
      id: 'orders', 
      title: 'Заказы', 
      subtitle: `${shopStats.todayOrders} сегодня`,
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
      
      {/* Анимированный фон */}
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
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 79, 94, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(45, 79, 94, 0.5)';
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Панель партнёра
          </h1>

          {/* Логотип */}
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'drop-shadow(0 2px 8px rgba(244, 162, 97, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(244, 162, 97, 0.2))';
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="ЛавкинКот" 
              style={{ 
                height: 48,
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Название магазина */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(244, 162, 97, 0.3)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
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
              boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4)',
            }}>
              🏪
            </div>
            <div>
              <h2 style={{
                fontSize: 20,
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 4,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {shopStats.shopName}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star style={{ width: 14, height: 14, color: '#FFD700', fill: '#FFD700' }} strokeWidth={0} />
                <span style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {shopStats.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}>
          {/* Выручка сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
          }}>
            <DollarSign style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {shopStats.todayRevenue.toLocaleString('ru-RU')}₽
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Выручка сегодня
            </p>
          </div>

          {/* Заказы сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <Package style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {shopStats.todayOrders}
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Заказов сегодня
            </p>
          </div>

          {/* Товаров */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <Store style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {shopStats.activeProducts}
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Активных товаров
            </p>
          </div>

          {/* Среднее время */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <Clock style={{ width: 24, height: 24, color: '#4CAF50', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {shopStats.avgDeliveryTime}
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Среднее время
            </p>
          </div>
        </div>

        {/* Меню разделов */}
        <h2 style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: 16,
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
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
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(244, 162, 97, 0.2)',
                  borderRadius: 16,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)';
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
                      <h3 style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        marginBottom: 2,
                        letterSpacing: '-0.01em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        fontSize: 12,
                        color: '#94A3B8',
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {item.subtitle}
                      </p>
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
