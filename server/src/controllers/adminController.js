const User = require('../models/User');

// @desc    Get all pending trainer applications
// @route   GET /api/admin/trainers/pending
exports.getPendingTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'Trainer', status: 'pending' }).select('-password');
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainer application by ID
// @route   GET /api/admin/trainers/:id
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: 'Trainer' }).select('-password');
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve trainer
// @route   PATCH /api/admin/trainers/:id/approve
exports.approveTrainer = async (req, res) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: 'Trainer', status: 'pending' });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Pending trainer not found' });
    }

    trainer.status = 'active';
    await trainer.save();

    res.status(200).json({ success: true, message: 'Trainer approved successfully', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject trainer
// @route   PATCH /api/admin/trainers/:id/reject
exports.rejectTrainer = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const trainer = await User.findOne({ _id: req.params.id, role: 'Trainer', status: 'pending' });
    
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Pending trainer not found' });
    }

    trainer.status = 'rejected';
    if (rejectionReason) trainer.rejectionReason = rejectionReason;
    await trainer.save();

    res.status(200).json({ success: true, message: 'Trainer application rejected', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (with optional filters)
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (Suspend/Activate)
// @route   PATCH /api/admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't let admin suspend themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own status this way' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ success: true, message: `User status changed to ${status}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
