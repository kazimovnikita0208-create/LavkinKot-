'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Package, Clock, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useMySubscription } from '@/hooks';
import { ordersApi, Order } from '@/lib/api';

function OrderConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, refetch: refetchSubscription } = useMySubscription();
  
  const confirmationType = searchParams.get('type') || 'order';
  const orderId = searchParams.get('orderId') || '';
  const returnUrl = searchParams.get('returnUrl') || '';
  const isBatch = searchParams.get('batch') === 'true';
  const orderIds = searchParams.get('orderIds') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [batchOrders, setBatchOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(confirmationType === 'order');
  
  useEffect(() => {
    if (confirmationType === 'subscription') {
      refetchSubscription();
      setIsLoading(false);
    }
  }, [confirmationType, refetchSubscription]);

  useEffect(() => {
    if (confirmationType !== 'order') return;

    const fetchOrders = async () => {
      try {
        if (isBatch && orderIds) {
          const ids = orderIds.split(',').filter(Boolean);
          const results = await Promise.all(ids.map(id => ordersApi.getOrderById(id)));
          setBatchOrders(results.filter(r => r.success && r.data).map(r => r.data as Order));
        } else if (orderId) {
          const response = await ordersApi.getOrderById(orderId);
          if (response.success && response.data) setOrder(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [confirmationType, orderId, isBatch, orderIds]);

  // Если пришли с checkout и купили подписку - показываем кнопку возврата
  const showReturnToCheckout = returnUrl === '/checkout';

  const handleMainAction = () => {
    if (showReturnToCheckout) {
      router.push('/checkout');
    } else {
      router.push('/');
    }
  };

  // Форматирование даты доставки
  const formatDeliveryDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

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
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="ЛавкинКот" 
              style={{ height: 48, width: 'auto', objectFit: 'contain' }} 
            />
          </button>
        </div>
      </header>
      
      {/* MAIN CONTENT */}
      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '16px',
      }}>
        
        {/* Иконка успеха */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(67, 160, 71, 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3), 0 0 0 1px rgba(76, 175, 80, 0.2)',
          }}>
            <CheckCircle style={{ width: 44, height: 44, color: '#4CAF50' }} strokeWidth={2} />
          </div>
        </div>

        {/* Заголовок */}
        <h1 style={{
          fontSize: 24,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: '-0.02em',
        }}>
          {confirmationType === 'subscription' ? 'Подписка оформлена!' : 'Заказ оформлен!'}
        </h1>

        {/* Подзаголовок */}
        <p style={{
          fontSize: 14,
          color: '#B8C5D0',
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 1.4,
          fontWeight: 500,
        }}>
          {confirmationType === 'subscription' 
            ? 'Спасибо! Ваша подписка активирована' 
            : 'Спасибо за заказ! Мы уже начали его готовить'}
        </p>

        {/* Информация о подписке */}
        {confirmationType === 'subscription' && subscription && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: 16,
              padding: 18,
              boxShadow: '0 6px 24px rgba(244, 162, 97, 0.3), 0 0 0 1px rgba(244, 162, 97, 0.3)',
              marginBottom: 16,
            }}>
              {/* Название подписки */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: 14,
                paddingBottom: 14,
                borderBottom: '1px solid rgba(244, 162, 97, 0.2)',
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Sparkles style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Подписка
                  </span>
                </div>
                <span style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#F4A261',
                  letterSpacing: '-0.02em',
                  display: 'block',
                }}>
                  {subscription.plan?.name || 'Активная'}
                </span>
              </div>

              {/* Детали подписки */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Доставки */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Package style={{ width: 18, height: 18, color: '#4CAF50' }} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 3 }}>
                      Бесплатные доставки
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF' }}>
                      {subscription.deliveries_remaining} доставок
                    </span>
                  </div>
                </div>

                {/* Срок действия */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(244, 162, 97, 0.2)',
                    border: '1px solid rgba(244, 162, 97, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Clock style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 3 }}>
                      Действует до
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                      {subscription.expires_at 
                        ? new Date(subscription.expires_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Бессрочно'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Информация о подписке */}
            <div style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(76, 175, 80, 0.15)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              marginBottom: 16,
            }}>
              <p style={{
                fontSize: 12,
                color: '#81C784',
                textAlign: 'center',
                fontWeight: 600,
                lineHeight: 1.5,
              }}>
                ✨ Подписка активна! Используйте бесплатные доставки в любое время
              </p>
            </div>
          </>
        )}

        {/* Batch-заказ: несколько магазинов */}
        {confirmationType === 'order' && isBatch && batchOrders.length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {batchOrders.map((bOrder, idx) => (
                <div key={bOrder.id} style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                      Магазин {idx + 1}{idx === 0 ? ' · включает доставку' : ' · доставка включена'}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#F4A261' }}>
                      #{bOrder.order_number || bOrder.id.slice(0, 8)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#B8C5D0', fontWeight: 500 }}>Сумма</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>{bOrder.total.toFixed(2)} ₽</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 13, color: '#B8C5D0', fontWeight: 500 }}>Время</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                      {bOrder.delivery_date ? formatDeliveryDate(bOrder.delivery_date) : ''}, {bOrder.delivery_time_slot || ''}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/order/${bOrder.id}`)}
                    style={{
                      marginTop: 10, width: '100%', padding: '8px',
                      borderRadius: 10, border: '1px solid rgba(244, 162, 97, 0.3)',
                      background: 'transparent', color: '#F4A261',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Отследить →
                  </button>
                </div>
              ))}
            </div>
            <div style={{
              padding: '10px 12px', borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.1)', border: '1px solid rgba(244, 162, 97, 0.2)',
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 11, color: '#F4A261', textAlign: 'center', fontWeight: 600, lineHeight: 1.4 }}>
                💬 Каждый магазин получил свой заказ. Курьер соберёт всё за одну поездку.
              </p>
            </div>
          </>
        )}

        {/* Информация о заказе */}
        {confirmationType === 'order' && !isBatch && order && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
              marginBottom: 16,
            }}>
              {/* Номер заказа */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Номер заказа
                </span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#F4A261', letterSpacing: '-0.02em' }}>
                  #{order.order_number || order.id.slice(0, 8)}
                </span>
              </div>

              {/* Детали */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                
                {/* Сумма */}
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
                    <Package style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      Сумма заказа
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                      {order.total.toFixed(2)} ₽
                    </span>
                  </div>
                </div>

                {/* Дата доставки */}
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
                    <Clock style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      Время доставки
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
                      {order.delivery_date ? formatDeliveryDate(order.delivery_date) : 'Скоро'}, {order.delivery_time_slot || ''}
                    </span>
                  </div>
                </div>

                {/* Адрес доставки */}
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
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      Адрес доставки
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                      {order.delivery_street}, д. {order.delivery_house}, кв. {order.delivery_apartment}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Информация */}
            <div style={{
              padding: '10px 12px',
              borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.1)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              marginBottom: 16,
            }}>
              <p style={{
                fontSize: 11,
                color: '#F4A261',
                textAlign: 'center',
                fontWeight: 600,
                lineHeight: 1.4,
              }}>
                💬 Курьер свяжется с вами за 15 минут до доставки
              </p>
            </div>
          </>
        )}

        {/* Кнопки */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Кнопка на главную или возврат к оформлению */}
          <button
            onClick={handleMainAction}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              padding: '14px 20px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
              transition: 'all 0.2s ease',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Home style={{ width: 18, height: 18 }} strokeWidth={2.5} />
            {showReturnToCheckout ? 'Продолжить оформление заказа' : 'На главный экран'}
          </button>

          {/* Кнопка отследить заказ (только для одиночного заказа) */}
          {confirmationType === 'order' && !isBatch && order && (
            <button
              onClick={() => router.push(`/order/${order.id}`)}
              style={{
                width: '100%',
                background: 'rgba(45, 79, 94, 0.5)',
                backdropFilter: 'blur(12px)',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: 12,
                border: '1px solid rgba(244, 162, 97, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '-0.01em',
              }}
            >
              Отследить заказ
            </button>
          )}
        </div>
      </main>
      
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBackground />
        <div style={{ 
          color: '#F4A261', 
          fontSize: 18, 
          fontWeight: 700,
          position: 'relative',
          zIndex: 10,
        }}>
          Загрузка...
        </div>
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  );
}
