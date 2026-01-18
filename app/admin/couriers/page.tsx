'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Truck,
  Search,
  CheckCircle,
  Clock,
  Package,
  DollarSign,
  Star,
  ChevronRight,
  Plus,
  X,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function AdminCouriersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on_shift' | 'off_shift'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourier, setNewCourier] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Mock данные курьеров
  const [allCouriers, setAllCouriers] = useState([
    {
      id: '1',
      name: 'Иван Петров',
      phone: '+7 (900) 111-22-33',
      onShift: true,
      todayDeliveries: 18,
      todayEarnings: 3600,
      totalDeliveries: 347,
      rating: 4.9,
      avgDeliveryTime: '22 мин',
      currentOrders: 2,
    },
    {
      id: '2',
      name: 'Мария Сидорова',
      phone: '+7 (900) 222-33-44',
      onShift: true,
      todayDeliveries: 15,
      todayEarnings: 3000,
      totalDeliveries: 289,
      rating: 4.8,
      avgDeliveryTime: '25 мин',
      currentOrders: 1,
    },
    {
      id: '3',
      name: 'Алексей Волков',
      phone: '+7 (900) 333-44-55',
      onShift: false,
      todayDeliveries: 0,
      todayEarnings: 0,
      totalDeliveries: 412,
      rating: 4.7,
      avgDeliveryTime: '28 мин',
      currentOrders: 0,
    },
    {
      id: '4',
      name: 'Елена Смирнова',
      phone: '+7 (900) 444-55-66',
      onShift: true,
      todayDeliveries: 12,
      todayEarnings: 2400,
      totalDeliveries: 198,
      rating: 4.9,
      avgDeliveryTime: '20 мин',
      currentOrders: 3,
    },
  ]);

  // Обработчик добавления курьера
  const handleAddCourier = () => {
    if (newCourier.name.trim() && newCourier.phone.trim()) {
      const courier = {
        id: String(allCouriers.length + 1),
        name: newCourier.name.trim(),
        phone: newCourier.phone.trim(),
        onShift: false,
        todayDeliveries: 0,
        todayEarnings: 0,
        totalDeliveries: 0,
        rating: 5.0,
        avgDeliveryTime: '0 мин',
        currentOrders: 0,
      };
      setAllCouriers([...allCouriers, courier]);
      setNewCourier({ name: '', phone: '', email: '' });
      setShowAddModal(false);
    }
  };

  // Фильтрация курьеров
  const filteredCouriers = allCouriers.filter(courier => {
    const matchesSearch = courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          courier.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' ? true :
                          statusFilter === 'on_shift' ? courier.onShift :
                          !courier.onShift;
    
    return matchesSearch && matchesStatus;
  });

  // Статистика
  const stats = {
    total: allCouriers.length,
    onShift: allCouriers.filter(c => c.onShift).length,
    offShift: allCouriers.filter(c => !c.onShift).length,
    totalDeliveriesToday: allCouriers.reduce((sum, c) => sum + c.todayDeliveries, 0),
    totalEarningsToday: allCouriers.reduce((sum, c) => sum + c.todayEarnings, 0),
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
            Курьеры
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
            <Truck style={{ width: 20, height: 20, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
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
              Всего курьеров
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
              {stats.onShift}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              На смене
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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
              {stats.totalDeliveriesToday}
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

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <DollarSign style={{ width: 20, height: 20, color: '#4CAF50', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.totalEarningsToday.toLocaleString('ru-RU')}₽
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
        </div>

        {/* Кнопка добавления курьера */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.4)',
            borderRadius: 14,
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 16,
            boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.15)';
          }}
        >
          <Plus style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          <span style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#F4A261',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Добавить курьера
          </span>
        </button>

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
            placeholder="Поиск по имени, телефону..."
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

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              flex: 1,
              background: statusFilter === 'all' 
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: statusFilter === 'all' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: statusFilter === 'all' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Все
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('on_shift')}
            style={{
              flex: 1,
              background: statusFilter === 'on_shift' 
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: statusFilter === 'on_shift' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: statusFilter === 'on_shift' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              На смене
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('off_shift')}
            style={{
              flex: 1,
              background: statusFilter === 'off_shift' 
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: statusFilter === 'off_shift' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: statusFilter === 'off_shift' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Не на смене
            </span>
          </button>
        </div>

        {/* Список курьеров */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredCouriers.map((courier) => (
            <div
              key={courier.id}
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
                    {courier.name}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {courier.phone}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star style={{ width: 14, height: 14, color: '#FFD700', fill: '#FFD700' }} strokeWidth={0} />
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {courier.rating}
                    </span>
                  </div>
                </div>

                {courier.onShift ? (
                  <div style={{
                    background: 'rgba(76, 175, 80, 0.15)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: 8,
                    padding: '4px 8px',
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#4CAF50',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      На смене
                    </span>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8,
                    padding: '4px 8px',
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#EF4444',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Не на смене
                    </span>
                  </div>
                )}
              </div>

              {courier.onShift && courier.currentOrders > 0 && (
                <div style={{
                  background: 'rgba(244, 162, 97, 0.15)',
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                  border: '1px solid rgba(244, 162, 97, 0.3)',
                }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#F4A261',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    🚴 Доставляет: {courier.currentOrders} {courier.currentOrders === 1 ? 'заказ' : 'заказа'}
                  </p>
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 10,
                padding: 10,
              }}>
                <div>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Сегодня
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {courier.todayDeliveries}
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
                    Заработал
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#4CAF50',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {courier.todayEarnings.toLocaleString('ru-RU')}₽
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
                    Всего
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {courier.totalDeliveries}
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
                    Среднее
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#F4A261',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {courier.avgDeliveryTime}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Модальное окно добавления курьера */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 343,
            background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(244, 162, 97, 0.3)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
                  border: '1px solid rgba(244, 162, 97, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
                </div>
                <h2 style={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Новый курьер
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCourier({ name: '', phone: '', email: '' });
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X style={{ width: 18, height: 18, color: '#EF4444' }} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              {/* Имя */}
              <div>
                <label style={{
                  fontSize: 13,
                  color: '#B0BEC5',
                  fontWeight: 700,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  <User style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  value={newCourier.name}
                  onChange={(e) => setNewCourier({ ...newCourier, name: e.target.value })}
                  placeholder="Иван Иванов"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                    border: '1px solid rgba(244, 162, 97, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(244, 162, 97, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(244, 162, 97, 0.25)';
                  }}
                />
              </div>

              {/* Телефон */}
              <div>
                <label style={{
                  fontSize: 13,
                  color: '#B0BEC5',
                  fontWeight: 700,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  <Phone style={{ width: 16, height: 16, color: '#4CAF50' }} strokeWidth={2.5} />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={newCourier.phone}
                  onChange={(e) => setNewCourier({ ...newCourier, phone: e.target.value })}
                  placeholder="+7 (900) 123-45-67"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(76, 175, 80, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(76, 175, 80, 0.25)';
                  }}
                />
              </div>

              {/* Email (опционально) */}
              <div>
                <label style={{
                  fontSize: 13,
                  color: '#B0BEC5',
                  fontWeight: 700,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  <Mail style={{ width: 16, height: 16, color: '#2196F3' }} strokeWidth={2.5} />
                  Email <span style={{ color: '#94A3B8', fontWeight: 500 }}>(опционально)</span>
                </label>
                <input
                  type="email"
                  value={newCourier.email}
                  onChange={(e) => setNewCourier({ ...newCourier, email: e.target.value })}
                  placeholder="courier@example.com"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                    border: '1px solid rgba(33, 150, 243, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(33, 150, 243, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(33, 150, 243, 0.25)';
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCourier({ name: '', phone: '', email: '' });
                }}
                style={{
                  flex: 1,
                  background: 'rgba(45, 79, 94, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 79, 94, 0.85)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 79, 94, 0.7)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#94A3B8',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Отмена
                </span>
              </button>

              <button
                onClick={handleAddCourier}
                disabled={!newCourier.name.trim() || !newCourier.phone.trim()}
                style={{
                  flex: 1,
                  background: (newCourier.name.trim() && newCourier.phone.trim())
                    ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                    : 'rgba(45, 79, 94, 0.5)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: (newCourier.name.trim() && newCourier.phone.trim()) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: (newCourier.name.trim() && newCourier.phone.trim()) ? 1 : 0.5,
                  boxShadow: (newCourier.name.trim() && newCourier.phone.trim()) ? '0 4px 16px rgba(244, 162, 97, 0.4)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (newCourier.name.trim() && newCourier.phone.trim()) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 162, 97, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newCourier.name.trim() && newCourier.phone.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.4)';
                  }
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Добавить
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
