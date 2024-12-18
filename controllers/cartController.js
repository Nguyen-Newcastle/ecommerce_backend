const pool = require('../db/db');

// Add to Cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    // Check if cart exists for the user
    let cart = await pool.query('SELECT * FROM carts WHERE userId = $1', [userId]);
    if (cart.rows.length === 0) {
      // Create a new cart for the user
      cart = await pool.query(
        'INSERT INTO carts (userId) VALUES ($1) RETURNING *',
        [userId]
      );
    }

    const cartId = cart.rows[0].cartid;

    // Check if product is already in the cart
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE cartId = $1 AND productId = $2',
      [cartId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity if product already exists in the cart
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cartId = $2 AND productId = $3',
        [quantity, cartId, productId]
      );
    } else {
      // Add new product to the cart
      await pool.query(
        'INSERT INTO cart_items (cartId, productId, quantity) VALUES ($1, $2, $3)',
        [cartId, productId, quantity]
      );
    }

    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
};

// Get Cart
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Retrieve the cart for the user
    const cart = await pool.query(
      'SELECT ci.cartItemId, ci.productId, ci.quantity, p.title, p.price, p.image FROM cart_items ci JOIN carts c ON ci.cartId = c.cartId JOIN products p ON ci.productId = p.productId WHERE c.userId = $1',
      [userId]
    );

    res.status(200).json(cart.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve cart', error });
  }
};

// Update Cart
const updateCart = async (req, res) => {
  const { cartItemId, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE cartItemId = $2',
      [quantity, cartItemId]
    );
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart', error });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Retrieve the cart ID for the user
    const cart = await pool.query('SELECT * FROM carts WHERE userId = $1', [userId]);
    if (cart.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = cart.rows[0].cartid;

    // Remove the product from the cart
    await pool.query('DELETE FROM cart_items WHERE cartId = $1 AND productId = $2', [
      cartId,
      productId,
    ]);

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove product from cart', error });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
};
