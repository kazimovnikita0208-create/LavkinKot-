'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';

// Mock данные товаров
const productsData: Record<string, any> = {
  '1': {
    name: 'Запеченный ролл Канада',
    weight: '240 г',
    price: 663.20,
    oldPrice: 829,
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=600&h=600&fit=crop&q=80',
    description: 'Это сочетание нежного лосося, свежего айсберга и двух видов сыра, покрытых острым и унаги соусами, с посыпкой из кунжута',
    composition: 'лосось, айсберг, сыры, острый соус, унаги соус, кунжут',
    category: 'Суши',
    shopId: '3',
    shopName: 'Суши-бар Токио',
  },
  '2': {
    name: 'Круассан классический',
    weight: '80 г',
    price: 120,
    oldPrice: 150,
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop&q=80',
    description: 'Воздушный французский круассан из слоёного теста с хрустящей корочкой и нежной текстурой внутри',
    composition: 'мука пшеничная, масло сливочное, молоко, дрожжи, сахар, соль',
    category: 'Выпечка',
    shopId: '1',
    shopName: 'Пекарня "Хлебница"',
  },
  '3': {
    name: 'Яблоки свежие',
    weight: '1 кг',
    price: 120,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop&q=80',
    description: 'Свежие сочные яблоки высшего качества. Идеально подходят для перекуса или приготовления десертов',
    composition: 'яблоки',
    category: 'Фрукты',
    shopId: '2',
    shopName: 'Фруктовый рай',
  },
};

// Рекомендованные товары со стильными изображениями
const recommendedProducts = [
  { id: '2', name: 'Круассан', price: 120, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80' },
  { id: '3', name: 'Яблоки', price: 120, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&q=80' },
  { id: '4', name: 'Багет', price: 89, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80' },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = productsData[productId] || productsData['1'];
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.shopId}-${productId}`,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        weight: product.weight,
        image: product.image,
        shopName: product.shopName,
        shopId: product.shopId,
      });
    }
    router.push('/cart');
  };

  const totalPrice = (product.price * quantity).toFixed(2);

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
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(38, 73, 92, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }} />
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.image} 
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
          {product.discount && (
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
              letterSpacing: '0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              boxShadow: '0 6px 20px rgba(244, 162, 97, 0.5), 0 0 0 1px rgba(244, 162, 97, 0.3)',
              zIndex: 2,
            }}>
              {product.discount}
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
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {product.name}
            </h2>
            
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(244, 162, 97, 0.15)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              marginBottom: 16,
            }}>
              <span style={{ 
                fontSize: 14, 
                color: '#F4A261', 
                fontWeight: 700,
                letterSpacing: '0.02em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {product.weight}
              </span>
            </div>
            
            <p style={{ 
              fontSize: 16, 
              color: '#D4DBE1', 
              lineHeight: 1.6,
              fontWeight: 500,
              letterSpacing: '0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {product.description}
            </p>
          </div>

          {/* Состав */}
          <div style={{ 
            marginBottom: 28,
            padding: 20,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
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
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Состав
              </h3>
            </div>
            <p style={{ 
              fontSize: 15, 
              color: '#D4DBE1', 
              lineHeight: 1.6,
              fontWeight: 500,
              letterSpacing: '0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {product.composition}
            </p>
          </div>

          {/* Вам может понравиться */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 18,
            }}>
              <div style={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              }} />
              <h3 style={{ 
                fontSize: 22, 
                fontWeight: 800, 
                color: '#FFFFFF', 
                letterSpacing: '-0.02em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Вам может понравиться
              </h3>
            </div>
            
            <div className="horizontal-scroll" style={{ 
              display: 'flex', 
              gap: 12,
              marginLeft: -16,
              paddingLeft: 16,
              paddingRight: 16,
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
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.4), 0 0 0 1px rgba(244, 162, 97, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)';
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
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '70%',
                        height: '70%',
                        objectFit: 'contain'
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
                      letterSpacing: '-0.01em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {item.name}
                    </p>
                    <p style={{ 
                      fontSize: 15, 
                      fontWeight: 800, 
                      color: '#F4A261',
                      letterSpacing: '-0.01em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {item.price} ₽
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {product.name}
            </h3>
            <p style={{ 
              fontSize: 14, 
              color: '#B8C5D0',
              fontWeight: 600,
              letterSpacing: '0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {product.weight}
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            {product.oldPrice && (
              <p style={{ 
                fontSize: 14, 
                color: '#B8C5D0',
                textDecoration: 'line-through',
                marginBottom: 4,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {product.oldPrice} ₽
              </p>
            )}
            <p style={{ 
              fontSize: 24, 
              fontWeight: 900, 
              color: '#F4A261',
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
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
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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
                  boxShadow: quantity <= 1 ? 'none' : '0 4px 12px rgba(38, 73, 92, 0.5)',
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: quantity <= 1 ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (quantity > 1) {
                    e.currentTarget.style.transform = 'scale(1.15)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(38, 73, 92, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = quantity <= 1 ? 'none' : '0 4px 12px rgba(38, 73, 92, 0.5)';
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
                letterSpacing: '-0.02em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  boxShadow: '0 6px 16px rgba(244, 162, 97, 0.5), 0 0 0 1px rgba(244, 162, 97, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 162, 97, 0.7), 0 0 0 2px rgba(244, 162, 97, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(244, 162, 97, 0.5), 0 0 0 1px rgba(244, 162, 97, 0.2)';
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
                boxShadow: '0 10px 30px rgba(244,162,97,0.5), 0 0 0 1px rgba(244,162,97,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,162,97,0.6), 0 0 0 1px rgba(244,162,97,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,162,97,0.5), 0 0 0 1px rgba(244,162,97,0.2)';
              }}
            >
              <ShoppingCart style={{ width: 20, height: 20 }} strokeWidth={2} />
              Добавить
            </button>
          </div>
      </div>
      
    </div>
  );
}
