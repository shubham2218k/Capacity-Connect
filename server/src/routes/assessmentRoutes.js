const express = require('express');
const router = express.Router();
const { 
  createAssessment,
  getTrainerAssessments,
  getAssessmentById,
  updateAssessment,
  submitAssessment,
  getAssessmentResults
} = require('../controllers/assessmentController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.post('/', protect, authorizeRoles('Trainer'), createAssessment);
router.get('/trainer', protect, authorizeRoles('Trainer'), getTrainerAssessments);
router.get('/:id', protect, getAssessmentById);
router.patch('/:id', protect, authorizeRoles('Trainer', 'Admin'), updateAssessment);

// Trainee routes
router.post('/:id/submit', protect, authorizeRoles('Trainee'), submitAssessment);

// Trainer routes for results
router.get('/:id/results', protect, authorizeRoles('Trainer', 'Admin'), getAssessmentResults);

module.exports = router;
