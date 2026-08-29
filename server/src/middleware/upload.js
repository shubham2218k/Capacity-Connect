const multer = require('multer');
const path = require('path');
const fs = require('fs');

const materialsDir = path.join(__dirname, '../../uploads/course-materials');
const thumbnailsDir = path.join(__dirname, '../../uploads/thumbnails');

// Ensure upload directories exist
if (!fs.existsSync(materialsDir)) {
  fs.mkdirSync(materialsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Disk storage for materials
const materialsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, materialsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `mat-${uniqueSuffix}${ext}`);
  }
});

// Disk storage for thumbnails
const thumbnailsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, thumbnailsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `thumb-${uniqueSuffix}${ext}`);
  }
});

// File filter for learning materials
const materialsFileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${ext}). Allowed types: PDF, DOC, DOCX, PPT, PPTX, MP4`), false);
  }
};

// File filter for thumbnails
const thumbnailFileFilter = (req, file, cb) => {
  const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid thumbnail file type (${ext}). Allowed types: PNG, JPG, JPEG, WEBP, GIF, SVG`), false);
  }
};

const uploadMaterial = multer({
  storage: materialsStorage,
  fileFilter: materialsFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB max limit
});

const uploadThumbnail = multer({
  storage: thumbnailsStorage,
  fileFilter: thumbnailFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max limit
});

module.exports = {
  uploadMaterial,
  uploadThumbnail
};
