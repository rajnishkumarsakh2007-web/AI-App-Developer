/**
 * Deployment Routes
 * Handles app deployment to cloud providers
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const Project = require('../models/Project');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/deployment/deploy
 * Deploy project to cloud
 */
router.post('/deploy',
  authenticateToken,
  [
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('provider').isIn(['vercel', 'netlify', 'heroku']).withMessage('Invalid provider')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { projectId, provider } = req.body;

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      if (project.ownerId.toString() !== req.userId) {
        return res.status(403).json({ success: false, message: 'Not authorized to deploy this project' });
      }

      project.deployment = {
        status: 'pending',
        provider,
        deployedAt: new Date()
      };
      await project.save();

      logger.info(`Deployment initiated for project: ${projectId}`);

      res.status(200).json({
        success: true,
        message: 'Deployment initiated',
        data: { projectId, provider, status: 'pending', estimatedTime: '2-5 minutes' }
      });
    } catch (error) {
      logger.error('Deployment error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to deploy project' });
    }
  }
);

/**
 * GET /api/deployment/status/:projectId
 * Get deployment status
 */
router.get('/status/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.ownerId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: project.deployment });
  } catch (error) {
    logger.error('Get deployment status error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to get deployment status' });
  }
});

module.exports = router;
