const authService = require('../services/auth.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * POST /api/auth/telegram
 * Авторизация через Telegram initData
 */
const loginWithTelegram = asyncHandler(async (req, res) => {
  const { initData } = req.body;
  
  const result = await authService.loginWithTelegram(initData);
  
  res.json({
    success: true,
    data: result
  });
});

/**
 * GET /api/auth/me
 * Получение текущего пользователя
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserWithSubscription(req.user.id);
  
  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/auth/logout
 * Выход (на клиенте просто удаляется токен)
 */
const logout = asyncHandler(async (req, res) => {
  // JWT токены stateless, просто возвращаем успех
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * POST /api/auth/dev-login
 * Тестовая авторизация (только для разработки!)
 */
const devLogin = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      error: 'Dev login is only available in development mode'
    });
  }

  const role = req.body?.role || 'customer';
  const result = await authService.devLogin(role);

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  loginWithTelegram,
  getMe,
  logout,
  devLogin
};
