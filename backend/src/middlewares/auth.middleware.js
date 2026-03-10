const { verifyToken } = require('../utils/jwt');
const { supabase } = require('../config/supabase');
const { AppError } = require('./errorHandler.middleware');

// Кэш пользователей: userId → { user, expiresAt }
// TTL 30 секунд — компромисс между скоростью и актуальностью роли
const USER_CACHE_TTL_MS = 30_000;
const userCache = new Map();

function getCachedUser(userId) {
  const entry = userCache.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    userCache.delete(userId);
    return null;
  }
  return entry.user;
}

function setCachedUser(userId, user) {
  userCache.set(userId, { user, expiresAt: Date.now() + USER_CACHE_TTL_MS });
  // Не даём кэшу расти бесконечно
  if (userCache.size > 1000) {
    const firstKey = userCache.keys().next().value;
    userCache.delete(firstKey);
  }
}

/**
 * Middleware для проверки JWT токена
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      throw new AppError('Token expired or invalid', 401);
    }

    // Пробуем достать из кэша
    let user = getCachedUser(payload.sub);

    if (!user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', payload.sub)
        .single();
      
      if (error || !data) {
        throw new AppError('User not found', 401);
      }
      user = data;
      setCachedUser(payload.sub, user);
    }
    
    if (!user.is_active) {
      throw new AppError('User is inactive', 403);
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Опциональный auth middleware
 * Не выбрасывает ошибку если токен отсутствует
 */
async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      req.user = null;
      return next();
    }
    
    const { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', payload.sub)
      .single();
    
    req.user = user && user.is_active ? user : null;
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

module.exports = { 
  authMiddleware,
  optionalAuthMiddleware
};
