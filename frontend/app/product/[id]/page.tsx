'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';
import { useProduct, useRecommendedProducts } from '@/hooks';
import { Product } from '@/lib/api';

// Функция для получения изображения товара
const getProductImage = (product: Product): string => {
  if (product.image_url && !product.image_url.startsWith('/images/')) {
    return product.image_url;
  }
  // Fallback изображения по категориям
  const categoryImages: Record<string, string> = {
    'Молочные продукты': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop&q=80',
    'Мясо': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&q=80',
    'Овощи': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop&q=80',
    'Напитки': 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600&h=600&fit=crop&q=80',
    'Хлеб': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop&q=80',
    'Выпечка': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop&q=80',
    'Торты': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&q=80',
  };
  return categoryImages[product.category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop&q=80';
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { product, isLoading, error } = useProduct(productId);
  const { products: recommendedProducts } = useRecommendedProducts(productId, 4);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        oldPrice: product.old_price ? Number(product.old_price) : undefined,
        weight: product.weight || '',
        image: getProductImage(product),
        shopName: product.shop?.name || '',
        shopId: product.shop_id,
      });
    }
    router.push('/cart');
  };

  if (isLoading) {
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

  if (error || !product) {
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
        <p style={{ color: '#F4A261', fontSize: 18, marginBottom: 16 }}>Товар не найден</p>
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

  const hasDiscount = product.old_price && Number(product.old_price) > Number(product.price);
  const discountPercent = hasDiscount 
    ? Math.round((1 - Number(product.price) / Number(product.old_price!)) * 100)
    : 0;
  const totalPrice = (Number(product.price) * quantity).toFixed(2);

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 120 }}>
      
      {/* Анимированный фон */}
      <AnimatedBackground />
      
      {/* HEADER */}
      <header style={{ 
        padding: '16px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
            fontSize: 18, 
            fontWeight: 700, 
            color: '#FFFFFF',
            flex: 1,
          }}>
            {product.category}
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
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ИЗОБРАЖЕНИЕ ТОВАРА */}
        <div style={{ 
          position: 'relative',
          height: 380,
          background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.95) 0%, rgba(38, 73, 92, 0.85) 50%, rgba(26, 47, 58, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Декоративные элементы */}
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 162, 97, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={getProductImage(product)} 
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
            }}
          />
          
          {/* Бейдж скидки */}
          {hasDiscount && (
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 800,
              padding: '10px 18px',
              borderRadius: 14,
              boxShadow: '0 6px 20px rgba(244, 162, 97, 0.5)',
              zIndex: 2,
            }}>
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* ИНФОРМАЦИЯ О ТОВАРЕ */}
        <div style={{ padding: '28px 20px' }}>
          
          {/* Название и описание */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ 
              fontSize: 28, 
              fontWeight: 800, 
              color: '#FFFFFF', 
              marginBottom: 8,
              lineHeight: 1.15,
            }}>
              {product.name}
            </h2>
            
            {product.weight && (
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(244, 162, 97, 0.15)',
                border: '1px solid rgba(244, 162, 97, 0.3)',
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 14, color: '#F4A261', fontWeight: 700 }}>
                  {product.weight}
                </span>
              </div>
            )}
            
            {product.description && (
              <p style={{ 
                fontSize: 16, 
                color: '#D4DBE1', 
                lineHeight: 1.6,
                fontWeight: 500,
              }}>
                {product.description}
              </p>
            )}
          </div>

          {/* Состав */}
          {product.composition && (
            <div style={{ 
              marginBottom: 28,
              padding: 20,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 4,
                  height: 20,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                }} />
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 800, 
                  color: '#FFFFFF', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  Состав
                </h3>
              </div>
              <p style={{ fontSize: 15, color: '#D4DBE1', lineHeight: 1.6, fontWeight: 500 }}>
                {product.composition}
              </p>
            </div>
          )}

          {/* Вам может понравиться */}
          {recommendedProducts.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                }} />
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>
                  Вам может понравиться
                </h3>
              </div>
              
              <div className="horizontal-scroll" style={{ 
                display: 'flex', 
                gap: 12,
                marginLeft: -16,
                paddingLeft: 16,
                paddingRight: 16,
                overflowX: 'auto',
              }}>
                {recommendedProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/product/${item.id}`)}
                    style={{ 
                      flexShrink: 0,
                      width: 130,
                      borderRadius: 18,
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ 
                      height: 100, 
                      background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.9) 0%, rgba(38, 73, 92, 0.7) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={getProductImage(item)} 
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div style={{ padding: 10 }}>
                      <p style={{ 
                        fontSize: 13, 
                        fontWeight: 700, 
                        color: '#FFFFFF', 
                        marginBottom: 6,
                        lineHeight: 1.2,
                      }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 800, color: '#F4A261' }}>
                        {Number(item.price).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ С ЦЕНОЙ И КНОПКОЙ */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 375,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 1) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(244, 162, 97, 0.2)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.4)',
        padding: '16px',
      }}>
        {/* Название, вес, цена */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <h3 style={{ 
              fontSize: 17, 
              fontWeight: 800, 
              color: '#FFFFFF', 
              marginBottom: 6,
              lineHeight: 1.2,
            }}>
              {product.name}
            </h3>
            <p style={{ fontSize: 14, color: '#B8C5D0', fontWeight: 600 }}>
              {product.weight || '—'}
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            {hasDiscount && (
              <p style={{ 
                fontSize: 14, 
                color: '#B8C5D0',
                textDecoration: 'line-through',
                marginBottom: 4,
                fontWeight: 600,
              }}>
                {Number(product.old_price).toLocaleString('ru-RU')} ₽
              </p>
            )}
            <p style={{ fontSize: 24, fontWeight: 900, color: '#F4A261' }}>
              {totalPrice} ₽
            </p>
          </div>
        </div>

        {/* Счетчик и кнопка добавить */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          
          {/* Счетчик количества */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 18,
            padding: '10px 14px',
            border: '1px solid rgba(244, 162, 97, 0.2)',
          }}>
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: quantity <= 1 
                  ? 'rgba(45, 79, 94, 0.4)' 
                  : 'linear-gradient(135deg, #26495C 0%, #1E3A47 100%)',
                border: quantity <= 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: quantity <= 1 ? 0.4 : 1,
              }}
            >
              <Minus style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
            </button>

            <span style={{ 
              fontSize: 20, 
              fontWeight: 800, 
              color: '#FFFFFF',
              minWidth: 28,
              textAlign: 'center',
            }}>
              {quantity}
            </span>

            <button
              onClick={increaseQuantity}
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
                boxShadow: '0 6px 16px rgba(244, 162, 97, 0.5)',
              }}
            >
              <Plus style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
            </button>
          </div>

          {/* Кнопка добавить */}
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              padding: '18px 24px',
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(244,162,97,0.5)',
              fontWeight: 800,
              fontSize: 17,
            }}
          >
            <ShoppingCart style={{ width: 20, height: 20 }} strokeWidth={2} />
            Добавить
          </button>
        </div>
      </div>

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
