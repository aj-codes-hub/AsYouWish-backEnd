// BackEnd/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env variables
dotenv.config();

const app = express();

// ✅ Debug
console.log('🔍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://as-you-wish-front.vercel.app',
    'https://as-you-wish-front-git-main-alijans-projects-41e85ffd.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AS YOU WISH API is running' });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// ✅ For Vercel
module.exports = app;

// ✅ For Local Development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  });
}