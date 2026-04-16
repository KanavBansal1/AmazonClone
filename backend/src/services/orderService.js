const { pool, isInMemoryMode } = require('../config/db');
const memStore = require('../config/inMemoryStore');
const { orderQueries, cartQueries } = require('../models/queries');
const { AppError } = require('../middleware/errorHandler');
const cartService = require('./cartService');

// Default user ID (no auth — assumed logged in)
const DEFAULT_USER_ID = 1;

/**
 * Order Service — Business logic for order operations
 * Supports both PostgreSQL and in-memory mode
 */
class OrderService {
  /**
   * Create an order from the current cart
   * - Validates cart is not empty
   * - Calculates total from cart items
   * - Creates order and order_items
   * - Decreases product stock
   * - Clears the cart
   */
  async createOrder(address) {
    if (!address || address.trim() === '') {
      throw new AppError('Shipping address is required', 400);
    }

    if (isInMemoryMode()) {
      const order = memStore.createOrder(address.trim());
      if (!order) throw new AppError('Cart is empty. Add items before placing an order.', 400);
      return order;
    }

    // Get current cart
    const cart = await cartService.getCartItems();

    if (cart.items.length === 0) {
      throw new AppError('Cart is empty. Add items before placing an order.', 400);
    }

    // Use a database transaction for atomicity
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create the order
      const orderResult = await client.query(orderQueries.createOrder, [
        DEFAULT_USER_ID,
        cart.subtotal,
        address.trim(),
      ]);
      const order = orderResult.rows[0];

      // Create order items and decrease stock
      for (const item of cart.items) {
        await client.query(orderQueries.createOrderItem, [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
        ]);

        // Decrease stock
        const stockResult = await client.query(orderQueries.decreaseStock, [
          item.quantity,
          item.product_id,
        ]);

        if (stockResult.rowCount === 0) {
          throw new AppError(
            `Insufficient stock for "${item.title}". Only ${item.stock} available.`,
            400
          );
        }
      }

      // Clear cart after successful order
      await client.query(cartQueries.clearCart, [cart.cart_id]);

      await client.query('COMMIT');

      // Return full order details
      return this.getOrderById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get order details by ID including order items
   */
  async getOrderById(orderId) {
    if (!orderId) {
      throw new AppError('Order ID is required', 400);
    }

    if (isInMemoryMode()) {
      const order = memStore.getOrderById(orderId);
      if (!order) throw new AppError('Order not found', 404);
      return order;
    }

    const orderResult = await pool.query(orderQueries.getOrderById, [orderId]);
    if (orderResult.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    const order = orderResult.rows[0];

    // Get order items with product details
    const itemsResult = await pool.query(orderQueries.getOrderItems, [orderId]);

    return {
      ...order,
      items: itemsResult.rows,
    };
  }
}

module.exports = new OrderService();
