const Resource = require('../models/Resource');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

// @desc    Upload a new resource
// @route   POST /api/resources
exports.uploadResource = async (req, res) => {
  try {
    const { title, description, type, courseId, moduleId } = req.body;
    let fileUrl = '';
    let originalFilename = '';
    let mimeType = '';
    let size = 0;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      originalFilename = req.file.originalname;
      mimeType = req.file.mimetype;
      size = req.file.size;
    } else if (type !== 'external-link') {
      return res.status(400).json({ success: false, message: 'File is required unless type is external-link' });
    }

    if (type === 'external-link') {
      fileUrl = req.body.fileUrl; // Use provided URL
    }

    const resource = await Resource.create({
      title,
      description,
      type: type.toLowerCase(),
      courseId,
      moduleId,
      trainerId: req.user._id,
      fileUrl,
      originalFilename,
      mimeType,
      size
    });

    res.status(201).json({ success: true, message: 'Resource uploaded successfully', data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resources (filtered by course or trainer)
// @route   GET /api/resources
exports.getResources = async (req, res) => {
  try {
    const { courseId, trainerId } = req.query;
    let query = {};

    if (courseId) query.courseId = courseId;
    if (trainerId) query.trainerId = trainerId;
    
    // Trainers can see their own
    if (req.user.role === 'Trainer') {
       query.trainerId = req.user._id;
    }

    const resources = await Resource.find(query).populate('courseId', 'title');
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    // Delete file from disk if it exists
    if (resource.type !== 'external-link' && resource.fileUrl) {
      const filePath = path.join(__dirname, '../../', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await resource.deleteOne();
    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
