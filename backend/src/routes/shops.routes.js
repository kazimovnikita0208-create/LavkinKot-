const { Router } = require('express');
const shopsController = require('../controllers/shops.controller');
const { validateQuery } = require('../middlewares/validator.middleware');
const { shopsQuerySchema, productsQuerySchema } = require('../utils/validators');

const router = Router();

/**
 * GET /api/shops
 * Получение списка магазинов
 */
router.get('/', 
  validateQuery(shopsQuerySchema),
  shopsController.getShops
);

/**
 * GET /api/shops/:id
 * Получение магазина по ID
 */
router.get('/:id', 
  shopsController.getShopById
);

/**
 * GET /api/shops/:id/products
 * Получение товаров магазина
 */
router.get('/:id/products', 
  validateQuery(productsQuerySchema),
  shopsController.getShopProducts
);

/**
 * GET /api/shops/:id/categories
 * Получение категорий товаров магазина
 */
router.get('/:id/categories', 
  shopsController.getShopCategories
);

module.exports = router;
