const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middleware/auth');
const { uploadMaterial, uploadThumbnail } = require('../middleware/upload');

router.use(protect);

router.post('/', authorizeRoles('Trainer'), uploadThumbnail.single('thumbnail'), courseController.createCourse);
router.get('/my', authorizeRoles('Trainer'), courseController.getMyCourses);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', authorizeRoles('Trainer'), uploadThumbnail.single('thumbnail'), courseController.updateCourse);
router.post('/:id/thumbnail', authorizeRoles('Trainer'), uploadThumbnail.single('thumbnail'), courseController.uploadThumbnail);

router.patch('/:id/publish', authorizeRoles('Trainer'), courseController.publishCourse);
router.patch('/:id/archive', authorizeRoles('Trainer', 'Admin'), courseController.archiveCourse);

// Modules
router.post('/:id/modules', authorizeRoles('Trainer'), courseController.addModule);
router.patch('/:id/modules/reorder', authorizeRoles('Trainer'), courseController.reorderModules);
router.patch('/:id/modules/:moduleId', authorizeRoles('Trainer'), courseController.updateModule);
router.delete('/:id/modules/:moduleId', authorizeRoles('Trainer'), courseController.deleteModule);

// Lessons / Materials
router.post('/:id/modules/:moduleId/lessons', authorizeRoles('Trainer'), uploadMaterial.single('file'), courseController.addLesson);
router.patch('/:id/modules/:moduleId/lessons/:lessonId', authorizeRoles('Trainer'), uploadMaterial.single('file'), courseController.updateLesson);
router.delete('/:id/modules/:moduleId/lessons/:lessonId', authorizeRoles('Trainer'), courseController.deleteLesson);

module.exports = router;
