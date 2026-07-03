const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      title: String,
      price: Number,
      quantity: Number,
      mainImage: String,
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'credit_card', 'jazzcash'],
    default: 'cod',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate order ID before saving
OrderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = '#' + Date.now().toString().slice(-6);
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);