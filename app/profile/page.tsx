'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Package,
  ChevronRight,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Truck,
  Phone
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  // Mock данные пользователя
  const user = {
    firstName: 'Никита',
    lastName: 'Иванов',
    phone: '+7 (900) 123-45-67',
    telegramUsername: '@nikita_user',
    defaultAddress: 'ул. Примерная, д. 10, кв. 5',
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
    },
  };

  // Mock данные подписки
  const subscription = {
    plan: 'Стандарт',
    deliveriesRemaining: 3,
    totalDeliveries: 5,
    expiresAt: '2026-02-15',
    status: 'active' as 'active' | 'expired',
  };

  // Mock данные заказов
  const allOrders = [
    {
      id: '1',
      orderNumber: '123456',
      shop: 'Пекарня "Хлебный Дом"',
      date: '2026-01-15',
      time: '12:00',
      total: 1613.20,
      status: 'in_transit' as const,
      statusText: 'В пути',
      items: 3,
    },
    {
      id: '2',
      orderNumber: '123455',
      shop: 'Магазин "Продукты"',
      date: '2026-01-14',
      time: '18:30',
      total: 2450.00,
      status: 'preparing' as const,
      statusText: 'Готовится',
      items: 5,
    },
  ];

  // Активные заказы (не доставлены)
  const activeOrders = allOrders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'in_transit':
        return '#F4A261';
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
      case 'in_transit':
        return <Truck style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      case 'cancelled':
        return <XCircle style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      default:
        return <Package style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric' 
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiry(subscription.expiresAt);

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
            onClick={() => router.push('/')}
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

          <h1 
            onClick={() => router.push('/role-select')}
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F4A261';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            Профиль
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
        
        {/* Информация о пользователе */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          marginBottom: 16,
        }}>
          {/* Заголовок с аватаром */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(244, 162, 97, 0.3)',
            }}>
              <User style={{ width: 28, height: 28, color: '#F4A261' }} strokeWidth={2} />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: 4,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {user.firstName} {user.lastName}
              </h2>
              <p style={{
                fontSize: 13,
                color: '#94A3B8',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {user.telegramUsername}
              </p>
            </div>
          </div>

          {/* Детальная информация */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Телефон */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                <Phone style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  fontWeight: 600,
                  marginBottom: 2,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Телефон
                </p>
                <p style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {user.phone}
                </p>
              </div>
            </div>

            {/* Адрес */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  fontSize: 11,
                  color: '#94A3B8',
                  fontWeight: 600,
                  marginBottom: 2,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Адрес доставки
                </p>
                <p style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {user.defaultAddress}
                </p>
              </div>
            </div>

            {/* Способ оплаты */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                <CreditCard style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  fontWeight: 600,
                  marginBottom: 2,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Способ оплаты
                </p>
                <p style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {user.paymentMethod.brand} •••• {user.paymentMethod.last4}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Подписка */}
        <button
          onClick={() => router.push('/profile/subscription')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.15) 0%, rgba(232, 149, 81, 0.1) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.3)',
            marginBottom: 20,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.3), 0 0 0 1px rgba(244, 162, 97, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.3)';
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
              <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Подписка {subscription.plan}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: subscription.status === 'active' ? '#4CAF50' : '#EF4444',
                backgroundColor: subscription.status === 'active' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                padding: '4px 8px',
                borderRadius: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {subscription.status === 'active' ? 'Активна' : 'Истекла'}
              </span>
              <ChevronRight style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <span style={{
              fontSize: 12,
              color: '#B8C5D0',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Осталось доставок
            </span>
            <span style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#F4A261',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {subscription.deliveriesRemaining} из {subscription.totalDeliveries}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: 6,
            backgroundColor: 'rgba(26, 47, 58, 0.5)',
            borderRadius: 3,
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            <div style={{
              width: `${(subscription.deliveriesRemaining / subscription.totalDeliveries) * 100}%`,
              height: '100%',
              background: subscription.deliveriesRemaining <= 2 
                ? 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)'
                : 'linear-gradient(90deg, #F4A261 0%, #E89551 100%)',
              transition: 'width 0.3s ease',
            }} />
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 6,
          }}>
            <Calendar style={{ width: 14, height: 14, color: '#94A3B8' }} strokeWidth={2} />
            <span style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Истекает {formatDate(subscription.expiresAt)} ({daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'})
            </span>
          </div>

          {subscription.deliveriesRemaining <= 2 && (
            <div style={{
              marginTop: 12,
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}>
              <p style={{
                fontSize: 11,
                color: '#FCA5A5',
                fontWeight: 600,
                lineHeight: 1.4,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                ⚠️ У вас осталось мало доставок. Продлите подписку, чтобы не переплачивать.
              </p>
            </div>
          )}
        </button>

        {/* Активные заказы */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Активные заказы
          </h3>

          {activeOrders.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 10,
            }}>
              {activeOrders.map((order) => (
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
              padding: 24,
              boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
              textAlign: 'center',
            }}>
              <Package style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
              <p style={{
                fontSize: 14,
                color: '#94A3B8',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Нет активных заказов
              </p>
            </div>
          )}
        </div>

        {/* Кнопка истории заказов */}
        <button
          onClick={() => router.push('/profile/orders')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(244, 162, 97, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Clock style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: 2,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                История заказов
              </h4>
              <p style={{
                fontSize: 12,
                color: '#94A3B8',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Все завершенные заказы
              </p>
            </div>
          </div>
          <ChevronRight style={{ width: 20, height: 20, color: '#94A3B8' }} strokeWidth={2} />
        </button>

      </main>
    </div>
  );
}
