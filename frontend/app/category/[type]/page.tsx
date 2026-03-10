'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search, Heart, Star, Clock, ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useShops } from '@/hooks';
import { useCart } from '@/contexts/CartContext';
import { Shop } from '@/lib/api';

// Маппинг типов URL на категории backend
const categoryMapping: Record<string, string> = {
  stores: 'store',
  bakeries: 'bakery',
  fruits: 'fruit',
  restaurants: 'restaurant',
};

// Типы категорий для отображения
const categoryNames: Record<string, string> = {
  stores: 'Магазины',
  bakeries: 'Пекарни',
  fruits: 'Фруктовые лавки',
  restaurants: 'Рестораны',
};

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
  const categoryTexts: Record<string, string> = {
    store: 'Продукты · Напитки',
    bakery: 'Выпечка · Хлеб',
    fruit: 'Фрукты · Овощи',
    restaurant: 'Ресторан · Кухня',
  };
  return categoryTexts[shop.category] || 'Магазин';
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const { getTotalItems, getTotalPrice } = useCart();
  const cartCount = getTotalItems();
  const cartTotal = getTotalPrice();

  // Получаем категорию для API
  const backendCategory = categoryMapping[type] || 'store';
  
  // Загружаем магазины из API
  const { shops, isLoading, error } = useShops({ 
    category: backendCategory,
    limit: 20 
  });

  const categoryName = categoryNames[type] || 'Магазины';

  // Фильтрация по поиску
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (shopId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(shopId)) {
        newFavorites.delete(shopId);
      } else {
        newFavorites.add(shopId);
      }
      return newFavorites;
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A2F3A', paddingBottom: 120, position: 'relative' }}>
      
      {/* Анимированный фон */}
      <AnimatedBackground />
      
      {/* HEADER */}
      <header style={{ padding: '16px 16px 8px', position: 'relative', zIndex: 10 }}>
        {/* Кнопка назад и заголовок */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button 
            onClick={() => router.push('/')}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft style={{ width: 24, height: 24, color: '#F4A261' }} strokeWidth={2} />
          </button>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: '#FFFFFF',
            flex: 1,
            marginLeft: 16,
          }}>
            {categoryName}
          </h1>
          {/* Логотип */}
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
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

        {/* Поисковая строка */}
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
            placeholder="Поиск"
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
            }}
          />
        </div>
      </header>

      {/* MAIN */}
      <main style={{ marginTop: 24, padding: '0 16px', position: 'relative', zIndex: 10 }}>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 style={{ width: 40, height: 40, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: '#F4A261', fontSize: 16 }}>Ошибка загрузки</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: '#B8C5D0', fontSize: 16 }}>
              {searchQuery ? 'Ничего не найдено' : 'Магазины не найдены'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => router.push(`/shop/${shop.id}`)}
                style={{ 
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Изображение */}
                <div style={{ height: 140, width: '100%', position: 'relative', backgroundColor: '#2D4F5E' }}>
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
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Градиент снизу */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(26, 47, 58, 0.85), transparent)',
                  }} />

                  {/* Кнопка избранного */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(shop.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(26, 47, 58, 0.9)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Heart 
                      style={{ 
                        width: 18, 
                        height: 18, 
                        color: favorites.has(shop.id) ? '#F4A261' : '#B8C5D0',
                        fill: favorites.has(shop.id) ? '#F4A261' : 'none',
                      }} 
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Информация */}
                <div style={{ padding: 16 }}>
                  <h3 style={{ 
                    fontSize: 16, 
                    fontWeight: 800, 
                    color: '#FFFFFF', 
                    marginBottom: 6,
                  }}>
                    {shop.name}
                  </h3>
                  
                  <p style={{ 
                    fontSize: 12, 
                    color: '#94A3B8', 
                    marginBottom: 10,
                    fontWeight: 600,
                  }}>
                    {getCategoryText(shop)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star style={{ width: 14, height: 14, color: '#F4A261', fill: '#F4A261' }} strokeWidth={2} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#F4A261' }}>
                        {shop.rating}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                        ({shop.reviews_count}+)
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock style={{ width: 14, height: 14, color: '#94A3B8' }} />
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>
                        {shop.delivery_time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
              boxShadow: '0 10px 40px rgba(244,162,97,0.6)'
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

      {/* CSS для анимации */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
    </div>
  );
}
