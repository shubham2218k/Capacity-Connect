const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  }
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  duration: {
    type: String, // e.g. "8 Weeks"
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  learningObjectives: [{
    type: String,
  }],
  skills: [{
    type: String,
  }],
  prerequisites: [{
    type: String,
  }],
  thumbnail: {
    type: String,
  },
  modules: [moduleSchema]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
