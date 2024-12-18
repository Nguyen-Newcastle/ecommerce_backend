const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', verifyToken, checkAuth);

module.exports = router;
