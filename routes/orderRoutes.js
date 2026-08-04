// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth'); // ✅ optionalAuth import karo
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
} = require('../controllers/orderController');

// ✅ PUBLIC ROUTE - Guest allowed (NO protect)
router.post('/', createOrder);  // 🔥 FIX: protect hatao!

// ✅ User routes (Login required)
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', optionalAuth, getOrderById); // Optional auth for viewing
router.put('/:id/cancel', protect, cancelOrder);

// ✅ Admin routes (Login required)
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;