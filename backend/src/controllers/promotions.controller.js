const promotionsService = require('../services/promotions.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * GET /api/promotions
 * Получение активных акций
 */
const getPromotions = asyncHandler(async (req, res) => {
  const { shop_id } = req.query;
  const promotions = await promotionsService.getActivePromotions(shop_id);
  
  res.json({
    success: true,
    data: promotions
  });
});

/**
 * GET /api/promotions/:id
 * Получение акции по ID
 */
const getPromotionById = asyncHandler(async (req, res) => {
  const promotion = await promotionsService.getPromotionById(req.params.id);
  
  res.json({
    success: true,
    data: promotion
  });
});

module.exports = {
  getPromotions,
  getPromotionById
};
