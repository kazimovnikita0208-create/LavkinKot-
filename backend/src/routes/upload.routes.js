const { Router } = require('express');
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { partnerOnly } = require('../middlewares/role.middleware');

const router = Router();

// Настройка multer для хранения в памяти
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'), false);
    }
  }
});

// Все маршруты требуют авторизации и роли partner
router.use(authMiddleware);
router.use(partnerOnly);

/**
 * POST /api/upload/product-image
 * Загрузка изображения товара
 */
router.post('/product-image', 
  upload.single('image'),
  uploadController.uploadProductImage
);

/**
 * POST /api/upload/shop-cover
 * Загрузка обложки магазина
 */
router.post('/shop-cover', 
  upload.single('image'),
  uploadController.uploadShopCover
);

/**
 * POST /api/upload/shop-image
 * Загрузка изображения магазина
 */
router.post('/shop-image', 
  upload.single('image'),
  uploadController.uploadShopImage
);

/**
 * DELETE /api/upload
 * Удаление изображения
 */
router.delete('/', 
  uploadController.deleteImage
);

module.exports = router;
