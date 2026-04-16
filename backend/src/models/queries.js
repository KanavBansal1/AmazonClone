/**
 * SQL Query Constants
 * Centralized location for all database queries used across services
 */

const productQueries = {
  // Get all products, optionally filtered by category
  getAll: `
    SELECT id, title, description, price, category, stock, images, rating, review_count, created_at
    FROM products
    ORDER BY created_at DESC
  `,

  getAllByCategory: `
    SELECT id, title, description, price, category, stock, images, rating, review_count, created_at
    FROM products
    WHERE LOWER(category) = LOWER($1)
    ORDER BY created_at DESC
  `,

  // Get a single product by ID
  getById: `
    SELECT id, title, description, price, category, stock, images, rating, review_count, created_at
    FROM products
    WHERE id = $1
  `,

  // Search products by title, description, or category (case-insensitive partial match)
  search: `
    SELECT id, title, description, price, category, stock, images, rating, review_count, created_at
    FROM products
    WHERE title ILIKE $1
       OR description ILIKE $1
       OR category ILIKE $1
    ORDER BY rating DESC, review_count DESC
  `,

  // Get all distinct categories
  getCategories: `
    SELECT DISTINCT category FROM products ORDER BY category
  `,
};

const cartQueries = {
  // Get or create cart for a user
  getCartByUserId: `
    SELECT id FROM carts WHERE user_id = $1
  `,

  createCart: `
    INSERT INTO carts (user_id) VALUES ($1) RETURNING id
  `,

  // Get all cart items with product details
  getCartItems: `
    SELECT
      ci.id,
      ci.quantity,
      p.id AS product_id,
      p.title,
      p.price,
      p.images,
      p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1
    ORDER BY ci.id
  `,

  // Add item to cart (upsert — increment quantity if exists)
  addItem: `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + $3
    RETURNING *
  `,

  // Update item quantity
  updateItem: `
    UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *
  `,

  // Remove item from cart
  removeItem: `
    DELETE FROM cart_items WHERE id = $1 RETURNING *
  `,

  // Clear all items in a cart
  clearCart: `
    DELETE FROM cart_items WHERE cart_id = $1
  `,
};

const orderQueries = {
  // Create a new order
  createOrder: `
    INSERT INTO orders (user_id, total_amount, address, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING *
  `,

  // Create order items from cart items
  createOrderItem: `
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,

  // Get order by ID with items
  getOrderById: `
    SELECT
      o.id,
      o.user_id,
      o.total_amount,
      o.address,
      o.status,
      o.created_at
    FROM orders o
    WHERE o.id = $1
  `,

  // Get order items with product details
  getOrderItems: `
    SELECT
      oi.id,
      oi.quantity,
      oi.price,
      p.id AS product_id,
      p.title,
      p.images
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `,

  // Decrease product stock after order
  decreaseStock: `
    UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1
  `,
};

module.exports = { productQueries, cartQueries, orderQueries };
