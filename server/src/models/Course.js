const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  type: {
    type: String,
    enum: ['video', 'pdf', 'document', 'presentation', 'link'],
    default: 'video'
  },
  fileUrl: { type: String, default: '' },
  originalFilename: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  externalUrl: { type: String, default: '' },
  duration: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    shortDescription: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    estimatedDuration: { type: String, trim: true, default: '' },
    learningObjectives: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    thumbnail: {
      url: { type: String, default: '' },
      filename: { type: String, default: '' }
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    modules: [moduleSchema],
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

// Virtual field for modules count
courseSchema.virtual('modulesCount').get(function () {
  return this.modules ? this.modules.length : 0;
});

// Virtual field for total lessons/resources count
courseSchema.virtual('resourcesCount').get(function () {
  if (!this.modules) return 0;
  return this.modules.reduce((total, mod) => total + (mod.lessons ? mod.lessons.length : 0), 0);
});

// Ensure virtuals are included when converting to JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
