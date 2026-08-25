const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  traineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    selectedAnswer: {
      type: String,
    },
    isCorrect: {
      type: Boolean,
    }
  }],
  score: {
    type: Number, // Absolute correct answers count
    default: 0,
  },
  percentage: {
    type: Number, // Out of 100
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Prevent duplicate attempts if required (for now, allow multiple or handle logic in controller)
// assessmentAttemptSchema.index({ assessmentId: 1, traineeId: 1 }, { unique: true });

const AssessmentAttempt = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
module.exports = AssessmentAttempt;
