'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  Phone,
  Loader2,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, useMySubscription } from '@/hooks';
import { Order } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, login } = useAuth();
  const { orders, isLoading: ordersLoading } = useOrders({ limit: 5 });
  const [loginAttempting, setLoginAttempting] = useState(false);
  const { subscription, isLoading: subLoading } = useMySubscription();

  // Активные заказы (не доставлены и не отменены)
  const activeOrders = orders.filter(
    order => !['delivered', 'cancelled'].includes(order.status)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'in_transit':
      case 'delivering':
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
      case 'delivering':
        return <Truck style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      case 'cancelled':
        return <XCircle style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      default:
        return <Package style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'pending': 'Ожидает',
      'confirmed': 'Подтверждён',
      'preparing': 'Готовится',
      'ready': 'Готов',
      'delivering': 'В пути',
      'in_transit': 'В пути',
      'delivered': 'Доставлен',
      'cancelled': 'Отменён',
    };
    return texts[status] || status;
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

  // Показываем загрузку
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1A2F3A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Loader2 className="animate-spin-custom" style={{ width: 48, height: 48, color: '#F4A261' }} />
      </div>
    );
  }

  // Если пользователь не авторизован
  if (!isAuthenticated || !user) {
    const isDev = process.env.NODE_ENV === 'development';
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        position: 'relative',
      }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <header style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => router.push('/')}
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
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Профиль</h1>
            <div style={{ width: 40 }} />
          </div>
        </header>

        <main style={{ 
          position: 'relative', 
          zIndex: 10, 
          padding: '60px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(244, 162, 97, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <LogIn style={{ width: 40, height: 40, color: '#F4A261' }} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
            Войдите через Telegram
          </h2>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 32, lineHeight: 1.5 }}>
            Откройте приложение через Telegram бота,<br />чтобы авторизоваться
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {/* Кнопка принудительного входа через Telegram initData */}
            <button
              onClick={async () => {
                setLoginAttempting(true);
                try {
                  let initData = '';
                  // Ждём до 2 секунд
                  for (let i = 0; i < 8; i++) {
                    initData = (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) || '';
                    if (initData) break;
                    await new Promise(r => setTimeout(r, 250));
                  }
                  if (initData) {
                    await login(initData);
                  } else {
                    alert('Откройте приложение через бота в Telegram');
                  }
                } finally {
                  setLoginAttempting(false);
                }
              }}
              disabled={loginAttempting}
              style={{
                background: loginAttempting
                  ? 'rgba(244, 162, 97, 0.5)'
                  : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: 14,
                border: 'none',
                cursor: loginAttempting ? 'default' : 'pointer',
                fontWeight: 800,
                fontSize: 15,
                width: '100%',
                maxWidth: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loginAttempting
                ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Входим...</>
                : 'Войти через Telegram'}
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#94A3B8',
                padding: '12px 32px',
                borderRadius: 14,
                border: '1px solid rgba(148, 163, 184, 0.2)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                width: '100%',
                maxWidth: 280,
              }}
            >
              На главную
            </button>

            {isDev && (
              <button
                onClick={() => router.push('/dev-login')}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#FCA5A5',
                  padding: '12px 32px',
                  borderRadius: 14,
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 13,
                  width: '100%',
                  maxWidth: 280,
                }}
              >
                🔧 Войти для разработки
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  const daysLeft = subscription?.expires_at ? getDaysUntilExpiry(subscription.expires_at) : 0;

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            onClick={() => router.push('/')}
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

          <h1 
            onClick={() => router.push('/role-select')}
            style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', cursor: 'pointer' }}
          >
            Профиль
          </h1>

          <button
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 100px' }}>
        
        {/* Информация о пользователе */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(244, 162, 97, 0.3)',
            }}>
              <User style={{ width: 28, height: 28, color: '#F4A261' }} strokeWidth={2} />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
                @{user.username || 'user'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {user.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244, 162, 97, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>Телефон</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{user.phone}</p>
                </div>
              </div>
            )}

            {user.default_street && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244, 162, 97, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>Адрес доставки</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                    {user.default_street}, д. {user.default_house}{user.default_apartment ? `, кв. ${user.default_apartment}` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Подписка */}
        <button
          onClick={() => router.push('/profile/subscription')}
          style={{
            width: '100%',
            background: subscription 
              ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.15) 0%, rgba(232, 149, 81, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: subscription 
              ? '0 4px 16px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.3)'
              : '0 4px 16px rgba(0,0,0,0.25)',
            marginBottom: 20,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {subLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <Loader2 className="animate-spin-custom" style={{ width: 24, height: 24, color: '#F4A261' }} />
            </div>
          ) : subscription ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
                    Подписка {subscription.plan?.name || 'Активна'}
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
                  }}>
                    {subscription.status === 'active' ? 'Активна' : 'Истекла'}
                  </span>
                  <ChevronRight style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#B8C5D0', fontWeight: 600 }}>Осталось доставок</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#F4A261' }}>
                  {subscription.deliveries_remaining} из {subscription.deliveries_remaining + subscription.deliveries_used}
                </span>
              </div>

              <div style={{
                width: '100%',
                height: 6,
                backgroundColor: 'rgba(26, 47, 58, 0.5)',
                borderRadius: 3,
                overflow: 'hidden',
                marginBottom: 12,
              }}>
                <div style={{
                  width: `${(subscription.deliveries_remaining / (subscription.deliveries_remaining + subscription.deliveries_used)) * 100}%`,
                  height: '100%',
                  background: subscription.deliveries_remaining <= 2 
                    ? 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)'
                    : 'linear-gradient(90deg, #F4A261 0%, #E89551 100%)',
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar style={{ width: 14, height: 14, color: '#94A3B8' }} strokeWidth={2} />
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                  Истекает {formatDate(subscription.expires_at)} ({daysLeft} дн.)
                </span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
                  Оформить подписку
                </span>
              </div>
              <ChevronRight style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
          )}
        </button>

        {/* Активные заказы */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
            Активные заказы
          </h3>

          {ordersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
              <Loader2 className="animate-spin-custom" style={{ width: 24, height: 24, color: '#F4A261' }} />
            </div>
          ) : activeOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => router.push(`/order/${order.id}`)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                    borderRadius: 14,
                    padding: 14,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                        {order.shop?.name || 'Заказ'}
                      </h4>
                      <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                        Заказ #{order.order_number}
                      </p>
                    </div>
                    <ChevronRight style={{ width: 18, height: 18, color: '#94A3B8' }} strokeWidth={2} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock style={{ width: 12, height: 12, color: '#94A3B8' }} strokeWidth={2} />
                      <span style={{ fontSize: 11, color: '#B8C5D0', fontWeight: 600 }}>
                        {new Date(order.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Package style={{ width: 12, height: 12, color: '#94A3B8' }} strokeWidth={2} />
                      <span style={{ fontSize: 11, color: '#B8C5D0', fontWeight: 600 }}>
                        {order.order_items?.length || 0} товаров
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      <span style={{ fontSize: 11, fontWeight: 700, color: getStatusColor(order.status) }}>
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <span style={{ fontSize: 16, fontWeight: 900, color: '#F4A261' }}>
                      {Number(order.total).toFixed(2)} ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
              borderRadius: 14,
              padding: 24,
              textAlign: 'center',
            }}>
              <Package style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
              <p style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
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
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
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
            }}>
              <Clock style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
                История заказов
              </h4>
              <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                Все завершенные заказы
              </p>
            </div>
          </div>
          <ChevronRight style={{ width: 20, height: 20, color: '#94A3B8' }} strokeWidth={2} />
        </button>

        {/* Юридические документы */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 0', borderTop: '1px solid rgba(244, 162, 97, 0.1)' }}>
          <button onClick={() => router.push('/privacy')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>Политика конфиденциальности</span>
          </button>
          <button onClick={() => router.push('/terms')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>Пользовательское соглашение</span>
          </button>
          <p style={{ fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 8 }}>
            © 2026 ЛавкинКот. Все права защищены.
          </p>
        </div>
      </main>

    </div>
  );
}
