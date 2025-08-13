const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profile
router.get('/profile', authMiddleware, authController.getProfile);

// routes/authRoutes.js (or profileRoutes.js)
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
