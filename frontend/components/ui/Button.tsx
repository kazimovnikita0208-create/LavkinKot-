'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #2D6A8A 0%, #1E5270 100%)',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(45, 106, 138, 0.35)',
  },
  accent: {
    background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4)',
  },
  secondary: {
    background: 'rgba(45, 79, 94, 0.5)',
    color: '#94A3B8',
    border: '1px solid rgba(244, 162, 97, 0.15)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#F4A261',
    border: '1px solid rgba(244, 162, 97, 0.3)',
    boxShadow: 'none',
  },
  destructive: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#EF4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    boxShadow: 'none',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: 13, borderRadius: 10, gap: 6 },
  md: { padding: '12px 20px', fontSize: 15, borderRadius: 12, gap: 8 },
  lg: { padding: '16px 24px', fontSize: 16, borderRadius: 16, gap: 8 },
};

export function Button({
  variant = 'accent',
  size = 'md',
  loading = false,
  icon,
  children,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        letterSpacing: '-0.01em',
        width: fullWidth ? '100%' : undefined,
        opacity: isDisabled ? 0.55 : 1,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', flexShrink: 0 }} />
      ) : icon ? (
        <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
