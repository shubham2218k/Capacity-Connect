const Course = require('../models/Course');

// @desc    Create a new course
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body, trainerId: req.user._id };
    const course = await Course.create(courseData);
    res.status(201).json({ success: true, message: 'Course created successfully', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get courses for the logged-in trainer
// @route   GET /api/courses/my
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ trainerId: req.user._id });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all courses (Admin sees all, Trainees see published)
// @route   GET /api/courses
exports.getAllCourses = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'Trainee') {
      query.status = 'published';
    }
    
    // Optional: filter by category/difficulty if passed in query
    if (req.query.category) query.category = req.query.category;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;

    const courses = await Course.find(query).populate('trainerId', 'name designation department');
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('trainerId', 'name designation department');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    
    // Privacy check: If trainee, course must be published
    if (req.user && req.user.role === 'Trainee' && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Course is not published yet' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course details
// @route   PATCH /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Make sure user owns the course (or is Admin)
    if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Course updated', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish a course
// @route   POST /api/courses/:id/publish
exports.publishCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to publish this course' });
    }

    course.status = 'published';
    await course.save();

    res.status(200).json({ success: true, message: 'Course published successfully', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course (draft only usually)
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    if (course.status !== 'draft' && req.user.role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Only draft courses can be deleted by trainer' });
    }

    await course.deleteOne();
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- MODULE & LESSON MANAGEMENT ---

// @desc    Add a module to course
// @route   POST /api/courses/:id/modules
exports.addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.trainerId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    course.modules.push(req.body);
    await course.save();
    res.status(201).json({ success: true, message: 'Module added', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a module
// @route   PATCH /api/courses/:courseId/modules/:moduleId
exports.updateModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.trainerId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    Object.assign(module, req.body);
    await course.save();
    res.status(200).json({ success: true, message: 'Module updated', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a module
// @route   DELETE /api/courses/:courseId/modules/:moduleId
exports.deleteModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.trainerId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    course.modules.pull(req.params.moduleId);
    await course.save();
    res.status(200).json({ success: true, message: 'Module deleted', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a lesson to module
// @route   POST /api/courses/:courseId/modules/:moduleId/lessons
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.trainerId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    module.lessons.push(req.body);
    await course.save();
    res.status(201).json({ success: true, message: 'Lesson added', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a lesson
// @route   PATCH /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
exports.updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.trainerId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    Object.assign(lesson, req.body);
    await course.save();
    res.status(200).json({ success: true, message: 'Lesson updated', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
exports.deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.trainerId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    module.lessons.pull(req.params.lessonId);
    await course.save();
    res.status(200).json({ success: true, message: 'Lesson deleted', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
