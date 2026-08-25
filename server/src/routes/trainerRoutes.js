const express = require('express');
const router = express.Router();
const { getTrainerAnalytics } = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/analytics', protect, authorizeRoles('Trainer'), getTrainerAnalytics);

module.exports = router;
