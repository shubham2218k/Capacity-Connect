const express = require('express');
const router = express.Router();
const { registerTrainee, applyTrainer, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerTrainee);
router.post('/trainer-apply', applyTrainer);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

module.exports = router;
