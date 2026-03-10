'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  Store,
  Loader2,
  XCircle
} from 'lucide-react';
import { useOrder } from '@/hooks';

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: orderId } = use(params);
  const { order, isLoading, error } = useOrder(orderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'delivering':
      case 'in_transit':
      case 'ready':
        return '#F4A261';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'pending': 'Ожидает подтверждения',
      'confirmed': 'Подтверждён',
      'preparing': 'Готовится',
      'ready': 'Готов к выдаче',
      'delivering': 'В пути',
      'delivered': 'Доставлен',
      'cancelled': 'Отменён',
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle style={{ width: 28, height: 28, color: getStatusColor(status) }} strokeWidth={2.5} />;
      case 'cancelled':
        return <XCircle style={{ width: 28, height: 28, color: getStatusColor(status) }} strokeWidth={2.5} />;
      case 'delivering':
      case 'in_transit':
        return <Truck style={{ width: 28, height: 28, color: getStatusColor(status) }} strokeWidth={2.5} />;
      default:
        return <Package style={{ width: 28, height: 28, color: getStatusColor(status) }} strokeWidth={2.5} />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Генерация таймлайна из статуса заказа
  const getTimeline = (status: string) => {
    const allSteps = [
      { status: 'pending', text: 'Заказ создан' },
      { status: 'confirmed', text: 'Принят магазином' },
      { status: 'preparing', text: 'Готовится' },
      { status: 'ready', text: 'Готов к выдаче' },
      { status: 'delivering', text: 'В пути к вам' },
      { status: 'delivered', text: 'Доставлен' },
    ];
    
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && status !== 'cancelled',
    }));
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1A2F3A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
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

  if (error || !order) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A' }}>
        <header style={{ padding: '16px' }}>
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
        </header>
        <main style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#EF4444', fontSize: 16 }}>Заказ не найден</p>
        </main>
      </div>
    );
  }

  const timeline = getTimeline(order.status);
  const deliveryAddress = `${order.delivery_street}, д. ${order.delivery_house}${order.delivery_apartment ? `, кв. ${order.delivery_apartment}` : ''}`;

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(244, 162, 97, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
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
            Заказ #{order.order_number}
          </h1>

          <button
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 100px' }}>
        
        {/* Статус заказа */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.15) 0%, rgba(232, 149, 81, 0.1) 100%)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(244, 162, 97, 0.2)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `${getStatusColor(order.status)}20`,
            border: `2px solid ${getStatusColor(order.status)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            {getStatusIcon(order.status)}
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
            {getStatusText(order.status)}
          </h2>

          {order.delivery_date && (
            <p style={{ fontSize: 13, color: '#B8C5D0', fontWeight: 600 }}>
              Доставка: {formatDateTime(order.delivery_date)}
            </p>
          )}
        </div>

        {/* Таймлайн */}
        {order.status !== 'cancelled' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
              Статус заказа
            </h3>

            <div style={{ position: 'relative' }}>
              {timeline.map((step, index) => (
                <div
                  key={step.status}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: index < timeline.length - 1 ? 16 : 0,
                    position: 'relative',
                  }}
                >
                  {/* Линия */}
                  {index < timeline.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: 11,
                      top: 28,
                      width: 2,
                      height: 'calc(100% + 4px)',
                      background: step.completed 
                        ? 'linear-gradient(180deg, #F4A261 0%, rgba(244, 162, 97, 0.3) 100%)'
                        : 'rgba(148, 163, 184, 0.2)',
                    }} />
                  )}

                  {/* Иконка */}
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: step.completed 
                      ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                      : 'rgba(148, 163, 184, 0.2)',
                    border: step.completed ? '2px solid rgba(244, 162, 97, 0.3)' : '2px solid rgba(148, 163, 184, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: step.completed ? '0 0 12px rgba(244, 162, 97, 0.4)' : 'none',
                  }}>
                    {step.completed && (
                      <CheckCircle style={{ width: 14, height: 14, color: '#1A2F3A' }} strokeWidth={3} />
                    )}
                  </div>

                  {/* Текст */}
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <p style={{
                      fontSize: 13,
                      fontWeight: step.completed ? 700 : 600,
                      color: step.completed ? '#FFFFFF' : '#94A3B8',
                    }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Информация о курьере */}
        {order.courier && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
              Курьер
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(244, 162, 97, 0.2)',
                border: '1px solid rgba(244, 162, 97, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                  {order.courier.first_name} {order.courier.last_name}
                </p>
                {order.courier.phone && (
                  <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                    {order.courier.phone}
                  </p>
                )}
              </div>
            </div>

            {order.courier.phone && (
              <a
                href={`tel:${order.courier.phone}`}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(244,162,97,0.3)',
                  fontWeight: 700,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textDecoration: 'none',
                }}
              >
                <Phone style={{ width: 16, height: 16 }} strokeWidth={2.5} />
                Позвонить курьеру
              </a>
            )}
          </div>
        )}

        {/* Адрес доставки */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
            Адрес доставки
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(244, 162, 97, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MapPin style={{ width: 16, height: 16, color: '#F4A261' }} strokeWidth={2} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4, marginBottom: 4 }}>
                {deliveryAddress}
              </p>
              {order.leave_at_door && (
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                  💬 Оставить у двери
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Товары в заказе */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
            Товары ({order.order_items?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 12,
                  background: 'rgba(26, 47, 58, 0.4)',
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.9) 0%, rgba(38, 73, 92, 0.7) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {item.product?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.product.image_url} 
                      alt={item.product?.name || 'Товар'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Package style={{ width: 24, height: 24, color: '#94A3B8' }} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                    {item.product?.name || 'Товар'}
                  </p>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                    {item.quantity} × {Number(item.price).toFixed(2)} ₽
                  </p>
                </div>

                <span style={{ fontSize: 14, fontWeight: 800, color: '#F4A261' }}>
                  {(item.quantity * Number(item.price)).toFixed(2)} ₽
                </span>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
              Итого
            </span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#F4A261' }}>
              {Number(order.total).toFixed(2)} ₽
            </span>
          </div>
        </div>

        {/* Информация о магазине */}
        {order.shop && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
              Магазин
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(244, 162, 97, 0.2)',
                border: '1px solid rgba(244, 162, 97, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {order.shop.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={order.shop.image_url} 
                    alt={order.shop.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Store style={{ width: 22, height: 22, color: '#F4A261' }} strokeWidth={2} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                  {order.shop.name}
                </p>
                {order.shop.address && (
                  <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                    {order.shop.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
