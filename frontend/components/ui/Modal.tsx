'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

/**
 * Bottom Sheet — нижняя шторка, характерная для мобильных приложений.
 * Анимация slide-up, backdrop blur.
 */
export function Modal({ isOpen, onClose, title, children, showCloseButton = true }: ModalProps) {
  // Блокируем scroll при открытом модале
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 375,
          background: 'linear-gradient(180deg, #1E3A4A 0%, #1A2F3A 100%)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid rgba(244, 162, 97, 0.15)',
          boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          background: 'rgba(148, 163, 184, 0.4)',
          margin: '12px auto 0',
        }} />

        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            {title && (
              <h3 style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(148, 163, 184, 0.12)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  flexShrink: 0,
                }}
              >
                <X style={{ width: 16, height: 16 }} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
      `}</style>
    </div>
  );
}
