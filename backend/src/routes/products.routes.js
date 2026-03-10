const { Router } = require('express');
const productsController = require('../controllers/products.controller');
const { validateQuery } = require('../middlewares/validator.middleware');
const { productsQuerySchema } = require('../utils/validators');

const router = Router();

/**
 * GET /api/products
 * Поиск товаров
 */
router.get('/', 
  validateQuery(productsQuerySchema),
  productsController.searchProducts
);

/**
 * GET /api/products/popular
 * Получение популярных товаров
 */
router.get('/popular', 
  productsController.getPopularProducts
);

/**
 * GET /api/products/:id
 * Получение товара по ID
 */
router.get('/:id', 
  productsController.getProductById
);

/**
 * GET /api/products/:id/recommended
 * Получение рекомендованных товаров
 */
router.get('/:id/recommended', 
  productsController.getRecommendedProducts
);

module.exports = router;
