// src/controllers/orderController.js
const Order = require('../models/Order');
const { sendOrderNotification } = require('../utils/emailService');
const Notification = require('../models/Notification');


const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus: 'pending',
    });

await Notification.create({
  title: '🛍️ New Order!',
  message: `Order #${order.orderId} received from ${shippingAddress.name}`,
  type: 'order',
  data: {
    orderId: order.orderId,
    customerName: shippingAddress.name,
    customerEmail: shippingAddress.email,
    customerPhone: shippingAddress.phone,
    shippingAddress: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      zipCode: shippingAddress.zipCode,
    },
    total: totalAmount,
    items: products.length,
    products: products.map(p => ({
      title: p.title,
      price: p.price,
      quantity: p.quantity,
      mainImage: p.mainImage,
    })),
    paymentMethod: paymentMethod,
    orderStatus: 'pending',
  },
});

    // ✅ Send email notification to admin
    await sendOrderNotification({
      customerName: shippingAddress.name,
      customerEmail: shippingAddress.email,
      orderId: order.orderId,
      total: totalAmount,
      items: products.length,
      products: products,
      shippingAddress: `${shippingAddress.address}, ${shippingAddress.city}`,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all orders (Admin only)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order (User only)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
};