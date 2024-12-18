const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/reviewController');

// Review routes
router.post('/review/add', addReview);
router.get('/review/:productId', getProductReviews);

module.exports = router;
