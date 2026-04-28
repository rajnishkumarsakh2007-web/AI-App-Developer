/**
 * Authentication middleware
 * Protects routes by verifying JWT tokens
 */

const { verifyToken } = require('../utils/auth');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user ID to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = { authenticateToken };
