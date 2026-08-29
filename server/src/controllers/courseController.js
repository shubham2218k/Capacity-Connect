const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

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

// Helper to safely delete file from disk if it exists
const deleteFileIfExists = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filename = path.basename(fileUrl);
    let filePath;
    if (fileUrl.includes('thumbnails')) {
      filePath = path.join(__dirname, '../../uploads/thumbnails', filename);
    } else {
      filePath = path.join(__dirname, '../../uploads/course-materials', filename);
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error('Failed to cleanup file:', fileUrl, e.message);
  }
};

// POST /api/courses
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDescription,
      description,
      detailedDescription,
      difficulty,
      estimatedDuration,
      duration,
      learningObjectives,
      objectives,
      skills
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required.' });
    }

    let thumbnail = { url: '', filename: '' };
    if (req.file) {
      thumbnail = {
        url: `/uploads/thumbnails/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    const newCourse = await Course.create({
      title,
      category,
      shortDescription: shortDescription || description || '',
      description: detailedDescription || description || shortDescription || '',
      difficulty: difficulty || 'Beginner',
      estimatedDuration: estimatedDuration || duration || '',
      learningObjectives: learningObjectives || objectives || [],
      skills: skills || [],
      thumbnail,
      trainer: req.user._id,
      organization: req.user.organizationId,
      status: 'draft',
      modules: []
    });

    return res.status(201).json({
      success: true,
      message: 'Course created as draft.',
      data: newCourse
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/my
exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ trainer: req.user._id })
      .populate('trainer', 'name email designation')
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      data: courses
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses
exports.getCourses = async (req, res, next) => {
  try {
    const query = { organization: req.user.organizationId };

    if (req.user.role === 'Trainee') {
      query.status = 'published';
    } else if (req.user.role === 'Trainer') {
      // Return published courses or courses created by current trainer
      query.$or = [
        { status: 'published' },
        { trainer: req.user._id }
      ];
      delete query.organization;
      query.$and = [
        { organization: req.user.organizationId }
      ];
    }

    const courses = await Course.find(query)
      .populate('trainer', 'name email designation')
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      data: courses
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('trainer', 'name email designation department qualification');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Organization check
    if (!verifyOrg(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Access denied. Course belongs to another organization.' });
    }

    // Trainee access rule: must be published
    if (req.user.role === 'Trainee' && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'This course is not available.' });
    }

    // Trainer access rule: owner can view any status, non-owner can view published only
    if (req.user.role === 'Trainer' && !verifyOwner(req.user, course) && course.status !== 'published') {
      return res.status(403).json({ success: false, message: "Not authorized to view another trainer's draft or archived course." });
    }

    return res.json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'You can only edit your own courses.' });
    }

    const allowedFields = [
      'title', 'shortDescription', 'description', 'detailedDescription',
      'category', 'difficulty', 'estimatedDuration', 'duration',
      'learningObjectives', 'objectives', 'skills'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'duration') course.estimatedDuration = req.body[field];
        else if (field === 'detailedDescription') course.description = req.body[field];
        else if (field === 'objectives') course.learningObjectives = req.body[field];
        else course[field] = req.body[field];
      }
    });

    if (req.file) {
      if (course.thumbnail && course.thumbnail.url) {
        deleteFileIfExists(course.thumbnail.url);
      }
      course.thumbnail = {
        url: `/uploads/thumbnails/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    await course.save();

    return res.json({
      success: true,
      message: 'Course updated successfully.',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/courses/:id/modules
exports.addModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    const title = req.body.title || `Module ${course.modules.length + 1}`;
    const description = req.body.description || '';
    const order = course.modules.length + 1;

    course.modules.push({ title, description, order, lessons: [] });
    await course.save();

    const createdModule = course.modules[course.modules.length - 1];

    return res.status(201).json({
      success: true,
      data: createdModule
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id/modules/:moduleId
exports.updateModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    if (req.body.title !== undefined) mod.title = req.body.title;
    if (req.body.description !== undefined) mod.description = req.body.description;
    if (req.body.order !== undefined) mod.order = req.body.order;

    await course.save();

    return res.json({
      success: true,
      message: 'Module updated.',
      data: mod
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id/modules/:moduleId
exports.deleteModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    // Unlink lesson files inside this module
    if (mod.lessons && mod.lessons.length > 0) {
      mod.lessons.forEach(lesson => {
        if (lesson.fileUrl) {
          deleteFileIfExists(lesson.fileUrl);
        }
      });
    }

    course.modules.pull(req.params.moduleId);

    // Re-index orders
    course.modules.forEach((m, idx) => { m.order = idx + 1; });

    await course.save();

    return res.json({
      success: true,
      message: 'Module deleted.'
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id/modules/reorder
exports.reorderModules = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    // Expecting array of { moduleId, order } or array of moduleIds
    const { moduleOrders } = req.body;
    if (Array.isArray(moduleOrders)) {
      moduleOrders.forEach((item, index) => {
        const modId = typeof item === 'object' ? item.moduleId : item;
        const newOrder = typeof item === 'object' ? item.order : index + 1;
        const mod = course.modules.id(modId);
        if (mod) {
          mod.order = newOrder;
        }
      });
      // Sort modules in array by order
      course.modules.sort((a, b) => a.order - b.order);
      await course.save();
    }

    return res.json({
      success: true,
      data: course.modules
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/courses/:id/modules/:moduleId/lessons
exports.addLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const { title, description, type, duration, externalUrl } = req.body;
    if (!title || !title.trim()) {
      if (req.file) deleteFileIfExists(`/uploads/course-materials/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Material title is required.' });
    }

    const lessonType = type || (req.file ? (req.file.mimetype.startsWith('video/') ? 'video' : 'pdf') : 'link');

    if (lessonType === 'link') {
      if (!externalUrl || !externalUrl.trim()) {
        if (req.file) deleteFileIfExists(`/uploads/course-materials/${req.file.filename}`);
        return res.status(400).json({ success: false, message: 'External URL is required for link resources.' });
      }
    } else {
      if (!req.file) {
        return res.status(400).json({ success: false, message: `File upload is required for ${lessonType} learning materials.` });
      }
    }

    let fileUrl = '';
    let originalFilename = '';
    let mimeType = '';
    let fileSize = 0;

    if (req.file) {
      fileUrl = `/uploads/course-materials/${req.file.filename}`;
      originalFilename = req.file.originalname;
      mimeType = req.file.mimetype;
      fileSize = req.file.size;
    }

    const lessonData = {
      title: title.trim(),
      description: description || '',
      type: lessonType,
      fileUrl,
      originalFilename,
      mimeType,
      fileSize,
      externalUrl: externalUrl || '',
      duration: duration || '',
      order: mod.lessons.length + 1
    };

    mod.lessons.push(lessonData);
    await course.save();

    const createdLesson = mod.lessons[mod.lessons.length - 1];

    return res.status(201).json({
      success: true,
      data: createdLesson
    });
  } catch (err) {
    if (req.file) deleteFileIfExists(`/uploads/course-materials/${req.file.filename}`);
    next(err);
  }
};

// PATCH /api/courses/:id/modules/:moduleId/lessons/:lessonId
exports.updateLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const lesson = mod.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    const targetType = req.body.type !== undefined ? req.body.type : lesson.type;
    const targetUrl = req.body.externalUrl !== undefined ? req.body.externalUrl : lesson.externalUrl;

    if (targetType === 'link') {
      if (!targetUrl || !targetUrl.trim()) {
        if (req.file) deleteFileIfExists(`/uploads/course-materials/${req.file.filename}`);
        return res.status(400).json({ success: false, message: 'External URL is required for link resources.' });
      }
    } else {
      if (!req.file && !lesson.fileUrl) {
        return res.status(400).json({ success: false, message: `File upload is required for ${targetType} learning materials.` });
      }
    }

    if (req.body.title !== undefined) lesson.title = req.body.title;
    if (req.body.description !== undefined) lesson.description = req.body.description;
    if (req.body.duration !== undefined) lesson.duration = req.body.duration;
    if (req.body.externalUrl !== undefined) lesson.externalUrl = req.body.externalUrl;
    if (req.body.type !== undefined) lesson.type = req.body.type;

    if (req.file) {
      // Clean up previous file if any
      if (lesson.fileUrl) {
        deleteFileIfExists(lesson.fileUrl);
      }
      lesson.fileUrl = `/uploads/course-materials/${req.file.filename}`;
      lesson.originalFilename = req.file.originalname;
      lesson.mimeType = req.file.mimetype;
      lesson.fileSize = req.file.size;
    }

    await course.save();

    return res.json({
      success: true,
      message: 'Lesson updated.',
      data: lesson
    });
  } catch (err) {
    if (req.file) deleteFileIfExists(`/uploads/course-materials/${req.file.filename}`);
    next(err);
  }
};

// DELETE /api/courses/:id/modules/:moduleId/lessons/:lessonId
exports.deleteLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const lesson = mod.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    if (lesson.fileUrl) {
      deleteFileIfExists(lesson.fileUrl);
    }

    mod.lessons.pull(req.params.lessonId);

    // Re-index lesson order
    mod.lessons.forEach((l, idx) => { l.order = idx + 1; });

    await course.save();

    return res.json({
      success: true,
      message: 'Lesson deleted.'
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/courses/:id/thumbnail
exports.uploadThumbnail = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    // Clean up old thumbnail
    if (course.thumbnail && course.thumbnail.url) {
      deleteFileIfExists(course.thumbnail.url);
    }

    course.thumbnail = {
      url: `/uploads/thumbnails/${req.file.filename}`,
      filename: req.file.filename
    };

    await course.save();

    return res.json({
      success: true,
      message: 'Thumbnail uploaded successfully.',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id/publish
exports.publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course) || !verifyOwner(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Not authorized to publish this course.' });
    }

    const missing = [];

    if (!course.title || course.title.trim() === '') missing.push('Course Title');
    if (!course.category || course.category.trim() === '') missing.push('Course Category');
    if (!course.shortDescription || course.shortDescription.trim() === '') missing.push('Short Description');
    if (!course.description || course.description.trim() === '') missing.push('Detailed Description');
    if (!course.learningObjectives || course.learningObjectives.length === 0 || course.learningObjectives.every(o => !o.trim())) {
      missing.push('At least 1 Learning Objective');
    }
    if (!course.skills || course.skills.length === 0) missing.push('At least 1 Skill/Competency');
    if (!course.modules || course.modules.length === 0) missing.push('At least 1 Module');

    // Count VALID learning materials (either valid link or non-empty fileUrl)
    let validMaterialsCount = 0;
    if (course.modules) {
      course.modules.forEach(mod => {
        if (mod.lessons) {
          mod.lessons.forEach(lesson => {
            if (lesson.type === 'link') {
              if (lesson.externalUrl && lesson.externalUrl.trim() !== '') validMaterialsCount++;
            } else {
              if (lesson.fileUrl && lesson.fileUrl.trim() !== '') validMaterialsCount++;
            }
          });
        }
      });
    }

    if (validMaterialsCount === 0) missing.push('At least 1 valid Learning Material (file or link)');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Course is not ready to publish. Please fulfill all requirements.',
        missing
      });
    }

    course.status = 'published';
    course.publishedAt = new Date();
    await course.save();

    return res.json({
      success: true,
      message: 'Course published successfully!',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id/archive
exports.archiveCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const isOwner = verifyOwner(req.user, course);
    const isAdminSameOrg = req.user.role === 'Admin' && verifyOrg(req.user, course);

    if (!isOwner && !isAdminSameOrg) {
      return res.status(403).json({ success: false, message: 'Not authorized to archive this course.' });
    }

    course.status = 'archived';
    await course.save();

    return res.json({
      success: true,
      message: 'Course archived.',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id/modules/:moduleId/lessons/:lessonId/material
exports.getLessonMaterial = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (!verifyOrg(req.user, course)) {
      return res.status(403).json({ success: false, message: 'Access denied. Course belongs to another organization.' });
    }

    if (req.user.role === 'Trainee' && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Material not available.' });
    }

    if (req.user.role === 'Trainer' && !verifyOwner(req.user, course) && course.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Material not available.' });
    }

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const lesson = mod.lessons.id(req.params.lessonId);
    if (!lesson || !lesson.fileUrl) {
      return res.status(404).json({ success: false, message: 'Material file not found.' });
    }

    const filename = path.basename(lesson.fileUrl);
    const filePath = path.join(__dirname, '../../uploads/course-materials', filename);

    if (!fs.existsSync(filePath)) {
      console.error(`getLessonMaterial file not found at path: ${filePath}`);
      return res.status(404).json({ success: false, message: 'Material file missing from storage.' });
    }

    if (lesson.mimeType) {
      res.setHeader('Content-Type', lesson.mimeType);
    }

    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};
