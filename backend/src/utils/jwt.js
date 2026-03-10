const jwt = require('jsonwebtoken');
const config = require('../config/env');

const JWT_SECRET = config.jwtSecret;
const ACCESS_TOKEN_EXPIRY = config.jwtExpiresIn;

/**
 * Генерация JWT токена
 * @param {Object} payload - Данные для токена
 * @returns {string} - JWT токен
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

/**
 * Верификация JWT токена
 * @param {string} token - JWT токен
 * @returns {Object|null} - Payload или null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Декодирование JWT токена без проверки подписи
 * @param {string} token - JWT токен
 * @returns {Object|null} - Payload или null
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
