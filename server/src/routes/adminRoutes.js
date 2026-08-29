const express = require('express');
const {
  getTrainerApplications,
  getTrainerApplicationById,
  updateTrainerChecklist,
  approveTrainer,
  requestTrainerChanges,
  rejectTrainer,
  streamTrainerDocument,
  getOrganizationUsers,
  getUserById,
  suspendUser,
  reactivateUser,
  deleteUser,
  getAdminDashboard
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Everything below is Admin only.
router.use(asyncHandler(protect), authorizeRoles('Admin'));

// Admin Dashboard Route
router.get('/dashboard', asyncHandler(getAdminDashboard));

// Trainer Approval & Inspection Routes
router.get('/trainer-applications', asyncHandler(getTrainerApplications));
router.get('/trainer-applications/:id', asyncHandler(getTrainerApplicationById));
router.patch('/trainer-applications/:id/review-checklist', asyncHandler(updateTrainerChecklist));
router.patch('/trainer-applications/:id/approve', asyncHandler(approveTrainer));
router.patch('/trainer-applications/:id/request-changes', asyncHandler(requestTrainerChanges));
router.patch('/trainer-applications/:id/reject', asyncHandler(rejectTrainer));
router.get('/trainer-applications/:id/documents/:docId', asyncHandler(streamTrainerDocument));

// User Management Routes
router.get('/users', asyncHandler(getOrganizationUsers));
router.get('/users/:id', asyncHandler(getUserById));
router.patch('/users/:id/suspend', asyncHandler(suspendUser));
router.patch('/users/:id/reactivate', asyncHandler(reactivateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

module.exports = router;
