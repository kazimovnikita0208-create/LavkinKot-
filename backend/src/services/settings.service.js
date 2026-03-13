const { supabase } = require('../config/supabase');

const DEFAULT_SETTINGS = {
  min_order_amount: 300,
  delivery_fee: 150,
  free_delivery_from: 1500,
};

// In-memory cache to avoid DB hit on every request
let _cache = null;
let _cacheAt = 0;
const CACHE_TTL = 60 * 1000; // 1 минута

async function getSettings() {
  if (_cache && Date.now() - _cacheAt < CACHE_TTL) {
    return _cache;
  }

  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value');

  if (error || !data) {
    return { ...DEFAULT_SETTINGS };
  }

  const settings = { ...DEFAULT_SETTINGS };
  for (const row of data) {
    if (row.key in settings) {
      settings[row.key] = Number(row.value) || settings[row.key];
    }
  }

  _cache = settings;
  _cacheAt = Date.now();
  return settings;
}

async function updateSettings(updates) {
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value: String(value),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('app_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) throw error;

  // Сбрасываем кэш
  _cache = null;

  return getSettings();
}

module.exports = { getSettings, updateSettings };
