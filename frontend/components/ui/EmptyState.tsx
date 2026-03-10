'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(244, 162, 97, 0.1)',
          border: '1.5px solid rgba(244, 162, 97, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
          color: '#F4A261',
        }}>
          {icon}
        </div>
      )}

      <p style={{
        fontSize: 16,
        fontWeight: 800,
        color: '#FFFFFF',
        letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>
        {title}
      </p>

      {subtitle && (
        <p style={{
          fontSize: 13,
          color: '#94A3B8',
          fontWeight: 500,
          lineHeight: 1.5,
          maxWidth: 260,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          {subtitle}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 8,
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
          {action.label}
        </button>
      )}
    </div>
  );
}
