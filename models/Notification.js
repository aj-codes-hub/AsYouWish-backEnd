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
  data: {
    orderId: { type: String },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      zipCode: { type: String },
    },
    total: { type: Number },
    items: { type: Number },
    products: [
      {
        title: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        mainImage: { type: String },
      }
    ],
    paymentMethod: { type: String },
    orderStatus: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);