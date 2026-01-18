'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search, Heart, Star, Clock, ArrowLeft, ShoppingCart } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// Типы категорий
const categoryNames: Record<string, string> = {
  stores: 'Магазины',
  bakeries: 'Пекарни',
  fruits: 'Фруктовые лавки',
  restaurants: 'Рестораны',
};

// Mock данные для разных категорий со стильными изображениями
const mockShops: Record<string, any[]> = {
  stores: [
    { id: '1', name: 'Продуктовый "У дома"', category: 'Продукты · Напитки', rating: 4.8, reviewCount: 850, time: '15-25 мин', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&q=80', discount: '-15%', cashback: 'BACK200' },
    { id: '2', name: 'Магазин "Свежесть"', category: 'Продукты · Фрукты', rating: 4.6, reviewCount: 620, time: '20-30 мин', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&q=80' },
    { id: '3', name: 'Супермаркет "Находка"', category: 'Продукты · Деликатесы', rating: 4.9, reviewCount: 1200, time: '25-35 мин', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=600&fit=crop&q=80', cashback: 'BACK300' },
  ],
  bakeries: [
    { id: '1', name: 'Пекарня "Хлебница"', category: 'Выпечка · Хлеб', rating: 4.9, reviewCount: 1100, time: '20-30 мин', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80', discount: '-25%', cashback: 'BACK400' },
    { id: '2', name: 'Булочная "Свежий хлеб"', category: 'Выпечка · Десерты', rating: 4.7, reviewCount: 890, time: '15-25 мин', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop&q=80' },
    { id: '3', name: 'Пироговая "Вкуснотища"', category: 'Пироги · Торты', rating: 4.8, reviewCount: 1050, time: '25-35 мин', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80', discount: '-20%' },
  ],
  fruits: [
    { id: '1', name: 'Фруктовый рай', category: 'Фрукты · Овощи', rating: 4.7, reviewCount: 920, time: '25-35 мин', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=600&fit=crop&q=80', discount: '-20%' },
    { id: '2', name: 'Свежие фрукты', category: 'Фрукты · Ягоды', rating: 4.6, reviewCount: 750, time: '30-40 мин', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=600&fit=crop&q=80', cashback: 'BACK250' },
    { id: '3', name: 'Овощная лавка', category: 'Овощи · Зелень', rating: 4.8, reviewCount: 1100, time: '20-30 мин', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&q=80' },
  ],
  restaurants: [
    { id: '1', name: 'ROSTIC\'S', category: 'Фастфуд, Бургеры, Десерты, Ланчи', rating: 4.6, reviewCount: 1100, time: '35-45 мин', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=600&fit=crop&q=80', discount: '-400₽', cashback: 'BACK400' },
    { id: '2', name: 'Вкусная - и точка', category: 'Бургеры, Завтраки, Фастфуд, Кофе', rating: 4.4, reviewCount: 3700, time: '40-50 мин', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&q=80', discount: '-400₽', cashback: 'BACK400' },
    { id: '3', name: 'Суши-бар Токио', category: 'Суши · Роллы', rating: 4.8, reviewCount: 980, time: '35-45 мин', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80', discount: '-30%' },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartCount] = useState(3);
  const [cartTotal] = useState(1250);

  const categoryName = categoryNames[type] || 'Магазины';
  const shops = mockShops[type] || mockShops.stores;

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
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          />
        </div>
      </header>

      {/* MAIN */}
      <main style={{ marginTop: 24, padding: '0 16px', position: 'relative', zIndex: 10 }}>
        
        {/* Список магазинов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {shops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => router.push(`/shop/${shop.id}`)}
              style={{ 
                borderRadius: 20,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                position: 'relative',
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
              <div style={{ height: 140, width: '100%', position: 'relative', backgroundColor: '#2D4F5E' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={shop.image} 
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

                {/* Badges */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                  {shop.discount && (
                    <span style={{
                      background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '5px 10px',
                      borderRadius: 8,
                      letterSpacing: '0.01em',
                      boxShadow: '0 2px 8px rgba(244, 162, 97, 0.3)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {shop.discount}
                    </span>
                  )}
                  {shop.cashback && (
                    <span style={{
                      background: 'rgba(45, 79, 94, 0.9)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      color: '#F4A261',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '5px 10px',
                      borderRadius: 8,
                      border: '1px solid rgba(244, 162, 97, 0.3)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {shop.cashback}
                    </span>
                  )}
                </div>

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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'rgba(244, 162, 97, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(244, 162, 97, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(26, 47, 58, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
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
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {shop.name}
                </h3>
                
                <p style={{ 
                  fontSize: 12, 
                  color: '#94A3B8', 
                  marginBottom: 10,
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {shop.category}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star style={{ width: 14, height: 14, color: '#F4A261', fill: '#F4A261' }} strokeWidth={2} />
                    <span style={{ 
                      fontSize: 13, 
                      fontWeight: 700, 
                      color: '#F4A261',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {shop.rating}
                    </span>
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      color: '#94A3B8',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      ({shop.reviewCount}+)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 14, height: 14, color: '#94A3B8' }} strokeWidth={2} />
                    <span style={{ 
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#B8C5D0',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {shop.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
          }}>
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
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {cartCount}
              </span>
            </div>
            <span style={{ 
              fontWeight: 600, 
              fontSize: 16,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>Корзина</span>
            <span style={{ 
              fontWeight: 700, 
              fontSize: 16,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>{cartTotal.toLocaleString('ru-RU')}₽</span>
          </button>
        </div>
      )}
      
    </div>
  );
}
