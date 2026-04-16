import axios from 'axios';

/**
 * Axios instance pre-configured with the API base URL
 * Uses NEXT_PUBLIC_API_URL env var, defaults to localhost:5000
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor — handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error ${error.response.status}: ${error.config?.url}`);
    } else if (error.request) {
      console.error('No response from server. Is the backend running?');
    }
    return Promise.reject(error);
  }
);

// =============================================
// PRODUCT API
// =============================================

export const productAPI = {
  /** Get all products, optionally filtered by category */
  getAll: (category) => {
    const params = category ? { category } : {};
    return api.get('/products', { params });
  },

  /** Get a single product by ID */
  getById: (id) => api.get(`/products/${id}`),

  /** Search products by query string */
  search: (query) => api.get('/products/search', { params: { q: query } }),

  /** Get all product categories */
  getCategories: () => api.get('/products/categories'),
};

// =============================================
// CART API
// =============================================

export const cartAPI = {
  /** Get current cart contents */
  get: () => api.get('/cart'),

  /** Add item to cart */
  addItem: (productId, quantity = 1) =>
    api.post('/cart/add', { product_id: productId, quantity }),

  /** Update cart item quantity */
  updateItem: (cartItemId, quantity) =>
    api.put('/cart/update', { cart_item_id: cartItemId, quantity }),

  /** Remove item from cart */
  removeItem: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
};

// =============================================
// ORDER API
// =============================================

export const orderAPI = {
  /** Create a new order */
  create: (address) => api.post('/orders', { address }),

  /** Get order by ID */
  getById: (id) => api.get(`/orders/${id}`),
};

export default api;
