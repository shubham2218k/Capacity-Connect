const express = require('express');
const router = express.Router();
const { uploadResource, getResources, deleteResource } = require('../controllers/resourceController');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorizeRoles('Trainer'), upload.single('file'), uploadResource);
router.get('/', protect, getResources);
router.delete('/:id', protect, authorizeRoles('Trainer', 'Admin'), deleteResource);

module.exports = router;
