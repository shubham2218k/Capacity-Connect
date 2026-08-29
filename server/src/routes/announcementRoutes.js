const express = require('express');
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorizeRoles } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// All announcement routes require authentication
router.use(asyncHandler(protect));

// Any authenticated user can read their org's announcements (audience-filtered)
router.get('/', asyncHandler(getAnnouncements));

// Only Admins can create, edit, delete
router.post('/', authorizeRoles('Admin'), asyncHandler(createAnnouncement));
router.patch('/:id', authorizeRoles('Admin'), asyncHandler(updateAnnouncement));
router.delete('/:id', authorizeRoles('Admin'), asyncHandler(deleteAnnouncement));

module.exports = router;
