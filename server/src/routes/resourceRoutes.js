const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', resourceController.getResources);
router.get('/:courseId/:moduleId/:lessonId', resourceController.getResourceById);
router.get('/:courseId/:moduleId/:lessonId/view', resourceController.viewResource);
router.get('/:courseId/:moduleId/:lessonId/download', resourceController.downloadResource);

module.exports = router;
