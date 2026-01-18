'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Users,
  Search,
  Filter,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function AdminUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'with_subscription' | 'without_subscription'>('all');

  // Mock данные пользователей
  const allUsers = [
    {
      id: '1',
      name: 'Никита Иванов',
      phone: '+7 (900) 123-45-67',
      email: 'nikita@example.com',
      registeredAt: '2025-12-01',
      subscription: {
        active: true,
        plan: 'Стандарт',
        deliveriesRemaining: 3,
        totalDeliveries: 5,
        expiresAt: '2026-02-15',
      },
      totalOrders: 47,
      totalSpent: 45230,
    },
    {
      id: '2',
      name: 'Елена Петрова',
      phone: '+7 (900) 234-56-78',
      email: 'elena@example.com',
      registeredAt: '2026-01-10',
      subscription: {
        active: true,
        plan: 'Премиум',
        deliveriesRemaining: 18,
        totalDeliveries: 20,
        expiresAt: '2026-03-10',
      },
      totalOrders: 23,
      totalSpent: 28450,
    },
    {
      id: '3',
      name: 'Алексей Смирнов',
      phone: '+7 (900) 345-67-89',
      email: 'alexey@example.com',
      registeredAt: '2025-11-15',
      subscription: {
        active: false,
        plan: null,
        deliveriesRemaining: 0,
        totalDeliveries: 0,
        expiresAt: null,
      },
      totalOrders: 12,
      totalSpent: 8940,
    },
    {
      id: '4',
      name: 'Мария Козлова',
      phone: '+7 (900) 456-78-90',
      email: 'maria@example.com',
      registeredAt: '2026-01-05',
      subscription: {
        active: true,
        plan: 'Стандарт',
        deliveriesRemaining: 1,
        totalDeliveries: 5,
        expiresAt: '2026-02-05',
      },
      totalOrders: 8,
      totalSpent: 12300,
    },
  ];

  // Фильтрация пользователей
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.phone.includes(searchQuery) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' ? true :
                          filterType === 'with_subscription' ? user.subscription.active :
                          !user.subscription.active;
    
    return matchesSearch && matchesFilter;
  });

  // Статистика
  const stats = {
    total: allUsers.length,
    withSubscription: allUsers.filter(u => u.subscription.active).length,
    withoutSubscription: allUsers.filter(u => !u.subscription.active).length,
    totalDeliveriesRemaining: allUsers.reduce((sum, u) => sum + u.subscription.deliveriesRemaining, 0),
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
            Пользователи
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
            <Users style={{ width: 20, height: 20, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
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
            border: '1px solid rgba(244, 162, 97, 0.2)',
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
              {stats.withSubscription}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              С подпиской
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
            <XCircle style={{ width: 20, height: 20, color: '#EF4444', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.withoutSubscription}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Без подписки
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
            <CreditCard style={{ width: 20, height: 20, color: '#F4A261', marginBottom: 8 }} strokeWidth={2} />
            <p style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.totalDeliveriesRemaining}
            </p>
            <p style={{
              fontSize: 11,
              color: '#94A3B8',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Доставок осталось
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
            placeholder="Поиск по имени, телефону, email..."
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
            onClick={() => setFilterType('all')}
            style={{
              flex: 1,
              background: filterType === 'all' 
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: filterType === 'all' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: filterType === 'all' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Все
            </span>
          </button>

          <button
            onClick={() => setFilterType('with_subscription')}
            style={{
              flex: 1,
              background: filterType === 'with_subscription' 
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: filterType === 'with_subscription' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: filterType === 'with_subscription' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              С подпиской
            </span>
          </button>

          <button
            onClick={() => setFilterType('without_subscription')}
            style={{
              flex: 1,
              background: filterType === 'without_subscription' 
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: filterType === 'without_subscription' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: filterType === 'without_subscription' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Без подписки
            </span>
          </button>
        </div>

        {/* Список пользователей */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
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
                    {user.name}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {user.phone}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {user.email}
                  </p>
                </div>

                {user.subscription.active ? (
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
                      Активна
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
                      Нет подписки
                    </span>
                  </div>
                )}
              </div>

              {user.subscription.active && (
                <div style={{
                  background: 'rgba(244, 162, 97, 0.1)',
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {user.subscription.plan}
                    </span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#F4A261',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {user.subscription.deliveriesRemaining} из {user.subscription.totalDeliveries}
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: 4,
                    backgroundColor: 'rgba(26, 47, 58, 0.5)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(user.subscription.deliveriesRemaining / user.subscription.totalDeliveries) * 100}%`,
                      height: '100%',
                      background: user.subscription.deliveriesRemaining <= 2
                        ? 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)'
                        : 'linear-gradient(90deg, #F4A261 0%, #E89551 100%)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Заказов
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {user.totalOrders}
                  </p>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Потрачено
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#F4A261',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {user.totalSpent.toLocaleString('ru-RU')} ₽
                  </p>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    fontWeight: 600,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    С нами
                  </p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {Math.ceil((new Date().getTime() - new Date(user.registeredAt).getTime()) / (1000 * 60 * 60 * 24))} дн.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
