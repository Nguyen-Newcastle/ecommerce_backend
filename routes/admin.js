const express = require('express');
const router = express.Router();
const {
  getUsersTotal,
  getProductsTotal,
  getOrdersTotal,
  getReviewsTotal,
  getOrdersRevenue,
  getOrdersByPeriod,
  getRevenueByPeriod,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} = require('../controllers/adminController');

// API Endpoints
router.get('/users/total', getUsersTotal);
router.get('/products/total', getProductsTotal);
router.get('/orders/total', getOrdersTotal);
router.get('/reviews/total', getReviewsTotal);
router.get('/orders/revenue', getOrdersRevenue);
router.get('/orders/period', getOrdersByPeriod);
router.get('/revenue/period', getRevenueByPeriod);
router.get('/orders/get', getAllOrders);
router.get('/orders/details/:id', getOrderDetails);
router.put('/orders/update/:id', updateOrderStatus);

module.exports = router;
