const express = require('express');
const router = express.Router();
const {
  uploadProductImage,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  getProductDetails,
  searchProducts,
} = require('../controllers/productController');

// Admin Routes
router.post('/admin/products/upload-image', uploadProductImage);
router.post('/admin/products/add', addProduct);
router.get('/admin/products/get', getAllProducts);
router.put('/admin/products/edit/:id', updateProduct);
router.delete('/admin/products/delete/:id', deleteProduct);

// Public Routes
router.get('/products/get', getFilteredProducts);
router.get('/products/get/:id', getProductDetails);
router.get('/search/:keyword', searchProducts);

module.exports = router;
