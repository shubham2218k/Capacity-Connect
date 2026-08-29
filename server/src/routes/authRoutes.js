const express = require('express');
const {
  adminRegister,
  traineeRegister,
  trainerApply,
  trainerResubmit,
  validateKey,
  login,
  me
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadTrainerDocs } = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/admin-register', asyncHandler(adminRegister));
router.post('/trainee-register', asyncHandler(traineeRegister));
router.post('/register', asyncHandler(traineeRegister)); // alias kept for the existing frontend

// Trainer Apply & Resubmit with file upload support
router.post(
  '/trainer-apply',
  uploadTrainerDocs.fields([
    { name: 'qualificationProof', maxCount: 1 },
    { name: 'experienceProof', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
  ]),
  asyncHandler(trainerApply)
);

router.post(
  '/trainer-resubmit',
  uploadTrainerDocs.fields([
    { name: 'qualificationProof', maxCount: 1 },
    { name: 'experienceProof', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
  ]),
  asyncHandler(trainerResubmit)
);

router.post('/validate-key', asyncHandler(validateKey));
router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(protect), asyncHandler(me));

module.exports = router;
