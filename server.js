const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Required for `req.cookies`
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true })); // Adjust CORS settings if needed

// Routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);
app.use('/', reviewRoutes);

// Server Listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
