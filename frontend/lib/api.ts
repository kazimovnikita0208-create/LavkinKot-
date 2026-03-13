/**
 * API Client для работы с backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── In-memory GET cache (stale-while-revalidate) ────────────────────────────
const _memCache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 минуты

function memCacheGet<T>(key: string): T | null {
  const entry = _memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { _memCache.delete(key); return null; }
  return entry.data as T;
}
function memCacheSet(key: string, data: unknown, ttl = CACHE_TTL_MS) {
  _memCache.set(key, { data, expires: Date.now() + ttl });
}
export function invalidateCache(prefix: string) {
  for (const key of _memCache.keys()) {
    if (key.startsWith(prefix)) _memCache.delete(key);
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private _reauthing = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Пробуем получить новый токен через Telegram initData
  private async tryReauth(): Promise<boolean> {
    if (this._reauthing) return false;
    if (typeof window === 'undefined') return false;
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return false;

    this._reauthing = true;
    try {
      const resp = await fetch(`${this.baseUrl}/auth/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      if (!resp.ok) return false;
      const json = await resp.json();
      if (json.success && json.data?.token) {
        this.setToken(json.data.token);
        return true;
      }
    } catch { /* ignore */ } finally {
      this._reauthing = false;
    }
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    _retry = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // GET-запросы: сначала проверяем кэш, параллельно обновляем
    const isGet = !options.method || options.method === 'GET';
    if (isGet) {
      const cached = memCacheGet<ApiResponse<T>>(url);
      if (cached) return cached;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && !_retry) {
          // Пробуем переавторизоваться через Telegram и повторить запрос
          const reauthed = await this.tryReauth();
          if (reauthed) return this.request<T>(endpoint, options, true);
          this.setToken(null);
        }
        throw new Error(data.error || 'Request failed');
      }

      // Кэшируем успешные GET
      if (isGet) memCacheSet(url, data);

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file (multipart/form-data)
  async upload<T>(endpoint: string, file: File, fieldName: string = 'image'): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

// Создаём экземпляр API клиента
export const api = new ApiClient(API_BASE_URL);

// ============================================
// API методы
// ============================================

// Auth
export const authApi = {
  loginWithTelegram: (initData: string) => 
    api.post<{ user: User; token: string }>('/auth/telegram', { initData }),
  
  getMe: () => 
    api.get<User>('/auth/me'),
  
  logout: () => 
    api.post('/auth/logout'),
};

// Shops
export const shopsApi = {
  getShops: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return api.get<Shop[]>(`/shops?${query.toString()}`);
  },
  
  getShopById: (id: string) => 
    api.get<Shop>(`/shops/${id}`),
  
  getShopProducts: (id: string, params?: { category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return api.get<Product[]>(`/shops/${id}/products?${query.toString()}`);
  },
  
  getShopCategories: (id: string) => 
    api.get<string[]>(`/shops/${id}/categories`),
};

// Products
export const productsApi = {
  getProducts: (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return api.get<Product[]>(`/products?${query.toString()}`);
  },
  
  getProductById: (id: string) => 
    api.get<Product>(`/products/${id}`),
  
  getPopularProducts: (limit?: number) => 
    api.get<Product[]>(`/products/popular${limit ? `?limit=${limit}` : ''}`),
  
  getRecommendedProducts: (productId: string, limit?: number) => 
    api.get<Product[]>(`/products/${productId}/recommended${limit ? `?limit=${limit}` : ''}`),
};

// Promotions
export const promotionsApi = {
  getPromotions: (shopId?: string) => 
    api.get<Promotion[]>(`/promotions${shopId ? `?shop_id=${shopId}` : ''}`),
  
  getPromotionById: (id: string) => 
    api.get<Promotion>(`/promotions/${id}`),
};

// Subscriptions
export const subscriptionsApi = {
  getPlans: () => 
    api.get<SubscriptionPlan[]>('/subscriptions/plans'),
  
  getMySubscription: () => 
    api.get<CustomerSubscription>('/subscriptions/me'),
  
  activate: (planId: string) => 
    api.post<CustomerSubscription>('/subscriptions/activate', { planId }),
  
  getTransactions: () => 
    api.get<SubscriptionTransaction[]>('/subscriptions/transactions'),
};

// Orders
export const ordersApi = {
  createOrder: (orderData: CreateOrderData) =>
    api.post<Order>('/orders', orderData),

  createBatchOrder: (batchData: CreateBatchOrderData) =>
    api.post<BatchOrderResponse>('/orders/batch', batchData),
  
  getOrders: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return api.get<Order[]>(`/orders?${query.toString()}`);
  },
  
  getOrderById: (id: string) => 
    api.get<Order>(`/orders/${id}`),
  
  getOrderStatus: (id: string) => 
    api.get<{ id: string; status: string; updated_at: string }>(`/orders/${id}/status`),
  
  cancelOrder: (id: string) => 
    api.post(`/orders/${id}/cancel`),
};

// Courier
export const courierApi = {
  // Смена
  startShift: () => 
    api.post<CourierShift>('/courier/shift/start'),
  
  endShift: () => 
    api.post<CourierShift>('/courier/shift/end'),
  
  getCurrentShift: () => 
    api.get<CourierShift | null>('/courier/shift/current'),
  
  // Заказы
  getOrders: () => 
    api.get<CourierOrder[]>('/courier/orders'),
  
  assignOrder: (orderId: string) => 
    api.post(`/courier/orders/${orderId}/assign`),
  
  pickupOrder: (orderId: string) => 
    api.post(`/courier/orders/${orderId}/pickup`),
  
  deliverOrder: (orderId: string) => 
    api.post(`/courier/orders/${orderId}/deliver`),
  
  // Статистика
  getStats: () => 
    api.get<CourierStats>('/courier/stats'),
};

// Partner
export const partnerApi = {
  // Магазин
  getShop: () => 
    api.get<PartnerShop>('/partner/shop'),
  
  updateShop: (data: Partial<PartnerShop>) => 
    api.patch<PartnerShop>('/partner/shop', data),
  
  // Товары
  getProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return api.get<Product[]>(`/partner/products?${query.toString()}`);
  },
  
  createProduct: (data: CreateProductData) => 
    api.post<Product>('/partner/products', data),
  
  updateProduct: (id: string, data: Partial<CreateProductData>) => 
    api.patch<Product>(`/partner/products/${id}`, data),
  
  deleteProduct: (id: string) => 
    api.delete(`/partner/products/${id}`),
  
  // Заказы
  getOrders: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return api.get<PartnerOrder[]>(`/partner/orders?${query.toString()}`);
  },
  
  acceptOrder: (orderId: string) => 
    api.post(`/partner/orders/${orderId}/accept`),
  
  markOrderReady: (orderId: string) => 
    api.post(`/partner/orders/${orderId}/ready`),
  
  // Аналитика
  getAnalytics: () => 
    api.get<PartnerAnalytics>('/partner/analytics'),
};

// Profile
export const profileApi = {
  getProfile: () => 
    api.get<UserProfile>('/profile'),
  
  updateProfile: (data: Partial<UserProfile>) => 
    api.patch<UserProfile>('/profile', data),
  
  updateAddress: (address: Address) => 
    api.patch<UserProfile>('/profile/address', address),
  
  getStats: () => 
    api.get<UserStats>('/profile/stats'),
};

// ============================================
// Types
// ============================================

export interface User {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'customer' | 'partner' | 'courier' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  default_district: string | null;
  default_street: string | null;
  default_house: string | null;
  default_entrance: string | null;
  default_floor: string | null;
  default_apartment: string | null;
  free_deliveries_remaining: number;
  subscription?: CustomerSubscription | null;
  shop?: Shop | null;
}

export interface UserStats {
  ordersCount: number;
  totalSpent: number;
  hasActiveSubscription: boolean;
  subscription: CustomerSubscription | null;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  category: 'store' | 'bakery' | 'fruit' | 'restaurant';
  description: string | null;
  address: string | null;
  image_url: string | null;
  cover_url: string | null;
  rating: number;
  reviews_count: number;
  min_order_amount: number;
  delivery_time: string;
  is_active: boolean;
  working_hours: Record<string, string>;
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  category: string;
  name: string;
  description: string | null;
  composition: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  weight: string | null;
  in_stock: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  shop?: Shop;
}

export interface Promotion {
  id: string;
  shop_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_percent: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  shop?: Shop;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  deliveries_limit: number;
  duration_days: number;
  price: number;
  is_active: boolean;
  sort_order: number;
}

export interface CustomerSubscription {
  id: string;
  profile_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled';
  deliveries_remaining: number;
  deliveries_used: number;
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  plan?: SubscriptionPlan;
}

export interface SubscriptionTransaction {
  id: string;
  subscription_id: string;
  profile_id: string;
  type: 'purchase' | 'renewal' | 'refund' | 'delivery_used';
  amount: number | null;
  deliveries_delta: number | null;
  order_id: string | null;
  description: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: number;
  profile_id: string;
  shop_id: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_district: string;
  delivery_street: string;
  delivery_house: string;
  delivery_entrance: string | null;
  delivery_floor: string | null;
  delivery_apartment: string;
  delivery_comment: string | null;
  delivery_date: string;
  delivery_time_slot: string;
  leave_at_door: boolean;
  customer_phone: string;
  payment_method: 'subscription' | 'one_time';
  payment_status: 'pending' | 'paid' | 'refunded';
  courier_id: string | null;
  created_at: string;
  shop?: Shop;
  order_items?: OrderItem[];
  courier?: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_weight: string | null;
  quantity: number;
  price: number;
  total: number;
  product?: Product;
}

export interface Address {
  district: string;
  street: string;
  house: string;
  entrance?: string;
  floor?: string;
  apartment: string;
}

export interface PartnerShop extends Shop {
  owner_id?: string;
}

export interface PartnerOrder {
  id: string;
  order_number: number;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_street: string;
  delivery_house: string;
  delivery_apartment: string;
  delivery_time_slot: string;
  customer_phone: string;
  leave_at_door: boolean;
  created_at: string;
  profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
  order_items?: OrderItem[];
  courier?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  } | null;
}

export interface PartnerAnalytics {
  // Сегодня
  todayOrdersCount: number;
  todayRevenue: number;
  
  // За неделю
  weekOrdersCount: number;
  weekRevenue: number;
  
  // Всего
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  
  // Показатели
  activeProducts: number;
  totalProducts: number;
  avgOrderValue: number;
  
  // Заказы по статусам
  ordersByStatus: {
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    delivering: number;
    delivered: number;
    cancelled: number;
  };
  
  // Топ товары
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    totalSold: number;
  }>;
  
  // Магазин
  rating: number;
  reviewsCount: number;
}

export interface CreateProductData {
  name: string;
  category: string;
  description?: string;
  composition?: string;
  price: number;
  old_price?: number;
  image_url?: string;
  weight?: string;
  in_stock?: boolean;
  is_popular?: boolean;
  sort_order?: number;
}

export interface CourierShift {
  id: string;
  courier_id: string;
  started_at: string;
  ended_at: string | null;
  orders_count: number;
  total_earned: number;
}

export interface CourierStats {
  todayDeliveries: number;
  todayEarnings: number;
  totalDeliveries: number;
  rating: number;
  activeOrdersCount: number;
}

export interface CourierOrder {
  id: string;
  order_number: number;
  status: string;
  shop: {
    id: string;
    name: string;
    address: string | null;
  };
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_street: string;
  delivery_house: string;
  delivery_apartment: string;
  delivery_time_slot: string;
  items_count: number;
  total: number;
  created_at: string;
}

export interface CreateOrderData {
  shop_id: string;
  items: { product_id: string; quantity: number; price: number }[];
  delivery_street: string;
  delivery_house: string;
  delivery_entrance?: string;
  delivery_floor?: string;
  delivery_apartment: string;
  delivery_date: string;
  delivery_time_slot?: string;
  contact_phone: string;
  use_subscription?: boolean;
  leave_at_door?: boolean;
  comment?: string;
}

export interface CreateBatchOrderData {
  orders: { shop_id: string; items: { product_id: string; quantity: number; price: number }[] }[];
  delivery_street: string;
  delivery_house: string;
  delivery_entrance?: string;
  delivery_floor?: string;
  delivery_apartment: string;
  delivery_date: string;
  delivery_time_slot?: string;
  contact_phone: string;
  use_subscription?: boolean;
  leave_at_door?: boolean;
  comment?: string;
}

export interface BatchOrderResponse {
  orders: Order[];
  batch_id: string;
}

export interface UploadResponse {
  url: string;
  path: string;
}

// ─── Admin Types ────────────────────────────────────────────────────────────

export interface AdminOverviewStats {
  users: { total: number; today: number };
  orders: { total: number; today: number };
  revenue: { total: number; today: number };
  partners: number;
  couriers: { total: number; active: number };
  shops: { total: number; active: number };
}

export interface AdminUser {
  id: string;
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  phone: string | null;
  role: 'customer' | 'courier' | 'partner' | 'admin';
  shop_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: number;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_street: string;
  delivery_house: string;
  delivery_apartment: string;
  delivery_date: string;
  delivery_time_slot: string;
  created_at: string;
  profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    telegram_id: number;
  };
  shop?: { id: string; name: string };
  courier?: { id: string; first_name: string | null; last_name: string | null } | null;
  order_items?: { id: string; product_name: string; quantity: number; price: number }[];
}

export interface AdminCourier {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  username: string | null;
  is_active: boolean;
  created_at: string;
  active_shift?: {
    id: string;
    started_at: string;
    deliveries_count: number;
    total_earnings: number;
  } | null;
}

export interface AdminCourierStats {
  totalDeliveries: number;
  totalEarnings: number;
  totalShifts: number;
  avgDeliveriesPerShift: number;
  recentShifts: { id: string; started_at: string; deliveries_count: number; total_earnings: number }[];
}

export interface AdminShop extends Shop {
  owner_id?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: () =>
    api.get<AdminOverviewStats>('/admin/stats/overview'),

  getOrders: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<AdminOrder[]>(`/admin/orders${qs ? `?${qs}` : ''}`);
  },

  updateOrder: (id: string, data: { status?: string; courier_id?: string }) =>
    api.patch<AdminOrder>(`/admin/orders/${id}`, data),

  getUsers: (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.role) q.set('role', params.role);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<AdminUser[]>(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  updateUserRole: (userId: string, role: string, shop_id?: string) =>
    api.patch<AdminUser>(`/admin/users/${userId}/role`, { role, shop_id }),

  getCouriers: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<AdminCourier[]>(`/admin/couriers${qs ? `?${qs}` : ''}`);
  },

  getCourierStats: (courierId: string) =>
    api.get<AdminCourierStats>(`/admin/couriers/${courierId}/stats`),

  getShops: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<AdminShop[]>(`/admin/shops${qs ? `?${qs}` : ''}`);
  },

  updateShop: (shopId: string, data: Partial<Shop>) =>
    api.patch<AdminShop>(`/admin/shops/${shopId}`, data),

  createShop: (data: Partial<Shop>) =>
    api.post<AdminShop>('/admin/shops', data),

  getPartnerApplications: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<AdminShop[]>(`/admin/partners${qs ? `?${qs}` : ''}`);
  },

  approvePartner: (shopId: string) =>
    api.post<AdminShop>(`/admin/partners/${shopId}/approve`, {}),

  rejectPartner: (shopId: string) =>
    api.post<AdminShop>(`/admin/partners/${shopId}/reject`, {}),

  getAllPromotions: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<Promotion[]>(`/admin/promotions${qs ? `?${qs}` : ''}`);
  },

  createPromotion: (data: Partial<Promotion>) =>
    api.post<Promotion>('/admin/promotions', data),

  updatePromotion: (id: string, data: Partial<Promotion>) =>
    api.patch<Promotion>(`/admin/promotions/${id}`, data),

  deletePromotion: (id: string) =>
    api.delete(`/admin/promotions/${id}`),
};

// Upload API
export const uploadApi = {
  uploadProductImage: (file: File) => 
    api.upload<UploadResponse>('/upload/product-image', file),
  
  uploadShopCover: (file: File) => 
    api.upload<UploadResponse>('/upload/shop-cover', file),
  
  uploadShopImage: (file: File) => 
    api.upload<UploadResponse>('/upload/shop-image', file),
  
  deleteImage: (path: string) => 
    api.delete(`/upload?path=${encodeURIComponent(path)}`),
};
