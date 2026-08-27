const mongoose = require('mongoose');
const User = require('../models/User');

// Every admin action is scoped to the admin's own organization.
const sameOrganization = (admin, user) =>
  admin.organizationId && user.organizationId && String(user.organizationId) === String(admin.organizationId);

const applicationView = (trainer) => ({
  _id: trainer._id,
  id: trainer._id,
  name: trainer.name,
  email: trainer.email,
  phone: trainer.phone,
  department: trainer.department,
  designation: trainer.designation,
  qualification: trainer.qualification,
  expertise: trainer.expertise,
  experience: trainer.experience,
  organizationName: trainer.organizationName,
  status: trainer.status,
  rejectionReason: trainer.rejectionReason,
  appliedOn: trainer.createdAt,
  createdAt: trainer.createdAt
});

// GET /api/admin/trainer-applications?status=pending
const getTrainerApplications = async (req, res) => {
  if (!req.user.organizationId) {
    return res.json({ success: true, data: [] });
  }

  const status = req.query.status || 'pending';

  const trainers = await User.find({
    role: 'Trainer',
    status,
    organizationId: req.user.organizationId
  }).sort({ createdAt: -1 });

  return res.json({ success: true, data: trainers.map(applicationView) });
};

// Shared lookup + ownership check for approve/reject.
const loadTrainer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ success: false, message: 'Trainer application not found.' });
    return null;
  }

  const trainer = await User.findById(id);

  if (!trainer || trainer.role !== 'Trainer') {
    res.status(404).json({ success: false, message: 'Trainer application not found.' });
    return null;
  }

  if (!sameOrganization(req.user, trainer)) {
    res.status(403).json({ success: false, message: 'This trainer does not belong to your organization.' });
    return null;
  }

  return trainer;
};

// PATCH /api/admin/trainer-applications/:id/approve
const approveTrainer = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  trainer.status = 'active';
  trainer.rejectionReason = '';
  await trainer.save();

  return res.json({
    success: true,
    message: `${trainer.name} has been approved.`,
    data: applicationView(trainer)
  });
};

// PATCH /api/admin/trainer-applications/:id/reject   { reason }
const rejectTrainer = async (req, res) => {
  const trainer = await loadTrainer(req, res);
  if (!trainer) return undefined;

  const reason = (req.body.reason || '').trim();
  if (!reason) {
    return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
  }

  // Rejected trainers are kept, not deleted.
  trainer.status = 'rejected';
  trainer.rejectionReason = reason;
  await trainer.save();

  return res.json({
    success: true,
    message: `${trainer.name}'s application was rejected.`,
    data: applicationView(trainer)
  });
};

module.exports = { getTrainerApplications, approveTrainer, rejectTrainer };
