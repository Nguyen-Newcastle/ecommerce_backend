const express = require('express');
const router = express.Router();
const {
  createOrder,
  capturePayment,
  getUserOrders,
  getOrderDetails,
} = require('../controllers/orderController');

// Order routes
router.post('/order/create', createOrder);
router.post('/order/capture', capturePayment);
router.get('/order/list/:userId', getUserOrders);
router.get('/order/details/:id', getOrderDetails);

module.exports = router;
