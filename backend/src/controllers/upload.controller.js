const uploadService = require('../services/upload.service');
const partnerService = require('../services/partner.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

/**
 * POST /api/upload/product-image
 * Загрузка изображения товара
 */
const uploadProductImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // Получаем магазин партнёра для формирования пути
  const shop = await partnerService.getPartnerShop(userId);
  
  const result = await uploadService.uploadProductImage(req.file, shop.id);
  
  res.json({
    success: true,
    data: {
      url: result.url,
      path: result.path
    }
  });
});

/**
 * POST /api/upload/shop-cover
 * Загрузка обложки магазина
 */
const uploadShopCover = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const shop = await partnerService.getPartnerShop(userId);
  
  const result = await uploadService.uploadShopCover(req.file, shop.id);
  
  res.json({
    success: true,
    data: {
      url: result.url,
      path: result.path
    }
  });
});

/**
 * POST /api/upload/shop-image
 * Загрузка изображения магазина
 */
const uploadShopImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const shop = await partnerService.getPartnerShop(userId);
  
  const result = await uploadService.uploadShopImage(req.file, shop.id);
  
  res.json({
    success: true,
    data: {
      url: result.url,
      path: result.path
    }
  });
});

/**
 * DELETE /api/upload
 * Удаление изображения
 */
const deleteImage = asyncHandler(async (req, res) => {
  const { path } = req.body;
  
  await uploadService.deleteImage(path);
  
  res.json({
    success: true,
    message: 'Image deleted'
  });
});

module.exports = {
  uploadProductImage,
  uploadShopCover,
  uploadShopImage,
  deleteImage
};
