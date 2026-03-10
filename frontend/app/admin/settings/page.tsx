'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Home,
  Bell,
  CreditCard,
  Plus,
  Trash2,
  Percent,
  Save,
  X,
  RefreshCw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { adminApi, Promotion } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type Tab = 'home' | 'notifications' | 'payment';

interface AppSettings {
  min_order_amount: number;
  delivery_fee: number;
  free_delivery_from: number;
}

function AdminSettingsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Акции
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoLoading, setPromoLoading] = useState(true);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showNewPromoForm, setShowNewPromoForm] = useState(false);
  const [newPromo, setNewPromo] = useState({ title: '', description: '', image_url: '', discount_percent: '' });
  const [saving, setSaving] = useState(false);

  // Уведомления
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmed: true,
    orderPreparing: true,
    orderInTransit: true,
    orderDelivered: true,
    promotions: true,
    newShops: false,
    newsletter: false,
  });

  // Настройки оплаты
  const [appSettings, setAppSettings] = useState<AppSettings>({
    min_order_amount: 300,
    delivery_fee: 150,
    free_delivery_from: 1500,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const loadPromotions = useCallback(async () => {
    setPromoLoading(true);
    setPromoError(null);
    try {
      const res = await adminApi.getAllPromotions({ limit: 50 });
      setPromotions((res.data as Promotion[]) ?? []);
    } catch (e: unknown) {
      setPromoError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setPromoLoading(false);
    }
  }, []);

  const loadAppSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const json = await res.json();
      if (json.success) setAppSettings(json.data);
    } catch {}
  }, []);

  useEffect(() => { loadPromotions(); }, [loadPromotions]);
  useEffect(() => { loadAppSettings(); }, [loadAppSettings]);

  const handleToggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePaymentSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSaved(false);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(appSettings),
      });
      const json = await res.json();
      if (json.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        setSettingsError(json.message || 'Ошибка сохранения');
      }
    } catch {
      setSettingsError('Ошибка соединения с сервером');
    } finally {
      setSettingsLoading(false);
    }
  };

  const tabStyle = (tab: Tab) => ({
    flex: 1,
    background: activeTab === tab
      ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
      : 'rgba(45, 79, 94, 0.5)',
    border: activeTab === tab ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
    borderRadius: 12,
    padding: '10px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  });

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 12px', borderRadius: 10,
    background: 'rgba(26, 47, 58, 0.8)',
    border: '1px solid rgba(244, 162, 97, 0.2)',
    color: '#FFFFFF', fontSize: 15, outline: 'none',
    MozAppearance: 'textfield',
  };

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
            onClick={() => router.push('/admin')}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{
            fontSize: 20, fontWeight: 900, color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Настройки
          </h1>

          <button
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </button>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Табы */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          <button onClick={() => setActiveTab('home')} style={tabStyle('home')}>
            <Home style={{ width: 16, height: 16, color: activeTab === 'home' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: activeTab === 'home' ? '#F4A261' : '#94A3B8' }}>
              Главная
            </span>
          </button>

          <button onClick={() => setActiveTab('payment')} style={tabStyle('payment')}>
            <CreditCard style={{ width: 16, height: 16, color: activeTab === 'payment' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: activeTab === 'payment' ? '#F4A261' : '#94A3B8' }}>
              Оплата
            </span>
          </button>

          <button onClick={() => setActiveTab('notifications')} style={tabStyle('notifications')}>
            <Bell style={{ width: 16, height: 16, color: activeTab === 'notifications' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: activeTab === 'notifications' ? '#F4A261' : '#94A3B8' }}>
              Уведомления
            </span>
          </button>
        </div>

        {/* ─── Вкладка: Главная ─── */}
        {activeTab === 'home' && (
          <>
            <button
              onClick={() => setShowNewPromoForm(!showNewPromoForm)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.4)',
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                transition: 'all 0.2s ease', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 16,
                boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
              }}
            >
              {showNewPromoForm
                ? <X style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                : <Plus style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
              }
              <span style={{ fontSize: 15, fontWeight: 800, color: '#F4A261' }}>
                {showNewPromoForm ? 'Отмена' : 'Добавить акцию'}
              </span>
            </button>

            {showNewPromoForm && (
              <div style={{
                background: 'rgba(45, 79, 94, 0.7)',
                border: '1px solid rgba(244, 162, 97, 0.3)',
                borderRadius: 14, padding: 16, marginBottom: 16,
              }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>Новая акция</p>
                {[
                  { label: 'Заголовок', key: 'title', placeholder: 'Скидка 20% на всё' },
                  { label: 'Описание', key: 'description', placeholder: 'Подробности акции' },
                  { label: 'URL картинки', key: 'image_url', placeholder: 'https://...' },
                  { label: 'Скидка %', key: 'discount_percent', placeholder: '20' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, fontWeight: 600 }}>{label}</p>
                    <input
                      value={newPromo[key as keyof typeof newPromo]}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <button
                  onClick={async () => {
                    if (!newPromo.title.trim()) return;
                    setSaving(true);
                    try {
                      await adminApi.createPromotion({
                        title: newPromo.title,
                        description: newPromo.description || undefined,
                        image_url: newPromo.image_url || undefined,
                        discount_percent: newPromo.discount_percent ? Number(newPromo.discount_percent) : undefined,
                        is_active: true,
                      });
                      setNewPromo({ title: '', description: '', image_url: '', discount_percent: '' });
                      setShowNewPromoForm(false);
                      loadPromotions();
                    } finally { setSaving(false); }
                  }}
                  disabled={saving || !newPromo.title.trim()}
                  style={{
                    width: '100%', padding: '10px 0', borderRadius: 10,
                    background: 'rgba(244, 162, 97, 0.2)',
                    border: '1px solid rgba(244, 162, 97, 0.4)',
                    color: '#F4A261', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  {saving
                    ? <RefreshCw className="animate-spin-custom" style={{ width: 14, height: 14 }} />
                    : <Save style={{ width: 14, height: 14 }} />
                  }
                  Сохранить
                </button>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>Акции и промо</h2>
                <button onClick={loadPromotions} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <RefreshCw
                    style={{ width: 16, height: 16, color: '#94A3B8' }}
                    className={promoLoading ? 'animate-spin-custom' : ''}
                    strokeWidth={2.5}
                  />
                </button>
              </div>

              {promoError && (
                <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{promoError}</p>
              )}

              {promoLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                  <RefreshCw className="animate-spin-custom" style={{ width: 24, height: 24, color: '#F4A261' }} />
                </div>
              )}

              {!promoLoading && promotions.length === 0 && (
                <div style={{
                  background: 'rgba(45, 79, 94, 0.4)', border: '1px dashed rgba(244, 162, 97, 0.2)',
                  borderRadius: 12, padding: 24, textAlign: 'center',
                }}>
                  <Percent style={{ width: 32, height: 32, color: '#94A3B8', margin: '0 auto 8px' }} strokeWidth={1.5} />
                  <p style={{ color: '#94A3B8', fontSize: 13 }}>Акций пока нет. Создайте первую!</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {promotions.map((promo) => (
                  <div key={promo.id} style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 14, padding: 12,
                    opacity: promo.is_active ? 1 : 0.6,
                  }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      {promo.image_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={promo.image_url} alt={promo.title} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>{promo.title}</p>
                        {promo.description && (
                          <p style={{ fontSize: 11, color: '#94A3B8' }}>{promo.description}</p>
                        )}
                        {promo.discount_percent && (
                          <p style={{ fontSize: 11, color: '#F4A261', fontWeight: 700, marginTop: 2 }}>−{promo.discount_percent}%</p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={async () => {
                          await adminApi.updatePromotion(promo.id, { is_active: !promo.is_active });
                          loadPromotions();
                        }}
                        style={{
                          flex: 2, padding: '7px 0', borderRadius: 8,
                          background: promo.is_active ? 'rgba(76, 175, 80, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                          border: `1px solid ${promo.is_active ? 'rgba(76, 175, 80, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
                          color: promo.is_active ? '#4CAF50' : '#94A3B8',
                          fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {promo.is_active ? 'Активна' : 'Отключена'}
                      </button>
                      <button
                        onClick={async () => {
                          await adminApi.deletePromotion(promo.id);
                          loadPromotions();
                        }}
                        style={{
                          padding: '7px 12px', borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 style={{ width: 13, height: 13, color: '#EF4444' }} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Вкладка: Оплата ─── */}
        {activeTab === 'payment' && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
              Настройки оплаты и доставки
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Минимальная сумма заказа */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                borderRadius: 14, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(244, 162, 97, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShoppingBag style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Минимальная сумма заказа</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>Применяется ко всем магазинам</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    value={appSettings.min_order_amount}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, min_order_amount: Number(e.target.value) }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>₽</span>
                </div>
              </div>

              {/* Стоимость доставки */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                borderRadius: 14, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(33, 150, 243, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Truck style={{ width: 18, height: 18, color: '#2196F3' }} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Стоимость доставки</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>Фиксированная цена за доставку</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    value={appSettings.delivery_fee}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, delivery_fee: Number(e.target.value) }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>₽</span>
                </div>
              </div>

              {/* Бесплатная доставка от */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                borderRadius: 14, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(76, 175, 80, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Percent style={{ width: 18, height: 18, color: '#4CAF50' }} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>Бесплатная доставка от</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>При заказе на эту сумму доставка бесплатно</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    value={appSettings.free_delivery_from}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, free_delivery_from: Number(e.target.value) }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>₽</span>
                </div>
              </div>
            </div>

            {settingsError && (
              <p style={{ fontSize: 12, color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{settingsError}</p>
            )}

            {settingsSaved && (
              <p style={{ fontSize: 12, color: '#4CAF50', marginTop: 12, textAlign: 'center', fontWeight: 700 }}>
                ✓ Настройки сохранены
              </p>
            )}

            <button
              onClick={handleSavePaymentSettings}
              disabled={settingsLoading}
              style={{
                width: '100%', marginTop: 20,
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                border: 'none', borderRadius: 14, padding: '16px',
                cursor: settingsLoading ? 'not-allowed' : 'pointer',
                opacity: settingsLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(244, 162, 97, 0.4)',
              }}
            >
              {settingsLoading
                ? <RefreshCw className="animate-spin-custom" style={{ width: 20, height: 20, color: '#FFFFFF' }} />
                : <Save style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
              }
              <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                {settingsLoading ? 'Сохранение...' : 'Сохранить настройки'}
              </span>
            </button>
          </>
        )}

        {/* ─── Вкладка: Уведомления ─── */}
        {activeTab === 'notifications' && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
              Настройка уведомлений
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'orderConfirmed' as const, label: 'Заказ подтверждён', description: 'При подтверждении заказа' },
                { key: 'orderPreparing' as const, label: 'Заказ готовится', description: 'При начале приготовления' },
                { key: 'orderInTransit' as const, label: 'Заказ в пути', description: 'При выходе курьера' },
                { key: 'orderDelivered' as const, label: 'Заказ доставлен', description: 'При доставке заказа' },
                { key: 'promotions' as const, label: 'Акции и скидки', description: 'Информация о новых акциях' },
                { key: 'newShops' as const, label: 'Новые магазины', description: 'Уведомления о новых партнёрах' },
                { key: 'newsletter' as const, label: 'Новости сервиса', description: 'Рассылка новостей и обновлений' },
              ].map((setting) => (
                <div
                  key={setting.key}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 14, padding: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                      {setting.label}
                    </h3>
                    <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                      {setting.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleNotification(setting.key)}
                    style={{
                      width: 56, height: 32, borderRadius: 16,
                      background: notificationSettings[setting.key]
                        ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                        : 'rgba(45, 79, 94, 0.7)',
                      border: notificationSettings[setting.key]
                        ? '1px solid rgba(244, 162, 97, 0.3)'
                        : '1px solid rgba(244, 162, 97, 0.2)',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                      position: 'relative', padding: 0,
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: '#FFFFFF',
                      position: 'absolute', top: 3,
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
                width: '100%', marginTop: 20,
                background: 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)',
                border: 'none', borderRadius: 14, padding: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(244, 162, 97, 0.4)',
              }}
            >
              <Save style={{ width: 20, height: 20, color: '#FFFFFF' }} strokeWidth={2.5} />
              <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                Сохранить настройки
              </span>
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
      <AdminGuard>
        <AdminSettingsContent />
      </AdminGuard>
    </>
  );
}
