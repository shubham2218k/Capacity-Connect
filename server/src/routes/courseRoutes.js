const express = require('express');
const router = express.Router();
const { 
  createCourse,
  getMyCourses,
  getAllCourses,
  getCourseById,
  updateCourse,
  publishCourse,
  deleteCourse,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/courseController');
const { enrollCourse, getEnrollmentStatus, getCourseTrainees } = require('../controllers/enrollmentController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Public/All authenticated users
router.get('/', protect, getAllCourses);
router.get('/my', protect, authorizeRoles('Trainer'), getMyCourses);
router.get('/:id', protect, getCourseById);

// Trainer restricted
router.post('/', protect, authorizeRoles('Trainer'), createCourse);
router.patch('/:id', protect, authorizeRoles('Trainer', 'Admin'), updateCourse);
router.post('/:id/publish', protect, authorizeRoles('Trainer', 'Admin'), publishCourse);
router.delete('/:id', protect, authorizeRoles('Trainer', 'Admin'), deleteCourse);
router.get('/:id/trainees', protect, authorizeRoles('Trainer', 'Admin'), getCourseTrainees);

// Trainee interactions
router.post('/:id/enroll', protect, authorizeRoles('Trainee'), enrollCourse);
router.get('/:id/enrollment', protect, authorizeRoles('Trainee'), getEnrollmentStatus);

// Modules
router.post('/:id/modules', protect, authorizeRoles('Trainer'), addModule);
router.patch('/:courseId/modules/:moduleId', protect, authorizeRoles('Trainer'), updateModule);
router.delete('/:courseId/modules/:moduleId', protect, authorizeRoles('Trainer'), deleteModule);

// Lessons
router.post('/:courseId/modules/:moduleId/lessons', protect, authorizeRoles('Trainer'), addLesson);
router.patch('/:courseId/modules/:moduleId/lessons/:lessonId', protect, authorizeRoles('Trainer'), updateLesson);
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', protect, authorizeRoles('Trainer'), deleteLesson);

module.exports = router;
