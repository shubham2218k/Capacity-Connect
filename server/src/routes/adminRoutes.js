const express = require('express');
const router = express.Router();
const { 
  getPendingTrainers, 
  getTrainerById, 
  approveTrainer, 
  rejectTrainer,
  getUsers,
  getUserById,
  updateUserStatus
} = require('../controllers/adminController');
const { getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../middleware/auth');

// All routes in this file require Admin role
router.use(protect);
router.use(authorizeRoles('Admin'));

// Trainer Approval routes
router.get('/trainers/pending', getPendingTrainers);
router.get('/trainers/:id', getTrainerById);
router.patch('/trainers/:id/approve', approveTrainer);
router.patch('/trainers/:id/reject', rejectTrainer);

// General User Management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);

// Analytics
router.get('/analytics', getAdminAnalytics);

module.exports = router;
