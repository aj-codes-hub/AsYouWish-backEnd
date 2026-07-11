// BackEnd/src/models/Product.js
const mongoose = require('mongoose');

// ✅ ReviewSchema PEHLE define karo
const ReviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  mainImage: { type: String, default: '' },
  moreImages: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// ✅ Phir ProductSchema define karo
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  details: { type: String, required: true },
  mainImage: { type: String, required: true },
  moreImages: { type: [String], default: [] },
  category: { type: String, required: true },
  stock: { type: Number, default: 10 },
  isFeatured: { type: Boolean, default: false },
  fabricType: { type: String, default: '' },
  productType: { type: String, default: '' },
  designType: { type: String, default: '' },
  pieces: { type: String, default: '' },
  color: { type: String, default: '' },
  size: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  Event: { type: String, default: '' },
  // ✅ ReviewSchema ab accessible hai
  review: { type: [ReviewSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);