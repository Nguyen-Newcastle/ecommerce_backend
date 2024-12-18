const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require('../controllers/cartController');

// Cart routes
router.post('/cart/add', addToCart);
router.get('/cart/get/:userId', getCart);
router.put('/cart/update-cart', updateCart);
router.delete('/cart/:userId/:productId', removeFromCart);

module.exports = router;
