'use client';

import { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function AdminPage() {
  const router = useRouter();

  // Mock статистика
  const stats = {
    totalUsers: 1247,
    totalOrders: 3589,
    totalRevenue: 2567890,
    activePartners: 4, // Новые заявки от партнёров
    activeCouriers: 28,
    todayOrders: 127,
  };

  const menuItems = [
    { 
      id: 'users', 
      title: 'Пользователи', 
      subtitle: `${stats.totalUsers} активных`,
      icon: Users, 
      color: '#F4A261',
      path: '/admin/users'
    },
    { 
      id: 'partners', 
      title: 'Заявки от партнёров', 
      subtitle: `${stats.activePartners} новых заявок`,
      icon: Store, 
      color: '#F4A261',
      path: '/admin/partners'
    },
    { 
      id: 'couriers', 
      title: 'Курьеры', 
      subtitle: `${stats.activeCouriers} на линии`,
      icon: Truck, 
      color: '#F4A261',
      path: '/admin/couriers'
    },
    { 
      id: 'orders', 
      title: 'Заказы', 
      subtitle: `${stats.todayOrders} сегодня`,
      icon: Package, 
      color: '#F4A261',
      path: '/admin/orders'
    },
    { 
      id: 'analytics', 
      title: 'Аналитика', 
      subtitle: 'Отчеты и статистика',
      icon: BarChart3, 
      color: '#F4A261',
      path: '/admin/analytics'
    },
    { 
      id: 'settings', 
      title: 'Настройки', 
      subtitle: 'Конфигурация системы',
      icon: Settings, 
      color: '#F4A261',
      path: '/admin/settings'
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
            Админ панель
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
        
        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}>
          {/* Выручка */}
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
              {(stats.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Выручка
            </p>
          </div>

          {/* Заказы */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <ShoppingBag style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.totalOrders}
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Всего заказов
            </p>
          </div>

          {/* Пользователи */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <Users style={{ width: 24, height: 24, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.totalUsers}
            </p>
            <p style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Пользователей
            </p>
          </div>

          {/* Сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <TrendingUp style={{ width: 24, height: 24, color: '#4CAF50', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 4,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.todayOrders}
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
          Управление
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
