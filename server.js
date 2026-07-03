// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware - SIRF EK BAAR (limit ke saath)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AS YOU WISH API is running' });
});

// Auth Routes
app.use('/api/auth', require('./src/routes/authRoutes'));

// Product Routes
app.use('/api/products', require('./src/routes/productRoutes'));

// Order Routes
app.use('/api/orders', require('./src/routes/orderRoutes'));

// Admin Routes
app.use('/api/admin', require('./src/routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});