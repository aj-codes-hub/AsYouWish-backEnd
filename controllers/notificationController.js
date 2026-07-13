// BackEnd/src/controllers/notificationController.js
const Notification = require('../models/Notification');

// ✅ Get all notifications with unread count
const getNotifications = async (req, res) => {
  try {
    const { filter } = req.query;
    let dateFilter = {};

    const now = new Date();
    switch (filter) {
      case '24hours':
        dateFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7days':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30days':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '3months':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    const notifications = await Notification.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(200);

    // ✅ CALCULATE UNREAD COUNT
    const unreadCount = notifications.filter(n => n.read === false).length;

    res.json({
      notifications,
      unreadCount,      // ✅ ADD THIS
      total: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single notification
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
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
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};