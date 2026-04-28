/**
 * Projects Routes
 * Handles CRUD operations for projects
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * GET /api/projects
 * Get all projects for authenticated user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ ownerId: req.userId, status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments({ ownerId: req.userId, status });

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get projects error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/',
  authenticateToken,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('prompt').trim().notEmpty().withMessage('Prompt is required'),
    body('language').isIn(['html', 'javascript', 'react', 'vue', 'python', 'node']).withMessage('Invalid language')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, description, prompt, language, files = [] } = req.body;

      const project = new Project({
        title,
        description,
        prompt,
        language,
        ownerId: req.userId,
        files: files.map(file => ({ ...file, id: uuidv4() })),
        generatedAt: new Date()
      });

      await project.save();
      await User.findByIdAndUpdate(req.userId, { $inc: { 'stats.projectsCreated': 1 } });

      logger.info(`Project created: ${project._id}`);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      logger.error('Create project error', { error: error.message });
      res.status(500).json({ success: false, message: 'Failed to create project' });
    }
  }
);

/**
 * GET /api/projects/:id
 * Get project by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('ownerId', 'name email avatar');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.visibility === 'private' && project.ownerId._id.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    project.stats.views += 1;
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    logger.error('Get project error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, files, status, visibility } = req.body;

    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.ownerId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (files) project.files = files;
    if (status) project.status = status;
    if (visibility) project.visibility = visibility;

    project.updatedAt = new Date();
    await project.save();

    logger.info(`Project updated: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    logger.error('Update project error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.ownerId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(id);
    logger.info(`Project deleted: ${id}`);

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    logger.error('Delete project error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

module.exports = router;
