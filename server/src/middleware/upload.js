const multer = require('multer');
const path = require('path');
const fs = require('fs');

const materialsDir = path.join(__dirname, '../../uploads/course-materials');
const thumbnailsDir = path.join(__dirname, '../../uploads/thumbnails');
const trainerDocsDir = path.join(__dirname, '../../uploads/trainer-documents');

// Ensure upload directories exist
if (!fs.existsSync(materialsDir)) {
  fs.mkdirSync(materialsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}
if (!fs.existsSync(trainerDocsDir)) {
  fs.mkdirSync(trainerDocsDir, { recursive: true });
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

// Disk storage for trainer documents
const trainerDocsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, trainerDocsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

// Allowed extension and MIME type mappings for learning materials
const allowedMaterialMap = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.ppt': ['application/vnd.ms-powerpoint'],
  '.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  '.mp4': ['video/mp4']
};

// Allowed extension and MIME type mappings for thumbnails (SVG excluded for security)
const allowedThumbnailMap = {
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.webp': ['image/webp'],
  '.gif': ['image/gif']
};

// Allowed extension and MIME type mappings for trainer documents
const allowedTrainerDocMap = {
  '.pdf': ['application/pdf'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png']
};

// File filter for learning materials
const materialsFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();
  
  if (allowedMaterialMap[ext] && allowedMaterialMap[ext].includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type or format (${ext}, ${mime}). Allowed formats: PDF, DOC, DOCX, PPT, PPTX, MP4`), false);
  }
};

// File filter for thumbnails
const thumbnailFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();

  if (allowedThumbnailMap[ext] && allowedThumbnailMap[ext].includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid thumbnail file type or format (${ext}, ${mime}). Allowed formats: PNG, JPG, JPEG, WEBP, GIF`), false);
  }
};

// File filter for trainer documents
const trainerDocFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();

  if (allowedTrainerDocMap[ext] && allowedTrainerDocMap[ext].includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid document format (${ext}, ${mime}). Allowed formats: PDF, JPG, JPEG, PNG`), false);
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

const uploadTrainerDocs = multer({
  storage: trainerDocsStorage,
  fileFilter: trainerDocFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max limit
});

module.exports = {
  uploadMaterial,
  uploadThumbnail,
  uploadTrainerDocs
};
