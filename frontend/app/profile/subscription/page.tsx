'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check,
  CreditCard,
  Zap,
  Star,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useSubscriptionPlans } from '@/hooks';
import { SubscriptionPlan } from '@/lib/api';

// Иконки для планов
const planIcons: Record<string, typeof CreditCard> = {
  'standard': CreditCard,
  'plus': Zap,
  'premium': Star,
};

const planColors: Record<string, string> = {
  'standard': '#94A3B8',
  'plus': '#F4A261',
  'premium': '#FFD700',
};

export default function SubscriptionPage() {
  const router = useRouter();
  const { plans, isLoading, error } = useSubscriptionPlans();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [fromCheckout, setFromCheckout] = useState(false);

  // Проверяем, пришли ли с checkout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkoutReturn = sessionStorage.getItem('checkout_return');
      if (checkoutReturn === 'true') {
        setFromCheckout(true);
      }
    }
  }, []);

  // Выбираем средний план по умолчанию
  if (plans.length > 0 && !selectedPlan) {
    const middleIndex = Math.floor(plans.length / 2);
    setSelectedPlan(plans[middleIndex]?.id || plans[0]?.id || '');
  }

  const handleBack = () => {
    if (fromCheckout) {
      sessionStorage.removeItem('checkout_return');
      router.push('/checkout');
    } else {
      router.push('/profile');
    }
  };

  const handleSubscribe = () => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    if (selectedPlanData) {
      // Передаём returnUrl если пришли с checkout
      const returnUrl = fromCheckout ? '/checkout' : '/profile';
      router.push(`/payment?type=subscription&plan=${selectedPlan}&amount=${selectedPlanData.price}&returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  const getPlanIcon = (slug: string) => planIcons[slug] || CreditCard;
  const getPlanColor = (slug: string) => planColors[slug] || '#94A3B8';

  const getFeatures = (plan: SubscriptionPlan): string[] => {
    const features: string[] = [];
    features.push(`Действует ${plan.duration_days} дней`);
    
    if (plan.slug === 'plus' || plan.slug === 'premium') {
      features.push('Без минимальной суммы');
    }
    if (plan.slug === 'plus') {
      features.push('Приоритетная поддержка');
    }
    if (plan.slug === 'premium') {
      features.push('VIP поддержка 24/7');
      features.push('Ранний доступ к акциям');
      features.push('Эксклюзивные скидки');
    }
    
    return features;
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1A2F3A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
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

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

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
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
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

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
            Выбор подписки
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
      <main style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        
        {/* Заголовок */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
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
            <span style={{ fontSize: 12, fontWeight: 800, color: '#F4A261' }}>
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
          }}>
            Выберите подходящий тариф и получайте бесплатные доставки
          </p>
        </div>

        {error ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: '#EF4444', fontSize: 14 }}>Ошибка загрузки тарифов</p>
          </div>
        ) : (
          <>
            {/* Карточки тарифов */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {plans.map((plan, index) => {
                const Icon = getPlanIcon(plan.slug);
                const color = getPlanColor(plan.slug);
                const isSelected = selectedPlan === plan.id;
                const isPopular = index === 1; // Средний план - популярный
                const pricePerDelivery = Number(plan.price) / plan.deliveries_limit;
                const features = getFeatures(plan);
                
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
                      border: isSelected 
                        ? '2px solid rgba(244, 162, 97, 0.5)' 
                        : '1px solid rgba(244, 162, 97, 0.2)',
                      borderRadius: 18,
                      padding: 18,
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected
                        ? '0 8px 32px rgba(244, 162, 97, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Популярный бейдж */}
                    {isPopular && (
                      <div style={{
                        position: 'absolute',
                        top: -8,
                        right: 16,
                        background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                        padding: '4px 12px',
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4)',
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase' }}>
                          Популярный
                        </span>
                      </div>
                    )}

                    {/* Заголовок */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
                          border: `1px solid ${color}60`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Icon style={{ width: 20, height: 20, color }} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginBottom: 2 }}>
                            {plan.name}
                          </h3>
                          <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                            {plan.deliveries_limit} доставок
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
                      }}>
                        {isSelected && <Check style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={3} />}
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
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>
                            {Number(plan.price).toLocaleString('ru-RU')}
                          </span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>₽</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: '#F4A261', fontWeight: 700 }}>
                        ~{Math.round(pricePerDelivery)} ₽ за доставку
                      </p>
                    </div>

                    {/* Преимущества */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {features.map((feature, idx) => (
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
                          }}>
                            <Check style={{ width: 10, height: 10, color: '#4CAF50' }} strokeWidth={3} />
                          </div>
                          <span style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 600 }}>
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
              <p style={{ fontSize: 12, color: '#90CAF9', fontWeight: 600, lineHeight: 1.5 }}>
                ℹ️ Подписка активируется сразу после оплаты. Неиспользованные доставки не сгорают.
              </p>
            </div>
          </>
        )}
      </main>

      {/* Кнопка оформления */}
      {selectedPlanData && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 375,
          padding: 16,
          background: 'linear-gradient(180deg, transparent 0%, rgba(26, 47, 58, 0.98) 20%)',
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
              boxShadow: '0 8px 24px rgba(244, 162, 97, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 2, textAlign: 'left' }}>
                {selectedPlanData.name}
              </p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', textAlign: 'left' }}>
                {Number(selectedPlanData.price).toLocaleString('ru-RU')} ₽
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>Купить</span>
              <ChevronRight style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
