const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validator.middleware');
const { telegramAuthSchema } = require('../utils/validators');

const router = Router();

/**
 * POST /api/auth/telegram
 * Авторизация через Telegram initData
 */
router.post('/telegram', 
  validateBody(telegramAuthSchema),
  authController.loginWithTelegram
);

/**
 * GET /api/auth/me
 * Получение текущего пользователя
 */
router.get('/me', 
  authMiddleware,
  authController.getMe
);

/**
 * POST /api/auth/logout
 * Выход
 */
router.post('/logout', 
  authMiddleware,
  authController.logout
);

/**
 * POST /api/auth/dev-login
 * Тестовая авторизация (только для разработки!)
 */
router.post('/dev-login',
  authController.devLogin
);

module.exports = router;
