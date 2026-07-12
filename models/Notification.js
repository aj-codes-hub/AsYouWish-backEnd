// BackEnd/src/models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['order', 'inventory', 'system', 'alert'], 
    default: 'order' 
  },
  read: { type: Boolean, default: false },
  data: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);