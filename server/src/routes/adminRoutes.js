const express = require('express');
const {
  getTrainerApplications,
  approveTrainer,
  rejectTrainer
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Everything below is Admin only.
router.use(asyncHandler(protect), authorizeRoles('Admin'));

router.get('/trainer-applications', asyncHandler(getTrainerApplications));
router.patch('/trainer-applications/:id/approve', asyncHandler(approveTrainer));
router.patch('/trainer-applications/:id/reject', asyncHandler(rejectTrainer));

module.exports = router;
