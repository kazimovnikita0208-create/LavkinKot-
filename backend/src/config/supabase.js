const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

/**
 * Supabase client с service_role ключом для backend операций
 * Обходит RLS политики
 */
const supabase = createClient(
  config.supabaseUrl || 'http://localhost:8000',
  config.supabaseServiceRoleKey || config.supabaseAnonKey || 'dummy-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Supabase client с anon ключом для публичных запросов
 */
const supabasePublic = createClient(
  config.supabaseUrl || 'http://localhost:8000',
  config.supabaseAnonKey || 'dummy-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = {
  supabase,
  supabasePublic
};
