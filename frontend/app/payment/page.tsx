'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft, ShieldCheck, Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ordersApi, api } from '@/lib/api';

declare global {
  interface Window {
    Robokassa?: {
      StartPayment: (params: Record<string, unknown>) => void;
      Render: (params: Record<string, unknown>, containerId: string) => void;
    };
  }
}

const planNames: { [key: string]: string } = {
  standard: 'Стандарт',
  plus: 'Плюс',
  premium: 'Премиум',
};

type PaymentStatus = 'idle' | 'processing' | 'success' | 'fail' | 'pending_confirm';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentType = searchParams.get('type') || 'order';
  const subscriptionPlan = searchParams.get('plan') || '';
  const subscriptionAmount = parseFloat(searchParams.get('amount') || '0');
  const returnUrl = searchParams.get('returnUrl') || '';
  const orderId = searchParams.get('orderId') || '';
  const batchId = searchParams.get('batchId') || '';

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [robokassaReady, setRobokassaReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentInvId, setCurrentInvId] = useState<number | null>(null);
  const [successCountdown, setSuccessCountdown] = useState(3);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const dragStartY = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

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
    }).catch(() => {}).finally(() => {
      setOrderLoading(false);
    });
  }, [orderId, paymentType]);

  const orderTotal = orderSubtotal ?? parseFloat(searchParams.get('amount') || '0');
  const deliveryFee = orderDeliveryFee ?? 0;
  const finalTotal = paymentType === 'subscription' ? subscriptionAmount : orderTotal + deliveryFee;

  // Проверить статус оплаты прямо сейчас
  const checkPaymentNow = useCallback(async (invId: number): Promise<boolean> => {
    try {
      if (paymentType === 'order' && orderId) {
        const res = await ordersApi.getOrderById(orderId);
        return res.data?.payment_status === 'paid';
      } else if (paymentType === 'subscription') {
        const res = await api.get<{ status: string }>(`/payments/status/${invId}`);
        return res.data?.status === 'paid';
      }
    } catch { /* ignore */ }
    return false;
  }, [orderId, paymentType]);

  // Polling: каждые 3 секунды
  const pollPaymentStatus = useCallback(async (invId: number) => {
    for (let i = 0; i < 100; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const paid = await checkPaymentNow(invId);
      if (paid) {
        setShowModal(false);
        setPaymentStatus('success');
        return;
      }
    }
  }, [checkPaymentNow]);

  // Кнопка "Я уже оплатил" — 3 попытки × 3с = 9с, затем → pending_confirm (не fail!)
  const handleManualCheck = useCallback(async () => {
    if (!currentInvId) return;
    setCheckingStatus(true);
    for (let i = 0; i < 3; i++) {
      const paid = await checkPaymentNow(currentInvId);
      if (paid) {
        setShowModal(false);
        setPaymentStatus('success');
        setCheckingStatus(false);
        return;
      }
      if (i < 2) await new Promise(r => setTimeout(r, 3000));
    }
    setCheckingStatus(false);
    setShowModal(false);
    // Webhook ещё не дошёл — показываем "обрабатывается", а не "не прошла"
    setPaymentStatus('pending_confirm');
  }, [currentInvId, checkPaymentNow]);

  // Ручная проверка на экране pending_confirm
  const handleRetryCheck = useCallback(async () => {
    if (!currentInvId) return;
    setCheckingStatus(true);
    const paid = await checkPaymentNow(currentInvId);
    setCheckingStatus(false);
    if (paid) setPaymentStatus('success');
  }, [currentInvId, checkPaymentNow]);

  // Auto-polling на экране pending_confirm каждые 5 секунд
  useEffect(() => {
    if (paymentStatus !== 'pending_confirm' || !currentInvId) return;
    const interval = setInterval(async () => {
      const paid = await checkPaymentNow(currentInvId);
      if (paid) {
        setPaymentStatus('success');
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [paymentStatus, currentInvId, checkPaymentNow]);

  // Автоотсчёт и редирект после успешной оплаты
  useEffect(() => {
    if (paymentStatus !== 'success') return;
    setSuccessCountdown(3);
    const interval = setInterval(() => {
      setSuccessCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Редирект на нужную страницу
          if (paymentType === 'subscription') {
            router.push('/profile/subscription');
          } else if (orderId) {
            router.push(`/order-confirmed?type=order&orderId=${orderId}`);
          } else {
            router.push('/');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStatus, paymentType, orderId, router]);

  // Закрыть модалку
  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setPaymentStatus('idle');
  }, []);

  // Swipe-to-close по drag handle
  const handleDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const handleDragEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - dragStartY.current;
    if (deltaY > 70) handleModalClose();
  };

  const handlePay = async () => {
    setPaymentStatus('processing');
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

      const res = await api.post<{
        redirectUrl: string;
        invId: number;
        iframeParams?: Record<string, unknown>;
      }>('/payments/robokassa/init', body);

      if (res.data?.iframeParams && window.Robokassa) {
        if (paymentType === 'subscription' && returnUrl) {
          sessionStorage.setItem('checkout_return', returnUrl);
        }

        setCurrentInvId(res.data.invId);
        setShowModal(true);
        await new Promise(r => setTimeout(r, 120));

        const params = {
          ...res.data.iframeParams,
          Settings: JSON.stringify({ Mode: 'widget' }),
        };
        window.Robokassa.Render(params, 'robokassa-widget-container');
        pollPaymentStatus(res.data.invId);
      } else if (res.data?.redirectUrl) {
        // Fallback: обычный редирект
        if (paymentType === 'subscription' && returnUrl) {
          sessionStorage.setItem('checkout_return', returnUrl);
        }
        window.location.href = res.data.redirectUrl;
      } else {
        setPaymentStatus('idle');
        setError('Не удалось создать платёж. Попробуйте ещё раз.');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка создания платежа';
      setPaymentStatus('idle');
      setError(msg);
    }
  };


  // Экран успешной оплаты
  if (paymentStatus === 'success') {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{
        backgroundColor: '#1A2F3A', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 300 }}>
          {/* Иконка успеха с анимацией */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(76,175,80,0.25) 0%, rgba(56,142,60,0.2) 100%)',
            border: '2px solid rgba(76,175,80,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            animation: 'fadeInUp 0.4s ease both',
          }}>
            <CheckCircle style={{ width: 46, height: 46, color: '#4CAF50' }} strokeWidth={2} />
          </div>

          <h1 style={{
            fontSize: 28, fontWeight: 900, color: '#FFFFFF', marginBottom: 10,
            animation: 'fadeInUp 0.4s 0.1s ease both',
          }}>
            Оплата прошла! 🎉
          </h1>

          <p style={{
            fontSize: 15, color: '#94A3B8', fontWeight: 500, lineHeight: 1.6, marginBottom: 8,
            animation: 'fadeInUp 0.4s 0.2s ease both',
          }}>
            {paymentType === 'subscription'
              ? 'Подписка успешно активирована. Доставки списываются автоматически.'
              : 'Заказ оплачен и принят в обработку.'}
          </p>

          {/* Счётчик */}
          <p style={{
            fontSize: 13, color: '#64A8C8', fontWeight: 600, marginBottom: 32,
            animation: 'fadeInUp 0.4s 0.3s ease both',
          }}>
            Перенаправляем через {successCountdown} сек...
          </p>

          <button
            onClick={() => {
              if (paymentType === 'subscription') router.push('/profile/subscription');
              else if (orderId) router.push(`/order-confirmed?type=order&orderId=${orderId}`);
              else router.push('/');
            }}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF', padding: '16px 24px', borderRadius: 16,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
              fontWeight: 800, fontSize: 16,
              animation: 'fadeInUp 0.4s 0.35s ease both',
            }}
          >
            {paymentType === 'subscription' ? 'Перейти к подписке' : 'К заказу'}
          </button>
        </div>
      </div>
    );
  }

  // Экран "Оплата обрабатывается" — webhook ещё не пришёл, но пользователь сказал что оплатил
  if (paymentStatus === 'pending_confirm') {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{
        backgroundColor: '#1A2F3A', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 300 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(244,162,97,0.15)',
            border: '2px solid rgba(244,162,97,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            animation: 'fadeInUp 0.4s ease both',
          }}>
            <Loader2 style={{ width: 44, height: 44, color: '#F4A261', animation: 'spin 1.2s linear infinite' }} />
          </div>

          <h1 style={{
            fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 12,
            animation: 'fadeInUp 0.4s 0.1s ease both',
          }}>
            Оплата обрабатывается
          </h1>

          <p style={{
            fontSize: 14, color: '#94A3B8', fontWeight: 500, lineHeight: 1.6, marginBottom: 32,
            animation: 'fadeInUp 0.4s 0.2s ease both',
          }}>
            Ожидаем подтверждение от платёжной системы. Обычно это занимает до 1 минуты. Не закрывайте приложение.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeInUp 0.4s 0.3s ease both' }}>
            <button
              onClick={handleRetryCheck}
              disabled={checkingStatus}
              style={{
                width: '100%',
                background: checkingStatus
                  ? 'rgba(244,162,97,0.4)'
                  : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                color: '#FFFFFF', padding: '16px 24px', borderRadius: 16,
                border: 'none', cursor: checkingStatus ? 'default' : 'pointer',
                boxShadow: checkingStatus ? 'none' : '0 6px 20px rgba(244,162,97,0.4)',
                fontWeight: 800, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {checkingStatus
                ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Проверяем...</>
                : '🔄 Проверить ещё раз'}
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#64748B', padding: '14px 24px', borderRadius: 16,
                border: '1px solid rgba(100,116,139,0.3)',
                cursor: 'pointer', fontWeight: 600, fontSize: 15,
              }}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Экран ошибки оплаты
  if (paymentStatus === 'fail') {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{
        backgroundColor: '#1A2F3A', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 300 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(239,68,68,0.15)',
            border: '2px solid rgba(239,68,68,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            animation: 'fadeInUp 0.4s ease both',
          }}>
            <XCircle style={{ width: 46, height: 46, color: '#EF4444' }} strokeWidth={2} />
          </div>

          <h1 style={{
            fontSize: 26, fontWeight: 900, color: '#FFFFFF', marginBottom: 10,
            animation: 'fadeInUp 0.4s 0.1s ease both',
          }}>
            Оплата не прошла
          </h1>

          <p style={{
            fontSize: 15, color: '#94A3B8', fontWeight: 500, lineHeight: 1.6, marginBottom: 32,
            animation: 'fadeInUp 0.4s 0.2s ease both',
          }}>
            Что-то пошло не так. Попробуйте оплатить снова или выберите другой способ оплаты.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeInUp 0.4s 0.3s ease both' }}>
            <button
              onClick={() => { setPaymentStatus('idle'); setShowModal(false); }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                color: '#FFFFFF', padding: '16px 24px', borderRadius: 16,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
                fontWeight: 800, fontSize: 16,
              }}
            >
              Попробовать снова
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#64748B', padding: '14px 24px', borderRadius: 16,
                border: '1px solid rgba(100,116,139,0.3)',
                cursor: 'pointer', fontWeight: 600, fontSize: 15,
              }}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 140 }}>
      {/* Robokassa iframe SDK */}
      <Script
        src="https://auth.robokassa.ru/Merchant/bundle/robokassa_iframe.js"
        strategy="afterInteractive"
        onLoad={() => setRobokassaReady(true)}
      />

      <AnimatedBackground />

      {/* HEADER */}
      <header style={{
        padding: '14px 16px',
        position: 'sticky', top: 0, zIndex: 20,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
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
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', flex: 1 }}>
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
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16, padding: 20,
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
                  <span style={{ fontSize: 28, color: '#F4A261', fontWeight: 900 }}>
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
                  <span style={{ fontSize: 28, color: '#F4A261', fontWeight: 900 }}>
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
            borderRadius: 14, padding: '14px 16px',
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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

        {/* Ожидание оплаты */}
        {paymentStatus === 'processing' && (
          <section style={{ marginBottom: 24 }}>
            <div style={{
              padding: '20px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.08) 0%, rgba(232, 149, 81, 0.05) 100%)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              textAlign: 'center',
            }}>
              <Loader2 style={{ width: 32, height: 32, color: '#F4A261', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                Ожидаем оплату
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, lineHeight: 1.4 }}>
                Завершите оплату в окне Robokassa.<br />Статус обновится автоматически.
              </p>
            </div>
          </section>
        )}

        {/* Ошибка */}
        {error && (
          <div style={{
            marginBottom: 16, padding: '14px',
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <XCircle style={{ width: 20, height: 20, color: '#FCA5A5', flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#FCA5A5', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* Безопасность */}
        <div style={{
          padding: '12px', borderRadius: 12,
          background: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <ShieldCheck style={{ width: 16, height: 16, color: '#4CAF50' }} strokeWidth={2} />
          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            Безопасная оплата. Данные защищены SSL
          </p>
        </div>
      </main>

      {/* ─── МОДАЛЬНОЕ ОКНО ОПЛАТЫ ─────────────────────────────────── */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'flex-end',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleModalClose();
          }}
        >
          {/* Sheet — отдельный div, блокирует всплытие touch-событий */}
          <div
            ref={sheetRef}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 375,
              margin: '0 auto',
              background: '#F8F9FA',
              borderRadius: '20px 20px 0 0',
              height: '88vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
              overflow: 'hidden',
            }}
          >
            {/* Drag handle — swipe вниз для закрытия */}
            <div
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
              style={{
                display: 'flex', justifyContent: 'center',
                paddingTop: 12, paddingBottom: 8,
                background: '#FFFFFF', flexShrink: 0,
                cursor: 'grab', touchAction: 'none',
              }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: '#D1D5DB' }} />
            </div>

            {/* Шапка */}
            <div style={{
              padding: '8px 16px 12px',
              background: '#FFFFFF',
              borderBottom: '1px solid #EFEFEF',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(76,175,80,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShieldCheck style={{ width: 17, height: 17, color: '#4CAF50' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>Безопасная оплата</p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>Защищено Robokassa · SSL</p>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                style={{
                  background: '#F3F4F6', border: 'none', borderRadius: '50%',
                  width: 34, height: 34, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6B7280', fontSize: 20, fontWeight: 300, flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Контейнер виджета — scroll работает, touch не всплывает */}
            <div
              id="robokassa-widget-container"
              onTouchStart={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              style={{
                flex: 1,
                overflowY: 'scroll',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                background: '#FFFFFF',
                touchAction: 'pan-y',
              }}
            />

            {/* Футер — кнопка "Я уже оплатил" */}
            <div style={{
              padding: '10px 16px',
              paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
              background: '#F8F9FA',
              borderTop: '1px solid #EFEFEF',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              flexShrink: 0,
            }}>
              <button
                onClick={handleManualCheck}
                disabled={checkingStatus}
                style={{
                  background: checkingStatus
                    ? 'rgba(244,162,97,0.5)'
                    : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                  color: '#FFFFFF', padding: '11px 24px', borderRadius: 12,
                  border: 'none', cursor: checkingStatus ? 'default' : 'pointer',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', gap: 7,
                  width: '100%', justifyContent: 'center',
                }}
              >
                {checkingStatus
                  ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Проверяем оплату...</>
                  : '✓ Я уже оплатил'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Loader2 style={{ width: 10, height: 10, color: '#9CA3AF', animation: 'spin 2s linear infinite' }} />
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>
                  Статус обновляется автоматически каждые 3 сек
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* НИЖНЯЯ КНОПКА */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 375, zIndex: 50,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 1) 100%)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(244, 162, 97, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
        padding: '16px',
      }}>
        <button
          onClick={handlePay}
          disabled={paymentStatus === 'processing' || orderLoading || !robokassaReady}
          style={{
            width: '100%',
            background: (paymentStatus === 'processing' || orderLoading || !robokassaReady)
              ? 'rgba(45, 79, 94, 0.5)'
              : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            color: (paymentStatus === 'processing' || orderLoading || !robokassaReady) ? '#94A3B8' : '#FFFFFF',
            padding: '16px 24px', borderRadius: 16, border: 'none',
            cursor: (paymentStatus === 'processing' || orderLoading || !robokassaReady) ? 'not-allowed' : 'pointer',
            boxShadow: (paymentStatus === 'processing' || orderLoading || !robokassaReady)
              ? '0 4px 16px rgba(0,0,0,0.25)'
              : '0 6px 20px rgba(244,162,97,0.4)',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontWeight: 800, fontSize: 16,
          }}
        >
          {paymentStatus === 'processing' && <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />}
          {paymentStatus === 'processing'
            ? 'Ожидаем оплату...'
            : `Оплатить ${finalTotal.toFixed(0)} ₽`}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#64748B', marginTop: 8, fontWeight: 500 }}>
          {paymentStatus === 'processing'
            ? 'Не закрывайте приложение до завершения оплаты'
            : 'Оплата откроется во всплывающем окне'}
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
