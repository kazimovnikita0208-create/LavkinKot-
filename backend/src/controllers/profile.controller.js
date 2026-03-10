const profileService = require('../services/profile.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/profile
 * Получение профиля
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  
  res.json({
    success: true,
    data: profile
  });
});

/**
 * PATCH /api/profile
 * Обновление профиля
 */
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfile(req.user.id, req.body);
  
  res.json({
    success: true,
    data: profile
  });
});

/**
 * PATCH /api/profile/address
 * Обновление адреса по умолчанию
 */
const updateAddress = asyncHandler(async (req, res) => {
  const profile = await profileService.updateDefaultAddress(req.user.id, req.body);
  
  res.json({
    success: true,
    data: profile
  });
});

/**
 * GET /api/profile/stats
 * Получение статистики пользователя
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await profileService.getUserStats(req.user.id);
  
  res.json({
    success: true,
    data: stats
  });
});

module.exports = {
  getProfile,
  updateProfile,
  updateAddress,
  getStats
};
