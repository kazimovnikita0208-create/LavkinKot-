'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Package,
  Search,
  Filter,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled'>('all');
  const [courierFilter, setCourierFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Mock данные заказов
  const allOrders = [
    {
      id: '1',
      orderNumber: '123456',
      customer: 'Никита Иванов',
      shop: 'Пекарня "Хлебница"',
      date: '2026-01-16',
      time: '12:00',
      total: 1613.20,
      status: 'in_transit' as const,
      statusText: 'В пути',
      courier: 'Иван Петров',
      items: 3,
      address: 'ул. Примерная, д. 10',
    },
    {
      id: '2',
      orderNumber: '123455',
      customer: 'Елена Петрова',
      shop: 'Фруктовый рай',
      date: '2026-01-16',
      time: '14:30',
      total: 2450.00,
      status: 'preparing' as const,
      statusText: 'Готовится',
      courier: null,
      items: 5,
      address: 'ул. Садовая, д. 5',
    },
    {
      id: '3',
      orderNumber: '123454',
      customer: 'Алексей Смирнов',
      shop: 'Суши-бар Токио',
      date: '2026-01-16',
      time: '18:00',
      total: 3200.00,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      courier: 'Мария Сидорова',
      items: 8,
      address: 'ул. Ленина, д. 42',
    },
    {
      id: '4',
      orderNumber: '123453',
      customer: 'Мария Козлова',
      shop: 'Магазин "Продукты"',
      date: '2026-01-15',
      time: '16:45',
      total: 980.00,
      status: 'cancelled' as const,
      statusText: 'Отменён',
      courier: null,
      items: 2,
      address: 'ул. Мира, д. 15',
    },
    {
      id: '5',
      orderNumber: '123452',
      customer: 'Дмитрий Волков',
      shop: 'Пекарня "Хлебница"',
      date: '2026-01-15',
      time: '10:20',
      total: 1250.00,
      status: 'delivered' as const,
      statusText: 'Доставлен',
      courier: 'Иван Петров',
      items: 4,
      address: 'ул. Советская, д. 8',
    },
  ];

  // Уникальные курьеры
  const couriers = Array.from(new Set(allOrders.filter(o => o.courier).map(o => o.courier as string)));

  // Фильтрация заказов
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.orderNumber.includes(searchQuery) ||
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.shop.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCourier = courierFilter === 'all' || order.courier === courierFilter;
    const matchesDate = dateFilter === 'all' || order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesCourier && matchesDate;
  });

  // Статистика
  const stats = {
    total: allOrders.length,
    preparing: allOrders.filter(o => o.status === 'preparing').length,
    inTransit: allOrders.filter(o => o.status === 'in_transit').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'in_transit':
        return '#F4A261';
      case 'preparing':
        return '#2196F3';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle style={{ width: 14, height: 14 }} strokeWidth={2.5} />;
      case 'in_transit':
        return <Truck style={{ width: 14, height: 14 }} strokeWidth={2.5} />;
      case 'preparing':
        return <Package style={{ width: 14, height: 14 }} strokeWidth={2.5} />;
      case 'cancelled':
        return <XCircle style={{ width: 14, height: 14 }} strokeWidth={2.5} />;
      default:
        return <Package style={{ width: 14, height: 14 }} strokeWidth={2.5} />;
    }
  };

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
            onClick={() => router.push('/admin')}
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
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
          }}>
            <Package style={{ width: 20, height: 20, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.total}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Всего
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <Package style={{ width: 20, height: 20, color: '#2196F3', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.preparing}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Готовится
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <Truck style={{ width: 20, height: 20, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.inTransit}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              В пути
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <CheckCircle style={{ width: 20, height: 20, color: '#4CAF50', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.delivered}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Доставлено
            </p>
          </div>
        </div>

        {/* Поиск */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 14,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
          border: '1px solid rgba(244, 162, 97, 0.1)',
        }}>
          <Search style={{ width: 18, height: 18, color: '#94A3B8' }} strokeWidth={2} />
          <input
            type="text"
            placeholder="Поиск по номеру, клиенту, магазину..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: '#FFFFFF',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          />
        </div>

        {/* Фильтры по статусу */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'Все' },
            { id: 'preparing', label: 'Готовится' },
            { id: 'in_transit', label: 'В пути' },
            { id: 'delivered', label: 'Доставлено' },
            { id: 'cancelled', label: 'Отменено' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id as any)}
              style={{
                background: statusFilter === filter.id
                  ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                  : 'rgba(45, 79, 94, 0.5)',
                border: statusFilter === filter.id ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
                borderRadius: 10,
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: statusFilter === filter.id ? '#F4A261' : '#94A3B8',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                {filter.label}
              </span>
            </button>
          ))}
        </div>

        {/* Фильтры по курьеру и дате */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <select
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              borderRadius: 10,
              padding: '8px 10px',
              fontSize: 12,
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <option value="all">Все курьеры</option>
            {couriers.map((courier) => (
              <option key={courier} value={courier}>{courier}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              borderRadius: 10,
              padding: '8px 10px',
              fontSize: 12,
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <option value="all">Все даты</option>
            <option value="2026-01-16">Сегодня</option>
            <option value="2026-01-15">Вчера</option>
          </select>
        </div>

        {/* Список заказов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => router.push(`/order/${order.id}`)}
              style={{
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                borderRadius: 14,
                padding: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 4,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Заказ #{order.orderNumber}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.customer}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.shop}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 8,
                  backgroundColor: `${getStatusColor(order.status)}20`,
                  border: `1px solid ${getStatusColor(order.status)}40`,
                }}>
                  <div style={{ color: getStatusColor(order.status) }}>
                    {getStatusIcon(order.status)}
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: getStatusColor(order.status),
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.statusText}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
                marginBottom: 10,
                padding: 10,
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 10,
              }}>
                <div>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Дата и время
                  </p>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.date} {order.time}
                  </p>
                </div>

                <div>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Курьер
                  </p>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: order.courier ? '#FFFFFF' : '#EF4444',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.courier || 'Не назначен'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Товаров: {order.items}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {order.address}
                  </p>
                </div>

                <p style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#F4A261',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {order.total.toFixed(2)} ₽
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
