// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../../middleware/auth');
const {
  getAdminStats,
  getUsers,
  updateUser,
  deleteUser,
} = require('../../controllers/adminController');

// All routes require admin authentication
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;