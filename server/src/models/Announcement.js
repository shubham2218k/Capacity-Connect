const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true
    },
    organizationName: { type: String, trim: true, default: '' },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdByName: { type: String, trim: true, default: '' },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    // Who can see this announcement
    audience: {
      type: String,
      enum: ['all', 'trainees', 'trainers'],
      default: 'all'
    },

    // Visual classification
    type: {
      type: String,
      enum: ['announcement', 'important', 'learning-content', 'policy', 'event'],
      default: 'announcement'
    },

    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal'
    },

    // Soft delete
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for the most common query pattern: org-scoped, non-deleted, sorted newest first
announcementSchema.index({ organization: 1, isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
