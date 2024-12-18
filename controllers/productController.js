const pool = require('../db/db');
const cloudinary = require('../config/cloudinary');

// Upload Product Image
const uploadProductImage = async (req, res) => {
  try {
    const file = req.files.image; // Ensure you use a middleware like multer to handle file uploads
    const result = await cloudinary.uploader.upload(file.path);
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

// Add Product
const addProduct = async (req, res) => {
  const { title, description, category, brand, price, salePrice, totalStock, image } = req.body;

  try {
    const newProduct = await pool.query(
      'INSERT INTO products (title, description, category, brand, price, salePrice, totalStock, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, category, brand, price, salePrice, totalStock, image]
    );
    res.status(201).json({ message: 'Product added successfully', product: newProduct.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error });
  }
};

// Get All Products (Admin)
const getAllProducts = async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products');
    res.status(200).json(products.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products', error });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, brand, price, salePrice, totalStock, image } = req.body;

  try {
    await pool.query(
      'UPDATE products SET title = $1, description = $2, category = $3, brand = $4, price = $5, salePrice = $6, totalStock = $7, image = $8 WHERE productId = $9',
      [title, description, category, brand, price, salePrice, totalStock, image, id]
    );
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE productId = $1', [id]);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

// Get Filtered Products (Public)
const getFilteredProducts = async (req, res) => {
  const { category, brand, sortBy } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = $1';
    params.push(category);
  }

  if (brand) {
    query += params.length ? ' AND brand = $2' : ' AND brand = $1';
    params.push(brand);
  }

  if (sortBy === 'price-lowtohigh') {
    query += ' ORDER BY price ASC';
  } else if (sortBy === 'price-hightolow') {
    query += ' ORDER BY price DESC';
  }

  try {
    const products = await pool.query(query, params);
    res.status(200).json(products.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter products', error });
  }
};

// Get Product Details
const getProductDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await pool.query('SELECT * FROM products WHERE productId = $1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve product details', error });
  }
};

// Search Products by Keyword
const searchProducts = async (req, res) => {
  const { keyword } = req.params;

  try {
    const products = await pool.query(
      'SELECT * FROM products WHERE title ILIKE $1 OR description ILIKE $1',
      [`%${keyword}%`]
    );
    res.status(200).json(products.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search products', error });
  }
};

module.exports = {
  uploadProductImage,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  getProductDetails,
  searchProducts,
};
