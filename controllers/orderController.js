const pool = require('../db/db');

// Create a New Order
const createOrder = async (req, res) => {
  const { userId, cartId, totalAmount, paymentMethod } = req.body;

  try {
    // Create a new order
    const newOrder = await pool.query(
      'INSERT INTO orders (userId, cartId, totalAmount, paymentMethod, orderStatus) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, cartId, totalAmount, paymentMethod, 'pending']
    );

    res.status(201).json({ message: 'Order created successfully', order: newOrder.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

// Capture Payment and Update Order Status
const capturePayment = async (req, res) => {
  const { orderId, paymentId, payerId } = req.body;

  try {
    // Update the order status and payment details
    await pool.query(
      'UPDATE orders SET paymentStatus = $1, orderStatus = $2, paymentId = $3, payerId = $4 WHERE orderId = $5',
      ['paid', 'completed', paymentId, payerId, orderId]
    );

    res.status(200).json({ message: 'Payment captured and order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to capture payment', error });
  }
};

// Get All Orders for a Specific User
const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE userId = $1 ORDER BY orderDate DESC',
      [userId]
    );

    res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
};

// Get Order Details by ID
const getOrderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await pool.query('SELECT * FROM orders WHERE orderId = $1', [id]);
    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve order details', error });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getUserOrders,
  getOrderDetails,
};
