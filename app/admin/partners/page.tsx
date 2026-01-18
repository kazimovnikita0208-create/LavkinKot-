'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  X
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'moderation';

interface PartnerApplication {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  description: string;
  submittedDate: string;
  status: ApplicationStatus;
  moderationComment?: string;
}

export default function AdminPartnersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationComment, setModerationComment] = useState('');

  // Mock данные заявок
  const [applications, setApplications] = useState<PartnerApplication[]>([
    {
      id: '1',
      shopName: 'Пекарня "Свежий хлеб"',
      ownerName: 'Иванова Мария Петровна',
      phone: '+7 (900) 123-45-67',
      email: 'maria@svezhihleb.ru',
      address: 'ул. Ленина, д. 15',
      category: 'Пекарни',
      description: 'Домашняя пекарня с широким ассортиментом свежей выпечки. Работаем с 6:00 до 22:00. Используем только натуральные ингредиенты.',
      submittedDate: '2026-01-15',
      status: 'pending',
    },
    {
      id: '2',
      shopName: 'Фермерские продукты "Эко"',
      ownerName: 'Петров Алексей Сергеевич',
      phone: '+7 (900) 234-56-78',
      email: 'alex@eco-farm.ru',
      address: 'ул. Садовая, д. 42',
      category: 'Магазины',
      description: 'Фермерские продукты напрямую от производителя. Свежие овощи, фрукты, молочная продукция.',
      submittedDate: '2026-01-14',
      status: 'pending',
    },
    {
      id: '3',
      shopName: 'Суши-бар "Токио"',
      ownerName: 'Ким Юн Су',
      phone: '+7 (900) 345-67-89',
      email: 'tokyo@sushi.ru',
      address: 'пр. Мира, д. 8',
      category: 'Рестораны',
      description: 'Японская кухня высокого качества. Опытные повара, свежие продукты, быстрая доставка.',
      submittedDate: '2026-01-13',
      status: 'moderation',
      moderationComment: 'Необходимо предоставить сертификаты качества на рыбу',
    },
    {
      id: '4',
      shopName: 'Кофейня "Зерно"',
      ownerName: 'Соколова Анна Викторовна',
      phone: '+7 (900) 456-78-90',
      email: 'anna@zerno-coffee.ru',
      address: 'ул. Пушкина, д. 23',
      category: 'Кофейни',
      description: 'Авторский кофе, свежая выпечка. Уютная атмосфера.',
      submittedDate: '2026-01-12',
      status: 'approved',
    },
  ]);

  // Статистика
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    moderation: applications.filter(a => a.status === 'moderation').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  // Фильтрация
  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const handleApprove = (id: string) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: 'approved' as ApplicationStatus } : app
    ));
  };

  const handleReject = (id: string) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: 'rejected' as ApplicationStatus } : app
    ));
  };

  const handleModeration = (id: string) => {
    setSelectedApplication(id);
    setShowModerationModal(true);
  };

  const submitModeration = () => {
    if (selectedApplication && moderationComment.trim()) {
      setApplications(apps => apps.map(app => 
        app.id === selectedApplication 
          ? { ...app, status: 'moderation' as ApplicationStatus, moderationComment: moderationComment }
          : app
      ));
      setShowModerationModal(false);
      setModerationComment('');
      setSelectedApplication(null);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending': return '#F4A261';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#EF4444';
      case 'moderation': return '#2196F3';
      default: return '#94A3B8';
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'moderation': return 'На модерации';
      default: return 'Неизвестно';
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
            fontSize: 18,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Заявки от партнёров
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
          gap: 10,
          marginBottom: 18,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.18) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 162, 97, 0.35)',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 4px 20px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.3), 0 0 0 1px rgba(244, 162, 97, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(244, 162, 97, 0.2), 0 0 0 1px rgba(244, 162, 97, 0.1)';
          }}
          >
            <Store style={{ width: 22, height: 22, color: '#F4A261', marginBottom: 10 }} strokeWidth={2.5} />
            <p style={{
              fontSize: 26,
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
              color: '#E0E0E0',
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Всего заявок
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(244, 162, 97, 0.25)',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
          }}
          >
            <Clock style={{ width: 22, height: 22, color: '#F4A261', marginBottom: 10 }} strokeWidth={2.5} />
            <p style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.pending}
            </p>
            <p style={{
              fontSize: 11,
              color: '#E0E0E0',
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Ожидает
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(33, 150, 243, 0.35)',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(33, 150, 243, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
          }}
          >
            <MessageSquare style={{ width: 22, height: 22, color: '#2196F3', marginBottom: 10 }} strokeWidth={2.5} />
            <p style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.moderation}
            </p>
            <p style={{
              fontSize: 11,
              color: '#E0E0E0',
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              На модерации
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(76, 175, 80, 0.35)',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(76, 175, 80, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
          }}
          >
            <CheckCircle style={{ width: 22, height: 22, color: '#4CAF50', marginBottom: 10 }} strokeWidth={2.5} />
            <p style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 2,
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              {stats.approved}
            </p>
            <p style={{
              fontSize: 11,
              color: '#E0E0E0',
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Одобрено
            </p>
          </div>
        </div>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }} className="horizontal-scroll">
          {[
            { id: 'all', label: 'Все' },
            { id: 'pending', label: 'Ожидает' },
            { id: 'moderation', label: 'На модерации' },
            { id: 'approved', label: 'Одобрено' },
            { id: 'rejected', label: 'Отклонено' },
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

        {/* Список заявок */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              style={{
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${getStatusColor(app.status)}40`,
                borderRadius: 16,
                padding: 18,
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px ${getStatusColor(app.status)}20`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${getStatusColor(app.status)}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px ${getStatusColor(app.status)}20`;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <h3 style={{
                    fontSize: 17,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    marginBottom: 6,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {app.shopName}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(244, 162, 97, 0.15)',
                    border: '1px solid rgba(244, 162, 97, 0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                  }}>
                    <p style={{
                      fontSize: 11,
                      color: '#F4A261',
                      fontWeight: 700,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {app.category}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: `${getStatusColor(app.status)}25`,
                  border: `1px solid ${getStatusColor(app.status)}50`,
                  borderRadius: 10,
                  padding: '6px 12px',
                  boxShadow: `0 2px 8px ${getStatusColor(app.status)}20`,
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: getStatusColor(app.status),
                    whiteSpace: 'nowrap',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {getStatusText(app.status)}
                  </span>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                borderRadius: 12,
                padding: 14,
                marginBottom: 14,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <p style={{
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  marginBottom: 10,
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {app.ownerName}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(76, 175, 80, 0.15)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Phone style={{ width: 14, height: 14, color: '#4CAF50' }} strokeWidth={2.5} />
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: '#E0E0E0',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {app.phone}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(33, 150, 243, 0.15)',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Mail style={{ width: 14, height: 14, color: '#2196F3' }} strokeWidth={2.5} />
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: '#E0E0E0',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      wordBreak: 'break-all',
                    }}>
                      {app.email}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(244, 162, 97, 0.15)',
                      border: '1px solid rgba(244, 162, 97, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <MapPin style={{ width: 14, height: 14, color: '#F4A261' }} strokeWidth={2.5} />
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: '#E0E0E0',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {app.address}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <p style={{
                  fontSize: 13,
                  color: '#E8E8E8',
                  fontWeight: 500,
                  lineHeight: '1.6',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  {app.description}
                </p>
              </div>

              {app.status === 'moderation' && app.moderationComment && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(21, 101, 192, 0.15) 100%)',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 14,
                  boxShadow: '0 2px 12px rgba(33, 150, 243, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <MessageSquare style={{ width: 14, height: 14, color: '#2196F3' }} strokeWidth={2.5} />
                    <p style={{
                      fontSize: 11,
                      color: '#2196F3',
                      fontWeight: 800,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Комментарий модератора
                    </p>
                  </div>
                  <p style={{
                    fontSize: 13,
                    color: '#E8E8E8',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    {app.moderationComment}
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}>
                <Clock style={{ width: 14, height: 14, color: '#94A3B8' }} strokeWidth={2.5} />
                <p style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Подана: {app.submittedDate}
                </p>
              </div>

              {(app.status === 'pending' || app.status === 'moderation') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Первая строка - Принять и Отклонить */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleApprove(app.id)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(67, 160, 71, 0.15) 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.35) 0%, rgba(67, 160, 71, 0.25) 100%)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(67, 160, 71, 0.15) 100%)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.15)';
                      }}
                    >
                      <CheckCircle style={{ width: 18, height: 18, color: '#4CAF50' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#4CAF50',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        Принять
                      </span>
                    </button>

                    <button
                      onClick={() => handleReject(app.id)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, rgba(220, 38, 38, 0.25) 100%)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
                      }}
                    >
                      <XCircle style={{ width: 18, height: 18, color: '#EF4444' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#EF4444',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        Отклонить
                      </span>
                    </button>
                  </div>

                  {/* Вторая строка - Модерация */}
                  <button
                    onClick={() => handleModeration(app.id)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.15) 100%)',
                      border: '1px solid rgba(33, 150, 243, 0.4)',
                      borderRadius: 12,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.35) 0%, rgba(21, 101, 192, 0.25) 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.15) 100%)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.15)';
                    }}
                  >
                    <MessageSquare style={{ width: 18, height: 18, color: '#2196F3' }} strokeWidth={2.5} />
                    <span style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#2196F3',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Отправить на модерацию
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Модальное окно модерации */}
      {showModerationModal && (
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
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(21, 101, 192, 0.2) 100%)',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MessageSquare style={{ width: 20, height: 20, color: '#2196F3' }} strokeWidth={2.5} />
                </div>
                <h2 style={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  На модерацию
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowModerationModal(false);
                  setModerationComment('');
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

            <p style={{
              fontSize: 14,
              color: '#B0BEC5',
              fontWeight: 600,
              marginBottom: 14,
              lineHeight: 1.4,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Укажите, какие документы или информацию необходимо предоставить партнёру:
            </p>

            <textarea
              value={moderationComment}
              onChange={(e) => setModerationComment(e.target.value)}
              placeholder="Например: Необходимо предоставить сертификаты качества продукции..."
              style={{
                width: '100%',
                minHeight: 130,
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.25)',
                borderRadius: 14,
                padding: 14,
                fontSize: 14,
                color: '#FFFFFF',
                fontWeight: 500,
                resize: 'vertical',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                outline: 'none',
                marginBottom: 18,
                lineHeight: 1.5,
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(244, 162, 97, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(244, 162, 97, 0.25)';
              }}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowModerationModal(false);
                  setModerationComment('');
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
                onClick={submitModeration}
                disabled={!moderationComment.trim()}
                style={{
                  flex: 1,
                  background: moderationComment.trim() 
                    ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
                    : 'rgba(45, 79, 94, 0.5)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: moderationComment.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: moderationComment.trim() ? 1 : 0.5,
                  boxShadow: moderationComment.trim() ? '0 4px 16px rgba(33, 150, 243, 0.4)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (moderationComment.trim()) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (moderationComment.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.4)';
                  }
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Отправить
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
