/**
 * Project Model
 * Defines the schema for AI-generated projects
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    thumbnail: String,
    icon: String,

    // Owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collaborators: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        role: {
          type: String,
          enum: ['viewer', 'editor', 'admin'],
          default: 'viewer'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // AI Generation
    prompt: {
      type: String,
      required: true
    },
    aiModel: {
      type: String,
      default: 'gpt-4',
      enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3']
    },
    generatedAt: Date,

    // Project Structure
    language: {
      type: String,
      enum: ['html', 'javascript', 'react', 'vue', 'python', 'node'],
      required: true
    },
    framework: String,
    dependencies: [String],

    // Code Files
    files: [
      {
        id: String,
        name: String,
        path: String,
        type: {
          type: String,
          enum: ['file', 'folder']
        },
        content: String,
        language: String,
        lastModified: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Project Status
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active'
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'private'
    },

    // Deployment
    deployment: {
      status: {
        type: String,
        enum: ['none', 'pending', 'active', 'failed'],
        default: 'none'
      },
      url: String,
      provider: String, // 'vercel', 'heroku', 'netlify', etc.
      deployedAt: Date,
      lastUpdatedAt: Date
    },

    // Statistics
    stats: {
      views: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      totalLines: { type: Number, default: 0 }
    },

    // Version Control
    version: {
      type: Number,
      default: 1
    },
    history: [
      {
        version: Number,
        changes: String,
        changedAt: Date,
        changedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    // Tags & Categories
    tags: [String],
    category: String,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ ownerId: 1, createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ visibility: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
