'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Store,
  Image as ImageIcon,
  Save,
  Upload,
  X
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function PartnerSettingsPage() {
  const router = useRouter();
  
  const [shopData, setShopData] = useState({
    name: 'Пекарня "Хлебница"',
    description: 'Домашняя пекарня с широким ассортиментом свежей выпечки. Работаем с 6:00 до 22:00.',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    category: 'Пекарни',
    address: 'ул. Ленина, д. 15',
    phone: '+7 (900) 123-45-67',
    email: 'info@hlebnica.ru',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(shopData);

  const handleSave = () => {
    setShopData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(shopData);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A', 
      position: 'relative',
      paddingBottom: 16,
    }}>
      
      {/* Анимированный фон */}
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
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/partner')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 79, 94, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(45, 79, 94, 0.5)';
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Настройки магазина
          </h1>

          {/* Логотип */}
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'drop-shadow(0 2px 8px rgba(244, 162, 97, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(244, 162, 97, 0.2))';
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="ЛавкинКот" 
              style={{ 
                height: 48,
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Обложка магазина */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Обложка магазина
          </h2>

          <div style={{
            position: 'relative',
            width: '100%',
            height: 180,
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={isEditing ? tempData.coverImage : shopData.coverImage}
              alt="Обложка"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {isEditing && (
              <button
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.95) 0%, rgba(232, 149, 81, 0.95) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: 'none',
                  borderRadius: 12,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(244, 162, 97, 0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Upload style={{ width: 16, height: 16, color: '#FFFFFF' }} strokeWidth={2.5} />
                <span style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Загрузить
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Основная информация */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 16,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Основная информация
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Название */}
            <div>
              <label style={{
                fontSize: 13,
                color: '#B0BEC5',
                fontWeight: 700,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                <Store style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                Название магазина
              </label>
              <input
                type="text"
                value={isEditing ? tempData.name : shopData.name}
                onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing 
                    ? 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                }}
              />
            </div>

            {/* Описание */}
            <div>
              <label style={{
                fontSize: 13,
                color: '#B0BEC5',
                fontWeight: 700,
                marginBottom: 8,
                display: 'block',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Описание
              </label>
              <textarea
                value={isEditing ? tempData.description : shopData.description}
                onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  minHeight: 80,
                  background: isEditing 
                    ? 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  cursor: isEditing ? 'text' : 'not-allowed',
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Категория */}
            <div>
              <label style={{
                fontSize: 13,
                color: '#B0BEC5',
                fontWeight: 700,
                marginBottom: 8,
                display: 'block',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Категория
              </label>
              <select
                value={isEditing ? tempData.category : shopData.category}
                onChange={(e) => setTempData({ ...tempData, category: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing 
                    ? 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                }}
              >
                <option value="Пекарни">Пекарни</option>
                <option value="Магазины">Магазины</option>
                <option value="Рестораны">Рестораны</option>
                <option value="Кофейни">Кофейни</option>
                <option value="Фрукты и овощи">Фрукты и овощи</option>
              </select>
            </div>

            {/* Адрес */}
            <div>
              <label style={{
                fontSize: 13,
                color: '#B0BEC5',
                fontWeight: 700,
                marginBottom: 8,
                display: 'block',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Адрес
              </label>
              <input
                type="text"
                value={isEditing ? tempData.address : shopData.address}
                onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing 
                    ? 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                }}
              />
            </div>

            {/* Телефон */}
            <div>
              <label style={{
                fontSize: 13,
                color: '#B0BEC5',
                fontWeight: 700,
                marginBottom: 8,
                display: 'block',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Телефон
              </label>
              <input
                type="tel"
                value={isEditing ? tempData.phone : shopData.phone}
                onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing 
                    ? 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(76, 175, 80, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                fontSize: 13,
                color: '#B0BEC5',
                fontWeight: 700,
                marginBottom: 8,
                display: 'block',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Email
              </label>
              <input
                type="email"
                value={isEditing ? tempData.email : shopData.email}
                onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing 
                    ? 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)'
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(33, 150, 243, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                }}
              />
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              border: 'none',
              borderRadius: 14,
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(244, 162, 97, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.4)';
            }}
          >
            <Store style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
            <span style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Редактировать
            </span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                background: 'rgba(45, 79, 94, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(45, 79, 94, 0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(45, 79, 94, 0.7)';
              }}
            >
              <span style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#94A3B8',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Отмена
              </span>
            </button>

            <button
              onClick={handleSave}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                border: 'none',
                borderRadius: 14,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.4)';
              }}
            >
              <Save style={{ width: 18, height: 18, color: '#FFFFFF' }} strokeWidth={2.5} />
              <span style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Сохранить
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
