const { pool, isInMemoryMode } = require('../config/db');
const memStore = require('../config/inMemoryStore');
const { productQueries } = require('../models/queries');
const { AppError } = require('../middleware/errorHandler');

/**
 * Product Service — Business logic for product operations
 * Supports both PostgreSQL and in-memory mode
 */
class ProductService {
  /**
   * Get all products, optionally filtered by category
   */
  async getAllProducts(category) {
    if (isInMemoryMode()) {
      return memStore.getAllProducts(category);
    }
    let result;
    if (category) {
      result = await pool.query(productQueries.getAllByCategory, [category]);
    } else {
      result = await pool.query(productQueries.getAll);
    }
    return result.rows;
  }

  /**
   * Get a single product by its ID
   */
  async getProductById(id) {
    if (isInMemoryMode()) {
      const product = memStore.getProductById(id);
      if (!product) throw new AppError('Product not found', 404);
      return product;
    }
    const result = await pool.query(productQueries.getById, [id]);
    if (result.rows.length === 0) {
      throw new AppError('Product not found', 404);
    }
    return result.rows[0];
  }

  /**
   * Search products by title (case-insensitive partial match)
   */
  async searchProducts(query) {
    if (!query || query.trim() === '') {
      throw new AppError('Search query is required', 400);
    }
    if (isInMemoryMode()) {
      return memStore.searchProducts(query.trim());
    }
    const searchTerm = `%${query.trim()}%`;
    const result = await pool.query(productQueries.search, [searchTerm]);
    return result.rows;
  }

  /**
   * Get all distinct product categories
   */
  async getCategories() {
    if (isInMemoryMode()) {
      return memStore.getCategories();
    }
    const result = await pool.query(productQueries.getCategories);
    return result.rows.map((row) => row.category);
  }
}

module.exports = new ProductService();
