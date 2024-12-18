const pool = require('../db/db');

// Get total users
const getUsersTotal = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get total products
const getProductsTotal = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_products FROM products');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get total orders
const getOrdersTotal = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get total reviews
const getReviewsTotal = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total_reviews FROM productReviews');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get total revenue
const getOrdersRevenue = async (req, res) => {
  try {
    const result = await pool.query('SELECT SUM(totalAmount) AS total_revenue FROM orders');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get orders by period
const getOrdersByPeriod = async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const result = await pool.query(
      'SELECT COUNT(*) AS total_orders FROM orders WHERE orderDate BETWEEN $1 AND $2',
      [start_date, end_date]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get revenue by period
const getRevenueByPeriod = async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const result = await pool.query(
      'SELECT SUM(totalAmount) AS total_revenue FROM orders WHERE orderDate BETWEEN $1 AND $2',
      [start_date, end_date]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE orderId = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  try {
    await pool.query('UPDATE orders SET orderStatus = $1 WHERE orderId = $2', [orderStatus, id]);
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
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
};
