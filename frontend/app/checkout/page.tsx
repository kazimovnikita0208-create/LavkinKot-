'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Phone, DoorOpen, CreditCard, Loader2, Gift, Sparkles } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMySubscription, useCreateOrder } from '@/hooks';
import { ordersApi } from '@/lib/api';
import { useTelegramBackButton } from '@/hooks/useTelegram';

const districts = ['Октябрьский'];

const timeSlots = [
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
];

type DeliveryPaymentType = 'free' | 'subscription' | 'one-time';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { subscription, refetch: refetchSubscription } = useMySubscription();
  const { createOrder, isLoading: isCreatingOrder } = useCreateOrder();

  useTelegramBackButton();

  const CHECKOUT_DRAFT_KEY = 'lavkinkot_checkout_draft';

  // Форма адреса — инициализация из localStorage (черновик)
  const [district, setDistrict] = useState('Октябрьский');
  const [street, setStreet] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || '{}').street || ''; } catch { return ''; }
  });
  const [house, setHouse] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || '{}').house || ''; } catch { return ''; }
  });
  const [entrance, setEntrance] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || '{}').entrance || ''; } catch { return ''; }
  });
  const [floor, setFloor] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || '{}').floor || ''; } catch { return ''; }
  });
  const [apartment, setApartment] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || '{}').apartment || ''; } catch { return ''; }
  });

  // Сохраняем черновик адреса при изменении
  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ street, house, entrance, floor, apartment }));
    } catch {}
  }, [street, house, entrance, floor, apartment]);

  // Ошибки валидации
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showValidationBanner, setShowValidationBanner] = useState(false);

  // Refs для скролла к ошибкам
  const streetRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  // Дата и время
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Контакты
  const [phone, setPhone] = useState('');
  
  // Опции
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  
  // Отслеживание фокуса
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Проверяем бесплатные доставки
  const hasFreeDelivery = (user?.free_deliveries_remaining || 0) > 0;
  const freeDeliveriesCount = user?.free_deliveries_remaining || 0;
  
  // Проверяем активную подписку
  const hasActiveSubscription = subscription?.status === 'active' && (subscription?.deliveries_remaining || 0) > 0;
  const subscriptionDeliveries = subscription?.deliveries_remaining || 0;
  const totalSubscriptionDeliveries = subscriptionDeliveries + (subscription?.deliveries_used || 0);
  const subscriptionType = subscription?.plan?.name || 'Стандарт';
  
  // Выбор типа оплаты доставки
  const [deliveryPaymentType, setDeliveryPaymentType] = useState<DeliveryPaymentType>('one-time');
  
  // Устанавливаем лучший вариант по умолчанию
  useEffect(() => {
    if (hasFreeDelivery) {
      setDeliveryPaymentType('free');
    } else if (hasActiveSubscription) {
      setDeliveryPaymentType('subscription');
    } else {
      setDeliveryPaymentType('one-time');
    }
  }, [hasFreeDelivery, hasActiveSubscription]);

  // Обновляем данные при возврате со страницы подписки
  useEffect(() => {
    const handleFocus = () => {
      refetchSubscription();
      refreshUser();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchSubscription, refreshUser]);
  
  // Заполняем данные пользователя
  useEffect(() => {
    if (user) {
      if (user.default_street) setStreet(user.default_street);
      if (user.default_house) setHouse(user.default_house);
      if (user.default_apartment) setApartment(user.default_apartment);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);
  
  // Настройки из API
  const [minOrderAmount, setMinOrderAmount] = useState(300);
  const [deliveryFee, setDeliveryFee] = useState(350);
  const [freeDeliveryFrom, setFreeDeliveryFrom] = useState(1500);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    fetch(`${apiUrl}/settings`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setMinOrderAmount(json.data.min_order_amount ?? 300);
          setDeliveryFee(json.data.delivery_fee ?? 350);
          setFreeDeliveryFrom(json.data.free_delivery_from ?? 1500);
        }
      })
      .catch(() => {});
  }, []);

  // Сумма товаров из корзины
  const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const oneTimeDeliveryFee = orderTotal >= freeDeliveryFrom ? 0 : deliveryFee;
  
  // Генерация дат
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

  const handleBuySubscription = () => {
    // Сохраняем состояние формы в sessionStorage для возврата
    sessionStorage.setItem('checkout_return', 'true');
    router.push('/profile/subscription');
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const phoneRegex = /^(\+7|8)[0-9]{10}$/;

    if (!street.trim()) errors.street = 'Укажите улицу';
    if (!house.trim()) errors.house = 'Укажите дом';
    if (!apartment.trim()) errors.apartment = 'Укажите квартиру';
    if (!selectedDate) errors.selectedDate = 'Выберите дату доставки';
    if (!selectedTime) errors.selectedTime = 'Выберите время доставки';
    if (!phone.trim()) {
      errors.phone = 'Укажите номер телефона';
    } else if (!phoneRegex.test(phone.replace(/\s|-/g, ''))) {
      errors.phone = 'Формат: +7XXXXXXXXXX или 8XXXXXXXXXX';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowValidationBanner(true);
      setTimeout(() => setShowValidationBanner(false), 4000);
      // Скролл к первой ошибке
      if (errors.street || errors.house || errors.apartment) {
        streetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errors.selectedDate || errors.selectedTime) {
        dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errors.phone) {
        phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }

    if (orderTotal < minOrderAmount) {
      alert(`Минимальная сумма заказа — ${minOrderAmount} ₽. Добавьте ещё товаров.`);
      return;
    }
    
    // Группируем товары по магазинам
    const itemsByShop: Record<string, typeof cartItems> = {};
    cartItems.forEach(item => {
      const shopId = item.shopId || 'unknown';
      if (!itemsByShop[shopId]) itemsByShop[shopId] = [];
      itemsByShop[shopId].push(item);
    });

    const shopIds = Object.keys(itemsByShop);
    const isMultiShop = shopIds.length > 1;

    const [timeStart] = selectedTime.split(' - ');
    const deliveryDateTime = new Date(`${selectedDate}T${timeStart}:00`);

    const deliveryInfo = {
      delivery_street: street,
      delivery_house: house,
      delivery_entrance: entrance || undefined,
      delivery_floor: floor || undefined,
      delivery_apartment: apartment,
      delivery_date: deliveryDateTime.toISOString(),
      delivery_time_slot: selectedTime,
      contact_phone: phone,
      leave_at_door: leaveAtDoor,
      use_subscription: deliveryPaymentType === 'subscription' || deliveryPaymentType === 'free',
    };

    try {
      if (isMultiShop) {
        // Batch-заказ: несколько магазинов, одна доставка
        const batchData: import('@/lib/api').CreateBatchOrderData = {
          ...deliveryInfo,
          orders: shopIds.map(shopId => ({
            shop_id: shopId,
            items: itemsByShop[shopId].map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          })),
        };

        const response = await ordersApi.createBatchOrder(batchData);
        if (!response.success || !response.data) {
          alert('Ошибка при создании заказа. Попробуйте ещё раз.');
          return;
        }

        clearCart();
        try { localStorage.removeItem(CHECKOUT_DRAFT_KEY); } catch {}

        const { orders: batchOrders, batch_id } = response.data;
        const orderIds = batchOrders.map(o => o.id).join(',');

        if (deliveryPaymentType === 'subscription' || deliveryPaymentType === 'free') {
          router.push(`/order-confirmed?type=order&batch=true&orderIds=${orderIds}`);
        } else {
          // Оплата за весь batch по сумме первого заказа (с доставкой)
          const firstOrderId = batchOrders[0].id;
          router.push(`/payment?type=order&orderId=${firstOrderId}&batchId=${batch_id}&amount=${finalTotal}`);
        }
      } else {
        // Обычный заказ из одного магазина
        const orderData: import('@/lib/api').CreateOrderData = {
          shop_id: shopIds[0],
          ...deliveryInfo,
          items: itemsByShop[shopIds[0]].map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        const order = await createOrder(orderData);

        if (order) {
          clearCart();
          try { localStorage.removeItem(CHECKOUT_DRAFT_KEY); } catch {}
          if (deliveryPaymentType === 'subscription' || deliveryPaymentType === 'free') {
            router.push(`/order-confirmed?type=order&orderId=${order.id}`);
          } else {
            router.push(`/payment?type=order&orderId=${order.id}&amount=${finalTotal}`);
          }
        } else {
          alert('Ошибка при создании заказа. Попробуйте ещё раз.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
      alert(`Ошибка при создании заказа: ${msg}`);
    }
  };
  
  const finalTotal = deliveryPaymentType === 'one-time' 
    ? orderTotal + oneTimeDeliveryFee 
    : orderTotal;

  // Если корзина пуста
  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative' }}>
        <AnimatedBackground />
        <header style={{ 
          padding: '14px 16px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 20, 
          background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
          borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <ArrowLeft style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
            </button>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', flex: 1 }}>
              Оформление заказа
            </h1>
          </div>
        </header>
        <main style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: 16, marginBottom: 24 }}>Корзина пуста</p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
            }}
          >
            Перейти к магазинам
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: isInputFocused ? 50 : 180 }}>
      
      <AnimatedBackground />
      
      {/* HEADER */}
      <header style={{ 
        padding: '14px 16px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', flex: 1 }}>
            Оформление заказа
          </h1>
          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        
        {/* Баннер ошибок валидации */}
        {showValidationBanner && (
          <div style={{
            marginBottom: 16, padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'fadeInUp 0.3s ease',
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <p style={{ fontSize: 14, color: '#FCA5A5', fontWeight: 600 }}>
              Пожалуйста, заполните все обязательные поля
            </p>
          </div>
        )}

        {/* АДРЕС ДОСТАВКИ */}
        <section ref={streetRef} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MapPin style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Адрес доставки</h2>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
            {/* Район */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
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
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                Улица *
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => { setStreet(e.target.value); setValidationErrors(prev => ({ ...prev, street: '' })); }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Введите название улицы"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'rgba(26, 47, 58, 0.6)',
                  border: validationErrors.street ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(244, 162, 97, 0.2)',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              {validationErrors.street && <p style={{ fontSize: 11, color: '#FCA5A5', marginTop: 4, fontWeight: 500 }}>{validationErrors.street}</p>}
            </div>
            
            {/* Дом и Квартира */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Дом *
                </label>
                <input
                  type="text"
                  value={house}
                  onChange={(e) => { setHouse(e.target.value); setValidationErrors(prev => ({ ...prev, house: '' })); }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="№"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'rgba(26, 47, 58, 0.6)',
                    border: validationErrors.house ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(244, 162, 97, 0.2)',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                {validationErrors.house && <p style={{ fontSize: 11, color: '#FCA5A5', marginTop: 4, fontWeight: 500 }}>{validationErrors.house}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Квартира *
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => { setApartment(e.target.value); setValidationErrors(prev => ({ ...prev, apartment: '' })); }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="№"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'rgba(26, 47, 58, 0.6)',
                    border: validationErrors.apartment ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(244, 162, 97, 0.2)',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                {validationErrors.apartment && <p style={{ fontSize: 11, color: '#FCA5A5', marginTop: 4, fontWeight: 500 }}>{validationErrors.apartment}</p>}
              </div>
            </div>
            
            {/* Подъезд и Этаж */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Подъезд
                </label>
                <input
                  type="text"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
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
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Этаж
                </label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
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
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ДАТА И ВРЕМЯ */}
        <section ref={dateRef} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Calendar style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Дата и время доставки</h2>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: (validationErrors.selectedDate || validationErrors.selectedTime) ? '1px solid rgba(239,68,68,0.5)' : '1px solid transparent',
          }}>
            {/* Дата */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: validationErrors.selectedDate ? '#FCA5A5' : '#94A3B8', marginBottom: 6 }}>
                Дата {validationErrors.selectedDate ? `— ${validationErrors.selectedDate}` : '*'}
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
                      border: selectedDate === date.value ? 'none' : '1px solid rgba(244, 162, 97, 0.2)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Время */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
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
                      border: selectedTime === time ? 'none' : '1px solid rgba(244, 162, 97, 0.2)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* СПОСОБ ОПЛАТЫ ДОСТАВКИ */}
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CreditCard style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Способ оплаты доставки</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* БЕСПЛАТНАЯ ДОСТАВКА (если есть) */}
            {hasFreeDelivery && (
              <button
                onClick={() => setDeliveryPaymentType('free')}
                style={{
                  background: deliveryPaymentType === 'free'
                    ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: deliveryPaymentType === 'free'
                    ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(76, 175, 80, 0.5)'
                    : '0 4px 16px rgba(0,0,0,0.25)',
                  border: 'none',
                  cursor: 'pointer',
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
                      border: deliveryPaymentType === 'free' ? '2px solid #4CAF50' : '2px solid rgba(255,255,255,0.3)',
                      background: deliveryPaymentType === 'free' ? '#4CAF50' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {deliveryPaymentType === 'free' && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Gift style={{ width: 14, height: 14, color: '#4CAF50' }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#4CAF50' }}>Приветственный бонус</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>Бесплатная доставка</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                      {freeDeliveriesCount} шт.
                    </span>
                    <div style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(76, 175, 80, 0.2)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#4CAF50' }}>Бесплатно</span>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* ПОДПИСКА (если есть) */}
            {hasActiveSubscription && (
              <button
                onClick={() => setDeliveryPaymentType('subscription')}
                style={{
                  background: deliveryPaymentType === 'subscription'
                    ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: deliveryPaymentType === 'subscription'
                    ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(244, 162, 97, 0.5)'
                    : '0 4px 16px rgba(0,0,0,0.25)',
                  border: 'none',
                  cursor: 'pointer',
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
                      border: deliveryPaymentType === 'subscription' ? '2px solid #F4A261' : '2px solid rgba(255,255,255,0.3)',
                      background: deliveryPaymentType === 'subscription' ? '#F4A261' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {deliveryPaymentType === 'subscription' && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#F4A261' }}>✓ Подписка</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{subscriptionType}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                      {subscriptionDeliveries} из {totalSubscriptionDeliveries}
                    </span>
                    <div style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(244, 162, 97, 0.2)', border: '1px solid rgba(244, 162, 97, 0.3)' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#F4A261' }}>Бесплатно</span>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* ОФОРМИТЬ ПОДПИСКУ (если нет подписки) */}
            {!hasActiveSubscription && (
              <button
                onClick={handleBuySubscription}
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.15) 0%, rgba(232, 149, 81, 0.1) 100%)',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: '0 4px 16px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: 'rgba(244, 162, 97, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Sparkles style={{ width: 18, height: 18, color: '#F4A261' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', display: 'block' }}>Оформить подписку</span>
                      <span style={{ fontSize: 11, color: '#F4A261', fontWeight: 600 }}>от 200 ₽ за доставку</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF' }}>Выгодно</span>
                  </div>
                </div>
              </button>
            )}

            {/* РАЗОВАЯ ДОСТАВКА */}
            <button
              onClick={() => setDeliveryPaymentType('one-time')}
              style={{
                background: deliveryPaymentType === 'one-time'
                  ? 'linear-gradient(135deg, rgba(38, 73, 92, 0.8) 0%, rgba(26, 47, 58, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                borderRadius: 16,
                padding: 16,
                boxShadow: deliveryPaymentType === 'one-time'
                  ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(148, 163, 184, 0.5)'
                  : '0 4px 16px rgba(0,0,0,0.25)',
                border: 'none',
                cursor: 'pointer',
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
                    border: deliveryPaymentType === 'one-time' ? '2px solid #94A3B8' : '2px solid rgba(255,255,255,0.3)',
                    background: deliveryPaymentType === 'one-time' ? '#94A3B8' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {deliveryPaymentType === 'one-time' && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>Разовая доставка</span>
                    <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
                      Оплата при оформлении
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#94A3B8' }}>{oneTimeDeliveryFee} ₽</span>
              </div>
            </button>
          </div>
        </section>

        {/* КОНТАКТЫ */}
        <section ref={phoneRef} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Phone style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Контактная информация</h2>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
              Номер телефона *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setValidationErrors(prev => ({ ...prev, phone: '' })); }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="+7XXXXXXXXXX"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: 'rgba(26, 47, 58, 0.6)',
                border: validationErrors.phone ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(244, 162, 97, 0.2)',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 600,
                outline: 'none',
              }}
            />
            {validationErrors.phone && <p style={{ fontSize: 11, color: '#FCA5A5', marginTop: 4, fontWeight: 500 }}>{validationErrors.phone}</p>}
          </div>
        </section>

        {/* ОПЦИИ */}
        <section style={{ marginBottom: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <DoorOpen style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Оставить у двери</span>
                </div>
                <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                  Курьер позвонит в дверь и оставит заказ
                </p>
              </div>
              
              <button
                onClick={() => setLeaveAtDoor(!leaveAtDoor)}
                style={{
                  position: 'relative',
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  background: leaveAtDoor ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)' : 'rgba(26, 47, 58, 0.8)',
                  border: leaveAtDoor ? '1px solid rgba(244, 162, 97, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
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
                  transition: 'all 0.3s ease',
                }} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ */}
      <div style={{
        position: 'fixed',
        bottom: isInputFocused ? -200 : 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 375,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 1) 100%)',
        borderTop: '1px solid rgba(244, 162, 97, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
        padding: '16px',
        transition: 'bottom 0.3s ease',
        opacity: isInputFocused ? 0 : 1,
      }}>
        
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 500 }}>Сумма заказа</span>
            <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 700 }}>{orderTotal.toFixed(2)} ₽</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 500 }}>Доставка</span>
            <span style={{ 
              fontSize: 14, 
              color: deliveryPaymentType === 'one-time' ? '#94A3B8' : '#4CAF50', 
              fontWeight: 700 
            }}>
              {deliveryPaymentType === 'one-time' ? `${oneTimeDeliveryFee} ₽` : 'Бесплатно'}
            </span>
          </div>
          
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(244, 162, 97, 0.3) 50%, transparent 100%)', marginBottom: 8 }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 800 }}>Итого</span>
            <span style={{ fontSize: 24, color: '#F4A261', fontWeight: 900 }}>{finalTotal.toFixed(2)} ₽</span>
          </div>
        </div>
        
        {orderTotal < minOrderAmount && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 10, padding: '8px 12px', marginBottom: 10, textAlign: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>
              Минимальная сумма заказа — {minOrderAmount} ₽ (ещё {minOrderAmount - orderTotal} ₽)
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isCreatingOrder || orderTotal < minOrderAmount}
          style={{
            width: '100%',
            background: (isCreatingOrder || orderTotal < minOrderAmount) ? 'rgba(244, 162, 97, 0.5)' : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
            color: '#FFFFFF',
            padding: '16px 24px',
            borderRadius: 16,
            border: 'none',
            cursor: (isCreatingOrder || orderTotal < minOrderAmount) ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(244,162,97,0.4)',
            fontWeight: 800,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isCreatingOrder && <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />}
          {deliveryPaymentType === 'one-time' ? 'Оплатить' : 'Оформить заказ'}
        </button>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
    </div>
  );
}
