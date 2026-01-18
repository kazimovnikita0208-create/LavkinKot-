'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check,
  CreditCard,
  Zap,
  Star,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

interface Plan {
  id: string;
  name: string;
  deliveries: number;
  price: number;
  pricePerDelivery: number;
  popular?: boolean;
  features: string[];
  color: string;
  icon: any;
}

const plans: Plan[] = [
  {
    id: 'standard',
    name: 'Стандарт',
    deliveries: 5,
    price: 1499,
    pricePerDelivery: 299.8,
    features: [
      'Действует 30 дней',
    ],
    color: '#94A3B8',
    icon: CreditCard,
  },
  {
    id: 'plus',
    name: 'Плюс',
    deliveries: 7,
    price: 1699,
    pricePerDelivery: 242.7,
    popular: true,
    features: [
      'Действует 45 дней',
      'Без минимальной суммы',
      'Приоритетная поддержка',
    ],
    color: '#F4A261',
    icon: Zap,
  },
  {
    id: 'premium',
    name: 'Премиум',
    deliveries: 10,
    price: 1999,
    pricePerDelivery: 199.9,
    features: [
      'Без минимальной суммы',
      'VIP поддержка 24/7',
      'Ранний доступ к акциям',
      'Эксклюзивные скидки',
    ],
    color: '#FFD700',
    icon: Star,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('plus');

  const handleSubscribe = () => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    // Переход на оплату подписки с параметрами
    router.push(`/payment?type=subscription&plan=${selectedPlan}&amount=${selectedPlanData?.price}`);
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
      paddingBottom: 100,
    }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        padding: '14px 16px',
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
            Выбор подписки
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
      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '16px',
      }}>
        
        {/* Заголовок */}
        <div style={{
          marginBottom: 24,
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 20,
            marginBottom: 12,
          }}>
            <Sparkles style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
            <span style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#F4A261',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Экономьте на каждой доставке
            </span>
          </div>
          
          <p style={{
            fontSize: 14,
            color: '#B8C5D0',
            fontWeight: 600,
            lineHeight: 1.5,
            maxWidth: 300,
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Выберите подходящий тариф и получайте бесплатные доставки
          </p>
        </div>

        {/* Карточки тарифов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: isSelected 
                    ? '2px solid rgba(244, 162, 97, 0.5)' 
                    : '1px solid rgba(244, 162, 97, 0.2)',
                  borderRadius: 18,
                  padding: 18,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected
                    ? '0 8px 32px rgba(244, 162, 97, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 28px rgba(244, 162, 97, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                  }
                }}
              >
                {/* Популярный бейдж */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    right: 16,
                    background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                    padding: '4px 12px',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4)',
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Популярный
                    </span>
                  </div>
                )}

                {/* Заголовок */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${plan.color}40 0%, ${plan.color}20 100%)`,
                      border: `1px solid ${plan.color}60`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 20, height: 20, color: plan.color }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: '#FFFFFF',
                        marginBottom: 2,
                        letterSpacing: '-0.01em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {plan.name}
                      </h3>
                      <p style={{
                        fontSize: 11,
                        color: '#94A3B8',
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {plan.deliveries} доставок
                      </p>
                    </div>
                  </div>

                  {/* Чекбокс */}
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                      : 'rgba(45, 79, 94, 0.7)',
                    border: isSelected ? 'none' : '2px solid rgba(244, 162, 97, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {isSelected && (
                      <Check style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={3} />
                    )}
                  </div>
                </div>

                {/* Цена */}
                <div style={{
                  background: 'rgba(26, 47, 58, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.15)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  marginBottom: 14,
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: '#FFFFFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {plan.price}
                      </span>
                      <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#94A3B8',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        ₽
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: '#F4A261',
                    fontWeight: 700,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    ~{Math.round(plan.pricePerDelivery)} ₽ за доставку
                  </p>
                </div>

                {/* Преимущества */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Check style={{ width: 10, height: 10, color: '#4CAF50' }} strokeWidth={3} />
                      </div>
                      <span style={{
                        fontSize: 12,
                        color: '#E2E8F0',
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Информация */}
        <div style={{
          background: 'rgba(33, 150, 243, 0.15)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
          borderRadius: 14,
          padding: 14,
          marginBottom: 20,
        }}>
          <p style={{
            fontSize: 12,
            color: '#90CAF9',
            fontWeight: 600,
            lineHeight: 1.5,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            ℹ️ Подписка активируется сразу после оплаты. Неиспользованные доставки не сгорают.
          </p>
        </div>
      </main>

      {/* Кнопка оформления */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 375,
        padding: 16,
        background: 'linear-gradient(180deg, transparent 0%, rgba(26, 47, 58, 0.98) 20%, rgba(26, 47, 58, 0.99) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 30,
      }}>
        <button
          onClick={handleSubscribe}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            border: 'none',
            borderRadius: 16,
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 8px 24px rgba(244, 162, 97, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(244, 162, 97, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 162, 97, 0.4)';
          }}
        >
          <div>
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 2,
              textAlign: 'left',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {plans.find(p => p.id === selectedPlan)?.name}
            </p>
            <p style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#FFFFFF',
              textAlign: 'left',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {plans.find(p => p.id === selectedPlan)?.price} ₽
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Купить
            </span>
            <ChevronRight style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </div>
  );
}
