const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders — Create a new order
router.post('/', orderController.createOrder);

// GET /api/orders/:id — Get order details
router.get('/:id', orderController.getOrderById);

module.exports = router;
