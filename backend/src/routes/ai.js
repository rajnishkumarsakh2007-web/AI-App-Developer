/**
 * AI Routes
 * Handles AI code generation, optimization, and bug fixing
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const User = require('../models/User');

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4';

/**
 * POST /api/ai/generate
 * Generate code from prompt using OpenAI
 */
router.post('/generate',
  authenticateToken,
  [
    body('prompt').trim().notEmpty().withMessage('Prompt is required'),
    body('language').notEmpty().withMessage('Language is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { prompt, language, framework = '' } = req.body;

      const systemPrompt = `You are an expert full-stack developer. Generate production-ready code for the following request.
      Language: ${language}
      Framework: ${framework}
      
      Requirements:
      1. Generate clean, well-commented code
      2. Follow best practices and design patterns
      3. Include error handling
      4. Make it production-ready
      5. Return ONLY the code in JSON format
      
      Return in JSON format:
      {"files":[{"name":"filename","content":"code","language":"lang"}],"description":"desc"}`;

      if (!OPENAI_API_KEY) {
        return res.status(400).json({ success: false, message: 'OpenAI API key not configured' });
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedCode = response.data.choices[0].message.content;
      
      let parsedCode;
      try {
        parsedCode = JSON.parse(generatedCode);
      } catch (e) {
        parsedCode = {
          files: [{ name: 'main', content: generatedCode, language }],
          description: 'Generated code'
        };
      }

      await User.findByIdAndUpdate(req.userId, { $inc: { 'stats.aiGenerations': 1 } });
      logger.info(`Code generated for user: ${req.userId}`);

      res.status(200).json({
        success: true,
        message: 'Code generated successfully',
        data: parsedCode
      });
    } catch (error) {
      logger.error('AI generation error', { error: error.message });
      
      if (error.response?.status === 401) {
        return res.status(401).json({ success: false, message: 'OpenAI API key is invalid' });
      }

      res.status(500).json({ success: false, message: 'Failed to generate code' });
    }
  }
);

/**
 * POST /api/ai/optimize
 * Optimize existing code
 */
router.post('/optimize',
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

      const systemPrompt = `You are an expert code optimizer. Optimize the given ${language} code for performance, readability, and best practices. Return ONLY the optimized code without explanations.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: code }
          ],
          temperature: 0.7,
          max_tokens: 3000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const optimizedCode = response.data.choices[0].message.content;

      res.status(200).json({
        success: true,
        message: 'Code optimized successfully',
        data: { code: optimizedCode }
      });
    } catch (error) {
      logger.error('Code optimization error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to optimize code' });
    }
  }
);

/**
 * POST /api/ai/fix
 * Fix bugs in code
 */
router.post('/fix',
  authenticateToken,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required'),
    body('error').trim().notEmpty().withMessage('Error description is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { code, language, error } = req.body;

      const systemPrompt = `You are an expert ${language} debugger. Fix the following code based on the error provided. Return ONLY the fixed code with comments explaining the fix.\n\nError: ${error}`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: code }
          ],
          temperature: 0.7,
          max_tokens: 3000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const fixedCode = response.data.choices[0].message.content;

      res.status(200).json({
        success: true,
        message: 'Code fixed successfully',
        data: { code: fixedCode }
      });
    } catch (error) {
      logger.error('Code fixing error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to fix code' });
    }
  }
);

module.exports = router;
