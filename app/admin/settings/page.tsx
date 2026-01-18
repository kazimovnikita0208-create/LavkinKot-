'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Home,
  Bell,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Image as ImageIcon,
  Type,
  Grid,
  Percent,
  Move,
  Save,
  X,
  Store
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

type ContentType = 'promotion' | 'category' | 'top_shop';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  position: number;
  isActive: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'notifications'>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  // Mock данные для главного экрана
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'promotion',
      title: 'Скидка 20% на всё',
      subtitle: 'До конца недели',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
      position: 1,
      isActive: true,
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Бесплатная доставка',
      subtitle: 'При заказе от 1000₽',
      imageUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=400',
      position: 2,
      isActive: true,
    },
    {
      id: '3',
      type: 'category',
      title: 'Фрукты и овощи',
      position: 1,
      isActive: true,
    },
    {
      id: '4',
      type: 'top_shop',
      title: 'Пекарня "Хлебница"',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      position: 1,
      isActive: true,
    },
  ]);

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmed: true,
    orderPreparing: true,
    orderInTransit: true,
    orderDelivered: true,
    promotions: true,
    newShops: false,
    newsletter: false,
  });

  const handleToggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'promotion': return 'Акция';
      case 'category': return 'Категория';
      case 'top_shop': return 'Топ магазин';
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case 'promotion': return '#F4A261';
      case 'category': return '#2196F3';
      case 'top_shop': return '#4CAF50';
    }
  };

  const handleDelete = (id: string) => {
    setContentItems(items => items.filter(item => item.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setContentItems(items => items.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const moveUp = (id: string, type: ContentType) => {
    const itemsOfType = contentItems.filter(item => item.type === type).sort((a, b) => a.position - b.position);
    const currentIndex = itemsOfType.findIndex(item => item.id === id);
    
    if (currentIndex > 0) {
      const newItems = [...contentItems];
      const currentItem = itemsOfType[currentIndex];
      const prevItem = itemsOfType[currentIndex - 1];
      
      const currentIdx = newItems.findIndex(item => item.id === currentItem.id);
      const prevIdx = newItems.findIndex(item => item.id === prevItem.id);
      
      newItems[currentIdx].position = prevItem.position;
      newItems[prevIdx].position = currentItem.position;
      
      setContentItems(newItems);
    }
  };

  const moveDown = (id: string, type: ContentType) => {
    const itemsOfType = contentItems.filter(item => item.type === type).sort((a, b) => a.position - b.position);
    const currentIndex = itemsOfType.findIndex(item => item.id === id);
    
    if (currentIndex < itemsOfType.length - 1) {
      const newItems = [...contentItems];
      const currentItem = itemsOfType[currentIndex];
      const nextItem = itemsOfType[currentIndex + 1];
      
      const currentIdx = newItems.findIndex(item => item.id === currentItem.id);
      const nextIdx = newItems.findIndex(item => item.id === nextItem.id);
      
      newItems[currentIdx].position = nextItem.position;
      newItems[nextIdx].position = currentItem.position;
      
      setContentItems(newItems);
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
            Настройки
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
        
        {/* Табы */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab('home')}
            style={{
              flex: 1,
              background: activeTab === 'home'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: activeTab === 'home' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Home style={{ width: 18, height: 18, color: activeTab === 'home' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: activeTab === 'home' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Главный экран
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              flex: 1,
              background: activeTab === 'notifications'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: activeTab === 'notifications' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Bell style={{ width: 18, height: 18, color: activeTab === 'notifications' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: activeTab === 'notifications' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Уведомления
            </span>
          </button>
        </div>

        {/* Контент вкладки "Главный экран" */}
        {activeTab === 'home' && (
          <>
            {/* Кнопка добавления */}
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
                marginBottom: 20,
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
                Добавить элемент
              </span>
            </button>

            {/* Акции */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: 12,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Акции и промо
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contentItems
                  .filter(item => item.type === 'promotion')
                  .sort((a, b) => a.position - b.position)
                  .map((item, index, array) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(244, 162, 97, 0.2)',
                        borderRadius: 14,
                        padding: 12,
                        opacity: item.isActive ? 1 : 0.5,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                        {item.imageUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 10,
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: '#FFFFFF',
                            marginBottom: 2,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p style={{
                              fontSize: 11,
                              color: '#94A3B8',
                              fontWeight: 600,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                            }}>
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => moveUp(item.id, 'promotion')}
                          disabled={index === 0}
                          style={{
                            flex: 1,
                            background: 'rgba(45, 79, 94, 0.5)',
                            border: '1px solid rgba(244, 162, 97, 0.2)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            opacity: index === 0 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#F4A261', fontWeight: 700 }}>↑</span>
                        </button>

                        <button
                          onClick={() => moveDown(item.id, 'promotion')}
                          disabled={index === array.length - 1}
                          style={{
                            flex: 1,
                            background: 'rgba(45, 79, 94, 0.5)',
                            border: '1px solid rgba(244, 162, 97, 0.2)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: index === array.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: index === array.length - 1 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#F4A261', fontWeight: 700 }}>↓</span>
                        </button>

                        <button
                          onClick={() => handleToggleActive(item.id)}
                          style={{
                            flex: 2,
                            background: item.isActive 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            border: item.isActive 
                              ? '1px solid rgba(76, 175, 80, 0.4)' 
                              : '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{
                            fontSize: 11,
                            color: item.isActive ? '#4CAF50' : '#EF4444',
                            fontWeight: 700,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {item.isActive ? 'Активно' : 'Отключено'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 style={{ width: 14, height: 14, color: '#EF4444' }} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Категории */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: 12,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Категории товаров
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contentItems
                  .filter(item => item.type === 'category')
                  .sort((a, b) => a.position - b.position)
                  .map((item, index, array) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(33, 150, 243, 0.3)',
                        borderRadius: 14,
                        padding: 12,
                        opacity: item.isActive ? 1 : 0.5,
                      }}
                    >
                      <h3 style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        marginBottom: 10,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {item.title}
                      </h3>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => moveUp(item.id, 'category')}
                          disabled={index === 0}
                          style={{
                            flex: 1,
                            background: 'rgba(45, 79, 94, 0.5)',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            opacity: index === 0 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#2196F3', fontWeight: 700 }}>↑</span>
                        </button>

                        <button
                          onClick={() => moveDown(item.id, 'category')}
                          disabled={index === array.length - 1}
                          style={{
                            flex: 1,
                            background: 'rgba(45, 79, 94, 0.5)',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: index === array.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: index === array.length - 1 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#2196F3', fontWeight: 700 }}>↓</span>
                        </button>

                        <button
                          onClick={() => handleToggleActive(item.id)}
                          style={{
                            flex: 2,
                            background: item.isActive 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            border: item.isActive 
                              ? '1px solid rgba(76, 175, 80, 0.4)' 
                              : '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{
                            fontSize: 11,
                            color: item.isActive ? '#4CAF50' : '#EF4444',
                            fontWeight: 700,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {item.isActive ? 'Активно' : 'Отключено'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 style={{ width: 14, height: 14, color: '#EF4444' }} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Топ магазины */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: 12,
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Топ магазины
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contentItems
                  .filter(item => item.type === 'top_shop')
                  .sort((a, b) => a.position - b.position)
                  .map((item, index, array) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        borderRadius: 14,
                        padding: 12,
                        opacity: item.isActive ? 1 : 0.5,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                        {item.imageUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 10,
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: '#FFFFFF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => moveUp(item.id, 'top_shop')}
                          disabled={index === 0}
                          style={{
                            flex: 1,
                            background: 'rgba(45, 79, 94, 0.5)',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            opacity: index === 0 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#4CAF50', fontWeight: 700 }}>↑</span>
                        </button>

                        <button
                          onClick={() => moveDown(item.id, 'top_shop')}
                          disabled={index === array.length - 1}
                          style={{
                            flex: 1,
                            background: 'rgba(45, 79, 94, 0.5)',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: index === array.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: index === array.length - 1 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#4CAF50', fontWeight: 700 }}>↓</span>
                        </button>

                        <button
                          onClick={() => handleToggleActive(item.id)}
                          style={{
                            flex: 2,
                            background: item.isActive 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            border: item.isActive 
                              ? '1px solid rgba(76, 175, 80, 0.4)' 
                              : '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{
                            fontSize: 11,
                            color: item.isActive ? '#4CAF50' : '#EF4444',
                            fontWeight: 700,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {item.isActive ? 'Активно' : 'Отключено'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 style={{ width: 14, height: 14, color: '#EF4444' }} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Контент вкладки "Уведомления" */}
        {activeTab === 'notifications' && (
          <>
            <h2 style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: 16,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Настройка уведомлений
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'orderConfirmed' as const, label: 'Заказ подтверждён', description: 'Уведомление при подтверждении заказа' },
                { key: 'orderPreparing' as const, label: 'Заказ готовится', description: 'Уведомление о начале приготовления' },
                { key: 'orderInTransit' as const, label: 'Заказ в пути', description: 'Уведомление о выходе курьера' },
                { key: 'orderDelivered' as const, label: 'Заказ доставлен', description: 'Уведомление о доставке заказа' },
                { key: 'promotions' as const, label: 'Акции и скидки', description: 'Информация о новых акциях' },
                { key: 'newShops' as const, label: 'Новые магазины', description: 'Уведомления о новых партнёрах' },
                { key: 'newsletter' as const, label: 'Новости сервиса', description: 'Рассылка новостей и обновлений' },
              ].map((setting) => (
                <div
                  key={setting.key}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 14,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: 4,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {setting.label}
                    </h3>
                    <p style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {setting.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleNotification(setting.key)}
                    style={{
                      width: 56,
                      height: 32,
                      borderRadius: 16,
                      background: notificationSettings[setting.key]
                        ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                        : 'rgba(45, 79, 94, 0.7)',
                      border: notificationSettings[setting.key] ? '1px solid rgba(244, 162, 97, 0.3)' : '1px solid rgba(244, 162, 97, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      padding: 0,
                    }}
                  >
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: 3,
                      left: notificationSettings[setting.key] ? 28 : 3,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }} />
                  </button>
                </div>
              ))}
            </div>

            <button
              style={{
                width: '100%',
                marginTop: 20,
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                border: 'none',
                borderRadius: 14,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(244, 162, 97, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.4)';
              }}
            >
              <Save style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
              <span style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Сохранить настройки
              </span>
            </button>
          </>
        )}
      </main>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 343,
            background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Добавить элемент
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(45, 79, 94, 0.5)',
                  border: '1px solid rgba(244, 162, 97, 0.2)',
                  borderRadius: 10,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
              </button>
            </div>

            <p style={{
              fontSize: 13,
              color: '#94A3B8',
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Выберите тип элемента:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => {
                  setSelectedType('promotion');
                  setShowAddModal(false);
                  // Open form for adding promotion
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
                  border: '1px solid rgba(244, 162, 97, 0.4)',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(244, 162, 97, 0.4) 0%, rgba(232, 149, 81, 0.3) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)';
                }}
              >
                <Percent style={{ width: 24, height: 24, color: '#F4A261' }} strokeWidth={2} />
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Акция
                  </h3>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Промо-баннер на главном экране
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedType('category');
                  setShowAddModal(false);
                  // Open form for adding category
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(21, 101, 192, 0.2) 100%)',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.4) 0%, rgba(21, 101, 192, 0.3) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(21, 101, 192, 0.2) 100%)';
                }}
              >
                <Grid style={{ width: 24, height: 24, color: '#2196F3' }} strokeWidth={2} />
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Категория
                  </h3>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Новая категория товаров
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedType('top_shop');
                  setShowAddModal(false);
                  // Open form for adding top shop
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(67, 160, 71, 0.2) 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.4)',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.4) 0%, rgba(67, 160, 71, 0.3) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(67, 160, 71, 0.2) 100%)';
                }}
              >
                <Store style={{ width: 24, height: 24, color: '#4CAF50' }} strokeWidth={2} />
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Топ магазин
                  </h3>
                  <p style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Добавить в топ магазины
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
