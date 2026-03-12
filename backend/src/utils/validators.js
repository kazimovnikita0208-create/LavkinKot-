const Joi = require('joi');
const { DISTRICTS, TIME_SLOTS, PAYMENT_METHOD } = require('../config/constants');

/**
 * Validation schemas
 */

// Auth schemas
const telegramAuthSchema = Joi.object({
  initData: Joi.string().required()
});

// Profile schemas
const updateProfileSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(null, ''),
  first_name: Joi.string().max(255).allow(null, ''),
  last_name: Joi.string().max(255).allow(null, '')
}).min(1);

const updateAddressSchema = Joi.object({
  district: Joi.string().valid(...DISTRICTS).required(),
  street: Joi.string().max(255).required(),
  house: Joi.string().max(50).required(),
  entrance: Joi.string().max(20).allow(null, ''),
  floor: Joi.string().max(20).allow(null, ''),
  apartment: Joi.string().max(50).required()
});

// Общие поля адреса и доставки (переиспользуем в batch)
const deliveryFields = {
  delivery_street: Joi.string().max(255).required(),
  delivery_house: Joi.string().max(50).required(),
  delivery_entrance: Joi.string().max(20).allow(null, ''),
  delivery_floor: Joi.string().max(20).allow(null, ''),
  delivery_apartment: Joi.string().max(50).required(),
  delivery_date: Joi.date().iso().required(),
  delivery_time_slot: Joi.string().max(20).allow(null, ''),
  contact_phone: Joi.string().required(),
  use_subscription: Joi.boolean().default(false),
  leave_at_door: Joi.boolean().default(false),
  comment: Joi.string().max(500).allow(null, ''),
};

const orderItemsSchema = Joi.array().items(
  Joi.object({
    product_id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).max(99).required(),
    price: Joi.number().positive().precision(2).optional()
  })
).min(1).required();

// Order schemas
const createOrderSchema = Joi.object({
  shop_id: Joi.string().uuid().required(),
  items: orderItemsSchema,
  ...deliveryFields,
});

// Batch order schema (несколько магазинов, одна доставка)
const createBatchOrderSchema = Joi.object({
  orders: Joi.array().items(
    Joi.object({
      shop_id: Joi.string().uuid().required(),
      items: orderItemsSchema,
    })
  ).min(1).required(),
  ...deliveryFields,
});

// Subscription schemas
const activateSubscriptionSchema = Joi.object({
  planId: Joi.string().uuid().required()
});

// Product schemas (for partners)
const createProductSchema = Joi.object({
  category: Joi.string().max(100).required(),
  name: Joi.string().max(255).required(),
  description: Joi.string().max(2000).allow(null, ''),
  composition: Joi.string().max(1000).allow(null, ''),
  price: Joi.number().positive().precision(2).required(),
  old_price: Joi.number().positive().precision(2).allow(null),
  image_url: Joi.string().uri().max(2000).allow(null, ''),
  weight: Joi.string().max(50).allow(null, ''),
  in_stock: Joi.boolean().default(true),
  is_popular: Joi.boolean().default(false),
  sort_order: Joi.number().integer().default(0)
});

const updateProductSchema = Joi.object({
  category: Joi.string().max(100),
  name: Joi.string().max(255),
  description: Joi.string().max(2000).allow(null, ''),
  composition: Joi.string().max(1000).allow(null, ''),
  price: Joi.number().positive().precision(2),
  old_price: Joi.number().positive().precision(2).allow(null),
  image_url: Joi.string().uri().max(2000).allow(null, ''),
  weight: Joi.string().max(50).allow(null, ''),
  in_stock: Joi.boolean(),
  is_popular: Joi.boolean(),
  sort_order: Joi.number().integer()
}).min(1);

// Shop schemas (for partners/admins)
const updateShopSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string().max(2000).allow(null, ''),
  address: Joi.string().max(500).allow(null, ''),
  category: Joi.string().valid('store', 'bakery', 'fruit', 'restaurant'),
  image_url: Joi.string().uri().max(2000).allow(null, ''),
  cover_url: Joi.string().uri().max(2000).allow(null, ''),
  min_order_amount: Joi.number().integer().min(0),
  delivery_time: Joi.string().max(50),
  is_active: Joi.boolean(),
  working_hours: Joi.object()
}).min(1);

// Admin schemas
const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('customer', 'partner', 'courier', 'admin').required(),
  shop_id: Joi.string().uuid().allow(null)
});

// Query schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const shopsQuerySchema = Joi.object({
  category: Joi.string().valid('store', 'bakery', 'fruit', 'restaurant'),
  search: Joi.string().max(100),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const productsQuerySchema = Joi.object({
  category: Joi.string().max(100),
  search: Joi.string().max(100),
  in_stock: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const ordersQuerySchema = Joi.object({
  status: Joi.string(),
  from_date: Joi.date().iso(),
  to_date: Joi.date().iso(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

module.exports = {
  telegramAuthSchema,
  updateProfileSchema,
  updateAddressSchema,
  createOrderSchema,
  createBatchOrderSchema,
  activateSubscriptionSchema,
  createProductSchema,
  updateProductSchema,
  updateShopSchema,
  updateUserRoleSchema,
  paginationSchema,
  shopsQuerySchema,
  productsQuerySchema,
  ordersQuerySchema
};
