'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminGuard } from '@/components/AdminGuard';
import { useAdminUsers } from '@/hooks/useAdmin';
import { AdminUser } from '@/lib/api';

const ROLE_LABELS: Record<string, { text: string; color: string; bg: string }> = {
  customer: { text: 'Клиент',   color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  courier:  { text: 'Курьер',   color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  partner:  { text: 'Партнёр',  color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  admin:    { text: 'Админ',    color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
};

const ROLE_FILTERS = [
  { key: 'all',      label: 'Все' },
  { key: 'customer', label: 'Клиенты' },
  { key: 'courier',  label: 'Курьеры' },
  { key: 'partner',  label: 'Партнёры' },
  { key: 'admin',    label: 'Админы' },
];

const ASSIGNABLE_ROLES = ['customer', 'courier', 'partner', 'admin'] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function UserCard({
  user,
  onRoleChange,
}: {
  user: AdminUser;
  onRoleChange: (id: string, role: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [changing, setChanging] = useState(false);
  const roleInfo = ROLE_LABELS[user.role] ?? { text: user.role, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' };
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || `@${user.username}` || `TG ${user.telegram_id}`;

  const handleRoleChange = async (newRole: string) => {
    if (newRole === user.role) { setExpanded(false); return; }
    setChanging(true);
    try {
      await onRoleChange(user.id, newRole);
    } finally {
      setChanging(false);
      setExpanded(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.7) 0%, rgba(38, 73, 92, 0.6) 100%)',
      border: '1px solid rgba(244, 162, 97, 0.2)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: roleInfo.bg,
              border: `1px solid ${roleInfo.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Shield style={{ width: 18, height: 18, color: roleInfo.color }} strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>{fullName}</p>
              {user.username && (
                <p style={{ fontSize: 11, color: '#94A3B8' }}>@{user.username}</p>
              )}
            </div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: roleInfo.color,
            background: roleInfo.bg,
            padding: '3px 10px', borderRadius: 8,
            border: `1px solid ${roleInfo.color}44`,
          }}>
            {roleInfo.text}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {user.phone && (
              <span style={{ fontSize: 11, color: '#94A3B8' }}>{user.phone}</span>
            )}
            <span style={{ fontSize: 11, color: '#94A3B8' }}>с {formatDate(user.created_at)}</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            disabled={changing}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 8,
              background: 'rgba(244, 162, 97, 0.1)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              color: '#F4A261', fontSize: 11, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {changing ? <RefreshCw className="animate-spin-custom" style={{ width: 12, height: 12 }} /> : null}
            Роль
            <ChevronDown style={{ width: 12, height: 12, transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
        </div>
      </div>

      {/* Выбор роли */}
      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(244, 162, 97, 0.15)',
          padding: '10px 16px',
          display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          {ASSIGNABLE_ROLES.map((r) => {
            const info = ROLE_LABELS[r];
            return (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                style={{
                  flex: 1, minWidth: 70,
                  padding: '6px 8px',
                  borderRadius: 10,
                  background: user.role === r ? info.bg : 'transparent',
                  border: `1px solid ${user.role === r ? info.color : 'rgba(244, 162, 97, 0.2)'}`,
                  color: user.role === r ? info.color : '#94A3B8',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {info.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminUsersContent() {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const { users, isLoading, error, totalPages, total, updateRole } = useAdminUsers(roleFilter, search, page);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ backgroundColor: '#1A2F3A', position: 'relative', paddingBottom: 24 }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{
        padding: '14px 16px',
        position: 'sticky', top: 0, zIndex: 20,
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>Пользователи</h1>
            {!isLoading && <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>{total} всего</p>}
          </div>

          <div style={{ width: 40 }} />
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>

        {/* Поиск */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(45, 79, 94, 0.5)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            borderRadius: 14, padding: '10px 14px',
          }}>
            <Search style={{ width: 16, height: 16, color: '#94A3B8', flexShrink: 0 }} strokeWidth={2.5} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Имя, username…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: 14 }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: '0 16px', borderRadius: 14,
              background: 'rgba(244, 162, 97, 0.2)',
              border: '1px solid rgba(244, 162, 97, 0.3)',
              color: '#F4A261', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Найти
          </button>
        </div>

        {/* Фильтры ролей */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setRoleFilter(f.key); setPage(1); }}
              style={{
                flexShrink: 0,
                padding: '6px 14px', borderRadius: 10,
                border: `1px solid ${roleFilter === f.key ? '#F4A261' : 'rgba(244, 162, 97, 0.2)'}`,
                background: roleFilter === f.key ? 'rgba(244, 162, 97, 0.2)' : 'transparent',
                color: roleFilter === f.key ? '#F4A261' : '#94A3B8',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Ошибка */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF4444',
          }}>
            {error}
          </div>
        )}

        {/* Лоадер */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <RefreshCw className="animate-spin-custom" style={{ width: 28, height: 28, color: '#F4A261' }} />
          </div>
        )}

        {/* Пустое состояние */}
        {!isLoading && users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <Users style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
            <p style={{ color: '#94A3B8', fontSize: 15, fontWeight: 600 }}>Пользователей не найдено</p>
          </div>
        )}

        {/* Список */}
        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {users.map((user) => (
              <UserCard key={user.id} user={user} onRoleChange={updateRole} />
            ))}
          </div>
        )}

        {/* Пагинация */}
        {totalPages > 1 && !isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(45, 79, 94, 0.5)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft style={{ width: 18, height: 18, color: '#F4A261' }} />
            </button>
            <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(45, 79, 94, 0.5)',
                border: '1px solid rgba(244, 162, 97, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              <ChevronRight style={{ width: 18, height: 18, color: '#F4A261' }} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminUsersContent />
    </AdminGuard>
  );
}
