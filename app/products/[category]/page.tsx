'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, Clock } from 'lucide-react';

export default function ProductCategoryShopsPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;

  // Маппинг категорий товаров к типам магазинов
  const categoryToShopType: Record<string, string> = {
    'fruits': 'fruits',
    'bakery': 'bakeries',
    'frozen': 'stores',
    'sushi': 'restaurants',
    'fruits2': 'fruits',
    'bakery2': 'bakeries',
    'frozen2': 'stores',
    'sushi2': 'restaurants',
    'bakery3': 'bakeries',
    'fruits3': 'fruits',
  };

  // Названия категорий
  const categoryNames: Record<string, string> = {
    'fruits': 'Фрукты',
    'bakery': 'Выпечка',
    'frozen': 'Полуфабрикаты',
    'sushi': 'Суши',
    'fruits2': 'Овощи',
    'bakery2': 'Десерты',
    'frozen2': 'Напитки',
    'sushi2': 'Закуски',
    'bakery3': 'Торты',
    'fruits3': 'Ягоды',
  };

  // Mock данные магазинов по категориям со стильными изображениями
  const shopsByCategory: Record<string, any[]> = {
    'fruits': [
      { id: '2', name: 'Фруктовый рай', category: 'Фрукты · Овощи', rating: 4.7, time: '25-35 мин', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=600&fit=crop&q=80' },
      { id: '5', name: 'Свежий урожай', category: 'Фрукты · Ягоды', rating: 4.8, time: '20-30 мин', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=600&fit=crop&q=80' },
      { id: '6', name: 'Фруктовая лавка', category: 'Фрукты · Соки', rating: 4.6, time: '30-40 мин', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop&q=80' },
    ],
    'bakeries': [
      { id: '1', name: 'Пекарня "Хлебница"', category: 'Выпечка · Хлеб', rating: 4.9, time: '20-30 мин', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80' },
      { id: '7', name: 'Сладкие грёзы', category: 'Торты · Десерты', rating: 4.8, time: '25-35 мин', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80' },
      { id: '8', name: 'Хлебный дом', category: 'Хлеб · Булочки', rating: 4.7, time: '15-25 мин', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop&q=80' },
    ],
    'restaurants': [
      { id: '3', name: 'Суши-бар Токио', category: 'Суши · Роллы', rating: 4.8, time: '35-45 мин', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80' },
      { id: '9', name: 'Японская кухня', category: 'Суши · Сашими', rating: 4.9, time: '40-50 мин', image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800&h=600&fit=crop&q=80' },
      { id: '10', name: 'Ресторан "Вкусно"', category: 'Европейская кухня', rating: 4.6, time: '45-60 мин', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80' },
    ],
    'stores': [
      { id: '4', name: 'Магазин "Продукты"', category: 'Продукты · Бакалея', rating: 4.5, time: '20-30 мин', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&q=80' },
      { id: '11', name: 'Универсам "У дома"', category: 'Продукты · Напитки', rating: 4.7, time: '15-25 мин', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&q=80' },
    ],
  };

  const shopType = categoryToShopType[category] || 'stores';
  const shops = shopsByCategory[shopType] || [];
  const categoryName = categoryNames[category] || 'Товары';

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(38, 73, 92, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '16px',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <button
            onClick={() => router.push('/')}
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

        <p style={{
          fontSize: 13,
          color: '#94A3B8',
          textAlign: 'center',
          fontWeight: 600,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          {shops.length} {shops.length === 1 ? 'магазин' : shops.length < 5 ? 'магазина' : 'магазинов'}
        </p>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '0 16px 100px',
      }}>
        
        {shops.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => router.push(`/shop/${shop.id}`)}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
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
                {/* Изображение магазина */}
                <div style={{ 
                  height: 140,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#2D4F5E',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={shop.image} 
                    alt={shop.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(26, 47, 58, 0.85), transparent)',
                  }} />
                </div>

                {/* Информация о магазине */}
                <div style={{ padding: 16 }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 6,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {shop.name}
                  </h3>

                  <p style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    marginBottom: 12,
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {shop.category}
                  </p>

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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 14,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Магазинов не найдено
            </p>
          </div>
        )}

      </main>

      {/* Floating Cart Button */}
      <div
        onClick={() => router.push('/cart')}
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
          borderRadius: 999,
          padding: '12px 24px',
          boxShadow: '0 8px 30px rgba(244, 162, 97, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 343,
          width: 'calc(100% - 32px)',
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
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            3
          </span>
        </div>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#FFFFFF',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          Корзина
        </span>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.7)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          ·
        </span>
        <span style={{
          fontSize: 16,
          fontWeight: 900,
          color: '#FFFFFF',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
          1250 ₽
        </span>
      </div>
    </div>
  );
}
