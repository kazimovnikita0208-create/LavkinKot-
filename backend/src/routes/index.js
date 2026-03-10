const { Router } = require('express');

const authRoutes = require('./auth.routes');
const shopsRoutes = require('./shops.routes');
const productsRoutes = require('./products.routes');
const promotionsRoutes = require('./promotions.routes');
const ordersRoutes = require('./orders.routes');
const subscriptionsRoutes = require('./subscriptions.routes');
const profileRoutes = require('./profile.routes');
const partnerRoutes = require('./partner.routes');
const courierRoutes = require('./courier.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes');
const paymentRoutes = require('./payment.routes');
const settingsRoutes = require('./settings.routes');

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/shops', shopsRoutes);
router.use('/products', productsRoutes);
router.use('/promotions', promotionsRoutes);
router.use('/subscriptions', subscriptionsRoutes);

// Protected routes
router.use('/orders', ordersRoutes);
router.use('/profile', profileRoutes);

// Role-based routes
router.use('/partner', partnerRoutes);
router.use('/courier', courierRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/payments', paymentRoutes);
router.use('/settings', settingsRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'ЛавкинКот API',
    version: '1.0.0',
    description: 'Backend API для сервиса доставки продуктов',
    endpoints: {
      auth: '/api/auth',
      shops: '/api/shops',
      products: '/api/products',
      promotions: '/api/promotions',
      orders: '/api/orders',
      subscriptions: '/api/subscriptions',
      profile: '/api/profile',
      partner: '/api/partner',
      courier: '/api/courier',
      admin: '/api/admin',
      upload: '/api/upload'
    }
  });
});

module.exports = router;
