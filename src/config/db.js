// BackEnd/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ✅ Debug - Check if URI exists
    console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ NOT FOUND');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // ✅ Don't exit process in serverless
    throw error;
  }
};

module.exports = connectDB;