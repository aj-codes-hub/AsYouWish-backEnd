// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAdminStats,
  getUsers,
  updateUser,
  deleteUser,
  getAllUsers,
} = require('../controllers/adminController');


const {
  getNotifications,
  getNotificationById, 
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require('../controllers/notificationController');

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);
router.delete('/notifications/:id', deleteNotification);
router.get('/notifications/:id', getNotificationById);



// All routes require admin authentication
router.use(protect, admin);
router.get('/stats', getAdminStats);
router.get('/users', protect, admin, getAllUsers, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', deleteUser);



module.exports = router;