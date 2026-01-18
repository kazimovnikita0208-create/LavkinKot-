'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Package,
  Clock,
  Award,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

interface DayStat {
  day: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export default function PartnerAnalyticsPage() {
  const router = useRouter();
  
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Статистика по дням (для графика)
  const weekStats: DayStat[] = [
    { day: 'Пн', revenue: 12500, orders: 45 },
    { day: 'Вт', revenue: 15300, orders: 52 },
    { day: 'Ср', revenue: 18200, orders: 61 },
    { day: 'Чт', revenue: 16800, orders: 58 },
    { day: 'Пт', revenue: 21000, orders: 72 },
    { day: 'Сб', revenue: 25400, orders: 89 },
    { day: 'Вс', revenue: 22600, orders: 78 },
  ];

  // Топ товары
  const topProducts: TopProduct[] = [
    { name: 'Багет французский', sales: 156, revenue: 18720 },
    { name: 'Круассан с шоколадом', sales: 142, revenue: 12070 },
    { name: 'Хлеб Бородинский', sales: 98, revenue: 9310 },
    { name: 'Булочка с корицей', sales: 87, revenue: 6090 },
    { name: 'Торт Наполеон', sales: 23, revenue: 19550 },
  ];

  const maxRevenue = Math.max(...weekStats.map(s => s.revenue));

  // Суммарная статистика
  const totalRevenue = weekStats.reduce((sum, s) => sum + s.revenue, 0);
  const totalOrders = weekStats.reduce((sum, s) => sum + s.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

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
            onClick={() => router.push('/partner')}
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
            Аналитика
          </h1>

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
        
        {/* Переключатель периода */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setPeriod('week')}
            style={{
              flex: 1,
              background: period === 'week'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: period === 'week' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '10px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: period === 'week' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Неделя
            </span>
          </button>

          <button
            onClick={() => setPeriod('month')}
            style={{
              flex: 1,
              background: period === 'month'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: period === 'month' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '10px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: period === 'month' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Месяц
            </span>
          </button>

          <button
            onClick={() => setPeriod('year')}
            style={{
              flex: 1,
              background: period === 'year'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: period === 'year' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '10px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: period === 'year' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Год
            </span>
          </button>
        </div>

        {/* Основная статистика */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}>
          {/* Выручка */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(69, 160, 73, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 14,
            padding: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Выручка
            </p>
            <p style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#4CAF50',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {totalRevenue.toLocaleString()}₽
            </p>
          </div>

          {/* Заказы */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 14,
            padding: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Заказов
            </p>
            <p style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#F4A261',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {totalOrders}
            </p>
          </div>

          {/* Средний чек */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: 14,
            padding: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(33, 150, 243, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <TrendingUp style={{ width: 20, height: 20, color: '#2196F3' }} strokeWidth={2.5} />
            </div>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Средний чек
            </p>
            <p style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#2196F3',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {Math.round(avgOrderValue)}₽
            </p>
          </div>

          {/* Рейтинг */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 160, 0, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: 14,
            padding: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(255, 193, 7, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Star style={{ width: 20, height: 20, color: '#FFC107', fill: '#FFC107' }} strokeWidth={2.5} />
            </div>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Рейтинг
            </p>
            <p style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#FFC107',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              4.8
            </p>
          </div>
        </div>

        {/* График выручки */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Выручка по дням
          </h2>

          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between',
            height: 160,
            gap: 8,
            paddingTop: 10,
          }}>
            {weekStats.map((stat, idx) => {
              const heightPercent = (stat.revenue / maxRevenue) * 100;
              return (
                <div 
                  key={idx}
                  style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, #F4A261 0%, #E89551 100%)',
                    borderRadius: '6px 6px 0 0',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 -2px 12px rgba(244, 162, 97, 0.3)',
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#F4A261',
                      whiteSpace: 'nowrap',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {(stat.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#94A3B8',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {stat.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Топ товары */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 18,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Award style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            <h2 style={{
              fontSize: 16,
              fontWeight: 900,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Топ товары
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topProducts.map((product, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(26, 47, 58, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.15)',
                  borderRadius: 12,
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: idx === 0 
                    ? 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)' 
                    : idx === 1
                    ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
                    : idx === 2
                    ? 'linear-gradient(135deg, #FF9E80 0%, #FF6E40 100%)'
                    : 'rgba(45, 79, 94, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: idx < 3 ? '#1A2F3A' : '#94A3B8',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {idx + 1}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {product.name}
                  </p>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#94A3B8',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {product.sales} продаж
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: '#F4A261',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {product.revenue.toLocaleString()}₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
