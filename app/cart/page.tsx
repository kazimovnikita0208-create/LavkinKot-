'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, updateQuantity: updateQty, removeItem: removeItm } = useCart();

  const updateQuantity = (id: string, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      updateQty(id, item.quantity + delta);
    }
  };

  const removeItem = (id: string) => {
    removeItm(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0; // Бесплатная доставка
  const total = subtotal + deliveryFee;

  const isEmpty = cartItems.length === 0;

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 120 }}>
      
      {/* Анимированный фон */}
      <AnimatedBackground />
      
      {/* HEADER */}
      <header style={{ 
        padding: '14px 16px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <ArrowLeft style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
          </button>
          <h1 style={{ 
            fontSize: 20, 
            fontWeight: 800, 
            color: '#FFFFFF',
            flex: 1,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Корзина
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
      <main style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        
        {isEmpty ? (
          // Пустая корзина
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px 20px',
          }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.4) 0%, rgba(38, 73, 92, 0.3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            }}>
              <ShoppingBag style={{ width: 44, height: 44, color: '#F4A261' }} strokeWidth={1.5} />
            </div>
            
            <h2 style={{ 
              fontSize: 22, 
              fontWeight: 800, 
              color: '#FFFFFF', 
              marginBottom: 12,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Корзина пуста
            </h2>
            
            <p style={{ 
              fontSize: 15, 
              color: '#94A3B8', 
              marginBottom: 32,
              lineHeight: 1.5,
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Добавьте товары из магазинов,<br />чтобы оформить заказ
            </p>
            
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,162,97,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,162,97,0.4)';
              }}
            >
              Перейти к магазинам
            </button>
          </div>
        ) : (
          // Товары в корзине
          <div>
            {/* Товары */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{ 
                    borderRadius: 20,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                    padding: 14,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(244, 162, 97, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    {/* Изображение */}
                    <div style={{ 
                      width: 90, 
                      height: 90, 
                      borderRadius: 16, 
                      background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.8) 0%, rgba(38, 73, 92, 0.6) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      padding: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>

                    {/* Информация */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ 
                          fontSize: 15, 
                          fontWeight: 700, 
                          color: '#FFFFFF', 
                          marginBottom: 4,
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {item.name}
                        </h3>
                        <p style={{ 
                          fontSize: 13, 
                          color: '#94A3B8', 
                          marginBottom: 4,
                          fontWeight: 500,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {item.weight}
                        </p>
                        <p style={{ 
                          fontSize: 11, 
                          color: '#F4A261', 
                          fontWeight: 600,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {item.shopName}
                        </p>
                      </div>

                      {/* Цена и управление */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span style={{ 
                            fontSize: 20, 
                            fontWeight: 900, 
                            color: '#F4A261',
                            letterSpacing: '-0.02em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {(item.price * item.quantity).toFixed(2)} ₽
                          </span>
                          {item.oldPrice && (
                            <span style={{ 
                              fontSize: 13, 
                              color: '#7D8FA3',
                              textDecoration: 'line-through',
                              fontWeight: 600,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                            }}>
                              {(item.oldPrice * item.quantity).toFixed(2)} ₽
                            </span>
                          )}
                        </div>
                        
                        {/* Кнопка удалить */}
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
                          }}
                        >
                          <Trash2 style={{ width: 18, height: 18, color: '#EF4444' }} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Счетчик количества */}
                  <div style={{ 
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ 
                      fontSize: 13, 
                      color: '#B8C5D0', 
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Количество
                    </span>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: 'rgba(38, 73, 92, 0.5)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: 12,
                      padding: '6px 8px',
                      border: '1px solid rgba(244, 162, 97, 0.15)',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: item.quantity <= 1 
                            ? 'rgba(45, 79, 94, 0.3)' 
                            : 'rgba(26, 47, 58, 0.8)',
                          border: 'none',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: item.quantity <= 1 ? 0.4 : 1,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (item.quantity > 1) {
                            e.currentTarget.style.background = 'rgba(26, 47, 58, 0.9)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (item.quantity > 1) {
                            e.currentTarget.style.background = 'rgba(26, 47, 58, 0.8)';
                          }
                        }}
                      >
                        <Minus style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2.5} />
                      </button>

                      <span style={{ 
                        fontSize: 15, 
                        fontWeight: 800, 
                        color: '#F4A261',
                        minWidth: 22,
                        textAlign: 'center',
                        letterSpacing: '-0.01em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(244, 162, 97, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 3px 8px rgba(244, 162, 97, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(244, 162, 97, 0.3)';
                        }}
                      >
                        <Plus style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ С ИТОГОМ */}
      {!isEmpty && (
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
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
          padding: '16px',
        }}>
          {/* Итого */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div>
                <span style={{ 
                  fontSize: 14, 
                  color: '#94A3B8',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}) · 
                </span>
                <span style={{ 
                  fontSize: 16, 
                  color: '#FFFFFF',
                  fontWeight: 700,
                  marginLeft: 6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {subtotal.toFixed(2)} ₽
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ 
                  fontSize: 24, 
                  color: '#F4A261',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {total.toFixed(2)} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Кнопка оформить */}
          <button
            onClick={() => router.push('/checkout')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              padding: '16px 24px',
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
              transition: 'all 0.2s ease',
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,162,97,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,162,97,0.4)';
            }}
          >
            Оформить заказ
          </button>
        </div>
      )}
      
    </div>
  );
}
