'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const planNames: { [key: string]: string } = {
  'standard': 'Стандарт',
  'plus': 'Плюс',
  'premium': 'Премиум',
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Определяем тип оплаты: 'subscription' или 'order'
  const paymentType = searchParams.get('type') || 'order';
  const subscriptionPlan = searchParams.get('plan') || '';
  const subscriptionAmount = parseFloat(searchParams.get('amount') || '0');
  
  // Mock данные заказа (используются только для type=order)
  const orderTotal = 1263.20;
  const deliveryFee = 350;
  const finalTotal = paymentType === 'subscription' ? subscriptionAmount : orderTotal + deliveryFee;
  
  // Выбранный способ оплаты: 'card' или 'sbp' или null (не выбран)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | null>(null);
  
  // Данные карты
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  
  // Выбранный банк для СБП
  const [selectedBank, setSelectedBank] = useState('');
  
  const banks = [
    { id: 'sberbank', name: 'Сбербанк', color: '#21A038' },
    { id: 'tinkoff', name: 'Т-Банк', color: '#FFDD2D' },
    { id: 'alfabank', name: 'Альфа-Банк', color: '#EF3124' },
    { id: 'gazprombank', name: 'Газпромбанк', color: '#0033A0' },
    { id: 'vtb', name: 'ВТБ', color: '#0088CC' },
  ];
  
  const handlePayment = () => {
    if (paymentMethod === 'card') {
      // Валидация данных карты
      if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
        alert('Пожалуйста, заполните все данные карты');
        return;
      }
      // Mock оплата картой
      setTimeout(() => {
        if (paymentType === 'subscription') {
          router.push(`/order-confirmed?type=subscription&plan=${subscriptionPlan}`);
        } else {
          router.push('/order-confirmed');
        }
      }, 1500);
    } else if (paymentMethod === 'sbp') {
      if (!selectedBank) {
        alert('Пожалуйста, выберите банк');
        return;
      }
      // Mock оплата СБП
      setTimeout(() => {
        if (paymentType === 'subscription') {
          router.push(`/order-confirmed?type=subscription&plan=${subscriptionPlan}`);
        } else {
          router.push('/order-confirmed');
        }
      }, 1500);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 140 }}>
      
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
            Способ оплаты
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
        
        {/* Информация о сумме */}
        <section style={{ marginBottom: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          }}>
            {paymentType === 'subscription' ? (
              <>
                {/* Информация о подписке */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Подписка
                  </span>
                  <h3 style={{
                    fontSize: 18,
                    color: '#FFFFFF',
                    fontWeight: 900,
                    marginTop: 4,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {planNames[subscriptionPlan] || subscriptionPlan}
                  </h3>
                </div>
                
                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(244, 162, 97, 0.3) 50%, transparent 100%)',
                  marginBottom: 12,
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    К оплате
                  </span>
                  <span style={{
                    fontSize: 24,
                    color: '#F4A261',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {finalTotal.toFixed(2)} ₽
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Информация о заказе */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 14,
                    color: '#94A3B8',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Сумма заказа
                  </span>
                  <span style={{
                    fontSize: 14,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {orderTotal.toFixed(2)} ₽
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{
                    fontSize: 14,
                    color: '#94A3B8',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Доставка
                  </span>
                  <span style={{
                    fontSize: 14,
                    color: '#F4A261',
                    fontWeight: 700,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {deliveryFee} ₽
                  </span>
                </div>
                
                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(244, 162, 97, 0.3) 50%, transparent 100%)',
                  marginBottom: 12,
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    К оплате
                  </span>
                  <span style={{
                    fontSize: 24,
                    color: '#F4A261',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {finalTotal.toFixed(2)} ₽
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Выбор способа оплаты */}
        <section>
          <h2 style={{ 
            fontSize: 16, 
            fontWeight: 700, 
            color: '#FFFFFF',
            marginBottom: 12,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Выберите способ оплаты
          </h2>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            
            {/* КАРТА */}
            <button
              onClick={() => setPaymentMethod(paymentMethod === 'card' ? null : 'card')}
              style={{
                flex: 1,
                background: paymentMethod === 'card'
                  ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16,
                padding: 16,
                boxShadow: paymentMethod === 'card'
                  ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(244, 162, 97, 0.5)'
                  : '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CreditCard style={{ width: 24, height: 24, color: '#F4A261' }} strokeWidth={2} />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    letterSpacing: '-0.01em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Карта
                  </h3>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Visa, МИР
                  </p>
                </div>
              </div>
            </button>

            {/* СБП */}
            <button
              onClick={() => setPaymentMethod(paymentMethod === 'sbp' ? null : 'sbp')}
              style={{
                flex: 1,
                background: paymentMethod === 'sbp'
                  ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16,
                padding: 16,
                boxShadow: paymentMethod === 'sbp'
                  ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(244, 162, 97, 0.5)'
                  : '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Smartphone style={{ width: 24, height: 24, color: '#F4A261' }} strokeWidth={2} />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    letterSpacing: '-0.01em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    СБП
                  </h3>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    По QR-коду
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* ФОРМА ОПЛАТЫ КАРТОЙ */}
          {paymentMethod === 'card' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
              marginBottom: 16,
            }}>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Данные карты
              </h3>

              {/* Номер карты */}
              <div style={{ marginBottom: 12 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#94A3B8',
                  marginBottom: 6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Номер карты
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'rgba(26, 47, 58, 0.6)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Срок и CVV */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#94A3B8',
                    marginBottom: 6,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Срок действия
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 12,
                      background: 'rgba(26, 47, 58, 0.6)',
                      border: '1px solid rgba(244, 162, 97, 0.2)',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#94A3B8',
                    marginBottom: 6,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 12,
                      background: 'rgba(26, 47, 58, 0.6)',
                      border: '1px solid rgba(244, 162, 97, 0.2)',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Имя владельца */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#94A3B8',
                  marginBottom: 6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Имя владельца
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="IVAN IVANOV"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'rgba(26, 47, 58, 0.6)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* ВЫБОР БАНКА ДЛЯ СБП */}
          {paymentMethod === 'sbp' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
              marginBottom: 16,
            }}>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Выберите банк
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    style={{
                      background: selectedBank === bank.id
                        ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                        : 'rgba(26, 47, 58, 0.6)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: 12,
                      padding: '12px',
                      border: selectedBank === bank.id
                        ? '1px solid rgba(244, 162, 97, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: bank.color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      flex: 1,
                      textAlign: 'left',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {bank.name}
                    </span>
                    {selectedBank === bank.id && (
                      <CheckCircle style={{ width: 20, height: 20, color: '#4CAF50' }} strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Информация о безопасности */}
        <div style={{
          marginTop: 20,
          padding: '12px',
          borderRadius: 12,
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
        }}>
          <p style={{
            fontSize: 11,
            color: '#94A3B8',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.5,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            🔒 Безопасная оплата. Ваши данные защищены
          </p>
        </div>
      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ С КНОПКОЙ */}
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
        <button
          onClick={handlePayment}
          disabled={!paymentMethod}
          style={{
            width: '100%',
            background: !paymentMethod
              ? 'rgba(45, 79, 94, 0.5)'
              : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            color: !paymentMethod ? '#94A3B8' : '#FFFFFF',
            padding: '16px 24px',
            borderRadius: 16,
            border: 'none',
            cursor: !paymentMethod ? 'not-allowed' : 'pointer',
            boxShadow: !paymentMethod
              ? '0 4px 16px rgba(0,0,0,0.25)'
              : '0 6px 20px rgba(244,162,97,0.4)',
            transition: 'all 0.2s ease',
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            opacity: !paymentMethod ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (paymentMethod) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,162,97,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (paymentMethod) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,162,97,0.4)';
            }
          }}
        >
          {!paymentMethod 
            ? 'Выберите способ оплаты' 
            : `Оплатить ${finalTotal.toFixed(2)} ₽`}
        </button>
      </div>
      
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBackground />
        <div style={{ 
          color: '#F4A261', 
          fontSize: 18, 
          fontWeight: 700,
          position: 'relative',
          zIndex: 10,
        }}>
          Загрузка...
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
