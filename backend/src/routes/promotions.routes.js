const { Router } = require('express');
const promotionsController = require('../controllers/promotions.controller');

const router = Router();

/**
 * GET /api/promotions
 * Получение активных акций
 */
router.get('/', 
  promotionsController.getPromotions
);

/**
 * GET /api/promotions/:id
 * Получение акции по ID
 */
router.get('/:id', 
  promotionsController.getPromotionById
);

module.exports = router;
