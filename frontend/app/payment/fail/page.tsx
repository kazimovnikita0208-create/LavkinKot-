'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function PaymentFailPage() {
  const router = useRouter();

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
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <XCircle style={{ width: 40, height: 40, color: '#EF4444' }} strokeWidth={2} />
        </div>

        <h1 style={{
          fontSize: 26,
          fontWeight: 900,
          color: '#FFFFFF',
          marginBottom: 12,
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          Оплата не прошла
        </h1>

        <p style={{
          fontSize: 15,
          color: '#94A3B8',
          fontWeight: 500,
          lineHeight: 1.5,
          marginBottom: 32,
        }}>
          Платёж был отменён или произошла ошибка. Попробуйте ещё раз или выберите другой способ оплаты.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => router.back()}
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
            <RefreshCw style={{ width: 18, height: 18 }} strokeWidth={2.5} />
            Попробовать снова
          </button>

          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              background: 'rgba(45, 79, 94, 0.5)',
              color: '#94A3B8',
              padding: '14px 24px',
              borderRadius: 16,
              border: '1px solid rgba(244, 162, 97, 0.15)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} strokeWidth={2} />
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
