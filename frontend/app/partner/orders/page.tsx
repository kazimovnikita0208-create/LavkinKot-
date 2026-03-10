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
  Loader2,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerOrders } from '@/hooks';

const statusInfo: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  created: { label: 'Новый', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.15)', borderColor: 'rgba(33, 150, 243, 0.3)' },
  accepted: { label: 'Принят', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.15)', borderColor: 'rgba(255, 152, 0, 0.3)' },
  preparing: { label: 'Готовится', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.15)', borderColor: 'rgba(156, 39, 176, 0.3)' },
  ready: { label: 'Готов', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)', borderColor: 'rgba(76, 175, 80, 0.3)' },
  courier_assigned: { label: 'Назначен курьер', color: '#00BCD4', bgColor: 'rgba(0, 188, 212, 0.15)', borderColor: 'rgba(0, 188, 212, 0.3)' },
  picked_up: { label: 'Забран', color: '#009688', bgColor: 'rgba(0, 150, 136, 0.15)', borderColor: 'rgba(0, 150, 136, 0.3)' },
  in_transit: { label: 'В пути', color: '#F4A261', bgColor: 'rgba(244, 162, 97, 0.15)', borderColor: 'rgba(244, 162, 97, 0.3)' },
  delivered: { label: 'Доставлен', color: '#607D8B', bgColor: 'rgba(96, 125, 139, 0.15)', borderColor: 'rgba(96, 125, 139, 0.3)' },
  cancelled: { label: 'Отменён', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' },
};

export default function PartnerOrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const { orders, isLoading: ordersLoading, acceptOrder, markOrderReady, refetch } = usePartnerOrders(filterStatus);

  // Проверка роли
  if (!authLoading && user?.role !== 'partner') {
    router.push('/partner');
    return null;
  }

  const isLoading = authLoading || ordersLoading;

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

  const handleAccept = async (orderId: string) => {
    try {
      await acceptOrder(orderId);
    } catch (err) {
      console.error('Accept order error:', err);
    }
  };

  const handleReady = async (orderId: string) => {
    try {
      await markOrderReady(orderId);
    } catch (err) {
      console.error('Mark ready error:', err);
    }
  };

  const getNextAction = (status: string): { action: 'accept' | 'ready'; label: string } | null => {
    switch (status) {
      case 'created':
        return { action: 'accept', label: 'Принять заказ' };
      case 'accepted':
      case 'preparing':
        return { action: 'ready', label: 'Готов к выдаче' };
      default:
        return null;
    }
  };

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
  const filterStatuses = ['created', 'accepted', 'preparing', 'ready'];

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
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
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
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Заказы</h1>

          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Статистика */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Всего заказов</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>{orders.length}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Активных</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#F4A261' }}>{activeOrders}</p>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setFilterStatus(undefined)}
            style={{
              background: filterStatus === undefined
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: filterStatus === undefined ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '8px 14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: filterStatus === undefined ? '#F4A261' : '#94A3B8' }}>
              Все
            </span>
          </button>

          {filterStatuses.map((status) => (
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
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: filterStatus === status ? '#F4A261' : '#94A3B8' }}>
                {statusInfo[status]?.label || status}
              </span>
            </button>
          ))}
        </div>

        {/* Список заказов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.length === 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
              borderRadius: 16,
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(244, 162, 97, 0.2)',
            }}>
              <Package style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
              <p style={{ fontSize: 15, color: '#94A3B8', fontWeight: 600 }}>
                {filterStatus ? 'Нет заказов с выбранным статусом' : 'Нет заказов'}
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const nextAction = getNextAction(order.status);
              const statusData = statusInfo[order.status] || statusInfo.created;
              const customerName = [order.profile?.first_name, order.profile?.last_name].filter(Boolean).join(' ') || 'Клиент';
              
              return (
                <div
                  key={order.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  {/* Заголовок */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF' }}>
                      Заказ #{order.order_number}
                    </h3>
                    <div style={{
                      background: statusData.bgColor,
                      border: `1px solid ${statusData.borderColor}`,
                      borderRadius: 8,
                      padding: '4px 10px',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: statusData.color }}>
                        {statusData.label}
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
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{customerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Phone style={{ width: 16, height: 16, color: '#94A3B8' }} strokeWidth={2.5} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>{order.customer_phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin style={{ width: 16, height: 16, color: '#94A3B8' }} strokeWidth={2.5} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>
                        {order.delivery_street}, д. {order.delivery_house}, кв. {order.delivery_apartment}
                      </span>
                    </div>
                  </div>

                  {/* Товары */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      {order.order_items.map((item, idx) => (
                        <div key={item.id || idx} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          paddingBottom: idx < order.order_items!.length - 1 ? 8 : 0,
                          marginBottom: idx < order.order_items!.length - 1 ? 8 : 0,
                          borderBottom: idx < order.order_items!.length - 1 ? '1px solid rgba(244, 162, 97, 0.1)' : 'none',
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>
                            {item.product_name} × {item.quantity}
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#F4A261' }}>
                            {(item.product_price * item.quantity).toFixed(0)}₽
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

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
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                        {order.delivery_time_slot}
                      </span>
                    </div>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#F4A261' }}>
                      {order.total.toFixed(0)}₽
                    </span>
                  </div>

                  {/* Кнопка действия */}
                  {nextAction && (
                    <button
                      onClick={() => nextAction.action === 'accept' ? handleAccept(order.id) : handleReady(order.id)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(69, 160, 73, 0.2) 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
                        borderRadius: 12,
                        padding: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <CheckCircle style={{ width: 18, height: 18, color: '#4CAF50' }} strokeWidth={2.5} />
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#4CAF50' }}>
                        {nextAction.label}
                      </span>
                    </button>
                  )}

                  {['courier_assigned', 'picked_up', 'in_transit'].includes(order.status) && (
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
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#4CAF50' }}>
                        {order.courier ? `Курьер: ${order.courier.first_name || 'Назначен'}` : 'Ожидает курьера'}
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
