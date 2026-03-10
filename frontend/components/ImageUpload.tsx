'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string | null;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  label?: string;
  height?: number;
  disabled?: boolean;
  placeholder?: string;
}

export function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  label,
  height = 160,
  disabled = false,
  placeholder = 'Нажмите или перетащите изображение',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Валидация
    if (!file.type.startsWith('image/')) {
      setError('Выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Максимальный размер 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    // Создаём превью
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  const displayImage = preview || currentImage;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          fontSize: 13,
          color: '#B0BEC5',
          fontWeight: 700,
          marginBottom: 8,
          display: 'block',
        }}>
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          position: 'relative',
          width: '100%',
          height,
          borderRadius: 16,
          overflow: 'hidden',
          border: isDragging 
            ? '2px dashed #F4A261' 
            : error 
              ? '2px solid rgba(239, 68, 68, 0.5)' 
              : '1px solid rgba(244, 162, 97, 0.3)',
          background: isDragging 
            ? 'rgba(244, 162, 97, 0.1)' 
            : 'rgba(45, 79, 94, 0.5)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {displayImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {/* Оверлей при наведении */}
            {!disabled && !isUploading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    background: 'rgba(244, 162, 97, 0.9)',
                    borderRadius: 12,
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <Upload style={{ width: 18, height: 18, color: '#FFFFFF' }} strokeWidth={2.5} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>Заменить</span>
                  </div>
                  
                  {onRemove && (
                    <button
                      onClick={handleRemove}
                      style={{
                        background: 'rgba(239, 68, 68, 0.9)',
                        border: 'none',
                        borderRadius: 12,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X style={{ width: 18, height: 18, color: '#FFFFFF' }} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            {isUploading ? (
              <Loader2 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#F4A261',
                  animation: 'spin 1s linear infinite',
                }} 
              />
            ) : (
              <>
                <ImageIcon style={{ width: 32, height: 32, color: '#94A3B8' }} strokeWidth={1.5} />
                <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, textAlign: 'center', padding: '0 16px' }}>
                  {placeholder}
                </span>
                <span style={{ fontSize: 11, color: '#64748B' }}>
                  JPG, PNG, WebP до 5MB
                </span>
              </>
            )}
          </div>
        )}

        {/* Индикатор загрузки */}
        {isUploading && displayImage && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Loader2 
              style={{ 
                width: 40, 
                height: 40, 
                color: '#F4A261',
                animation: 'spin 1s linear infinite',
              }} 
            />
          </div>
        )}
      </div>

      {/* Ошибка */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 8,
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 8,
        }}>
          <AlertCircle style={{ width: 14, height: 14, color: '#EF4444' }} />
          <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Скрытый input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
