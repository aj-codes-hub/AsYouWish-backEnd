// BackEnd/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const productController = require('../controllers/productController');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,  // ✅ NEW
} = require('../controllers/productController');

// ✅ Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// ✅ Admin routes
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;