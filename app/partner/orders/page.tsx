'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

type OrderStatus = 'new' | 'accepted' | 'collected' | 'handed_to_courier' | 'delivered';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
  date: string;
  time: string;
}

const statusInfo: Record<OrderStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  new: { label: 'Новый', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.15)', borderColor: 'rgba(33, 150, 243, 0.3)' },
  accepted: { label: 'Принят', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.15)', borderColor: 'rgba(255, 152, 0, 0.3)' },
  collected: { label: 'Собран', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.15)', borderColor: 'rgba(156, 39, 176, 0.3)' },
  handed_to_courier: { label: 'Передан курьеру', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)', borderColor: 'rgba(76, 175, 80, 0.3)' },
  delivered: { label: 'Доставлен', color: '#607D8B', bgColor: 'rgba(96, 125, 139, 0.15)', borderColor: 'rgba(96, 125, 139, 0.3)' },
};

export default function PartnerOrdersPage() {
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '45892',
      customerName: 'Иван Петров',
      customerPhone: '+7 (999) 123-45-67',
      address: 'ул. Ленина, 45, кв. 12',
      items: [
        { name: 'Багет французский', quantity: 2, price: 120 },
        { name: 'Круассан с шоколадом', quantity: 3, price: 85 },
      ],
      total: 495,
      status: 'new',
      date: '16.01.2026',
      time: '14:30',
    },
    {
      id: '2',
      orderNumber: '45891',
      customerName: 'Мария Сидорова',
      customerPhone: '+7 (999) 765-43-21',
      address: 'пр. Мира, 12, кв. 5',
      items: [
        { name: 'Хлеб Бородинский', quantity: 1, price: 95 },
        { name: 'Булочка с корицей', quantity: 4, price: 70 },
      ],
      total: 375,
      status: 'accepted',
      date: '16.01.2026',
      time: '13:15',
    },
    {
      id: '3',
      orderNumber: '45890',
      customerName: 'Алексей Иванов',
      customerPhone: '+7 (999) 555-77-88',
      address: 'ул. Гагарина, 78, кв. 23',
      items: [
        { name: 'Торт Наполеон', quantity: 1, price: 850 },
      ],
      total: 850,
      status: 'collected',
      date: '16.01.2026',
      time: '12:00',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'new':
        return 'accepted';
      case 'accepted':
        return 'collected';
      case 'collected':
        return 'handed_to_courier';
      default:
        return null;
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const activeOrders = orders.filter(o => o.status !== 'delivered').length;

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A', 
      position: 'relative',
      paddingBottom: 16,
    }}>
      
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
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/partner')}
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
            Заказы
          </h1>

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
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Статистика */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 12,
                color: '#94A3B8',
                fontWeight: 600,
                marginBottom: 4,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Всего заказов
              </p>
              <p style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {orders.length}
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 12,
                color: '#94A3B8',
                fontWeight: 600,
                marginBottom: 4,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Активных
              </p>
              <p style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#F4A261',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {activeOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 20, 
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              background: filterStatus === 'all'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: filterStatus === 'all' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '8px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: filterStatus === 'all' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Все ({orders.length})
            </span>
          </button>

          {(Object.keys(statusInfo) as OrderStatus[]).filter(s => s !== 'delivered').map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                background: filterStatus === status
                  ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                  : 'rgba(45, 79, 94, 0.5)',
                border: filterStatus === status ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
                borderRadius: 12,
                padding: '8px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: filterStatus === status ? '#F4A261' : '#94A3B8',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {statusInfo[status].label} ({orders.filter(o => o.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Список заказов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(244, 162, 97, 0.2)',
            }}>
              <Package style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
              <p style={{
                fontSize: 15,
                color: '#94A3B8',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Нет заказов с выбранным статусом
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              return (
                <div
                  key={order.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Заголовок */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Заказ №{order.orderNumber}
                    </h3>
                    <div style={{
                      background: statusInfo[order.status].bgColor,
                      border: `1px solid ${statusInfo[order.status].borderColor}`,
                      borderRadius: 8,
                      padding: '4px 10px',
                    }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: statusInfo[order.status].color,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {statusInfo[order.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Информация о клиенте */}
                  <div style={{ 
                    background: 'rgba(26, 47, 58, 0.5)', 
                    borderRadius: 12, 
                    padding: 12, 
                    marginBottom: 12,
                    border: '1px solid rgba(244, 162, 97, 0.1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <User style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {order.customerName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Phone style={{ width: 16, height: 16, color: '#94A3B8' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#94A3B8',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {order.customerPhone}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin style={{ width: 16, height: 16, color: '#94A3B8' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#94A3B8',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {order.address}
                      </span>
                    </div>
                  </div>

                  {/* Товары */}
                  <div style={{ marginBottom: 12 }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingBottom: idx < order.items.length - 1 ? 8 : 0,
                        marginBottom: idx < order.items.length - 1 ? 8 : 0,
                        borderBottom: idx < order.items.length - 1 ? '1px solid rgba(244, 162, 97, 0.1)' : 'none',
                      }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#E2E8F0',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {item.name} × {item.quantity}
                        </span>
                        <span style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#F4A261',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {item.price * item.quantity}₽
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Итого и время */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 14,
                    paddingTop: 12,
                    borderTop: '1px solid rgba(244, 162, 97, 0.2)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock style={{ width: 14, height: 14, color: '#94A3B8' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#94A3B8',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {order.date} • {order.time}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        fontSize: 17,
                        fontWeight: 900,
                        color: '#F4A261',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {order.total}₽
                      </span>
                    </div>
                  </div>

                  {/* Кнопка изменения статуса */}
                  {nextStatus && (
                    <button
                      onClick={() => handleStatusChange(order.id, nextStatus)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(69, 160, 73, 0.2) 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
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
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <CheckCircle style={{ width: 18, height: 18, color: '#4CAF50' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#4CAF50',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {nextStatus === 'accepted' && 'Принять заказ'}
                        {nextStatus === 'collected' && 'Отметить как собранный'}
                        {nextStatus === 'handed_to_courier' && 'Передать курьеру'}
                      </span>
                    </button>
                  )}

                  {order.status === 'handed_to_courier' && (
                    <div style={{
                      background: 'rgba(76, 175, 80, 0.15)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <Truck style={{ width: 16, height: 16, color: '#4CAF50' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#4CAF50',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        Заказ в пути
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
