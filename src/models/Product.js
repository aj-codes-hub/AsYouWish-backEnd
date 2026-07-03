const mongoose = require('mongoose');

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
  reviews: { type: [Object], default: [] },
  Event: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);