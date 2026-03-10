'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'order';
  const orderId = searchParams.get('orderId') || '';

  const handleContinue = () => {
    if (type === 'subscription') {
      router.push('/profile/subscription');
    } else if (orderId) {
      router.push(`/order-confirmed?type=order&orderId=${orderId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div
      className="w-full max-w-[375px] min-h-screen mx-auto"
      style={{
        backgroundColor: '#1A2F3A',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <AnimatedBackground />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 300 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(56, 142, 60, 0.2) 100%)',
          border: '2px solid rgba(76, 175, 80, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <CheckCircle style={{ width: 40, height: 40, color: '#4CAF50' }} strokeWidth={2} />
        </div>

        <h1 style={{
          fontSize: 26,
          fontWeight: 900,
          color: '#FFFFFF',
          marginBottom: 12,
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          Оплата прошла!
        </h1>

        <p style={{
          fontSize: 15,
          color: '#94A3B8',
          fontWeight: 500,
          lineHeight: 1.5,
          marginBottom: 32,
        }}>
          {type === 'subscription'
            ? 'Подписка успешно активирована. Доставки списываются автоматически.'
            : 'Заказ оплачен и принят в обработку.'}
        </p>

        <button
          onClick={handleContinue}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            color: '#FFFFFF',
            padding: '16px 24px',
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          {type === 'subscription' ? 'К подписке' : 'К заказу'}
          <ArrowRight style={{ width: 18, height: 18 }} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A' }} />
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
