/**
 * User Model
 * Defines the schema for user documents in MongoDB
 */

const mongoose = require('mongoose');
const { hashPassword } = require('../utils/auth');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    avatar: {
      type: String,
      default: null
    },

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // Profile
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    company: String,
    location: String,
    website: String,
    socialLinks: {
      github: String,
      twitter: String,
      linkedin: String
    },

    // Subscription
    subscription: {
      type: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
      },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'inactive'
      }
    },

    // Settings
    settings: {
      darkMode: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' }
    },

    // Usage Statistics
    stats: {
      projectsCreated: { type: Number, default: 0 },
      appsDeployed: { type: Number, default: 0 },
      aiGenerations: { type: Number, default: 0 },
      totalCodeLines: { type: Number, default: 0 }
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: Date
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
