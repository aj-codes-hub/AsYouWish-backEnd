// BackEnd/src/controllers/productController.js
const Product = require('../models/Product');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload image to Cloudinary
const uploadToCloudinary = async (base64Image, folder = 'as-you-wish/products') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// ✅ Delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    // Remove folder prefix
    const cleanPublicId = `as-you-wish/products/${publicId.split('/').pop()}`;
    await cloudinary.uploader.destroy(cleanPublicId);
    console.log('✅ Image deleted from Cloudinary:', cleanPublicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

// ✅ Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Create product with Cloudinary upload
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        // ✅ Upload main image to Cloudinary
        if (productData.mainImage && productData.mainImage.startsWith('data:image')) {
            const mainImageUrl = await uploadToCloudinary(productData.mainImage);
            productData.mainImage = mainImageUrl;
        }
        
        // ✅ Upload more images to Cloudinary
        if (productData.moreImages && productData.moreImages.length > 0) {
            const moreImageUrls = [];
            for (const img of productData.moreImages) {
                if (img && img.startsWith('data:image')) {
                    const url = await uploadToCloudinary(img);
                    moreImageUrls.push(url);
                } else {
                    moreImageUrls.push(img);
                }
            }
            productData.moreImages = moreImageUrls;
        }
        
        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update product with Cloudinary upload
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const updateData = req.body;
        
        // ✅ Check if main image is new (base64) and upload to Cloudinary
        if (updateData.mainImage && updateData.mainImage.startsWith('data:image')) {
            // Delete old image from Cloudinary
            if (product.mainImage && product.mainImage.includes('cloudinary')) {
                await deleteFromCloudinary(product.mainImage);
            }
            const mainImageUrl = await uploadToCloudinary(updateData.mainImage);
            updateData.mainImage = mainImageUrl;
        }
        
        // ✅ Check if more images are new (base64) and upload to Cloudinary
        if (updateData.moreImages && updateData.moreImages.length > 0) {
            const moreImageUrls = [];
            for (const img of updateData.moreImages) {
                if (img && img.startsWith('data:image')) {
                    const url = await uploadToCloudinary(img);
                    moreImageUrls.push(url);
                } else {
                    moreImageUrls.push(img);
                }
            }
            updateData.moreImages = moreImageUrls;
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete product with Cloudinary image deletion
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // ✅ Delete main image from Cloudinary
        if (product.mainImage && product.mainImage.includes('cloudinary')) {
            await deleteFromCloudinary(product.mainImage);
        }
        
        // ✅ Delete more images from Cloudinary
        if (product.moreImages && product.moreImages.length > 0) {
            for (const img of product.moreImages) {
                if (img && img.includes('cloudinary')) {
                    await deleteFromCloudinary(img);
                }
            }
        }
        
        await product.deleteOne();
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};