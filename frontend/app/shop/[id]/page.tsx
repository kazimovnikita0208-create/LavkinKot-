'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Plus, Flame, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';
import { useShop, useShopProducts } from '@/hooks';
import { Product } from '@/lib/api';
import { useTelegramBackButton } from '@/hooks/useTelegram';

// Функция для получения изображения товара
const getProductImage = (product: Product): string => {
  if (product.image_url && !product.image_url.startsWith('/images/')) {
    return product.image_url;
  }
  // Fallback изображения по категориям
  const categoryImages: Record<string, string> = {
    'Молочные продукты': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&q=80',
    'Мясо': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop&q=80',
    'Овощи': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&q=80',
    'Напитки': 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=400&fit=crop&q=80',
    'Хлеб': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80',
    'Выпечка': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80',
    'Торты': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80',
  };
  return categoryImages[product.category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80';
};

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.id as string;

  useTelegramBackButton();
  
  const { shop, isLoading: shopLoading, error: shopError } = useShop(shopId);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  
  const { products, categories, isLoading: productsLoading } = useShopProducts(
    shopId, 
    { category: selectedCategory === 'Все' ? undefined : selectedCategory, limit: 100 }
  );
  
  const { addItem, getTotalItems, getTotalPrice } = useCart();
  
  const cartCount = getTotalItems();
  const cartTotal = getTotalPrice();

  // Устанавливаем первую категорию при загрузке
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'Все') {
      // Оставляем "Все" как опцию
    }
  }, [categories]);

  const allCategories = ['Все', ...categories];

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      oldPrice: product.old_price ? Number(product.old_price) : undefined,
      weight: product.weight || '',
      image: getProductImage(product),
      shopName: shop?.name || '',
      shopId: shopId,
    });
  };

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (shopLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1A2F3A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Loader2 style={{ width: 48, height: 48, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1A2F3A', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 20,
      }}>
        <p style={{ color: '#F4A261', fontSize: 18, marginBottom: 16 }}>Магазин не найден</p>
        <button 
          onClick={() => router.back()}
          style={{
            backgroundColor: '#F4A261',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A2F3A', paddingBottom: 160, position: 'relative' }}>
      
      {/* Анимированный фон */}
      <AnimatedBackground />
      
      {/* HEADER */}
      <header style={{ 
        padding: '16px 16px 8px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Кнопка назад, название, логотип */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button 
            onClick={() => router.back()}
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
            fontSize: 20, 
            fontWeight: 700, 
            color: '#FFFFFF',
            flex: 1,
          }}>
            {shop.name}
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

        {/* Табы категорий */}
        <div 
          className="horizontal-scroll"
          style={{ 
            display: 'flex', 
            gap: 10, 
            paddingBottom: 8,
            overflowX: 'auto',
          }}
        >
          {allCategories.map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                flexShrink: 0,
                padding: '10px 18px',
                borderRadius: 14,
                border: selectedCategory === category ? 'none' : '1px solid rgba(255,255,255,0.1)',
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)' 
                  : 'rgba(38, 73, 92, 0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: selectedCategory === category ? '#FFFFFF' : '#B8C5D0',
                fontSize: 14,
                fontWeight: selectedCategory === category ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === category 
                  ? '0 4px 12px rgba(244, 162, 97, 0.4)' 
                  : '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN - ТОВАРЫ */}
      <main style={{ marginTop: 16, padding: '0 16px', position: 'relative', zIndex: 10 }}>
        
        {productsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Loader2 style={{ width: 32, height: 32, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: '#B8C5D0', fontSize: 16 }}>Товары не найдены</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}>
            {filteredProducts.map((product) => {
              const hasDiscount = product.old_price && Number(product.old_price) > Number(product.price);
              const discountPercent = hasDiscount 
                ? Math.round((1 - Number(product.price) / Number(product.old_price!)) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  style={{ 
                    borderRadius: 18,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    backgroundColor: 'rgba(45, 79, 94, 0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  {/* Изображение товара */}
                  <div style={{ 
                    height: 140, 
                    width: '100%', 
                    position: 'relative', 
                    background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.9) 0%, rgba(38, 73, 92, 0.7) 100%)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Бейдж скидки */}
                    {hasDiscount && (
                      <span style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '5px 10px',
                        borderRadius: 10,
                        boxShadow: '0 2px 8px rgba(244, 162, 97, 0.4)',
                      }}>
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Информация о товаре */}
                  <div style={{ padding: 12 }}>
                    <h3 style={{ 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: '#FFFFFF', 
                      marginBottom: 4,
                      lineHeight: 1.3,
                      minHeight: 36,
                    }}>
                      {product.name}
                    </h3>
                    
                    <p style={{ 
                      fontSize: 12, 
                      color: '#B8C5D0', 
                      marginBottom: 8,
                      fontWeight: 500,
                    }}>
                      {product.weight || '—'}
                    </p>

                    {/* Цена и кнопка */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ 
                          fontSize: 16, 
                          fontWeight: 700, 
                          color: '#FFFFFF',
                        }}>
                          {Number(product.price).toLocaleString('ru-RU')} ₽
                        </span>
                        {hasDiscount && (
                          <span style={{ 
                            fontSize: 12, 
                            color: '#B8C5D0',
                            textDecoration: 'line-through',
                            fontWeight: 500,
                          }}>
                            {Number(product.old_price).toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                      </div>
                      
                      {/* Кнопка добавить */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Plus style={{ width: 22, height: 22, color: '#FFFFFF' }} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ПЛАШКА МИНИМАЛЬНОГО ЗАКАЗА */}
      <div style={{
        position: 'fixed',
        bottom: cartCount > 0 ? 90 : 24,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        transition: 'bottom 0.3s ease',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(38, 73, 92, 0.95) 0%, rgba(38, 73, 92, 0.85) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(244, 162, 97, 0.3)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          maxWidth: 343,
          width: 'calc(100% - 32px)',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: 'rgba(244, 162, 97, 0.2)',
            border: '1.5px solid rgba(244, 162, 97, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Минимальный заказ от <span style={{ color: '#F4A261', fontWeight: 700 }}>{shop.min_order_amount} ₽</span>
          </span>
        </div>
      </div>

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
            <span style={{ fontWeight: 700, fontSize: 16 }}>{cartTotal.toLocaleString('ru-RU')} ₽</span>
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
