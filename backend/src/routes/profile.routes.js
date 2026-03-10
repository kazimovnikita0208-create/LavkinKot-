const { Router } = require('express');
const profileController = require('../controllers/profile.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validator.middleware');
const { updateProfileSchema, updateAddressSchema } = require('../utils/validators');

const router = Router();

// Все маршруты требуют авторизации
router.use(authMiddleware);

/**
 * GET /api/profile
 * Получение профиля
 */
router.get('/', 
  profileController.getProfile
);

/**
 * PATCH /api/profile
 * Обновление профиля
 */
router.patch('/', 
  validateBody(updateProfileSchema),
  profileController.updateProfile
);

/**
 * PATCH /api/profile/address
 * Обновление адреса по умолчанию
 */
router.patch('/address', 
  validateBody(updateAddressSchema),
  profileController.updateAddress
);

/**
 * GET /api/profile/stats
 * Получение статистики пользователя
 */
router.get('/stats', 
  profileController.getStats
);

module.exports = router;
