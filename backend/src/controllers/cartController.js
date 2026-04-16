const cartService = require('../services/cartService');

/**
 * Cart Controller — Handles HTTP requests for cart operations
 */
const cartController = {
  /**
   * GET /api/cart
   * Get cart contents for the default user
   */
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCartItems();
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/cart/add
   * Add item to cart { product_id, quantity }
   */
  async addItem(req, res, next) {
    try {
      const { product_id, quantity } = req.body;
      const cart = await cartService.addItem(product_id, quantity || 1);
      res.status(201).json({ success: true, data: cart, message: 'Item added to cart' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/cart/update
   * Update cart item quantity { cart_item_id, quantity }
   */
  async updateItem(req, res, next) {
    try {
      const { cart_item_id, quantity } = req.body;
      const cart = await cartService.updateItem(cart_item_id, quantity);
      res.json({ success: true, data: cart, message: 'Cart updated' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/cart/remove/:id
   * Remove item from cart
   */
  async removeItem(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await cartService.removeItem(id);
      res.json({ success: true, data: cart, message: 'Item removed from cart' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
