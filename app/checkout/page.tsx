'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Phone, DoorOpen, CreditCard } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// Mock данные
const districts = ['Октябрьский'];

const timeSlots = [
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
];

export default function CheckoutPage() {
  const router = useRouter();
  
  // Форма адреса
  const [district, setDistrict] = useState('Октябрьский');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  
  // Дата и время
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Контакты
  const [phone, setPhone] = useState('');
  
  // Опции
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  
  // Подписка (mock)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  const [subscriptionDeliveries, setSubscriptionDeliveries] = useState(3);
  const [subscriptionType, setSubscriptionType] = useState('Стандарт'); // Базовая, Стандарт, Премиум
  const [totalSubscriptionDeliveries, setTotalSubscriptionDeliveries] = useState(5);
  
  // Выбор типа оплаты доставки: 'subscription' или 'one-time'
  const [deliveryPaymentType, setDeliveryPaymentType] = useState<'subscription' | 'one-time'>(
    hasActiveSubscription ? 'subscription' : 'one-time'
  );
  
  // Mock данные заказа
  const orderTotal = 1263.20; // Сумма товаров из корзины
  const oneTimeDeliveryFee = 350;
  
  // Генерация дат (завтра и далее)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
      });
    }
    return dates;
  };
  
  const availableDates = generateDates();
  
  const handleSubmit = () => {
    // Валидация
    if (!street || !house || !apartment || !selectedDate || !selectedTime || !phone) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (deliveryPaymentType === 'subscription') {
      // Оформление заказа по подписке - списываем доставку и переходим к подтверждению
      router.push('/order-confirmed?type=order');
    } else {
      // Разовая доставка - переход на страницу оплаты
      router.push('/payment?type=order');
    }
  };
  
  const finalTotal = deliveryPaymentType === 'one-time' 
    ? orderTotal + oneTimeDeliveryFee 
    : orderTotal;

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 180 }}>
      
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
            Оформление заказа
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
        
        {/* АДРЕС ДОСТАВКИ */}
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MapPin style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Адрес доставки
            </h2>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          }}>
            {/* Район */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#94A3B8',
                marginBottom: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Район
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
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
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            {/* Улица */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#94A3B8',
                marginBottom: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Улица *
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Введите название улицы"
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
            
            {/* Дом и Квартира в одной строке */}
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
                  Дом *
                </label>
                <input
                  type="text"
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                  placeholder="№"
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
                  Квартира *
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="№"
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
            
            {/* Подъезд и Этаж в одной строке */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#94A3B8',
                  marginBottom: 6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Подъезд
                </label>
                <input
                  type="text"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  placeholder="№"
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
                  Этаж
                </label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="№"
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
          </div>
        </section>

        {/* ДАТА И ВРЕМЯ */}
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Calendar style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Дата и время доставки
            </h2>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          }}>
            {/* Дата */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#94A3B8',
                marginBottom: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Дата *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {availableDates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: selectedDate === date.value 
                        ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)' 
                        : 'rgba(26, 47, 58, 0.6)',
                      border: selectedDate === date.value 
                        ? 'none' 
                        : '1px solid rgba(244, 162, 97, 0.2)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Время */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#94A3B8',
                marginBottom: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Время *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: selectedTime === time 
                        ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)' 
                        : 'rgba(26, 47, 58, 0.6)',
                      border: selectedTime === time 
                        ? 'none' 
                        : '1px solid rgba(244, 162, 97, 0.2)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ОПЛАТА */}
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CreditCard style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Способ оплаты доставки
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* КАРТОЧКА ПОДПИСКИ (если есть активная подписка) */}
            {hasActiveSubscription && (
              <button
                onClick={() => setDeliveryPaymentType('subscription')}
                style={{
                  background: deliveryPaymentType === 'subscription'
                    ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: deliveryPaymentType === 'subscription'
                    ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(76, 175, 80, 0.5)'
                    : '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: deliveryPaymentType === 'subscription' 
                        ? '2px solid #4CAF50' 
                        : '2px solid rgba(255,255,255,0.3)',
                      background: deliveryPaymentType === 'subscription' 
                        ? '#4CAF50' 
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}>
                      {deliveryPaymentType === 'subscription' && (
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                        }} />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#4CAF50',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          ✓ Подписка
                        </span>
                      </div>
                      <span style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '-0.01em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {subscriptionType}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {subscriptionDeliveries} из {totalSubscriptionDeliveries}
                    </span>
                    <div style={{
                      padding: '5px 10px',
                      borderRadius: 8,
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                    }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#4CAF50',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        Бесплатно
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* КАРТОЧКА РАЗОВОЙ ДОСТАВКИ */}
            <button
              onClick={() => setDeliveryPaymentType('one-time')}
              style={{
                background: deliveryPaymentType === 'one-time'
                  ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16,
                padding: 16,
                boxShadow: deliveryPaymentType === 'one-time'
                  ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(244, 162, 97, 0.5)'
                  : '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: deliveryPaymentType === 'one-time' 
                      ? '2px solid #F4A261' 
                      : '2px solid rgba(255,255,255,0.3)',
                    background: deliveryPaymentType === 'one-time' 
                      ? '#F4A261' 
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {deliveryPaymentType === 'one-time' && (
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                      }} />
                    )}
                  </div>
                  <div>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Разовая доставка
                    </span>
                    <p style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 500,
                      marginTop: 2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Оплата при оформлении
                    </p>
                  </div>
                </div>
                <span style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#F4A261',
                  letterSpacing: '-0.02em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {oneTimeDeliveryFee} ₽
                </span>
              </div>
            </button>

            {/* Подсказка о подписке */}
            {!hasActiveSubscription && (
              <div style={{
                padding: '10px 12px',
                borderRadius: 12,
                background: 'rgba(244, 162, 97, 0.1)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
              }}>
                <p style={{
                  fontSize: 11,
                  color: '#F4A261',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  💡 Оформите подписку и экономьте на доставках
                </p>
              </div>
            )}
          </div>
        </section>

        {/* КОНТАКТЫ */}
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Phone style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Контактная информация
            </h2>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#94A3B8',
              marginBottom: 6,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Номер телефона *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
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
        </section>

        {/* ОПЦИИ */}
        <section style={{ marginBottom: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(244, 162, 97, 0.1)',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              justifyContent: 'space-between',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <DoorOpen style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
                  <span style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Оставить у двери
                  </span>
                </div>
                <p style={{
                  fontSize: 12,
                  color: '#94A3B8',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Курьер позвонит в дверь и оставит заказ
                </p>
              </div>
              
              {/* Тумблер */}
              <button
                onClick={() => setLeaveAtDoor(!leaveAtDoor)}
                style={{
                  position: 'relative',
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  background: leaveAtDoor 
                    ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)' 
                    : 'rgba(26, 47, 58, 0.8)',
                  border: leaveAtDoor 
                    ? '1px solid rgba(244, 162, 97, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: leaveAtDoor 
                    ? '0 2px 8px rgba(244, 162, 97, 0.4)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 3,
                  left: leaveAtDoor ? 23 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                }} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ С ИТОГОМ */}
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
        
        {/* Итоговая информация */}
        <div style={{ marginBottom: 12 }}>
          {/* Сумма заказа */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
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
          
          {/* Доставка */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
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
              color: deliveryPaymentType === 'subscription' ? '#4CAF50' : '#F4A261',
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {deliveryPaymentType === 'subscription' ? 'Бесплатно' : `${oneTimeDeliveryFee} ₽`}
            </span>
          </div>
          
          {/* Разделитель */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(244, 162, 97, 0.3) 50%, transparent 100%)',
            marginBottom: 8,
          }} />
          
          {/* Итого */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{
              fontSize: 16,
              color: '#FFFFFF',
              fontWeight: 800,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Итого
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
        </div>
        
        {/* Кнопка */}
        <button
          onClick={handleSubmit}
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
          {deliveryPaymentType === 'subscription' ? 'Оформить заказ' : 'Оплатить'}
        </button>
      </div>
      
    </div>
  );
}
