const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const AssessmentAttempt = require('../models/AssessmentAttempt');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const traineesCount = await User.countDocuments({ role: 'Trainee' });
    const trainersCount = await User.countDocuments({ role: 'Trainer', status: 'active' });
    const pendingTrainersCount = await User.countDocuments({ role: 'Trainer', status: 'pending' });
    const coursesCount = await Course.countDocuments();
    const enrollmentsCount = await Enrollment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: usersCount,
        trainees: traineesCount,
        trainers: trainersCount,
        pendingTrainers: pendingTrainersCount,
        courses: coursesCount,
        enrollments: enrollmentsCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Trainer Dashboard Analytics
// @route   GET /api/trainer/analytics
exports.getTrainerAnalytics = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const coursesCount = await Course.countDocuments({ trainerId });
    const courses = await Course.find({ trainerId }).select('_id');
    const courseIds = courses.map(c => c._id);
    
    const enrollmentsCount = await Enrollment.countDocuments({ courseId: { $in: courseIds } });
    
    // For simplicity, total assessments created
    const Assessment = require('../models/Assessment');
    const assessmentsCount = await Assessment.countDocuments({ trainerId });

    res.status(200).json({
      success: true,
      data: {
        activeCourses: coursesCount,
        totalTrainees: enrollmentsCount, // Approximation
        assessments: assessmentsCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
