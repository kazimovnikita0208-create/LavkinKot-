'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A',
      position: 'relative',
      paddingBottom: 32,
    }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.back()}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            <h1 style={{
              fontSize: 17,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Пользовательское соглашение
            </h1>
          </div>

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
                height: 40,
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ position: 'relative', zIndex: 10, padding: '20px 16px' }}>
        
        {/* Дата обновления */}
        <div style={{
          textAlign: 'center',
          marginBottom: 24,
          padding: '12px 16px',
          background: 'rgba(244, 162, 97, 0.1)',
          border: '1px solid rgba(244, 162, 97, 0.2)',
          borderRadius: 12,
        }}>
          <p style={{
            fontSize: 13,
            color: '#F4A261',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Дата последнего обновления: 18 января 2026 г.
          </p>
        </div>

        {/* Введение */}
        <section style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: '#B8C5D0',
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Настоящее Пользовательское соглашение регулирует отношения между <strong style={{ color: '#F4A261' }}>ЛавкинКот</strong> и пользователями сервиса доставки продуктов и еды.
          </p>
        </section>

        {/* 1. Общие положения */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            1. Общие положения
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <ul style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: '#B8C5D0',
              paddingLeft: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              <li>Сервис предоставляет услуги по организации доставки продуктов и еды</li>
              <li>Использование сервиса означает полное согласие с условиями</li>
              <li>Пользователем может стать лицо старше 18 лет</li>
              <li>Регистрация осуществляется через Telegram</li>
            </ul>
          </div>
        </section>

        {/* 2. Оформление заказа */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            2. Оформление и выполнение заказа
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <ul style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: '#B8C5D0',
              paddingLeft: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              <li>Заказ считается принятым после подтверждения партнером</li>
              <li>Срок доставки зависит от загруженности и может варьироваться</li>
              <li>Мы не несем ответственность за качество товаров партнеров</li>
              <li>При получении проверяйте комплектность и качество заказа</li>
              <li>Замена товара возможна только до оплаты заказа</li>
            </ul>
          </div>
        </section>

        {/* 3. Оплата */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            3. Оплата и возврат
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <ul style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: '#B8C5D0',
              paddingLeft: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              <li>Оплата производится банковской картой или через СБП</li>
              <li>Цены указаны в рублях с учетом НДС</li>
              <li>Стоимость доставки указывается при оформлении заказа</li>
              <li>Возврат средств возможен в течение 7 дней</li>
              <li>Подписка оплачивается заранее и не подлежит возврату</li>
            </ul>
          </div>
        </section>

        {/* 4. Подписка */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            4. Условия подписки
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <ul style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: '#B8C5D0',
              paddingLeft: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              <li>Подписка дает право на определенное количество бесплатных доставок</li>
              <li>Срок действия подписки указан в тарифе</li>
              <li>Неиспользованные доставки не переносятся на следующий период</li>
              <li>Отмена подписки не дает права на возврат средств</li>
              <li>Подписка продлевается автоматически (если включено)</li>
            </ul>
          </div>
        </section>

        {/* 5. Ответственность */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            5. Ответственность сторон
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.5) 0%, rgba(38, 73, 92, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(244, 162, 97, 0.1)',
          }}>
            <ul style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: '#B8C5D0',
              paddingLeft: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              <li>Сервис не несет ответственность за задержки по вине партнеров</li>
              <li>Пользователь обязан предоставить точный адрес доставки</li>
              <li>При отсутствии по адресу заказ может быть отменен</li>
              <li>Ответственность за качество товаров несет партнер</li>
              <li>Претензии по качеству принимаются в день доставки</li>
            </ul>
          </div>
        </section>

        {/* 6. Изменения и расторжение */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            6. Изменения условий
          </h2>
          
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#B8C5D0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Мы оставляем за собой право изменять условия соглашения. О существенных изменениях пользователи будут уведомлены заранее.
          </p>
        </section>

        {/* Контакты */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            7. Контактная информация
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(232, 149, 81, 0.15) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(244, 162, 97, 0.3)',
          }}>
            <p style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: '#B8C5D0',
              marginBottom: 0,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              <strong style={{ color: '#FFFFFF' }}>Email:</strong> <span style={{ color: '#F4A261' }}>support@lavkinkot.ru</span><br/>
              <strong style={{ color: '#FFFFFF' }}>Telegram:</strong> <span style={{ color: '#F4A261' }}>@lavkinkot_support</span><br/>
              <strong style={{ color: '#FFFFFF' }}>Адрес:</strong> г. Самара, Россия
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
