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

console.log('🔍 Environment variables loaded:');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  - PORT:', process.env.PORT || '5000 (default)');

const app = express();

// ✅ Connect to MongoDB (with error handling)
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // ✅ Don't exit - Vercel will handle it
  }
};

startServer();

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