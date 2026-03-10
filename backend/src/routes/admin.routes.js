const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validateBody, validateQuery } = require('../middlewares/validator.middleware');
const { 
  updateShopSchema, 
  updateUserRoleSchema,
  ordersQuerySchema,
  paginationSchema
} = require('../utils/validators');

const router = Router();

// Все маршруты требуют авторизации и роли admin
router.use(authMiddleware);
router.use(adminOnly);

/**
 * GET /api/admin/orders
 * Получение всех заказов
 */
router.get('/orders', 
  validateQuery(ordersQuerySchema),
  adminController.getAllOrders
);

/**
 * PATCH /api/admin/orders/:id
 * Редактирование заказа
 */
router.patch('/orders/:id', 
  adminController.updateOrder
);

/**
 * GET /api/admin/users
 * Получение всех пользователей
 */
router.get('/users', 
  validateQuery(paginationSchema),
  adminController.getAllUsers
);

/**
 * PATCH /api/admin/users/:id/role
 * Изменение роли пользователя
 */
router.patch('/users/:id/role', 
  validateBody(updateUserRoleSchema),
  adminController.updateUserRole
);

/**
 * GET /api/admin/shops
 * Получение всех магазинов
 */
router.get('/shops', 
  validateQuery(paginationSchema),
  adminController.getAllShops
);

/**
 * POST /api/admin/shops
 * Создание магазина
 */
router.post('/shops', 
  adminController.createShop
);

/**
 * PATCH /api/admin/shops/:id
 * Редактирование магазина
 */
router.patch('/shops/:id', 
  validateBody(updateShopSchema),
  adminController.updateShop
);

/**
 * GET /api/admin/couriers
 * Получение всех курьеров
 */
router.get('/couriers', 
  validateQuery(paginationSchema),
  adminController.getAllCouriers
);

/**
 * GET /api/admin/couriers/:id/stats
 * Статистика курьера
 */
router.get('/couriers/:id/stats', 
  adminController.getCourierStats
);

/**
 * GET /api/admin/stats/overview
 * Общая статистика
 */
router.get('/stats/overview', 
  adminController.getOverviewStats
);

/**
 * GET /api/admin/partners
 * Заявки партнёров
 */
router.get('/partners', 
  validateQuery(paginationSchema),
  adminController.getPartnerApplications
);

/**
 * POST /api/admin/partners/:id/approve
 * Одобрить заявку партнёра
 */
router.post('/partners/:id/approve', 
  adminController.approvePartner
);

/**
 * POST /api/admin/partners/:id/reject
 * Отклонить заявку партнёра
 */
router.post('/partners/:id/reject',
  adminController.rejectPartner
);

/**
 * GET /api/admin/promotions
 */
router.get('/promotions', adminController.getAllPromotions);

/**
 * POST /api/admin/promotions
 */
router.post('/promotions', adminController.createPromotion);

/**
 * PATCH /api/admin/promotions/:id
 */
router.patch('/promotions/:id', adminController.updatePromotion);

/**
 * DELETE /api/admin/promotions/:id
 */
router.delete('/promotions/:id', adminController.deletePromotion);

module.exports = router;
