'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ChevronRight
} from 'lucide-react';

export default function OrderHistoryPage() {
  const router = useRouter();

  // Mock данные завершенных заказов
  const completedOrders = [
    {
      id: '2',
      orderNumber: '123455',
      shop: 'Магазин "Продукты"',
      date: '2026-01-14',
      time: '18:30',
      total: 2450.00,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      items: 5,
    },
    {
      id: '3',
      orderNumber: '123454',
      shop: 'Ресторан "Суши Мастер"',
      date: '2026-01-13',
      time: '20:00',
      total: 3200.00,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      items: 7,
    },
    {
      id: '4',
      orderNumber: '123453',
      shop: 'Пекарня "Хлебница"',
      date: '2026-01-12',
      time: '10:15',
      total: 890.50,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      items: 4,
    },
    {
      id: '5',
      orderNumber: '123452',
      shop: 'Фруктовый рай',
      date: '2026-01-11',
      time: '14:00',
      total: 1560.00,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      items: 6,
    },
    {
      id: '6',
      orderNumber: '123451',
      shop: 'Магазин "У дома"',
      date: '2026-01-10',
      time: '19:45',
      total: 2100.00,
      status: 'cancelled' as const,
      statusText: 'Отменен',
      items: 3,
    },
    {
      id: '7',
      orderNumber: '123450',
      shop: 'Пекарня "Хлебница"',
      date: '2026-01-09',
      time: '11:20',
      total: 750.00,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      items: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      case 'cancelled':
        return <XCircle style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      default:
        return <Package style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
    }
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(38, 73, 92, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '16px',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
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
            История заказов
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

      {/* MAIN CONTENT */}
      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '0 16px 100px',
      }}>
        
        {completedOrders.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 10,
          }}>
            {completedOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/order/${order.id}`)}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 14,
                  padding: 14,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: 4,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {order.shop}
                    </h4>
                    <p style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Заказ #{order.orderNumber}
                    </p>
                  </div>

                  <ChevronRight style={{ width: 18, height: 18, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2} />
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 12, height: 12, color: '#94A3B8' }} strokeWidth={2} />
                    <span style={{
                      fontSize: 11,
                      color: '#B8C5D0',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {order.date}, {order.time}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Package style={{ width: 12, height: 12, color: '#94A3B8' }} strokeWidth={2} />
                    <span style={{
                      fontSize: 11,
                      color: '#B8C5D0',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {order.items} {order.items === 1 ? 'товар' : order.items < 5 ? 'товара' : 'товаров'}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 6,
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    border: `1px solid ${getStatusColor(order.status)}40`,
                  }}>
                    <div style={{ color: getStatusColor(order.status) }}>
                      {getStatusIcon(order.status)}
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: getStatusColor(order.status),
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {order.statusText}
                    </span>
                  </div>

                  <span style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: '#F4A261',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.total.toFixed(2)} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 14,
            padding: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
            textAlign: 'center',
          }}>
            <Package style={{ width: 56, height: 56, color: '#94A3B8', margin: '0 auto 16px' }} strokeWidth={1.5} />
            <h3 style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: 8,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              История пуста
            </h3>
            <p style={{
              fontSize: 13,
              color: '#94A3B8',
              fontWeight: 600,
              lineHeight: 1.4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Здесь будут отображаться ваши завершенные заказы
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
