const Course = require('../models/Course');
const path = require('path');
const fs = require('fs');

// Helper to check organization match
const verifyOrg = (user, course) => {
  const orgId = course.organization && course.organization._id ? course.organization._id : course.organization;
  return String(user.organizationId) === String(orgId);
};

// Helper to check course ownership
const verifyOwner = (user, course) => {
  const trainerId = course.trainer && course.trainer._id ? course.trainer._id : course.trainer;
  return String(user._id) === String(trainerId);
};

// Normalize lesson object into standard resource format
const normalizeResource = (course, mod, lesson) => {
  const trainerObj = typeof course.trainer === 'object' ? course.trainer : null;
  return {
    id: lesson._id,
    courseId: course._id,
    courseTitle: course.title,
    category: course.category,
    status: course.status,
    moduleId: mod._id,
    moduleTitle: mod.title,
    title: lesson.title,
    description: lesson.description || '',
    type: lesson.type,
    fileUrl: lesson.fileUrl || '',
    externalUrl: lesson.externalUrl || '',
    originalFilename: lesson.originalFilename || '',
    mimeType: lesson.mimeType || '',
    fileSize: lesson.fileSize || 0,
    duration: lesson.duration || '',
    trainerId: trainerObj ? trainerObj._id : course.trainer,
    trainerName: trainerObj ? trainerObj.name : 'Trainer',
    organizationId: course.organization,
    createdAt: lesson.createdAt || course.createdAt
  };
};

// GET /api/resources
exports.getResources = async (req, res, next) => {
  try {
    const role = req.user.role;
    let query = {};

    if (role === 'Trainee') {
      query = { organization: req.user.organizationId, status: 'published' };
    } else if (role === 'Trainer') {
      query = { trainer: req.user._id };
    } else if (role === 'Admin') {
      query = { organization: req.user.organizationId };
    } else {
      query = { organization: req.user.organizationId, status: 'published' };
    }

    const courses = await Course.find(query)
      .populate('trainer', 'name email designation department')
      .sort({ updatedAt: -1 });

    const resources = [];

    courses.forEach(course => {
      if (course.modules && course.modules.length > 0) {
        course.modules.forEach(mod => {
          if (mod.lessons && mod.lessons.length > 0) {
            mod.lessons.forEach(lesson => {
              resources.push(normalizeResource(course, mod, lesson));
            });
          }
        });
      }
    });

    resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,
      data: resources
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/resources/:courseId/:moduleId/:lessonId
exports.getResourceById = async (req, res, next) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    const course = await Course.findById(courseId).populate('trainer', 'name email designation department');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Access denied. Resource belongs to another organization.' });
    }

    if (req.user.role === 'Trainee' && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Resource not available.' });
    }

    if (req.user.role === 'Trainer' && !verifyOwner(req.user, course) && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Resource not available.' });
    }

    const mod = course.modules.id(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const lesson = mod.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson resource not found.' });
    }

    return res.json({
      success: true,
      data: normalizeResource(course, mod, lesson)
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/resources/:courseId/:moduleId/:lessonId/view
exports.viewResource = async (req, res, next) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Access denied. Resource belongs to another organization.' });
    }

    if (req.user.role === 'Trainee' && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Resource not available.' });
    }

    if (req.user.role === 'Trainer' && !verifyOwner(req.user, course) && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Resource not available.' });
    }

    const mod = course.modules.id(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const lesson = mod.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson resource not found.' });
    }

    if (lesson.type === 'link') {
      if (!lesson.externalUrl) {
        return res.status(404).json({ success: false, message: 'External link URL is missing.' });
      }
      return res.json({
        success: true,
        type: 'link',
        externalUrl: lesson.externalUrl
      });
    }

    if (!lesson.fileUrl) {
      return res.status(404).json({ success: false, message: 'Resource file is unavailable.' });
    }

    const filename = path.basename(lesson.fileUrl);
    const filePath = path.join(__dirname, '../../uploads/course-materials', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resource file is unavailable.' });
    }

    const mime = lesson.mimeType || (lesson.type === 'video' ? 'video/mp4' : lesson.type === 'pdf' ? 'application/pdf' : 'application/octet-stream');
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(lesson.originalFilename || lesson.title)}"`);

    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};

// GET /api/resources/:courseId/:moduleId/:lessonId/download
exports.downloadResource = async (req, res, next) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Access denied. Resource belongs to another organization.' });
    }

    if (req.user.role === 'Trainee' && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Resource not available.' });
    }

    if (req.user.role === 'Trainer' && !verifyOwner(req.user, course) && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Resource not available.' });
    }

    const mod = course.modules.id(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const lesson = mod.lessons.id(lessonId);
    if (!lesson || !lesson.fileUrl) {
      return res.status(400).json({ success: false, message: 'No downloadable file for this resource.' });
    }

    const filename = path.basename(lesson.fileUrl);
    const filePath = path.join(__dirname, '../../uploads/course-materials', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resource file is unavailable.' });
    }

    const downloadFilename = lesson.originalFilename || `${lesson.title.replace(/[^a-zA-Z0-9_-]/g, '_')}${path.extname(filename)}`;

    return res.download(filePath, downloadFilename);
  } catch (err) {
    next(err);
  }
};
