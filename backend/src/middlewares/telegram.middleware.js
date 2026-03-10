const { validateTelegramInitData, extractUserFromInitData } = require('../utils/telegram');
const config = require('../config/env');
const { AppError } = require('./errorHandler.middleware');

/**
 * Middleware для валидации Telegram initData
 * Используется при авторизации
 */
function telegramMiddleware(req, res, next) {
  try {
    const { initData } = req.body;
    
    if (!initData) {
      throw new AppError('initData is required', 400);
    }
    
    // В development режиме можно пропустить валидацию
    if (config.nodeEnv === 'development' && process.env.SKIP_TELEGRAM_VALIDATION === 'true') {
      const user = extractUserFromInitData(initData);
      if (!user) {
        throw new AppError('Invalid initData format', 400);
      }
      req.telegramUser = user;
      return next();
    }
    
    // Валидация initData
    const user = validateTelegramInitData(initData, config.botToken);
    
    if (!user) {
      throw new AppError('Invalid Telegram data', 401);
    }
    
    // Добавляем пользователя Telegram в request
    req.telegramUser = user;
    
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { telegramMiddleware };
