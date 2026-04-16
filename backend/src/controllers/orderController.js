const orderService = require('../services/orderService');

/**
 * Order Controller — Handles HTTP requests for order operations
 */
const orderController = {
  /**
   * POST /api/orders
   * Create a new order from the current cart { address }
   */
  async createOrder(req, res, next) {
    try {
      const { address } = req.body;
      const order = await orderService.createOrder(address);
      res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/orders/:id
   * Get order details by ID
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
