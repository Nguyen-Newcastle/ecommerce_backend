const pool = require('../db/db');

// Add a New Review
const addReview = async (req, res) => {
  const { userId, productId, reviewMessage, reviewValue } = req.body;

  try {
    // Check if the user has already reviewed this product
    const existingReview = await pool.query(
      'SELECT * FROM productReviews WHERE userId = $1 AND productId = $2',
      [userId, productId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if the user has purchased the product
    const order = await pool.query(
      'SELECT * FROM orders o JOIN cart_items ci ON o.cartId = ci.cartId WHERE o.userId = $1 AND ci.productId = $2',
      [userId, productId]
    );

    if (order.rows.length === 0) {
      return res.status(400).json({ message: 'You cannot review a product you have not purchased' });
    }

    // Add the review
    const newReview = await pool.query(
      'INSERT INTO productReviews (userId, productId, reviewMessage, reviewValue) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, productId, reviewMessage, reviewValue]
    );

    // Update the average review for the product
    await pool.query(
      'UPDATE products SET salePrice = (SELECT AVG(reviewValue) FROM productReviews WHERE productId = $1) WHERE productId = $1',
      [productId]
    );

    res.status(201).json({ message: 'Review added successfully', review: newReview.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add review', error });
  }
};

// Get Reviews for a Product
const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await pool.query(
      'SELECT pr.reviewId, pr.reviewMessage, pr.reviewValue, u.userName, pr.createdAt FROM productReviews pr JOIN users u ON pr.userId = u.userId WHERE pr.productId = $1 ORDER BY pr.createdAt DESC',
      [productId]
    );

    res.status(200).json(reviews.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve reviews', error });
  }
};

module.exports = {
  addReview,
  getProductReviews,
};
