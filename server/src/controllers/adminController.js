const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Course = require('../models/Course');

// Every admin action is scoped to the admin's own organization.
const sameOrganization = (admin, user) =>
  admin.organizationId && user.organizationId && String(user.organizationId) === String(admin.organizationId);

const calculateCompleteness = (t) => {
  let score = 0;
  let total = 9;
  if (t.name) score += 1;
  if (t.email) score += 1;
  if (t.phone) score += 1;
  if (t.department) score += 1;
  if (t.designation) score += 1;
  if (t.qualification) score += 1;
  if (t.expertise && t.expertise.length > 0) score += 1;
  if (t.professionalBio) score += 1;
  if (t.trainerDocuments && t.trainerDocuments.length > 0) score += 1;
  return Math.round((score / total) * 100);
};

const applicationView = (trainer) => ({
  _id: trainer._id,
  id: trainer._id,
  name: trainer.name,
  email: trainer.email,
  phone: trainer.phone,
  department: trainer.department,
  designation: trainer.designation,
  employeeId: trainer.employeeId || '',
  qualification: trainer.qualification,
  institution: trainer.institution || '',
  professionalBio: trainer.professionalBio || '',
  expertise: trainer.expertise || [],
  experience: trainer.experience || '',
  trainerDocuments: trainer.trainerDocuments || [],
  organizationName: trainer.organizationName,
  status: trainer.status,
  changesRequestedReason: trainer.changesRequestedReason || '',
  rejectionReason: trainer.rejectionReason || '',
  trainerReview: trainer.trainerReview || {},
  reviewHistory: trainer.reviewHistory || [],
  completenessScore: calculateCompleteness(trainer),
  appliedOn: trainer.createdAt,
  createdAt: trainer.createdAt,
  updatedAt: trainer.updatedAt
});

const userSummaryView = (u) => ({
  _id: u._id,
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone || '',
  role: u.role,
  status: u.status,
  department: u.department || '',
  designation: u.designation || '',
  qualification: u.qualification || '',
  institution: u.institution || '',
  employeeId: u.employeeId || '',
  professionalBio: u.professionalBio || '',
  organizationName: u.organizationName || '',
  expertise: u.expertise || [],
  experience: u.experience || '',
  verifiedExpertise: u.trainerReview?.verifiedExpertise || [],
  changesRequestedReason: u.changesRequestedReason || '',
  rejectionReason: u.rejectionReason || '',
  createdAt: u.createdAt,
  updatedAt: u.updatedAt
});

// GET /api/admin/trainer-applications
const getTrainerApplications = async (req, res) => {
  if (!req.user.organizationId) {
    return res.json({ success: true, data: [] });
  }

  const reqStatus = req.query.status || 'pending';
  let query = {
    role: 'Trainer',
    organizationId: req.user.organizationId,
    isDeleted: { $ne: true }
  };

  if (reqStatus !== 'all') {
    query.status = reqStatus;
  }

  const trainers = await User.find(query).sort({ createdAt: -1 });

  return res.json({ success: true, data: trainers.map(applicationView) });
};

// Shared lookup + ownership check for trainer operations.
const loadTrainer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ success: false, message: 'Trainer application not found.' });
    return null;
  }

  const trainer = await User.findById(id);

  if (!trainer || trainer.role !== 'Trainer' || trainer.isDeleted) {
    res.status(404).json({ success: false, message: 'Trainer application not found.' });
    return null;
  }

  if (!sameOrganization(req.user, trainer)) {
    res.status(403).json({ success: false, message: 'Access denied. Trainer does not belong to your organization.' });
    return null;
  }

  return trainer;
};

// GET /api/admin/trainer-applications/:id
const getTrainerApplicationById = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  return res.json({
    success: true,
    data: applicationView(trainer)
  });
};

// PATCH /api/admin/trainer-applications/:id/review-checklist
const updateTrainerChecklist = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  const {
    organizationVerified,
    profileComplete,
    qualificationReviewed,
    experienceReviewed,
    expertiseReviewed,
    documentsReviewed,
    verifiedExpertise,
    adminRemarks
  } = req.body;

  if (!trainer.trainerReview) {
    trainer.trainerReview = {};
  }

  if (organizationVerified !== undefined) trainer.trainerReview.organizationVerified = Boolean(organizationVerified);
  if (profileComplete !== undefined) trainer.trainerReview.profileComplete = Boolean(profileComplete);
  if (qualificationReviewed !== undefined) trainer.trainerReview.qualificationReviewed = Boolean(qualificationReviewed);
  if (experienceReviewed !== undefined) trainer.trainerReview.experienceReviewed = Boolean(experienceReviewed);
  if (expertiseReviewed !== undefined) trainer.trainerReview.expertiseReviewed = Boolean(expertiseReviewed);
  if (documentsReviewed !== undefined) trainer.trainerReview.documentsReviewed = Boolean(documentsReviewed);
  if (verifiedExpertise !== undefined) {
    trainer.trainerReview.verifiedExpertise = Array.isArray(verifiedExpertise) ? verifiedExpertise : [];
  }
  if (adminRemarks !== undefined) trainer.trainerReview.adminRemarks = adminRemarks;

  await trainer.save();

  return res.json({
    success: true,
    message: 'Verification checklist updated.',
    data: applicationView(trainer)
  });
};

// PATCH /api/admin/trainer-applications/:id/approve
const approveTrainer = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  if (trainer.status !== 'pending' && trainer.status !== 'changes_requested') {
    return res.status(400).json({ success: false, message: 'Only pending applications can be approved.' });
  }

  // HARD BACKEND CHECKLIST VALIDATION
  const review = trainer.trainerReview || {};
  const reqChecks = [
    review.organizationVerified,
    review.profileComplete,
    review.qualificationReviewed,
    review.expertiseReviewed,
    review.documentsReviewed
  ];
  if (trainer.experience && String(trainer.experience).trim() !== '') {
    reqChecks.push(review.experienceReviewed);
  }

  const isChecklistComplete = reqChecks.every(Boolean);
  if (!isChecklistComplete) {
    return res.status(400).json({
      success: false,
      message: 'Complete the trainer verification checklist before approval.'
    });
  }

  trainer.status = 'active';
  trainer.rejectionReason = '';
  trainer.changesRequestedReason = '';
  trainer.trainerReview.reviewedBy = req.user._id;
  trainer.trainerReview.reviewedAt = new Date();

  trainer.reviewHistory.push({
    action: 'approved',
    note: 'Trainer application approved by administrator.',
    performedBy: req.user._id,
    timestamp: new Date()
  });

  await trainer.save();

  return res.json({
    success: true,
    message: `${trainer.name} has been approved as an active Trainer.`,
    data: applicationView(trainer)
  });
};

// PATCH /api/admin/trainer-applications/:id/request-changes
const requestTrainerChanges = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  const reason = (req.body.reason || '').trim();
  if (!reason) {
    return res.status(400).json({ success: false, message: 'A reason for requesting changes is required.' });
  }

  trainer.status = 'changes_requested';
  trainer.changesRequestedReason = reason;
  trainer.reviewHistory.push({
    action: 'changes_requested',
    note: reason,
    performedBy: req.user._id,
    timestamp: new Date()
  });

  await trainer.save();

  return res.json({
    success: true,
    message: `Changes requested for ${trainer.name}'s application.`,
    data: applicationView(trainer)
  });
};

// PATCH /api/admin/trainer-applications/:id/reject
const rejectTrainer = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  const reason = (req.body.reason || '').trim();
  if (!reason) {
    return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
  }

  trainer.status = 'rejected';
  trainer.rejectionReason = reason;
  trainer.trainerReview.reviewedBy = req.user._id;
  trainer.trainerReview.reviewedAt = new Date();

  trainer.reviewHistory.push({
    action: 'rejected',
    note: reason,
    performedBy: req.user._id,
    timestamp: new Date()
  });

  await trainer.save();

  return res.json({
    success: true,
    message: `${trainer.name}'s application was rejected.`,
    data: applicationView(trainer)
  });
};

// GET /api/admin/trainer-applications/:id/documents/:docId
const streamTrainerDocument = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  const doc = trainer.trainerDocuments.id(req.params.docId);
  if (!doc || !doc.filename) {
    return res.status(404).json({ success: false, message: 'Trainer document not found.' });
  }

  const filePath = path.join(__dirname, '../../uploads/trainer-documents', path.basename(doc.filename));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Document file missing from storage.' });
  }

  res.setHeader('Content-Type', doc.mimeType || 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalFilename || doc.filename)}"`);
  return res.sendFile(filePath);
};

// GET /api/admin/users
const getOrganizationUsers = async (req, res) => {
  if (!req.user.organizationId) {
    return res.json({ success: true, data: [] });
  }

  const query = {
    organizationId: req.user.organizationId,
    isDeleted: { $ne: true }
  };

  const { role, status, search } = req.query;

  if (role && role !== 'All') {
    query.role = role;
  }

  if (status && status !== 'All') {
    const s = status.toLowerCase();
    if (s === 'pending approval' || s === 'pending') query.status = 'pending';
    else if (s === 'changes requested' || s === 'changes_requested') query.status = 'changes_requested';
    else query.status = s;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { department: regex }
    ];
  }

  const users = await User.find(query).sort({ createdAt: -1 });

  return res.json({
    success: true,
    data: users.map(userSummaryView)
  });
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const targetUser = await User.findById(id);

  if (!targetUser || targetUser.isDeleted) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!sameOrganization(req.user, targetUser)) {
    return res.status(403).json({ success: false, message: 'Access denied. User belongs to another organization.' });
  }

  return res.json({
    success: true,
    data: userSummaryView(targetUser)
  });
};

// PATCH /api/admin/users/:id/suspend
const suspendUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const targetUser = await User.findById(id);

  if (!targetUser || targetUser.isDeleted) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!sameOrganization(req.user, targetUser)) {
    return res.status(403).json({ success: false, message: 'Access denied. User belongs to another organization.' });
  }

  if (String(req.user._id) === String(targetUser._id)) {
    return res.status(400).json({ success: false, message: 'You cannot suspend your own Admin account.' });
  }

  if (targetUser.role === 'Admin') {
    return res.status(400).json({ success: false, message: 'Admin accounts cannot be suspended.' });
  }

  if (targetUser.role !== 'Trainee' && targetUser.role !== 'Trainer') {
    return res.status(400).json({ success: false, message: 'Only Trainee and Trainer accounts can be suspended.' });
  }

  targetUser.status = 'suspended';
  await targetUser.save();

  return res.json({
    success: true,
    message: `${targetUser.name}'s account has been suspended.`,
    data: userSummaryView(targetUser)
  });
};

// PATCH /api/admin/users/:id/reactivate
const reactivateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const targetUser = await User.findById(id);

  if (!targetUser || targetUser.isDeleted) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!sameOrganization(req.user, targetUser)) {
    return res.status(403).json({ success: false, message: 'Access denied. User belongs to another organization.' });
  }

  if (targetUser.status !== 'suspended') {
    return res.status(400).json({ success: false, message: 'Account is not currently suspended.' });
  }

  targetUser.status = 'active';
  await targetUser.save();

  return res.json({
    success: true,
    message: `${targetUser.name}'s account has been reactivated.`,
    data: userSummaryView(targetUser)
  });
};

// DELETE /api/admin/users/:id (Permanent Delete)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const targetUser = await User.findById(id);

  if (!targetUser || targetUser.isDeleted) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!sameOrganization(req.user, targetUser)) {
    return res.status(403).json({ success: false, message: 'Access denied. User belongs to another organization.' });
  }

  if (String(req.user._id) === String(targetUser._id)) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own Admin account.' });
  }

  if (targetUser.role === 'Admin') {
    return res.status(403).json({ success: false, message: 'Admin accounts cannot be deleted.' });
  }

  // If user is a Trainer, check if they own any Course documents
  if (targetUser.role === 'Trainer') {
    const hasCourses = await Course.exists({ trainer: targetUser._id });
    if (hasCourses) {
      return res.status(409).json({
        success: false,
        message: 'This Trainer owns existing courses. Reassign or remove those courses before permanently deleting the account.'
      });
    }

    // Safely cleanup uploaded documents on disk if any exist
    if (Array.isArray(targetUser.trainerDocuments) && targetUser.trainerDocuments.length > 0) {
      targetUser.trainerDocuments.forEach(doc => {
        if (doc.filename) {
          const safeName = path.basename(doc.filename);
          const filePath = path.join(__dirname, '../../uploads/trainer-documents', safeName);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (e) {
            console.error(`Could not delete document file ${safeName}:`, e.message);
          }
        }
      });
    }
  }

  // Physically remove document from MongoDB
  await User.deleteOne({ _id: targetUser._id });

  return res.json({
    success: true,
    message: `${targetUser.name}'s account has been permanently deleted.`
  });
};

// GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  if (!req.user.organizationId) {
    return res.json({
      success: true,
      data: {
        totalUsers: 0,
        activeTrainees: 0,
        activeTrainers: 0,
        suspendedUsers: 0,
        pendingTrainerApprovals: 0,
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        announcementsCount: 0,
        recentActivity: []
      }
    });
  }

  const orgId = req.user.organizationId;
  const Announcement = require('../models/Announcement');

  const [
    totalUsers,
    activeTrainees,
    activeTrainers,
    suspendedUsers,
    pendingTrainerApprovals,
    totalCourses,
    publishedCourses,
    draftCourses,
    announcementsCount,
    recentUsers,
    recentCourses,
    recentAnnouncements
  ] = await Promise.all([
    User.countDocuments({ organizationId: orgId, isDeleted: { $ne: true } }),
    User.countDocuments({ organizationId: orgId, role: 'Trainee', status: 'active', isDeleted: { $ne: true } }),
    User.countDocuments({ organizationId: orgId, role: 'Trainer', status: 'active', isDeleted: { $ne: true } }),
    User.countDocuments({ organizationId: orgId, status: 'suspended', isDeleted: { $ne: true } }),
    User.countDocuments({ organizationId: orgId, role: 'Trainer', status: 'pending', isDeleted: { $ne: true } }),
    Course.countDocuments({ organization: orgId }),
    Course.countDocuments({ organization: orgId, status: 'published' }),
    Course.countDocuments({ organization: orgId, status: 'draft' }),
    Announcement.countDocuments({ organization: orgId, isDeleted: { $ne: true } }),

    User.find({ organizationId: orgId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5),
    Course.find({ organization: orgId }).sort({ createdAt: -1 }).limit(5),
    Announcement.find({ organization: orgId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5)
  ]);

  const activityItems = [];

  recentUsers.forEach(u => {
    if (u.role === 'Trainer' && u.status === 'pending') {
      activityItems.push({
        type: 'trainer_application',
        title: 'Trainer Application Submitted',
        description: `${u.name} applied for Trainer verification (${u.department || 'Department'})`,
        createdAt: u.createdAt,
        entityId: u._id
      });
    } else if (u.role === 'Trainee') {
      activityItems.push({
        type: 'trainee_registration',
        title: 'New Trainee Registered',
        description: `${u.name} joined as Trainee`,
        createdAt: u.createdAt,
        entityId: u._id
      });
    } else if (u.role === 'Trainer' && u.status === 'active') {
      activityItems.push({
        type: 'trainer_approved',
        title: 'Trainer Active',
        description: `${u.name} is an active Trainer`,
        createdAt: u.createdAt,
        entityId: u._id
      });
    }
  });

  recentCourses.forEach(c => {
    activityItems.push({
      type: 'course_created',
      title: c.status === 'published' ? 'Course Published' : 'Draft Course Created',
      description: `"${c.title}" (${c.category})`,
      createdAt: c.createdAt,
      entityId: c._id
    });
  });

  recentAnnouncements.forEach(a => {
    activityItems.push({
      type: 'announcement_posted',
      title: 'Announcement Posted',
      description: `"${a.title}"`,
      createdAt: a.createdAt,
      entityId: a._id
    });
  });

  activityItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentActivity = activityItems.slice(0, 6);

  return res.json({
    success: true,
    data: {
      totalUsers,
      activeTrainees,
      activeTrainers,
      suspendedUsers,
      pendingTrainerApprovals,
      totalCourses,
      publishedCourses,
      draftCourses,
      announcementsCount,
      recentActivity
    }
  });
};

module.exports = {
  getTrainerApplications,
  getTrainerApplicationById,
  updateTrainerChecklist,
  approveTrainer,
  requestTrainerChanges,
  rejectTrainer,
  streamTrainerDocument,
  getOrganizationUsers,
  getUserById,
  suspendUser,
  reactivateUser,
  deleteUser,
  getAdminDashboard
};

