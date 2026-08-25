const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    
    if (course.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Cannot enroll in an unpublished course' });
    }

    const existingEnrollment = await Enrollment.findOne({ traineeId: req.user._id, courseId: req.params.id });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      traineeId: req.user._id,
      courseId: req.params.id
    });

    res.status(201).json({ success: true, message: 'Successfully enrolled', data: enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ traineeId: req.user._id }).populate({
      path: 'courseId',
      populate: { path: 'trainerId', select: 'name department' }
    });
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single enrollment status for a course
// @route   GET /api/courses/:id/enrollment
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ traineeId: req.user._id, courseId: req.params.id });
    if (!enrollment) {
      return res.status(200).json({ success: true, enrolled: false });
    }
    res.status(200).json({ success: true, enrolled: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress (mark lesson complete)
// @route   PATCH /api/enrollments/:id/progress
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId, progress, status } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    if (enrollment.traineeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    
    if (progress !== undefined) enrollment.progress = progress;
    if (status !== undefined) enrollment.status = status;

    await enrollment.save();
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all enrollments (Admin only)
// @route   GET /api/enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('traineeId', 'name email department')
      .populate('courseId', 'title category');
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainees for a trainer's course
// @route   GET /api/courses/:id/trainees
exports.getCourseTrainees = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    
    // Check if Trainer owns this course or is Admin
    if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const enrollments = await Enrollment.find({ courseId: req.params.id })
      .populate('traineeId', 'name email department designation');
    
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
