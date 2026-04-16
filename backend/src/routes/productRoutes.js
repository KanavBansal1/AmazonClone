const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/search?q= — Must be before /:id to avoid conflict
router.get('/search', productController.search);

// GET /api/products/categories — Get all categories
router.get('/categories', productController.getCategories);

// GET /api/products — List all products (supports ?category= filter)
router.get('/', productController.getAll);

// GET /api/products/:id — Get single product
router.get('/:id', productController.getById);

module.exports = router;
