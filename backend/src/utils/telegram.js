const crypto = require('crypto');

/**
 * Валидация Telegram initData
 * @param {string} initData - Строка initData из Telegram WebApp
 * @param {string} botToken - Токен Telegram бота
 * @returns {Object|null} - Данные пользователя или null
 */
function validateTelegramInitData(initData, botToken) {
  try {
    if (!initData || !botToken) {
      return null;
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      console.log('No hash in initData');
      return null;
    }
    
    urlParams.delete('hash');
    
    // Сортируем параметры
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Создаём secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    // Проверяем подпись
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    if (calculatedHash !== hash) {
      console.log('Invalid hash');
      return null;
    }
    
    // Проверяем auth_date (не старше 24 часов)
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime - authDate > 86400) {
      console.log('initData expired');
      return null;
    }
    
    // Парсим данные пользователя
    const userDataString = urlParams.get('user');
    if (!userDataString) {
      console.log('No user data in initData');
      return null;
    }
    
    const user = JSON.parse(userDataString);
    return user;
    
  } catch (error) {
    console.error('Telegram initData validation error:', error);
    return null;
  }
}

/**
 * Извлечение данных пользователя из initData без валидации
 * (для тестирования/разработки)
 * @param {string} initData - Строка initData
 * @returns {Object|null} - Данные пользователя или null
 */
function extractUserFromInitData(initData) {
  try {
    const urlParams = new URLSearchParams(initData);
    const userDataString = urlParams.get('user');
    
    if (!userDataString) {
      return null;
    }
    
    return JSON.parse(userDataString);
  } catch (error) {
    console.error('Error extracting user from initData:', error);
    return null;
  }
}

module.exports = {
  validateTelegramInitData,
  extractUserFromInitData
};
