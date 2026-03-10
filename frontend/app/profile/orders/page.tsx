'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useOrders } from '@/hooks';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { orders, isLoading, error } = useOrders();

  // Фильтруем завершенные и отменённые заказы
  const completedOrders = orders.filter(
    order => ['delivered', 'cancelled'].includes(order.status)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      case 'cancelled':
        return <XCircle style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
      default:
        return <Package style={{ width: 16, height: 16 }} strokeWidth={2.5} />;
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'delivered': 'Доставлен',
      'cancelled': 'Отменён',
    };
    return texts[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
            История заказов
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
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 style={{ width: 40, height: 40, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 14,
            padding: 40,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 14, color: '#EF4444' }}>Ошибка загрузки заказов</p>
          </div>
        ) : completedOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completedOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/order/${order.id}`)}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
                  borderRadius: 14,
                  padding: 14,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                      {order.shop?.name || 'Заказ'}
                    </h4>
                    <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                      Заказ #{order.order_number}
                    </p>
                  </div>
                  <ChevronRight style={{ width: 18, height: 18, color: '#94A3B8' }} strokeWidth={2} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 12, height: 12, color: '#94A3B8' }} strokeWidth={2} />
                    <span style={{ fontSize: 11, color: '#B8C5D0', fontWeight: 600 }}>
                      {formatDate(order.created_at)}, {formatTime(order.created_at)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Package style={{ width: 12, height: 12, color: '#94A3B8' }} strokeWidth={2} />
                    <span style={{ fontSize: 11, color: '#B8C5D0', fontWeight: 600 }}>
                      {order.order_items?.length || 0} товаров
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 6,
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    border: `1px solid ${getStatusColor(order.status)}40`,
                  }}>
                    <div style={{ color: getStatusColor(order.status) }}>
                      {getStatusIcon(order.status)}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: getStatusColor(order.status) }}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <span style={{ fontSize: 16, fontWeight: 900, color: '#F4A261' }}>
                    {Number(order.total).toFixed(2)} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            borderRadius: 14,
            padding: 40,
            textAlign: 'center',
          }}>
            <Package style={{ width: 56, height: 56, color: '#94A3B8', margin: '0 auto 16px' }} strokeWidth={1.5} />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
              История пуста
            </h3>
            <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, lineHeight: 1.4 }}>
              Здесь будут отображаться ваши завершенные заказы
            </p>
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
