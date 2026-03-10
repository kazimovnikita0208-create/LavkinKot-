/**
 * Application constants
 */

// User roles
const ROLES = {
  CUSTOMER: 'customer',
  PARTNER: 'partner',
  COURIER: 'courier',
  ADMIN: 'admin'
};

// Order statuses
const ORDER_STATUS = {
  CREATED: 'created',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  COURIER_ASSIGNED: 'courier_assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment methods
const PAYMENT_METHOD = {
  SUBSCRIPTION: 'subscription',
  ONE_TIME: 'one_time'
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

// Subscription statuses
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

// Transaction types
const TRANSACTION_TYPE = {
  PURCHASE: 'purchase',
  RENEWAL: 'renewal',
  REFUND: 'refund',
  DELIVERY_USED: 'delivery_used'
};

// Shop categories
const SHOP_CATEGORY = {
  STORE: 'store',
  BAKERY: 'bakery',
  FRUIT: 'fruit',
  RESTAURANT: 'restaurant'
};

// Delivery fee for one-time delivery (in rubles)
const ONE_TIME_DELIVERY_FEE = 350;

// Courier earning per delivery (in rubles)
const COURIER_EARNING_PER_DELIVERY = 200;

// Districts
const DISTRICTS = [
  'Октябрьский',
  'Ленинский',
  'Советский',
  'Кировский',
  'Промышленный',
  'Самарский',
  'Железнодорожный',
  'Красноглинский',
  'Куйбышевский'
];

// Time slots
const TIME_SLOTS = [
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00'
];

module.exports = {
  ROLES,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  SUBSCRIPTION_STATUS,
  TRANSACTION_TYPE,
  SHOP_CATEGORY,
  ONE_TIME_DELIVERY_FEE,
  COURIER_EARNING_PER_DELIVERY,
  DISTRICTS,
  TIME_SLOTS
};
