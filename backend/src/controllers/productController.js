const productService = require('../services/productService');

/**
 * Product Controller — Handles HTTP requests for product operations
 */
const productController = {
  /**
   * GET /api/products
   * Get all products, optionally filtered by category
   */
  async getAll(req, res, next) {
    try {
      const { category } = req.query;
      const products = await productService.getAllProducts(category);
      res.json({ success: true, data: products, count: products.length });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/search?q=
   * Search products by title
   */
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const products = await productService.searchProducts(q);
      res.json({ success: true, data: products, count: products.length });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/categories
   * Get all distinct product categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   * Get a single product by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
