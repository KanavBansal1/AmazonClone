const { pool, isInMemoryMode } = require('../config/db');
const memStore = require('../config/inMemoryStore');
const { cartQueries } = require('../models/queries');
const { AppError } = require('../middleware/errorHandler');

// Default user ID (no auth — assumed logged in)
const DEFAULT_USER_ID = 1;

/**
 * Cart Service — Business logic for cart operations
 * Supports both PostgreSQL and in-memory mode
 */
class CartService {
  /**
   * Get or create cart for the default user, returns cart_id
   */
  async getOrCreateCart() {
    if (isInMemoryMode()) return 1;
    let result = await pool.query(cartQueries.getCartByUserId, [DEFAULT_USER_ID]);
    if (result.rows.length === 0) {
      result = await pool.query(cartQueries.createCart, [DEFAULT_USER_ID]);
    }
    return result.rows[0].id;
  }

  /**
   * Get all cart items with product details
   */
  async getCartItems() {
    if (isInMemoryMode()) {
      return memStore.getCart();
    }
    const cartId = await this.getOrCreateCart();
    const result = await pool.query(cartQueries.getCartItems, [cartId]);

    // Calculate totals
    const items = result.rows;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    return {
      cart_id: cartId,
      items,
      total_items: totalItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
    };
  }

  /**
   * Add an item to the cart
   */
  async addItem(productId, quantity = 1) {
    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }
    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    if (isInMemoryMode()) {
      return memStore.addToCart(productId, quantity);
    }

    const cartId = await this.getOrCreateCart();
    await pool.query(cartQueries.addItem, [cartId, productId, quantity]);

    // Return updated cart
    return this.getCartItems();
  }

  /**
   * Update quantity of a cart item
   */
  async updateItem(cartItemId, quantity) {
    if (!cartItemId) {
      throw new AppError('Cart item ID is required', 400);
    }
    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    if (isInMemoryMode()) {
      const cart = memStore.updateCartItem(cartItemId, quantity);
      if (!cart) throw new AppError('Cart item not found', 404);
      return cart;
    }

    const result = await pool.query(cartQueries.updateItem, [quantity, cartItemId]);
    if (result.rows.length === 0) {
      throw new AppError('Cart item not found', 404);
    }

    return this.getCartItems();
  }

  /**
   * Remove an item from the cart
   */
  async removeItem(cartItemId) {
    if (!cartItemId) {
      throw new AppError('Cart item ID is required', 400);
    }

    if (isInMemoryMode()) {
      const cart = memStore.removeCartItem(cartItemId);
      if (!cart) throw new AppError('Cart item not found', 404);
      return cart;
    }

    const result = await pool.query(cartQueries.removeItem, [cartItemId]);
    if (result.rows.length === 0) {
      throw new AppError('Cart item not found', 404);
    }

    return this.getCartItems();
  }

  /**
   * Clear all items from the cart
   */
  async clearCart() {
    if (isInMemoryMode()) {
      memStore.clearCart();
      return;
    }
    const cartId = await this.getOrCreateCart();
    await pool.query(cartQueries.clearCart, [cartId]);
  }
}

module.exports = new CartService();
