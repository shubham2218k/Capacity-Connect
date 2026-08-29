const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { generateUniqueKeys } = require('../utils/generateKey');

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// The shape the frontend already expects: a flat user object plus a token.
const authPayload = (user, extra = {}) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  organizationId: user.organizationId,
  organizationName: user.organizationName,
  department: user.department,
  designation: user.designation,
  qualification: user.qualification,
  expertise: user.expertise,
  experience: user.experience,
  token: signToken(user),
  ...extra
});

const normaliseKey = (key) => String(key || '').trim().toUpperCase();

const findOrganizationByKey = (key, type) =>
  Organization.findOne(
    type === 'Trainer' ? { trainerAccessKey: normaliseKey(key) } : { traineeAccessKey: normaliseKey(key) }
  );

// POST /api/auth/admin-register
// Creates the organization (with its two access keys) and its first Admin.
const adminRegister = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    organizationName,
    organizationType,
    officialEmail,
    officialPhone,
    address,
    city,
    state,
    country,
    department
  } = req.body;

  if (!name || !email || !password || !organizationName || !officialEmail) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, password, organization name and official email are required.'
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  const { traineeAccessKey, trainerAccessKey } = await generateUniqueKeys(Organization);

  const organization = await Organization.create({
    name: organizationName,
    organizationType,
    officialEmail,
    phone: officialPhone || phone,
    address,
    city,
    state,
    country,
    traineeAccessKey,
    trainerAccessKey
  });

  let admin;
  try {
    admin = await User.create({
      name,
      email,
      password,
      phone,
      role: 'Admin',
      status: 'active',
      organizationId: organization._id,
      organizationName: organization.name,
      department
    });
  } catch (err) {
    // Don't leave an orphan organization behind if the admin could not be created.
    await Organization.deleteOne({ _id: organization._id });
    throw err;
  }

  organization.createdBy = admin._id;
  await organization.save();

  return res.status(201).json({
    success: true,
    data: authPayload(admin, {
      organizationName: organization.name,
      traineeKey: organization.traineeAccessKey,
      trainerKey: organization.trainerAccessKey,
      traineeAccessKey: organization.traineeAccessKey,
      trainerAccessKey: organization.trainerAccessKey
    })
  });
};

// POST /api/auth/trainee-register  (also mounted at /api/auth/register)
const traineeRegister = async (req, res) => {
  const { name, email, password, phone, department, designation, qualification } = req.body;
  const key = req.body.traineeAccessKey || req.body.accessKey;

  if (!key) {
    return res.status(400).json({ success: false, message: 'Organization access key is required.' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const organization = await findOrganizationByKey(key, 'Trainee');
  if (!organization) {
    // Give a useful hint if they pasted the trainer key by mistake.
    const asTrainerKey = await findOrganizationByKey(key, 'Trainer');
    return res.status(400).json({
      success: false,
      message: asTrainerKey
        ? 'That is a Trainer access key. Please use your organization\'s Trainee access key.'
        : 'Invalid organization access key.'
    });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  // The organization always comes from the access key, never from the request body.
  const trainee = await User.create({
    name,
    email,
    password,
    phone,
    role: 'Trainee',
    status: 'active',
    organizationId: organization._id,
    organizationName: organization.name,
    department,
    designation,
    qualification
  });

  return res.status(201).json({ success: true, data: authPayload(trainee) });
};

// POST /api/auth/trainer-apply
// Creates the trainer with status "pending" - no token, they cannot log in yet.
const trainerApply = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    department,
    designation,
    employeeId,
    qualification,
    highestQualification,
    institution,
    expertise,
    experience,
    experienceYears,
    bio,
    professionalBio
  } = req.body;
  const key = req.body.trainerAccessKey || req.body.accessKey;

  if (!key) {
    return res.status(400).json({ success: false, message: 'Organization access key is required.' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const organization = await findOrganizationByKey(key, 'Trainer');
  if (!organization) {
    const asTraineeKey = await findOrganizationByKey(key, 'Trainee');
    return res.status(400).json({
      success: false,
      message: asTraineeKey
        ? 'That is a Trainee access key. Please use your organization\'s Trainer access key.'
        : 'Invalid organization access key.'
    });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  // Process uploaded documents if present
  const trainerDocuments = [];
  if (req.files) {
    const filesArr = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    filesArr.forEach(file => {
      let docType = 'other';
      if (file.fieldname.includes('qualification')) docType = 'qualification';
      else if (file.fieldname.includes('experience')) docType = 'experience';
      else if (file.fieldname.includes('identity')) docType = 'identity';

      trainerDocuments.push({
        type: docType,
        originalFilename: file.originalname,
        filename: file.filename,
        fileUrl: `/uploads/trainer-documents/${file.filename}`,
        mimeType: file.mimetype,
        uploadedAt: new Date()
      });
    });
  }

  const trainer = await User.create({
    name,
    email,
    password,
    phone,
    role: 'Trainer',
    status: 'pending',
    organizationId: organization._id,
    organizationName: organization.name,
    department: department || '',
    designation: designation || '',
    employeeId: employeeId || '',
    qualification: qualification || highestQualification || '',
    institution: institution || '',
    professionalBio: professionalBio || bio || '',
    expertise: Array.isArray(expertise)
      ? expertise
      : typeof expertise === 'string' && expertise.trim()
        ? expertise.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    experience: experience || experienceYears || '',
    trainerDocuments,
    trainerReview: {
      organizationVerified: true,
      profileComplete: Boolean((name && email && phone && designation && (qualification || highestQualification))),
      qualificationReviewed: false,
      experienceReviewed: false,
      expertiseReviewed: false,
      documentsReviewed: false,
      verifiedExpertise: [],
      adminRemarks: ''
    },
    reviewHistory: [
      {
        action: 'submitted',
        note: 'Trainer application submitted.',
        timestamp: new Date()
      }
    ]
  });

  return res.status(201).json({
    success: true,
    message: 'Trainer application submitted successfully. Your account is awaiting Admin approval.',
    data: {
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      role: trainer.role,
      status: trainer.status,
      organizationName: trainer.organizationName
    }
  });
};

// POST /api/auth/trainer-resubmit
// Resubmits an application for a Trainer whose status is 'changes_requested'.
const trainerResubmit = async (req, res) => {
  const {
    email,
    password,
    department,
    designation,
    employeeId,
    qualification,
    highestQualification,
    institution,
    expertise,
    experience,
    experienceYears,
    bio,
    professionalBio
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required to verify your application identity.' });
  }

  const trainer = await User.findOne({ email: String(email).toLowerCase().trim(), role: 'Trainer' }).select('+password');
  if (!trainer || !(await trainer.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  if (trainer.status !== 'changes_requested' && trainer.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Application is not open for revision.' });
  }

  // Update profile fields
  if (department !== undefined) trainer.department = department;
  if (designation !== undefined) trainer.designation = designation;
  if (employeeId !== undefined) trainer.employeeId = employeeId;
  if (qualification !== undefined || highestQualification !== undefined) {
    trainer.qualification = qualification || highestQualification;
  }
  if (institution !== undefined) trainer.institution = institution;
  if (professionalBio !== undefined || bio !== undefined) {
    trainer.professionalBio = professionalBio || bio;
  }
  if (experience !== undefined || experienceYears !== undefined) {
    trainer.experience = experience || experienceYears;
  }
  if (expertise !== undefined) {
    trainer.expertise = Array.isArray(expertise)
      ? expertise
      : typeof expertise === 'string' && expertise.trim()
        ? expertise.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
  }

  // Process any newly uploaded documents
  if (req.files) {
    const filesArr = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    filesArr.forEach(file => {
      let docType = 'other';
      if (file.fieldname.includes('qualification')) docType = 'qualification';
      else if (file.fieldname.includes('experience')) docType = 'experience';
      else if (file.fieldname.includes('identity')) docType = 'identity';

      trainer.trainerDocuments.push({
        type: docType,
        originalFilename: file.originalname,
        filename: file.filename,
        fileUrl: `/uploads/trainer-documents/${file.filename}`,
        mimeType: file.mimetype,
        uploadedAt: new Date()
      });
    });
  }

  trainer.status = 'pending';
  trainer.changesRequestedReason = '';
  if (trainer.trainerReview) {
    trainer.trainerReview.documentsReviewed = false;
  }
  trainer.reviewHistory.push({
    action: 'resubmitted',
    note: 'Trainer corrected application and resubmitted for review.',
    timestamp: new Date()
  });

  await trainer.save();

  return res.json({
    success: true,
    message: 'Trainer application resubmitted successfully. Status is now pending review.',
    data: {
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      status: trainer.status
    }
  });
};

// POST /api/auth/validate-key  { key, type: 'Trainee' | 'Trainer' }
// Used by the registration forms to show which organization a key belongs to.
const validateKey = async (req, res) => {
  const { key, type } = req.body;

  if (!key) {
    return res.status(400).json({ success: false, message: 'Access key is required.' });
  }

  const organization = await findOrganizationByKey(key, type === 'Trainer' ? 'Trainer' : 'Trainee');

  if (!organization) {
    return res.status(400).json({ success: false, message: 'Invalid organization access key.' });
  }

  return res.json({
    success: true,
    data: { organizationId: organization._id, organizationName: organization.name }
  });
};

// POST /api/auth/login  { email, password, role, accessKey }
const login = async (req, res) => {
  const { email, password, role } = req.body;
  const accessKey = req.body.accessKey || req.body.traineeAccessKey || req.body.trainerAccessKey;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  // password has select:false on the model, so ask for it explicitly.
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');

  if (!user || user.isDeleted || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (role && user.role !== role) {
    return res.status(401).json({
      success: false,
      message: `This email is registered as a ${user.role}. Please select ${user.role} and try again.`
    });
  }

  if (user.role === 'Trainee' || user.role === 'Trainer') {
    if (!accessKey) {
      return res.status(400).json({ success: false, message: `Organization ${user.role} access key is required.` });
    }

    const organization = await Organization.findById(user.organizationId);
    if (!organization) {
      return res.status(403).json({ success: false, message: 'Your organization could not be found. Contact your administrator.' });
    }

    const expected = user.role === 'Trainer' ? organization.trainerAccessKey : organization.traineeAccessKey;
    if (normaliseKey(accessKey) !== expected) {
      return res.status(401).json({ success: false, message: 'Invalid organization access key.' });
    }
  }

  if (user.role === 'Trainer' && user.status === 'pending') {
    return res.status(403).json({ success: false, status: 'pending', message: 'Your Trainer application is currently under review.' });
  }

  if (user.role === 'Trainer' && user.status === 'changes_requested') {
    return res.status(403).json({
      success: false,
      status: 'changes_requested',
      message: 'Changes have been requested for your Trainer application.',
      changesRequestedReason: user.changesRequestedReason || '',
      email: user.email
    });
  }

  if (user.status === 'rejected') {
    return res.status(403).json({
      success: false,
      status: 'rejected',
      message: user.role === 'Trainer'
        ? (user.rejectionReason ? `Your Trainer application was rejected. Reason: ${user.rejectionReason}` : 'Your Trainer application was rejected.')
        : 'Your account was rejected.'
    });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ success: false, message: 'Your account has been suspended by your organization administrator.' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ success: false, message: 'Your account is not active yet.' });
  }

  const extra = {};
  if (user.role === 'Admin' && user.organizationId) {
    const organization = await Organization.findById(user.organizationId);
    if (organization) {
      extra.traineeKey = organization.traineeAccessKey;
      extra.trainerKey = organization.trainerAccessKey;
      extra.traineeAccessKey = organization.traineeAccessKey;
      extra.trainerAccessKey = organization.trainerAccessKey;
    }
  }

  return res.json({ success: true, data: authPayload(user, extra) });
};

// GET /api/auth/me
const me = async (req, res) => {
  const extra = {};

  if (req.user.role === 'Admin' && req.user.organizationId) {
    const organization = await Organization.findById(req.user.organizationId);
    if (organization) {
      extra.traineeKey = organization.traineeAccessKey;
      extra.trainerKey = organization.trainerAccessKey;
    }
  }

  return res.json({ success: true, data: { ...authPayload(req.user, extra) } });
};

module.exports = { adminRegister, traineeRegister, trainerApply, trainerResubmit, validateKey, login, me };
