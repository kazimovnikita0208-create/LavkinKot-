'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Package, Clock, MapPin, CreditCard, Sparkles } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const planNames: { [key: string]: string } = {
  'standard': 'Стандарт',
  'plus': 'Плюс',
  'premium': 'Премиум',
};

const planDetails: { [key: string]: { deliveries: number; days: number } } = {
  'standard': { deliveries: 5, days: 30 },
  'plus': { deliveries: 7, days: 45 },
  'premium': { deliveries: 10, days: 60 },
};

function OrderConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Определяем тип подтверждения: 'subscription' или 'order'
  const confirmationType = searchParams.get('type') || 'order';
  const subscriptionPlan = searchParams.get('plan') || '';
  
  // Mock данные заказа (используются только для type=order)
  const orderNumber = '123456';
  const orderTotal = 1613.20;
  const deliveryDate = 'Завтра';
  const deliveryTime = '12:00 - 14:00';
  const deliveryAddress = 'ул. Примерная, д. 10, кв. 5';

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '16px',
      }}>
        
        {/* Иконка успеха */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 16 
        }}>
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
            <CheckCircle style={{ 
              width: 44, 
              height: 44, 
              color: '#4CAF50',
            }} strokeWidth={2} />
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          {confirmationType === 'subscription' 
            ? 'Спасибо! Ваша подписка активирована' 
            : 'Спасибо за заказ! Мы уже начали его готовить'}
        </p>

        {/* Информация о заказе/подписке */}
        {confirmationType === 'subscription' ? (
          <>
            <div style={{
              background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
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
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}>
                  <Sparkles style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {planNames[subscriptionPlan]}
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
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 3,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Бесплатные доставки
                    </span>
                    <span style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {planDetails[subscriptionPlan]?.deliveries || 0} доставок
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
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 3,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Действует
                    </span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {planDetails[subscriptionPlan]?.days || 0} дней
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
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                ✨ Подписка активна! Используйте бесплатные доставки в любое время
              </p>
            </div>
          </>
        ) : (
          <>
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
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
                <span style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Номер заказа
                </span>
                <span style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#F4A261',
                  letterSpacing: '-0.02em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  #{orderNumber}
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
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Сумма заказа
                    </span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {orderTotal.toFixed(2)} ₽
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
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Время доставки
                    </span>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {deliveryDate}, {deliveryTime}
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
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Адрес доставки
                    </span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {deliveryAddress}
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
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                💬 Курьер свяжется с вами за 15 минут до доставки
              </p>
            </div>
          </>
        )}

        {/* Кнопки */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Кнопка на главную */}
          <button
            onClick={() => router.push('/')}
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
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,162,97,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,162,97,0.4)';
            }}
          >
            <Home style={{ width: 18, height: 18 }} strokeWidth={2.5} />
            На главный экран
          </button>

          {/* Кнопка отследить заказ (только для заказов) */}
          {confirmationType === 'order' && (
            <button
              onClick={() => router.push('/order/123')}
              style={{
                width: '100%',
                background: 'rgba(45, 79, 94, 0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: 12,
                border: '1px solid rgba(244, 162, 97, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(45, 79, 94, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(45, 79, 94, 0.5)';
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
