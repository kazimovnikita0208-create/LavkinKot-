'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  Store,
  MessageCircle
} from 'lucide-react';

export default function OrderPage() {
  const router = useRouter();

  // Mock данные заказа
  const order = {
    id: '1',
    orderNumber: '123456',
    shop: {
      name: 'Пекарня "Хлебный Дом"',
      phone: '+7 (900) 111-22-33',
    },
    status: 'in_transit' as const,
    statusText: 'В пути',
    createdAt: '2026-01-15T10:30:00',
    estimatedDelivery: '12:00 - 14:00',
    total: 1613.20,
    deliveryAddress: 'ул. Примерная, д. 10, кв. 5',
    deliveryComment: 'Оставить у двери',
    courier: {
      name: 'Иван Петров',
      phone: '+7 (900) 999-88-77',
    },
    items: [
      {
        id: '1',
        name: 'Круассан классический',
        quantity: 3,
        price: 150,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop&q=80',
      },
      {
        id: '2',
        name: 'Багет французский',
        quantity: 2,
        price: 200,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&q=80',
      },
    ],
    timeline: [
      { status: 'created', text: 'Заказ создан', time: '10:30', completed: true },
      { status: 'accepted', text: 'Принят магазином', time: '10:32', completed: true },
      { status: 'preparing', text: 'Готовится', time: '10:35', completed: true },
      { status: 'ready', text: 'Готов к выдаче', time: '11:15', completed: true },
      { status: 'picked_up', text: 'Забрал курьер', time: '11:20', completed: true },
      { status: 'in_transit', text: 'В пути к вам', time: '11:25', completed: true },
      { status: 'delivered', text: 'Доставлен', time: '', completed: false },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'in_transit':
      case 'picked_up':
        return '#F4A261';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
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
            Заказ #{order.orderNumber}
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
        
        {/* Статус заказа */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.15) 0%, rgba(232, 149, 81, 0.1) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.3)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `${getStatusColor(order.status)}20`,
            border: `2px solid ${getStatusColor(order.status)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Truck style={{ width: 28, height: 28, color: getStatusColor(order.status) }} strokeWidth={2.5} />
          </div>

          <h2 style={{
            fontSize: 18,
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: 6,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            {order.statusText}
          </h2>

          <p style={{
            fontSize: 13,
            color: '#B8C5D0',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Ожидаемое время доставки: {order.estimatedDelivery}
          </p>
        </div>

        {/* Таймлайн */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Статус заказа
          </h3>

          <div style={{ position: 'relative' }}>
            {order.timeline.map((step, index) => (
              <div
                key={step.status}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: index < order.timeline.length - 1 ? 16 : 0,
                  position: 'relative',
                }}
              >
                {/* Линия */}
                {index < order.timeline.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: 11,
                    top: 28,
                    width: 2,
                    height: 'calc(100% + 4px)',
                    background: step.completed 
                      ? 'linear-gradient(180deg, #F4A261 0%, rgba(244, 162, 97, 0.3) 100%)'
                      : 'rgba(148, 163, 184, 0.2)',
                  }} />
                )}

                {/* Иконка */}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: step.completed 
                    ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                    : 'rgba(148, 163, 184, 0.2)',
                  border: step.completed ? '2px solid rgba(244, 162, 97, 0.3)' : '2px solid rgba(148, 163, 184, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: step.completed ? '0 0 12px rgba(244, 162, 97, 0.4)' : 'none',
                }}>
                  {step.completed && (
                    <CheckCircle style={{ width: 14, height: 14, color: '#1A2F3A' }} strokeWidth={3} />
                  )}
                </div>

                {/* Текст */}
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <p style={{
                    fontSize: 13,
                    fontWeight: step.completed ? 700 : 600,
                    color: step.completed ? '#FFFFFF' : '#94A3B8',
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {step.text}
                  </p>
                  {step.time && (
                    <p style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {step.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Информация о курьере */}
        {order.courier && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
            marginBottom: 16,
          }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: 12,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Курьер
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <User style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
              </div>

              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginBottom: 2,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {order.courier.name}
                </p>
                <p style={{
                  fontSize: 12,
                  color: '#94A3B8',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {order.courier.phone}
                </p>
              </div>
            </div>

            <button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                color: '#FFFFFF',
                padding: '10px 16px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(244,162,97,0.3)',
                transition: 'all 0.2s ease',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(244,162,97,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(244,162,97,0.3)';
              }}
            >
              <Phone style={{ width: 16, height: 16 }} strokeWidth={2.5} />
              Позвонить курьеру
            </button>
          </div>
        )}

        {/* Адрес доставки */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Адрес доставки
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(244, 162, 97, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MapPin style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.4,
                marginBottom: 4,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {order.deliveryAddress}
              </p>
              {order.deliveryComment && (
                <p style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  💬 {order.deliveryComment}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Товары в заказе */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Товары ({order.items.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 12,
                  background: 'rgba(26, 47, 58, 0.4)',
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.9) 0%, rgba(38, 73, 92, 0.7) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {item.quantity} × {item.price} ₽
                  </p>
                </div>

                <span style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#F4A261',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {(item.quantity * item.price).toFixed(2)} ₽
                </span>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Итого
            </span>
            <span style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#F4A261',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {order.total.toFixed(2)} ₽
            </span>
          </div>
        </div>

        {/* Информация о магазине */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Магазин
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Store style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: 2,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {order.shop.name}
              </p>
              <p style={{
                fontSize: 12,
                color: '#94A3B8',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {order.shop.phone}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
