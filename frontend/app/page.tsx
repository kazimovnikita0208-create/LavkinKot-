'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, User, Store, Croissant, Apple, UtensilsCrossed,
  Star, Clock, ShoppingCart, Loader2
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';
import { useShops, usePromotions } from '@/hooks';
import { Shop, Promotion } from '@/lib/api';
import { ErrorState, SkeletonCard, EmptyState } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';

// Маппинг категорий магазинов на типы backend
const categoryMapping: Record<string, string> = {
  'stores': 'store',
  'bakeries': 'bakery',
  'fruits': 'fruit',
  'restaurants': 'restaurant',
};

const storeCategories = [
  { id: 'stores', name: 'Магазины', icon: Store, color: '#F4A261', bg: '#26495C' },
  { id: 'bakeries', name: 'Пекарни', icon: Croissant, color: '#F4A261', bg: '#26495C' },
  { id: 'fruits', name: 'Фрукты', icon: Apple, color: '#F4A261', bg: '#26495C' },
  { id: 'restaurants', name: 'Рестораны', icon: UtensilsCrossed, color: '#F4A261', bg: '#26495C' },
];

// Стильные изображения категорий товаров
const productCategories = [
  { id: 'fruits', name: 'Фрукты', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop&q=80' },
  { id: 'bakery', name: 'Выпечка', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80' },
  { id: 'sushi', name: 'Суши', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&q=80' },
  { id: 'vegetables', name: 'Овощи', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&q=80' },
  { id: 'desserts', name: 'Десерты', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&q=80' },
  { id: 'drinks', name: 'Напитки', image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop&q=80' },
  { id: 'snacks', name: 'Закуски', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&q=80' },
  { id: 'cakes', name: 'Торты', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&q=80' },
];

// Функция для получения изображения магазина
const getShopImage = (shop: Shop): string => {
  // Приоритет: cover_url > image_url > fallback
  if (shop.cover_url && !shop.cover_url.startsWith('/images/')) {
    return shop.cover_url;
  }
  if (shop.image_url && !shop.image_url.startsWith('/images/')) {
    return shop.image_url;
  }
  // Fallback изображения по категориям
  const categoryImages: Record<string, string> = {
    store: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&q=80',
    bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
    fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=600&fit=crop&q=80',
    restaurant: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80',
  };
  return categoryImages[shop.category] || categoryImages.store;
};

// Функция для получения текста категории
const getCategoryText = (shop: Shop): string => {
  const categoryNames: Record<string, string> = {
    store: 'Продукты',
    bakery: 'Выпечка · Хлеб',
    fruit: 'Фрукты · Овощи',
    restaurant: 'Ресторан · Кухня',
  };
  return categoryNames[shop.category] || 'Магазин';
};

export default function HomePage() {
  const router = useRouter();
  const { getTotalItems, getTotalPrice } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Получаем данные из API
  const { shops, isLoading: shopsLoading, error: shopsError, refetch: refetchShops } = useShops({ limit: 6, search: debouncedSearch || undefined });
  const { promotions, isLoading: promotionsLoading } = usePromotions();
  
  const cartCount = getTotalItems();
  const cartTotal = getTotalPrice();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A2F3A', paddingBottom: 120, position: 'relative' }}>
      
      {/* Анимированный фон */}
      <AnimatedBackground />
      
      {/* HEADER */}
      <header style={{ padding: '16px 16px 8px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 320, margin: '0 auto 16px' }}>
          <button
            onClick={() => router.push('/profile')}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
          >
            <User style={{ width: 36, height: 36, color: '#F4A261' }} strokeWidth={2} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.png" 
            alt="ЛавкинКот" 
            style={{ 
              height: 62,
              width: 'auto',
              maxWidth: 240,
              objectFit: 'contain'
            }} 
          />
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#26495C', 
          borderRadius: 16, 
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          <Search style={{ width: 20, height: 20, color: '#F4A261', marginRight: 12 }} strokeWidth={2} />
          <input
            type="text"
            placeholder="Поиск товаров и магазинов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flex: 1, 
              backgroundColor: 'transparent', 
              border: 'none', 
              outline: 'none',
              fontSize: 15,
              fontWeight: 500,
              color: '#FFFFFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          />
        </div>
      </header>

      {/* MAIN */}
      <main style={{ marginTop: 24, position: 'relative', zIndex: 10 }}>
        
        {/* Категории магазинов 2×2 */}
        <section style={{ padding: '0 16px', marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {storeCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/category/${cat.id}`)}
                  style={{ 
                    backgroundColor: 'rgba(45, 79, 94, 0.4)',
                    borderRadius: 24,
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    height: 140,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <Icon style={{ width: 40, height: 40, color: cat.color, filter: 'drop-shadow(0 2px 6px rgba(244, 162, 97, 0.4))' }} strokeWidth={1.5} />
                  </div>
                  <span style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: '#FFFFFF', 
                    textAlign: 'center',
                  }}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Категории товаров */}
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ 
            padding: '0 16px', 
            fontSize: 11, 
            fontWeight: 700, 
            color: '#FFFFFF', 
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 16,
          }}>
            Категории товаров
          </h3>
          <div 
            className="horizontal-scroll"
            style={{ 
              display: 'flex', 
              gap: 12, 
              paddingLeft: 16, 
              paddingRight: 32,
              overflowX: 'auto',
            }}
          >
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/products/${cat.id}`)}
                style={{ 
                  flexShrink: 0,
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                  backgroundColor: '#2D4F5E',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                }} />
                <span style={{
                  position: 'absolute',
                  bottom: 6,
                  left: 6,
                  right: 6,
                  color: '#FFFFFF',
                  fontSize: 9,
                  fontWeight: 700,
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                }}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Акции - данные из API */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ 
            padding: '0 16px', 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#FFFFFF',
            marginBottom: 16,
          }}>
            Акции
          </h2>
          {promotionsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <Loader2 style={{ width: 24, height: 24, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div 
              className="horizontal-scroll"
              style={{ 
                display: 'flex', 
                gap: 16, 
                paddingLeft: 16, 
                paddingRight: 32,
                overflowX: 'auto',
              }}
            >
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  style={{ 
                    flexShrink: 0,
                    width: 220,
                    height: 140,
                    borderRadius: 20,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
                    backgroundColor: '#2D4F5E'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={promo.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80'} 
                    alt={promo.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))'
                  }} />
                  {promo.discount_percent && (
                    <span style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#F4A261',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '6px 10px',
                      borderRadius: 10,
                    }}>
                      -{promo.discount_percent}%
                    </span>
                  )}
                  <div style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 14,
                    right: 14
                  }}>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: 11, 
                      marginBottom: 4,
                      fontWeight: 500,
                    }}>
                      {promo.shop?.name || 'Акция'}
                    </p>
                    <p style={{ 
                      color: '#FFFFFF', 
                      fontSize: 15, 
                      fontWeight: 700,
                    }}>
                      {promo.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Топ магазины - данные из API */}
        <section style={{ padding: '0 16px' }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#FFFFFF',
            marginBottom: 16,
          }}>
            Топ магазины
          </h2>
          {shopsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : shopsError ? (
            <ErrorState
              message="Не удалось загрузить магазины"
              onRetry={refetchShops}
            />
          ) : shops.length === 0 ? (
            <EmptyState
              title={debouncedSearch ? 'Ничего не найдено' : 'Магазинов пока нет'}
              subtitle={debouncedSearch ? `По запросу "${debouncedSearch}" магазины не найдены` : 'Скоро здесь появятся магазины'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => router.push(`/shop/${shop.id}`)}
                  style={{ 
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    backgroundColor: '#2D4F5E',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ height: 120, width: '100%', position: 'relative', backgroundColor: '#1A2F3A' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getShopImage(shop)} 
                      alt={shop.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ 
                      fontSize: 16, 
                      fontWeight: 700, 
                      color: '#FFFFFF', 
                      marginBottom: 4,
                    }}>
                      {shop.name}
                    </h3>
                    <p style={{ 
                      fontSize: 13, 
                      color: '#B8C5D0', 
                      marginBottom: 12,
                      fontWeight: 500,
                    }}>
                      {getCategoryText(shop)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star style={{ width: 16, height: 16, color: '#F4A261', fill: '#F4A261' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
                          {shop.rating}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock style={{ width: 14, height: 14, color: '#B8C5D0' }} />
                        <span style={{ fontSize: 12, color: '#B8C5D0' }}>
                          {shop.delivery_time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* КОРЗИНА */}
      {cartCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 343,
          zIndex: 50
        }}>
          <button 
            onClick={() => router.push('/cart')}
            style={{
              width: '100%',
              backgroundColor: '#F4A261',
              color: '#fff',
              padding: '16px 20px',
              borderRadius: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(244,162,97,0.6), 0 0 0 1px rgba(244,162,97,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart style={{ width: 20, height: 20 }} strokeWidth={2} />
              <span style={{
                width: 24,
                height: 24,
                backgroundColor: '#26495C',
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                {cartCount}
              </span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Корзина</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{cartTotal.toLocaleString('ru-RU')}₽</span>
          </button>
        </div>
      )}

      {/* CSS для анимации загрузки */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
    </div>
  );
}
