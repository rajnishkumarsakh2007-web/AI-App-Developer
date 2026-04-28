/**
 * Authentication Routes
 * Handles user registration, login, and token refresh
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, generateRefreshToken, comparePassword } = require('../utils/auth');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      const user = new User({ name, email, password });
      await user.save();
      logger.info(`New user registered: ${email}`);

      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: { id: user._id, name: user.name, email: user.email },
          token,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Registration error', { error: error.message });
      res.status(500).json({ success: false, message: 'Registration failed' });
    }
  }
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      logger.info(`User logged in: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
          token,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Login error', { error: error.message });
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('Get user error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const { verifyToken } = require('../utils/auth');
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newToken = generateToken(decoded.userId);
    res.status(200).json({ success: true, data: { token: newToken } });
  } catch (error) {
    logger.error('Token refresh error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to refresh token' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticateToken, (req, res) => {
  logger.info(`User logged out: ${req.userId}`);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
