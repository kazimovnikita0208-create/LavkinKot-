'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, RefreshCw, Store, ShoppingCart } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useShops } from '@/hooks';
import { useCart } from '@/contexts/CartContext';
import { Shop } from '@/lib/api';

// Маппинг URL-слага продуктовой категории → категория магазина в БД
const slugToShopCategory: Record<string, string> = {
  fruits:     'fruit',
  fruits2:    'fruit',
  fruits3:    'fruit',
  bakery:     'bakery',
  bakery2:    'bakery',
  bakery3:    'bakery',
  frozen:     'store',
  frozen2:    'store',
  sushi:      'restaurant',
  sushi2:     'restaurant',
};

const categoryDisplayNames: Record<string, string> = {
  fruits:     'Фрукты',
  bakery:     'Выпечка',
  frozen:     'Полуфабрикаты',
  sushi:      'Суши',
  fruits2:    'Овощи',
  bakery2:    'Десерты',
  frozen2:    'Напитки',
  sushi2:     'Закуски',
  bakery3:    'Торты',
  fruits3:    'Ягоды',
};

function getShopImage(shop: Shop): string {
  if (shop.cover_url) return shop.cover_url;
  if (shop.image_url) return shop.image_url;
  return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&q=80';
}

function pluralShops(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'магазин';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'магазина';
  return 'магазинов';
}

export default function ProductCategoryShopsPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;

  const shopCategory = slugToShopCategory[category];
  const categoryName = categoryDisplayNames[category] || 'Товары';

  const { shops, isLoading, error, refetch } = useShops({
    category: shopCategory,
    limit: 50,
  });

  const { items: cartItems } = useCart();
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{
      backgroundColor: '#1A2F3A',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(38, 73, 92, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button
            onClick={() => router.push('/')}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{
            fontSize: 20, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            {categoryName}
          </h1>

          <button
            onClick={refetch}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RefreshCw
              style={{ width: 18, height: 18, color: '#F4A261' }}
              className={isLoading ? 'animate-spin-custom' : ''}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {!isLoading && (
          <p style={{
            fontSize: 13, color: '#94A3B8', textAlign: 'center', fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            {shops.length} {pluralShops(shops.length)}
          </p>
        )}
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: `0 16px ${cartCount > 0 ? 110 : 24}px` }}>

        {/* Ошибка */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF4444',
          }}>
            {error.message}
          </div>
        )}

        {/* Загрузка */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <RefreshCw className="animate-spin-custom" style={{ width: 32, height: 32, color: '#F4A261' }} />
          </div>
        )}

        {/* Нет категории в БД */}
        {!isLoading && !shopCategory && (
          <div style={{
            background: 'rgba(45, 79, 94, 0.5)', borderRadius: 16, padding: 40, textAlign: 'center',
          }}>
            <Store style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
              Категория не найдена
            </p>
          </div>
        )}

        {/* Пустой список */}
        {!isLoading && shopCategory && shops.length === 0 && !error && (
          <div style={{
            background: 'rgba(45, 79, 94, 0.5)', borderRadius: 16, padding: 40, textAlign: 'center',
          }}>
            <Store style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
              Магазинов не найдено
            </p>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>
              В этой категории пока нет активных магазинов
            </p>
          </div>
        )}

        {/* Список магазинов */}
        {!isLoading && shops.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => router.push(`/shop/${shop.id}`)}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(244, 162, 97, 0.1)';
                }}
              >
                {/* Изображение */}
                <div style={{ height: 140, position: 'relative', overflow: 'hidden', backgroundColor: '#2D4F5E' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getShopImage(shop)}
                    alt={shop.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                    background: 'linear-gradient(to top, rgba(26, 47, 58, 0.85), transparent)',
                  }} />
                  {!shop.is_active && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(239, 68, 68, 0.85)', borderRadius: 8,
                      padding: '3px 8px', fontSize: 11, color: '#FFFFFF', fontWeight: 700,
                    }}>
                      Закрыт
                    </div>
                  )}
                </div>

                {/* Информация */}
                <div style={{ padding: 16 }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 4,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {shop.name}
                  </h3>
                  {shop.description && (
                    <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 500 }}>
                      {shop.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {shop.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star style={{ width: 14, height: 14, color: '#F4A261', fill: '#F4A261' }} strokeWidth={2} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#F4A261' }}>{shop.rating}</span>
                      </div>
                    )}
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{shop.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Плавающая корзина */}
      {cartCount > 0 && (
        <div
          onClick={() => router.push('/cart')}
          style={{
            position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 50,
            background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            borderRadius: 999, padding: '12px 24px',
            boxShadow: '0 8px 30px rgba(244, 162, 97, 0.4)',
            cursor: 'pointer', transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', gap: 12,
            maxWidth: 343, width: 'calc(100% - 32px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(244, 162, 97, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(244, 162, 97, 0.4)';
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>{cartCount}</span>
          </div>
          <ShoppingCart style={{ width: 18, height: 18, color: '#FFFFFF' }} strokeWidth={2.5} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>Корзина</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', marginLeft: 'auto' }}>
            {cartTotal} ₽
          </span>
        </div>
      )}
    </div>
  );
}
