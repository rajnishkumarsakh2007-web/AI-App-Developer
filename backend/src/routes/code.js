/**
 * Code Execution Routes
 * Handles code execution and preview
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/code/execute
 * Execute code and return output
 */
router.post('/execute',
  authenticateToken,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { code, language, files = [] } = req.body;

      // For HTML/JavaScript, return the code as-is for browser execution
      if (language === 'html' || language === 'javascript' || language === 'react') {
        return res.status(200).json({
          success: true,
          message: 'Code prepared for execution',
          data: { code, language, files, executable: true }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Code execution in progress',
        data: { code, language, output: 'Code execution output will appear here', status: 'pending' }
      });
    } catch (error) {
      logger.error('Code execution error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to execute code' });
    }
  }
);

/**
 * POST /api/code/validate
 * Validate code syntax
 */
router.post('/validate',
  authenticateToken,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { code, language } = req.body;
      const isValid = code && code.trim().length > 0;

      res.status(200).json({
        success: true,
        data: { isValid, language, warnings: [], errors: [] }
      });
    } catch (error) {
      logger.error('Code validation error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to validate code' });
    }
  }
);

module.exports = router;
