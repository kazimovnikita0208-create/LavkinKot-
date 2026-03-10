const { Router } = require('express');
const partnerController = require('../controllers/partner.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { partnerOnly } = require('../middlewares/role.middleware');
const { validateBody, validateQuery } = require('../middlewares/validator.middleware');
const { 
  updateShopSchema, 
  createProductSchema, 
  updateProductSchema,
  productsQuerySchema,
  ordersQuerySchema
} = require('../utils/validators');

const router = Router();

// Все маршруты требуют авторизации и роли partner
router.use(authMiddleware);
router.use(partnerOnly);

/**
 * GET /api/partner/shop
 * Получение магазина партнёра
 */
router.get('/shop', 
  partnerController.getShop
);

/**
 * PATCH /api/partner/shop
 * Обновление магазина
 */
router.patch('/shop', 
  validateBody(updateShopSchema),
  partnerController.updateShop
);

/**
 * GET /api/partner/products
 * Получение товаров магазина
 */
router.get('/products', 
  validateQuery(productsQuerySchema),
  partnerController.getProducts
);

/**
 * POST /api/partner/products
 * Создание товара
 */
router.post('/products', 
  validateBody(createProductSchema),
  partnerController.createProduct
);

/**
 * PATCH /api/partner/products/:id
 * Обновление товара
 */
router.patch('/products/:id', 
  validateBody(updateProductSchema),
  partnerController.updateProduct
);

/**
 * DELETE /api/partner/products/:id
 * Удаление товара
 */
router.delete('/products/:id', 
  partnerController.deleteProduct
);

/**
 * GET /api/partner/orders
 * Получение заказов магазина
 */
router.get('/orders', 
  validateQuery(ordersQuerySchema),
  partnerController.getOrders
);

/**
 * POST /api/partner/orders/:id/accept
 * Принять заказ
 */
router.post('/orders/:id/accept', 
  partnerController.acceptOrder
);

/**
 * POST /api/partner/orders/:id/ready
 * Заказ готов
 */
router.post('/orders/:id/ready', 
  partnerController.markOrderReady
);

/**
 * GET /api/partner/analytics
 * Аналитика магазина
 */
router.get('/analytics', 
  partnerController.getAnalytics
);

module.exports = router;
