'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function PrivacyPolicyPage() {
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
            <Shield style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
            <h1 style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Политика конфиденциальности
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
            Настоящая Политика конфиденциальности описывает, как <strong style={{ color: '#F4A261' }}>ЛавкинКот</strong> собирает, 
            использует и защищает вашу персональную информацию при использовании нашего сервиса доставки продуктов и еды.
          </p>
        </section>

        {/* 1. Какие данные мы собираем */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            1. Какие данные мы собираем
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
              <li><strong style={{ color: '#FFFFFF' }}>Личные данные:</strong> имя, фамилия, номер телефона</li>
              <li><strong style={{ color: '#FFFFFF' }}>Данные Telegram:</strong> username, ID пользователя</li>
              <li><strong style={{ color: '#FFFFFF' }}>Адрес доставки:</strong> улица, дом, квартира, подъезд, этаж</li>
              <li><strong style={{ color: '#FFFFFF' }}>Данные заказов:</strong> история покупок, предпочтения</li>
              <li><strong style={{ color: '#FFFFFF' }}>Платежная информация:</strong> последние 4 цифры карты (полные данные карты мы не храним)</li>
              <li><strong style={{ color: '#FFFFFF' }}>Данные подписки:</strong> активный тариф, остаток доставок</li>
            </ul>
          </div>
        </section>

        {/* 2. Как мы используем данные */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            2. Как мы используем ваши данные
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
              <li>Обработка и доставка ваших заказов</li>
              <li>Связь с вами по вопросам заказа</li>
              <li>Улучшение качества сервиса</li>
              <li>Персонализация предложений</li>
              <li>Обработка платежей и подписок</li>
              <li>Отправка уведомлений о статусе заказа</li>
              <li>Предотвращение мошенничества</li>
            </ul>
          </div>
        </section>

        {/* 3. Передача данных третьим лицам */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            3. Передача данных третьим лицам
          </h2>
          
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#B8C5D0',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Мы передаем ваши данные только в необходимых случаях:
          </p>

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
              <li><strong style={{ color: '#FFFFFF' }}>Партнерам:</strong> информация о заказе для его подготовки</li>
              <li><strong style={{ color: '#FFFFFF' }}>Курьерам:</strong> адрес доставки и контактный номер телефона</li>
              <li><strong style={{ color: '#FFFFFF' }}>Платежным системам:</strong> для обработки платежей (по защищенным каналам)</li>
              <li><strong style={{ color: '#FFFFFF' }}>Telegram:</strong> для работы Mini App в мессенджере</li>
            </ul>
          </div>

          <div style={{
            marginTop: 12,
            padding: '10px 12px',
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 10,
          }}>
            <p style={{
              fontSize: 12,
              color: '#81C784',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              ✓ Мы НЕ продаем ваши данные третьим лицам
            </p>
          </div>
        </section>

        {/* 4. Защита данных */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            4. Как мы защищаем ваши данные
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
              <li>Шифрование данных при передаче (SSL/TLS)</li>
              <li>Безопасное хранение на защищенных серверах</li>
              <li>Ограниченный доступ к данным для сотрудников</li>
              <li>Регулярный аудит безопасности</li>
              <li>Соответствие требованиям законодательства РФ</li>
            </ul>
          </div>
        </section>

        {/* 5. Ваши права */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            5. Ваши права
          </h2>
          
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#B8C5D0',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            В соответствии с ФЗ №152 "О персональных данных" вы имеете право:
          </p>

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
              <li>Запрашивать информацию о хранящихся данных</li>
              <li>Требовать исправления неточных данных</li>
              <li>Требовать удаления данных</li>
              <li>Отозвать согласие на обработку данных</li>
              <li>Ограничить обработку данных</li>
              <li>Получить копию своих данных</li>
            </ul>
          </div>
        </section>

        {/* 6. Cookies и аналитика */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            6. Cookies и аналитика
          </h2>
          
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#B8C5D0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Мы используем cookies и аналитические инструменты для улучшения работы сервиса, 
            анализа использования и персонализации контента. Вы можете отключить cookies в настройках браузера.
          </p>
        </section>

        {/* 7. Хранение данных */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            7. Срок хранения данных
          </h2>
          
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#B8C5D0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Мы храним ваши данные в течение периода использования сервиса и 3 года после последнего заказа. 
            После этого данные удаляются или анонимизируются, за исключением случаев, когда закон требует более длительного хранения.
          </p>
        </section>

        {/* 8. Изменения в политике */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            8. Изменения в политике конфиденциальности
          </h2>
          
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#B8C5D0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Мы оставляем за собой право вносить изменения в эту Политику. 
            О существенных изменениях мы уведомим вас через приложение или по электронной почте. 
            Дата последнего обновления указана в начале документа.
          </p>
        </section>

        {/* 9. Контакты */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            9. Контакты
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
              По вопросам обработки персональных данных обращайтесь:
              <br/><br/>
              <strong style={{ color: '#FFFFFF' }}>Email:</strong> <span style={{ color: '#F4A261' }}>privacy@lavkinkot.ru</span><br/>
              <strong style={{ color: '#FFFFFF' }}>Telegram:</strong> <span style={{ color: '#F4A261' }}>@lavkinkot_support</span><br/>
              <strong style={{ color: '#FFFFFF' }}>Адрес:</strong> г. Самара, Россия
            </p>
          </div>
        </section>

        {/* Согласие */}
        <section>
          <div style={{
            padding: '16px',
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 12,
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 13,
              color: '#81C784',
              fontWeight: 600,
              lineHeight: 1.6,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Используя наш сервис, вы соглашаетесь с условиями данной Политики конфиденциальности
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
