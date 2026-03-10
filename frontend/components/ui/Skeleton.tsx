'use client';

import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, className }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${className || ''}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(45, 79, 94, 0.3)',
      borderRadius: 16,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <Skeleton height={120} borderRadius={12} />
      <Skeleton height={16} width="70%" />
      <Skeleton height={12} width="50%" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton height={18} width={60} />
        <Skeleton height={32} width={32} borderRadius={10} />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius="50%" />;
}

export function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '3px solid rgba(244, 162, 97, 0.2)',
        borderTop: '3px solid #F4A261',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: 500,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>
        Загрузка...
      </p>
    </div>
  );
}
