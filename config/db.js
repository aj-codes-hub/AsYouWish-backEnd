const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;