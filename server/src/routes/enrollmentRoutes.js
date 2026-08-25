const express = require('express');
const router = express.Router();
const { 
  enrollCourse, 
  getMyEnrollments, 
  getEnrollmentStatus, 
  updateProgress, 
  getAllEnrollments, 
  getCourseTrainees 
} = require('../controllers/enrollmentController');
const { protect, authorizeRoles } = require('../middleware/auth');

// We will mount course specific enrollment routes in courseRoutes or app.js as custom mount point.
// However, to keep it simple, we can put standard enrollment routes here.

router.get('/', protect, authorizeRoles('Admin'), getAllEnrollments);
router.get('/my', protect, authorizeRoles('Trainee'), getMyEnrollments);
router.patch('/:id/progress', protect, authorizeRoles('Trainee'), updateProgress);

module.exports = router;
