'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Store,
  Save,
  Loader2,
  MapPin,
  Clock,
  DollarSign,
  Power,
  AlertCircle
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ImageUpload } from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerShop } from '@/hooks';
import { uploadApi } from '@/lib/api';

export default function PartnerSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { shop, isLoading: shopLoading, error: shopError, updateShop, refetch } = usePartnerShop();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    address: string;
    category: 'bakery' | 'store' | 'fruit' | 'restaurant';
    min_order_amount: number;
    delivery_time: string;
    is_active: boolean;
    image_url: string;
    cover_url: string;
  }>({
    name: '',
    description: '',
    address: '',
    category: 'store',
    min_order_amount: 0,
    delivery_time: '30-45 мин',
    is_active: true,
    image_url: '',
    cover_url: '',
  });

  // Загружаем данные магазина в форму
  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        description: shop.description || '',
        address: shop.address || '',
        category: shop.category || 'store',
        min_order_amount: shop.min_order_amount || 0,
        delivery_time: shop.delivery_time || '30-45 мин',
        is_active: shop.is_active !== false,
        image_url: shop.image_url || '',
        cover_url: shop.cover_url || '',
      });
    }
  }, [shop]);

  // Проверка доступа
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/dev-login');
    }
    if (!authLoading && isAuthenticated && user?.role !== 'partner' && user?.role !== 'admin') {
      router.push('/profile');
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      
      await updateShop({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        category: formData.category,
        min_order_amount: formData.min_order_amount,
        delivery_time: formData.delivery_time,
        is_active: formData.is_active,
        image_url: formData.image_url,
        cover_url: formData.cover_url,
      });
      
      setSaveSuccess(true);
      setIsEditing(false);
      await refetch();
      
      // Скрываем сообщение об успехе через 3 секунды
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save shop:', err);
      setSaveError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        description: shop.description || '',
        address: shop.address || '',
        category: shop.category || 'store',
        min_order_amount: shop.min_order_amount || 0,
        delivery_time: shop.delivery_time || '30-45 мин',
        is_active: shop.is_active !== false,
        image_url: shop.image_url || '',
        cover_url: shop.cover_url || '',
      });
    }
    setIsEditing(false);
    setSaveError(null);
  };

  const categoryLabels: Record<string, string> = {
    store: 'Магазин',
    bakery: 'Пекарня',
    fruit: 'Фрукты и овощи',
    restaurant: 'Ресторан',
  };

  if (authLoading || shopLoading) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Loader2 style={{ width: 40, height: 40, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (shopError) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <AlertCircle style={{ width: 48, height: 48, color: '#EF4444', marginBottom: 16 }} />
        <p style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>
          Ошибка загрузки данных магазина
        </p>
        <button
          onClick={() => router.push('/partner')}
          style={{
            marginTop: 20,
            background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            border: 'none',
            borderRadius: 12,
            padding: '12px 24px',
            cursor: 'pointer',
            color: '#FFFFFF',
            fontWeight: 700,
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A', 
      position: 'relative',
      paddingBottom: 16,
    }}>
      
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{ 
        padding: '14px 16px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
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
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
            Настройки магазина
          </h1>

          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Успешное сохранение */}
        {saveSuccess && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, color: '#4CAF50', fontWeight: 600 }}>
              ✓ Изменения сохранены
            </p>
          </div>
        )}

        {/* Ошибка сохранения */}
        {saveError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, color: '#EF4444', fontWeight: 600 }}>{saveError}</p>
          </div>
        )}

        {/* Статус магазина */}
        <div style={{
          background: formData.is_active 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
          border: `1px solid ${formData.is_active ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Power style={{ width: 24, height: 24, color: formData.is_active ? '#4CAF50' : '#EF4444' }} strokeWidth={2.5} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                {formData.is_active ? 'Магазин активен' : 'Магазин неактивен'}
              </p>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>
                {formData.is_active ? 'Клиенты могут делать заказы' : 'Заказы временно недоступны'}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              style={{
                background: formData.is_active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                border: `1px solid ${formData.is_active ? 'rgba(239, 68, 68, 0.4)' : 'rgba(76, 175, 80, 0.4)'}`,
                borderRadius: 10,
                padding: '8px 14px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: formData.is_active ? '#EF4444' : '#4CAF50' }}>
                {formData.is_active ? 'Выключить' : 'Включить'}
              </span>
            </button>
          )}
        </div>

        {/* Обложка магазина */}
        <div style={{ marginBottom: 20 }}>
          <ImageUpload
            label="Обложка магазина"
            currentImage={formData.cover_url || formData.image_url}
            height={160}
            disabled={!isEditing}
            placeholder="Загрузите обложку магазина"
            onUpload={async (file) => {
              const response = await uploadApi.uploadShopCover(file);
              if (response.success && response.data) {
                const url = response.data.url;
                setFormData(prev => ({ ...prev, cover_url: url }));
                return url;
              }
              throw new Error('Ошибка загрузки');
            }}
            onRemove={() => setFormData(prev => ({ ...prev, cover_url: '' }))}
          />
        </div>

        {/* Основная информация */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
            Основная информация
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Название */}
            <div>
              <label style={{ fontSize: 13, color: '#B0BEC5', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Store style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                Название магазина
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing ? 'rgba(45, 79, 94, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Описание */}
            <div>
              <label style={{ fontSize: 13, color: '#B0BEC5', fontWeight: 700, marginBottom: 8, display: 'block' }}>
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  minHeight: 80,
                  background: isEditing ? 'rgba(45, 79, 94, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                  resize: 'vertical',
                  cursor: isEditing ? 'text' : 'not-allowed',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Категория */}
            <div>
              <label style={{ fontSize: 13, color: '#B0BEC5', fontWeight: 700, marginBottom: 8, display: 'block' }}>
                Категория
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'bakery' | 'store' | 'fruit' | 'restaurant' })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing ? 'rgba(45, 79, 94, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  boxSizing: 'border-box',
                }}
              >
                <option value="store">Магазин</option>
                <option value="bakery">Пекарня</option>
                <option value="fruit">Фрукты и овощи</option>
                <option value="restaurant">Ресторан</option>
              </select>
            </div>

            {/* Адрес */}
            <div>
              <label style={{ fontSize: 13, color: '#B0BEC5', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                Адрес
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing ? 'rgba(45, 79, 94, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Настройки доставки */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
            Настройки доставки
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Минимальная сумма заказа */}
            <div>
              <label style={{ fontSize: 13, color: '#B0BEC5', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                Минимальная сумма заказа (₽)
              </label>
              <input
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  background: isEditing ? 'rgba(45, 79, 94, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Время доставки */}
            <div>
              <label style={{ fontSize: 13, color: '#B0BEC5', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                Время доставки
              </label>
              <input
                type="text"
                value={formData.delivery_time}
                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                disabled={!isEditing}
                placeholder="например: 30-45 мин"
                style={{
                  width: '100%',
                  background: isEditing ? 'rgba(45, 79, 94, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  border: isEditing ? '1px solid rgba(244, 162, 97, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: isEditing ? 'text' : 'not-allowed',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Информация о магазине (только для чтения) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.15)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', marginBottom: 12 }}>
            Статистика магазина
          </h2>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Рейтинг</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#F4A261' }}>
                {shop?.rating?.toFixed(1) || '0.0'} ★
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Отзывов</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
                {shop?.reviews_count || 0}
              </p>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(244, 162, 97, 0.4)',
            }}
          >
            <Store style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
              Редактировать
            </span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              style={{
                flex: 1,
                background: 'rgba(45, 79, 94, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '16px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>
                Отмена
              </span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                border: 'none',
                borderRadius: 14,
                padding: '16px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? (
                <Loader2 style={{ width: 18, height: 18, color: '#FFFFFF', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Save style={{ width: 18, height: 18, color: '#FFFFFF' }} strokeWidth={2.5} />
              )}
              <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </span>
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
