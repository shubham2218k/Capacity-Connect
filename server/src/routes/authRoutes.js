const express = require('express');
const {
  adminRegister,
  traineeRegister,
  trainerApply,
  validateKey,
  login,
  me
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/admin-register', asyncHandler(adminRegister));
router.post('/trainee-register', asyncHandler(traineeRegister));
router.post('/register', asyncHandler(traineeRegister)); // alias kept for the existing frontend
router.post('/trainer-apply', asyncHandler(trainerApply));
router.post('/validate-key', asyncHandler(validateKey));
router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(protect), asyncHandler(me));

module.exports = router;
