const { AppError } = require('./errorHandler.middleware');

/**
 * Middleware для проверки роли пользователя
 * @param {Array<string>} allowedRoles - Разрешённые роли
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden: insufficient permissions', 403);
    }
    
    next();
  };
}

/**
 * Shortcut middleware для админов
 */
const adminOnly = roleMiddleware(['admin']);

/**
 * Shortcut middleware для партнёров
 */
const partnerOnly = roleMiddleware(['partner', 'admin']);

/**
 * Shortcut middleware для курьеров
 */
const courierOnly = roleMiddleware(['courier', 'admin']);

/**
 * Shortcut middleware для всех авторизованных ролей
 */
const anyRole = roleMiddleware(['customer', 'partner', 'courier', 'admin']);

module.exports = { 
  roleMiddleware,
  adminOnly,
  partnerOnly,
  courierOnly,
  anyRole
};
