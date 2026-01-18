'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Plus, Flame } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';

// Mock данные магазинов
const shopsData: Record<string, any> = {
  '1': {
    name: 'Пекарня "Хлебница"',
    minOrder: 300,
    categories: ['Популярное', 'Хлеб', 'Выпечка', 'Десерты', 'Напитки', 'Торты', 'Пироги', 'Печенье'],
    products: [
      { id: '1', name: 'Багет французский', price: 89, oldPrice: null, weight: '200 г', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80', category: 'Хлеб' },
      { id: '2', name: 'Круассан', price: 120, oldPrice: 150, weight: '80 г', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80', category: 'Выпечка', discount: '-20%' },
      { id: '4', name: 'Булочка с корицей', price: 95, oldPrice: 110, weight: '120 г', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=400&fit=crop&q=85', category: 'Выпечка', discount: '-15%' },
      { id: '5', name: 'Черный хлеб', price: 65, oldPrice: null, weight: '300 г', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&q=80', category: 'Хлеб' },
      { id: '6', name: 'Пончик глазированный', price: 80, oldPrice: 100, weight: '90 г', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&q=80', category: 'Десерты', discount: '-20%' },
    ],
  },
  '2': {
    name: 'Фруктовый рай',
    minOrder: 500,
    categories: ['Популярное', 'Фрукты', 'Ягоды', 'Овощи', 'Сухофрукты', 'Орехи', 'Зелень', 'Экзотика'],
    products: [
      { id: '1', name: 'Яблоки', price: 120, oldPrice: null, weight: '1 кг', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&q=80', category: 'Фрукты' },
      { id: '2', name: 'Бананы', price: 89, oldPrice: 110, weight: '1 кг', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop&q=80', category: 'Фрукты', discount: '-20%' },
      { id: '3', name: 'Апельсины', price: 150, oldPrice: null, weight: '1 кг', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop&q=80', category: 'Фрукты' },
      { id: '4', name: 'Клубника', price: 350, oldPrice: 420, weight: '500 г', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&q=80', category: 'Ягоды', discount: '-15%' },
      { id: '5', name: 'Виноград', price: 280, oldPrice: null, weight: '1 кг', image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&h=400&fit=crop&q=85', category: 'Фрукты' },
      { id: '6', name: 'Помидоры', price: 180, oldPrice: 200, weight: '1 кг', image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop&q=80', category: 'Овощи', discount: '-10%' },
    ],
  },
  '3': {
    name: 'Суши-бар Токио',
    minOrder: 800,
    categories: ['Популярное', 'Роллы', 'Суши', 'Сеты', 'Напитки', 'Супы', 'Закуски', 'Десерты'],
    products: [
      { id: '1', name: 'Филадельфия', price: 450, oldPrice: null, weight: '220 г', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&q=80', category: 'Роллы' },
      { id: '2', name: 'Калифорния', price: 380, oldPrice: 450, weight: '200 г', image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=400&fit=crop&q=80', category: 'Роллы', discount: '-15%' },
      { id: '3', name: 'Сет "Токио"', price: 1200, oldPrice: null, weight: '800 г', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=400&fit=crop&q=80', category: 'Сеты' },
      { id: '4', name: 'Нигири с лососем', price: 120, oldPrice: 150, weight: '40 г', image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=400&fit=crop&q=80', category: 'Суши', discount: '-20%' },
      { id: '5', name: 'Ролл Дракон', price: 520, oldPrice: null, weight: '250 г', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=400&fit=crop&q=80', category: 'Роллы' },
      { id: '6', name: 'Сашими', price: 380, oldPrice: 450, weight: '180 г', image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=400&fit=crop&q=80', category: 'Суши', discount: '-15%' },
    ],
  },
};

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.id as string;
  const shop = shopsData[shopId] || shopsData['1'];
  const { addItem, getTotalItems, getTotalPrice } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(shop.categories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartCount = getTotalItems();
  const cartTotal = getTotalPrice();

  const addToCart = (product: any) => {
    addItem({
      id: `${shopId}-${product.id}`,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      weight: product.weight,
      image: product.image,
      shopName: shop.name,
      shopId: shopId,
    });
  };

  const filteredProducts = shop.products.filter((product: any) => 
    selectedCategory === shop.categories[0] || product.category === selectedCategory
  );

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
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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

        {/* Табы категорий */}
        <div 
          className="horizontal-scroll"
          style={{ 
            display: 'flex', 
            gap: 10, 
            paddingBottom: 8,
          }}
        >
          {shop.categories.map((category: string) => (
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === category 
                  ? '0 4px 12px rgba(244, 162, 97, 0.4), 0 0 0 1px rgba(244, 162, 97, 0.2)' 
                  : '0 2px 6px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = 'rgba(38, 73, 92, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(244, 162, 97, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = 'rgba(38, 73, 92, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN - ТОВАРЫ */}
      <main style={{ marginTop: 16, padding: '0 16px', position: 'relative', zIndex: 10 }}>
        
        {/* Сетка товаров 2 колонки */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {filteredProducts.map((product: any) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              style={{ 
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(45, 79, 94, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(244, 162, 97, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)';
              }}
            >
              {/* Изображение товара */}
              <div style={{ 
                height: 140, 
                width: '100%', 
                position: 'relative', 
                background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.9) 0%, rgba(38, 73, 92, 0.7) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Бейдж скидки */}
                {product.discount && (
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
                    letterSpacing: '0.02em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    boxShadow: '0 2px 8px rgba(244, 162, 97, 0.4), 0 0 0 1px rgba(244, 162, 97, 0.2)',
                  }}>
                    {product.discount}
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
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  minHeight: 36,
                }}>
                  {product.name}
                </h3>
                
                <p style={{ 
                  fontSize: 12, 
                  color: '#B8C5D0', 
                  marginBottom: 8,
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {product.weight}
                </p>

                {/* Цена и кнопка */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ 
                      fontSize: 16, 
                      fontWeight: 700, 
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {product.price} ₽
                    </span>
                    {product.oldPrice && (
                      <span style={{ 
                        fontSize: 12, 
                        color: '#B8C5D0',
                        textDecoration: 'line-through',
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {product.oldPrice} ₽
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
                      boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4), 0 0 0 1px rgba(244, 162, 97, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 162, 97, 0.6), 0 0 0 2px rgba(244, 162, 97, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 162, 97, 0.4), 0 0 0 1px rgba(244, 162, 97, 0.2)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                    }}
                  >
                    <Plus style={{ width: 22, height: 22, color: '#FFFFFF' }} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(244, 162, 97, 0.1)',
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
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Минимальный заказ от <span style={{ color: '#F4A261', fontWeight: 700 }}>{shop.minOrder} ₽</span>
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
            }}>{cartTotal.toLocaleString('ru-RU')} ₽</span>
          </button>
        </div>
      )}
      
    </div>
  );
}
