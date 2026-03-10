'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Что-то пошло не так',
  message = 'Не удалось загрузить данные. Попробуйте ещё раз.',
  onRetry,
  retryLabel = 'Попробовать снова',
}: ErrorStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.12)',
        border: '1.5px solid rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
      }}>
        <AlertCircle style={{ width: 28, height: 28, color: '#EF4444' }} strokeWidth={2} />
      </div>

      <p style={{
        fontSize: 16,
        fontWeight: 800,
        color: '#FFFFFF',
        letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>
        {title}
      </p>

      <p style={{
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: 500,
        lineHeight: 1.5,
        maxWidth: 260,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(244,162,97,0.35)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          <RefreshCw style={{ width: 16, height: 16 }} strokeWidth={2.5} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
