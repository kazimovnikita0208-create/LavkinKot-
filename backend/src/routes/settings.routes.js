const { Router } = require('express');
const { getAppSettings, updateAppSettings } = require('../controllers/settings.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

const router = Router();

// Публичный эндпоинт — читать настройки может любой
router.get('/', getAppSettings);

// Изменять могут только админы
router.put('/', authMiddleware, adminOnly, updateAppSettings);

module.exports = router;
