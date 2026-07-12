// BackEnd/src/controllers/notificationController.js
const Notification = require('../models/Notification');

// ✅ Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    res.json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark all notifications as read
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};