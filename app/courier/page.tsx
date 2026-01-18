'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Truck,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  Phone,
  Navigation,
  DollarSign,
  Star,
  Check
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

type OrderStatus = 'preparing' | 'accepted' | 'in_transit' | 'delivered';

interface Order {
  id: string;
  orderNumber: string;
  shop: string;
  customer: string;
  phone: string;
  address: string;
  items: number;
  total: number;
  deliveryTime: string;
  distance: string;
  status: OrderStatus;
}

const statusInfo: Record<OrderStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  preparing: { label: 'Готовится', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', borderColor: 'rgba(33, 150, 243, 0.4)' },
  accepted: { label: 'Принят', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', borderColor: 'rgba(255, 152, 0, 0.4)' },
  in_transit: { label: 'В пути', color: '#F4A261', bgColor: 'rgba(244, 162, 97, 0.2)', borderColor: 'rgba(244, 162, 97, 0.4)' },
  delivered: { label: 'Доставлен', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', borderColor: 'rgba(76, 175, 80, 0.4)' },
};

export default function CourierPage() {
  const router = useRouter();
  const [onShift, setOnShift] = useState(true);

  // Mock данные курьера
  const courierData = {
    name: 'Иван Петров',
    phone: '+7 (900) 111-22-33',
    rating: 4.9,
    todayDeliveries: 18,
    todayEarnings: 3600,
    totalDeliveries: 347,
  };

  // Mock активные заказы
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '123456',
      shop: 'Пекарня "Хлебница"',
      customer: 'Никита Иванов',
      phone: '+7 (900) 555-11-22',
      address: 'ул. Примерная, д. 10, кв. 5',
      items: 3,
      total: 1613.20,
      deliveryTime: '12:00 - 14:00',
      distance: '2.3 км',
      status: 'in_transit',
    },
    {
      id: '2',
      orderNumber: '123457',
      shop: 'Фруктовый рай',
      customer: 'Елена Петрова',
      phone: '+7 (900) 555-33-44',
      address: 'ул. Садовая, д. 5, кв. 12',
      items: 5,
      total: 2450.00,
      deliveryTime: '14:00 - 16:00',
      distance: '3.7 км',
      status: 'preparing',
    },
  ]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'preparing':
        return 'in_transit'; // Сразу в пути при принятии
      case 'accepted':
        return 'in_transit'; // На случай если есть такой статус
      case 'in_transit':
        return 'delivered';
      default:
        return null;
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered');

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
      paddingBottom: 16,
    }}>
      {/* Анимированный фон */}
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/profile')}
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
            Курьер
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

      {/* MAIN CONTENT */}
      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '16px',
      }}>
        
        {/* Переключатель смены */}
        <div style={{
          background: onShift 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(69, 160, 73, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: onShift ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 16,
          padding: 18,
          boxShadow: onShift ? '0 4px 20px rgba(76, 175, 80, 0.2)' : '0 4px 20px rgba(239, 68, 68, 0.2)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: onShift 
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(69, 160, 73, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
              border: onShift ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Truck style={{ width: 24, height: 24, color: onShift ? '#4CAF50' : '#EF4444' }} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{
                fontSize: 17,
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 2,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {onShift ? 'На смене' : 'Не на смене'}
              </h3>
              <p style={{
                fontSize: 12,
                color: '#94A3B8',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {onShift ? 'Принимаете заказы' : 'Заказы не принимаются'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOnShift(!onShift)}
            style={{
              width: 60,
              height: 34,
              borderRadius: 17,
              background: onShift 
                ? 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
                : 'rgba(45, 79, 94, 0.8)',
              border: onShift ? '2px solid rgba(76, 175, 80, 0.5)' : '2px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              padding: 0,
              boxShadow: onShift ? '0 4px 12px rgba(76, 175, 80, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#FFFFFF',
              position: 'absolute',
              top: 2,
              left: onShift ? 30 : 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {onShift && <Check style={{ width: 14, height: 14, color: '#4CAF50' }} strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}>
          {/* Доставок сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 20px rgba(244, 162, 97, 0.15)',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.25)',
              border: '1px solid rgba(244, 162, 97, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Package style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {courierData.todayDeliveries}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Доставок сегодня
            </p>
          </div>

          {/* Заработано */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(69, 160, 73, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(76, 175, 80, 0.25)',
              border: '1px solid rgba(76, 175, 80, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <DollarSign style={{ width: 20, height: 20, color: '#4CAF50' }} strokeWidth={2.5} />
            </div>
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {courierData.todayEarnings}₽
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Заработано сегодня
            </p>
          </div>

          {/* Всего доставок */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(244, 162, 97, 0.15)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Truck style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {courierData.totalDeliveries}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Всего доставок
            </p>
          </div>

          {/* Рейтинг */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 160, 0, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 193, 7, 0.4)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 20px rgba(255, 193, 7, 0.15)',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12,
              background: 'rgba(255, 193, 7, 0.25)',
              border: '1px solid rgba(255, 193, 7, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Star style={{ width: 20, height: 20, color: '#FFC107', fill: '#FFC107' }} strokeWidth={0} />
            </div>
            <p style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {courierData.rating}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Рейтинг
            </p>
          </div>
        </div>

        {/* Активные заказы */}
        {onShift && activeOrders.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Активные заказы
              </h2>
              <div style={{
                background: 'rgba(244, 162, 97, 0.2)',
                border: '1px solid rgba(244, 162, 97, 0.4)',
                borderRadius: 10,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 36,
              }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#F4A261',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  textAlign: 'center',
                }}>
                  {activeOrders.length}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const statusData = statusInfo[order.status];
                
                return (
                  <div
                    key={order.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(244, 162, 97, 0.25)',
                      borderRadius: 18,
                      padding: 18,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Заголовок с номером и статусом */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{
                          fontSize: 17,
                          fontWeight: 900,
                          color: '#FFFFFF',
                          marginBottom: 4,
                          letterSpacing: '-0.01em',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          Заказ #{order.orderNumber}
                        </h3>
                        <p style={{
                          fontSize: 13,
                          color: '#94A3B8',
                          fontWeight: 600,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {order.shop}
                        </p>
                      </div>

                      <div style={{
                        background: statusData.bgColor,
                        border: `1px solid ${statusData.borderColor}`,
                        borderRadius: 10,
                        padding: '8px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 80,
                      }}>
                        <span style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: statusData.color,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}>
                          {statusData.label}
                        </span>
                      </div>
                    </div>

                    {/* Информация о клиенте */}
                    <div style={{
                      background: 'rgba(26, 47, 58, 0.6)',
                      border: '1px solid rgba(244, 162, 97, 0.15)',
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 14,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: 'rgba(244, 162, 97, 0.2)',
                          border: '1px solid rgba(244, 162, 97, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <MapPin style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            marginBottom: 3,
                            lineHeight: 1.4,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {order.address}
                          </p>
                          <p style={{
                            fontSize: 12,
                            color: '#94A3B8',
                            fontWeight: 600,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {order.distance}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: 'rgba(76, 175, 80, 0.2)',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Phone style={{ width: 16, height: 16, color: '#4CAF50' }} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            marginBottom: 2,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {order.customer}
                          </p>
                          <p style={{
                            fontSize: 12,
                            color: '#94A3B8',
                            fontWeight: 600,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {order.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Детали заказа */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: 14,
                      paddingBottom: 14,
                      borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div>
                          <p style={{
                            fontSize: 11,
                            color: '#94A3B8',
                            fontWeight: 600,
                            marginBottom: 4,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            Товаров
                          </p>
                          <p style={{
                            fontSize: 16,
                            fontWeight: 900,
                            color: '#FFFFFF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {order.items}
                          </p>
                        </div>

                        <div>
                          <p style={{
                            fontSize: 11,
                            color: '#94A3B8',
                            fontWeight: 600,
                            marginBottom: 4,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            Время
                          </p>
                          <p style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {order.deliveryTime}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: 11,
                          color: '#94A3B8',
                          fontWeight: 600,
                          marginBottom: 4,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          Сумма
                        </p>
                        <p style={{
                          fontSize: 20,
                          fontWeight: 900,
                          color: '#4CAF50',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {order.total.toFixed(2)} ₽
                        </p>
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      {order.status === 'in_transit' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate or open map
                          }}
                          style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(21, 101, 192, 0.2) 100%)',
                            border: '1px solid rgba(33, 150, 243, 0.4)',
                            borderRadius: 12,
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Navigation style={{ width: 16, height: 16, color: '#2196F3' }} strokeWidth={2.5} />
                          <span style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: '#2196F3',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            Навигация
                          </span>
                        </button>
                      )}

                      {nextStatus && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order.id, nextStatus);
                          }}
                          style={{
                            flex: order.status === 'in_transit' ? 1 : 1,
                            background: nextStatus === 'delivered'
                              ? 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
                              : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)', // Всегда персиковый для "Принять"
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: nextStatus === 'delivered'
                              ? '0 4px 16px rgba(76, 175, 80, 0.4)'
                              : '0 4px 16px rgba(244, 162, 97, 0.4)', // Всегда персиковая тень
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = nextStatus === 'delivered'
                              ? '0 6px 24px rgba(76, 175, 80, 0.5)'
                              : '0 6px 24px rgba(244, 162, 97, 0.5)'; // Всегда персиковая тень при hover
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = nextStatus === 'delivered'
                              ? '0 4px 16px rgba(76, 175, 80, 0.4)'
                              : '0 4px 16px rgba(244, 162, 97, 0.4)'; // Всегда персиковая тень
                          }}
                        >
                          <CheckCircle style={{ width: 16, height: 16, color: '#FFFFFF' }} strokeWidth={2.5} />
                          <span style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: '#FFFFFF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {nextStatus === 'delivered' && 'Доставлен'}
                            {nextStatus === 'in_transit' && (order.status === 'preparing' ? 'Принять' : 'В пути')}
                            {nextStatus === 'accepted' && 'Принять'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {onShift && activeOrders.length === 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 18,
            padding: 40,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'rgba(244, 162, 97, 0.15)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Package style={{ width: 40, height: 40, color: '#F4A261' }} strokeWidth={2} />
            </div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 8,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Нет активных заказов
            </h3>
            <p style={{
              fontSize: 14,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Ожидайте новых заказов
            </p>
          </div>
        )}

        {!onShift && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 18,
            padding: 40,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Truck style={{ width: 40, height: 40, color: '#EF4444' }} strokeWidth={2} />
            </div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 8,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Вы не на смене
            </h3>
            <p style={{
              fontSize: 14,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Включите статус смены, чтобы принимать заказы
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
