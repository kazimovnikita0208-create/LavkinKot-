'use client';

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
  Check,
  Loader2
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { useCourierShift, useCourierOrders, useCourierStats } from '@/hooks';

type OrderStatus = 'created' | 'accepted' | 'preparing' | 'ready' | 'courier_assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

const statusInfo: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  created: { label: 'Создан', color: '#94A3B8', bgColor: 'rgba(148, 163, 184, 0.2)', borderColor: 'rgba(148, 163, 184, 0.4)' },
  accepted: { label: 'Принят', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', borderColor: 'rgba(33, 150, 243, 0.4)' },
  preparing: { label: 'Готовится', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', borderColor: 'rgba(255, 152, 0, 0.4)' },
  ready: { label: 'Готов', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', borderColor: 'rgba(156, 39, 176, 0.4)' },
  courier_assigned: { label: 'Назначен', color: '#F4A261', bgColor: 'rgba(244, 162, 97, 0.2)', borderColor: 'rgba(244, 162, 97, 0.4)' },
  picked_up: { label: 'Забран', color: '#00BCD4', bgColor: 'rgba(0, 188, 212, 0.2)', borderColor: 'rgba(0, 188, 212, 0.4)' },
  in_transit: { label: 'В пути', color: '#F4A261', bgColor: 'rgba(244, 162, 97, 0.2)', borderColor: 'rgba(244, 162, 97, 0.4)' },
  delivered: { label: 'Доставлен', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', borderColor: 'rgba(76, 175, 80, 0.4)' },
  cancelled: { label: 'Отменён', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.4)' },
};

export default function CourierPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { isOnShift, isLoading: shiftLoading, startShift, endShift } = useCourierShift();
  const { orders, isLoading: ordersLoading, assignOrder, pickupOrder, deliverOrder, refetch: refetchOrders } = useCourierOrders();
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useCourierStats();

  // Проверка роли
  if (!authLoading && user?.role !== 'courier') {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <AnimatedBackground />
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}>
          <h2 style={{ color: '#EF4444', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            Доступ запрещён
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>
            Эта страница доступна только курьерам
          </p>
          <button
            onClick={() => router.push('/profile')}
            style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Вернуться в профиль
          </button>
        </div>
      </div>
    );
  }

  const handleShiftToggle = async () => {
    try {
      if (isOnShift) {
        await endShift();
      } else {
        await startShift();
      }
      refetchStats();
      refetchOrders();
    } catch (err) {
      console.error('Shift toggle error:', err);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'assign' | 'pickup' | 'deliver') => {
    try {
      if (action === 'assign') {
        await assignOrder(orderId);
      } else if (action === 'pickup') {
        await pickupOrder(orderId);
      } else if (action === 'deliver') {
        await deliverOrder(orderId);
      }
      refetchStats();
    } catch (err) {
      console.error('Order action error:', err);
    }
  };

  const getNextAction = (status: string): { action: 'assign' | 'pickup' | 'deliver'; label: string } | null => {
    switch (status) {
      case 'ready':
        return { action: 'assign', label: 'Взять заказ' };
      case 'courier_assigned':
        return { action: 'pickup', label: 'Забрал' };
      case 'picked_up':
      case 'in_transit':
        return { action: 'deliver', label: 'Доставлен' };
      default:
        return null;
    }
  };

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const availableOrders = orders.filter(o => o.status === 'ready');
  const myOrders = orders.filter(o => ['courier_assigned', 'picked_up', 'in_transit'].includes(o.status));

  const isLoading = authLoading || shiftLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBackground />
        <Loader2 style={{ width: 48, height: 48, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
      paddingBottom: 16,
    }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
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
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
            Курьер
          </h1>

          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        
        {/* Переключатель смены */}
        <div style={{
          background: isOnShift 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(69, 160, 73, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)',
          border: isOnShift ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: isOnShift 
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(69, 160, 73, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
              border: isOnShift ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Truck style={{ width: 24, height: 24, color: isOnShift ? '#4CAF50' : '#EF4444' }} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#FFFFFF', marginBottom: 2 }}>
                {isOnShift ? 'На смене' : 'Не на смене'}
              </h3>
              <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                {isOnShift ? 'Принимаете заказы' : 'Заказы не принимаются'}
              </p>
            </div>
          </div>

          <button
            onClick={handleShiftToggle}
            style={{
              width: 60,
              height: 34,
              borderRadius: 17,
              background: isOnShift 
                ? 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
                : 'rgba(45, 79, 94, 0.8)',
              border: isOnShift ? '2px solid rgba(76, 175, 80, 0.5)' : '2px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              position: 'relative',
              padding: 0,
            }}
          >
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#FFFFFF',
              position: 'absolute',
              top: 2,
              left: isOnShift ? 30 : 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {isOnShift && <Check style={{ width: 14, height: 14, color: '#4CAF50' }} strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          {/* Доставок сегодня */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.25) 0%, rgba(232, 149, 81, 0.15) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(244, 162, 97, 0.25)', border: '1px solid rgba(244, 162, 97, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Package style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 2 }}>
              {stats?.todayDeliveries || 0}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Доставок сегодня</p>
          </div>

          {/* Заработано */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(69, 160, 73, 0.15) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(76, 175, 80, 0.25)', border: '1px solid rgba(76, 175, 80, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <DollarSign style={{ width: 20, height: 20, color: '#4CAF50' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 2 }}>
              {stats?.todayEarnings || 0}₽
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Заработано сегодня</p>
          </div>

          {/* Всего доставок */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(244, 162, 97, 0.15)', border: '1px solid rgba(244, 162, 97, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Truck style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 2 }}>
              {stats?.totalDeliveries || 0}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Всего доставок</p>
          </div>

          {/* Рейтинг */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 160, 0, 0.15) 100%)',
            border: '1px solid rgba(255, 193, 7, 0.4)',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255, 193, 7, 0.25)', border: '1px solid rgba(255, 193, 7, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Star style={{ width: 20, height: 20, color: '#FFC107', fill: '#FFC107' }} strokeWidth={0} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 2 }}>
              {stats?.rating?.toFixed(1) || '0.0'}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Рейтинг</p>
          </div>
        </div>

        {/* Мои заказы */}
        {isOnShift && myOrders.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>Мои заказы</h2>
              <div style={{
                background: 'rgba(244, 162, 97, 0.2)',
                border: '1px solid rgba(244, 162, 97, 0.4)',
                borderRadius: 10,
                padding: '6px 12px',
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#F4A261' }}>{myOrders.length}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {myOrders.map((order) => {
                const nextAction = getNextAction(order.status);
                const statusData = statusInfo[order.status] || statusInfo.created;
                
                return (
                  <div
                    key={order.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                      border: '1px solid rgba(244, 162, 97, 0.25)',
                      borderRadius: 18,
                      padding: 18,
                    }}
                  >
                    {/* Заголовок */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
                          Заказ #{order.order_number}
                        </h3>
                        <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>{order.shop?.name}</p>
                      </div>
                      <div style={{
                        background: statusData.bgColor,
                        border: `1px solid ${statusData.borderColor}`,
                        borderRadius: 10,
                        padding: '8px 14px',
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: statusData.color }}>{statusData.label}</span>
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
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(244, 162, 97, 0.2)', border: '1px solid rgba(244, 162, 97, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MapPin style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 3, lineHeight: 1.4 }}>
                            {order.delivery_street}, д. {order.delivery_house}, кв. {order.delivery_apartment}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(76, 175, 80, 0.2)', border: '1px solid rgba(76, 175, 80, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Phone style={{ width: 16, height: 16, color: '#4CAF50' }} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                            {order.customer_name || 'Клиент'}
                          </p>
                          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{order.customer_phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Детали */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(244, 162, 97, 0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div>
                          <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Товаров</p>
                          <p style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF' }}>{order.items_count}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Время</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{order.delivery_time_slot}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Сумма</p>
                        <p style={{ fontSize: 20, fontWeight: 900, color: '#4CAF50' }}>{order.total.toFixed(2)} ₽</p>
                      </div>
                    </div>

                    {/* Кнопки */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      {['picked_up', 'in_transit'].includes(order.status) && (
                        <button
                          onClick={() => window.open(`https://yandex.ru/maps/?text=${encodeURIComponent(order.delivery_street + ' ' + order.delivery_house)}`, '_blank')}
                          style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(21, 101, 192, 0.2) 100%)',
                            border: '1px solid rgba(33, 150, 243, 0.4)',
                            borderRadius: 12,
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                          }}
                        >
                          <Navigation style={{ width: 16, height: 16, color: '#2196F3' }} strokeWidth={2.5} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#2196F3' }}>Навигация</span>
                        </button>
                      )}

                      {nextAction && (
                        <button
                          onClick={() => handleOrderAction(order.id, nextAction.action)}
                          style={{
                            flex: 1,
                            background: nextAction.action === 'deliver'
                              ? 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
                              : 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                          }}
                        >
                          <CheckCircle style={{ width: 16, height: 16, color: '#FFFFFF' }} strokeWidth={2.5} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>{nextAction.label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Доступные заказы */}
        {isOnShift && availableOrders.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>Доступные заказы</h2>
              <div style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid rgba(76, 175, 80, 0.4)',
                borderRadius: 10,
                padding: '6px 12px',
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#4CAF50' }}>{availableOrders.length}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {availableOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(69, 160, 73, 0.1) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
                        #{order.order_number} • {order.shop?.name}
                      </h3>
                      <p style={{ fontSize: 12, color: '#94A3B8' }}>
                        {order.delivery_street}, д. {order.delivery_house}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#4CAF50' }}>{order.total.toFixed(0)} ₽</p>
                  </div>
                  
                  <button
                    onClick={() => handleOrderAction(order.id, 'assign')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#FFFFFF',
                    }}
                  >
                    Взять заказ
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Нет заказов */}
        {isOnShift && activeOrders.length === 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 18,
            padding: 40,
            textAlign: 'center',
          }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(244, 162, 97, 0.15)', border: '1px solid rgba(244, 162, 97, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Package style={{ width: 40, height: 40, color: '#F4A261' }} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginBottom: 8 }}>Нет активных заказов</h3>
            <p style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>Ожидайте новых заказов</p>
          </div>
        )}

        {/* Не на смене */}
        {!isOnShift && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 18,
            padding: 40,
            textAlign: 'center',
          }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Truck style={{ width: 40, height: 40, color: '#EF4444' }} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginBottom: 8 }}>Вы не на смене</h3>
            <p style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>Включите статус смены, чтобы принимать заказы</p>
          </div>
        )}
      </main>
    </div>
  );
}
