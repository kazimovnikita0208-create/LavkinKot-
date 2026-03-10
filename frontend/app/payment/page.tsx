'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Loader2, CreditCard } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ordersApi, api } from '@/lib/api';

const planNames: { [key: string]: string } = {
  standard: 'Стандарт',
  plus: 'Плюс',
  premium: 'Премиум',
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentType = searchParams.get('type') || 'order';
  const subscriptionPlan = searchParams.get('plan') || '';
  const subscriptionAmount = parseFloat(searchParams.get('amount') || '0');
  const returnUrl = searchParams.get('returnUrl') || '';
  const orderId = searchParams.get('orderId') || '';

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderSubtotal, setOrderSubtotal] = useState<number | null>(null);
  const [orderDeliveryFee, setOrderDeliveryFee] = useState<number | null>(null);
  const [orderLoading, setOrderLoading] = useState(paymentType === 'order' && !!orderId);

  useEffect(() => {
    if (paymentType !== 'order' || !orderId) return;
    ordersApi.getOrderById(orderId).then((res) => {
      if (res.data) {
        setOrderSubtotal(res.data.subtotal);
        setOrderDeliveryFee(res.data.delivery_fee);
      }
    }).catch(() => {
      // Используем amount из query если заказ не загрузился
    }).finally(() => {
      setOrderLoading(false);
    });
  }, [orderId, paymentType]);

  const orderTotal = orderSubtotal ?? parseFloat(searchParams.get('amount') || '0');
  const deliveryFee = orderDeliveryFee ?? 0;
  const finalTotal = paymentType === 'subscription' ? subscriptionAmount : orderTotal + deliveryFee;

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const body: Record<string, unknown> = { type: paymentType };
      if (paymentType === 'subscription') {
        body.planId = subscriptionPlan;
        body.amount = subscriptionAmount;
      } else {
        body.orderId = orderId;
        body.amount = finalTotal;
      }

      const res = await api.post<{ redirectUrl: string; invId: number }>('/payments/robokassa/init', body);

      if (res.data?.redirectUrl) {
        // Сохраняем флаг для возможного возврата после оплаты
        if (paymentType === 'subscription' && returnUrl) {
          sessionStorage.setItem('checkout_return', returnUrl);
        }
        window.location.href = res.data.redirectUrl;
      } else {
        setError('Не удалось создать платёж. Попробуйте ещё раз.');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка создания платежа';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 140 }}>

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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
          </button>
          <h1 style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#FFFFFF',
            flex: 1,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Оплата
          </h1>
          <button
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </button>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, padding: '16px' }}>

        {/* Сумма к оплате */}
        <section style={{ marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          }}>
            {orderLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                <Loader2 style={{ width: 24, height: 24, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : paymentType === 'subscription' ? (
              <>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Подписка</span>
                  <span style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 900 }}>
                    {planNames[subscriptionPlan] || subscriptionPlan}
                  </span>
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(244,162,97,0.3), transparent)', marginBottom: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 800 }}>К оплате</span>
                  <span style={{ fontSize: 28, color: '#F4A261', fontWeight: 900, letterSpacing: '-0.02em' }}>
                    {finalTotal.toFixed(0)} ₽
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 500 }}>Сумма заказа</span>
                  <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 700 }}>{orderTotal.toFixed(0)} ₽</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 500 }}>Доставка</span>
                  <span style={{ fontSize: 14, color: '#F4A261', fontWeight: 700 }}>{deliveryFee} ₽</span>
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(244,162,97,0.3), transparent)', marginBottom: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 800 }}>К оплате</span>
                  <span style={{ fontSize: 28, color: '#F4A261', fontWeight: 900, letterSpacing: '-0.02em' }}>
                    {finalTotal.toFixed(0)} ₽
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Robokassa badge */}
        <section style={{ marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.4) 0%, rgba(38, 73, 92, 0.3) 100%)',
            borderRadius: 14,
            padding: '14px 16px',
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <CreditCard style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>Оплата через Robokassa</p>
                <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>Карта, СБП, ЮMoney и другие способы</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ошибка */}
        {error && (
          <div style={{
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <p style={{ fontSize: 13, color: '#FCA5A5', fontWeight: 500, textAlign: 'center' }}>{error}</p>
          </div>
        )}

        {/* Безопасность */}
        <div style={{
          padding: '12px',
          borderRadius: 12,
          background: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <ShieldCheck style={{ width: 16, height: 16, color: '#4CAF50' }} strokeWidth={2} />
          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            Безопасная оплата. Данные защищены SSL
          </p>
        </div>
      </main>

      {/* НИЖНЯЯ КНОПКА */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 375,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 1) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(244, 162, 97, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
        padding: '16px',
      }}>
        <button
          onClick={handlePay}
          disabled={isProcessing || orderLoading}
          style={{
            width: '100%',
            background: (isProcessing || orderLoading)
              ? 'rgba(45, 79, 94, 0.5)'
              : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            color: (isProcessing || orderLoading) ? '#94A3B8' : '#FFFFFF',
            padding: '16px 24px',
            borderRadius: 16,
            border: 'none',
            cursor: (isProcessing || orderLoading) ? 'not-allowed' : 'pointer',
            boxShadow: (isProcessing || orderLoading)
              ? '0 4px 16px rgba(0,0,0,0.25)'
              : '0 6px 20px rgba(244,162,97,0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          {isProcessing && <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />}
          {isProcessing ? 'Переход к оплате...' : `Оплатить ${finalTotal.toFixed(0)} ₽`}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#64748B', marginTop: 8, fontWeight: 500 }}>
          Вы будете перенаправлены на страницу Robokassa
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBackground />
        <div style={{ color: '#F4A261', fontSize: 18, fontWeight: 700, position: 'relative', zIndex: 10 }}>
          Загрузка...
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
