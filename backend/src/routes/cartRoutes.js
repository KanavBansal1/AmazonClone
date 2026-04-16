const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart — Get cart contents
router.get('/', cartController.getCart);

// POST /api/cart/add — Add item to cart
router.post('/add', cartController.addItem);

// PUT /api/cart/update — Update item quantity
router.put('/update', cartController.updateItem);

// DELETE /api/cart/remove/:id — Remove item from cart
router.delete('/remove/:id', cartController.removeItem);

module.exports = router;
