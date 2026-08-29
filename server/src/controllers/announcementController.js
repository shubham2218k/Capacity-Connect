const Announcement = require('../models/Announcement');

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalizeAudience = (raw) => {
  if (!raw) return 'all';
  const lower = String(raw).toLowerCase().trim();
  if (lower === 'trainees' || lower === 'trainee') return 'trainees';
  if (lower === 'trainers' || lower === 'trainer') return 'trainers';
  return 'all';
};

// Build an audience-aware Mongoose filter for the current user's role
const audienceFilter = (role) => {
  if (role === 'Trainee') return { audience: { $in: ['all', 'trainees'] } };
  if (role === 'Trainer') return { audience: { $in: ['all', 'trainers'] } };
  // Admin sees everything in their org
  return {};
};

const view = (a) => ({
  _id: a._id,
  id: a._id,
  organization: a.organization,
  organizationName: a.organizationName,
  createdBy: a.createdBy,
  createdByName: a.createdByName,
  title: a.title,
  message: a.message,
  audience: a.audience,
  type: a.type,
  priority: a.priority,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt
});

// ─── GET /api/announcements ─────────────────────────────────────────────────
// Returns announcements for the authenticated user's organization,
// filtered by their role (audience).
exports.getAnnouncements = async (req, res) => {
  const filter = {
    organization: req.user.organizationId,
    isDeleted: false,
    ...audienceFilter(req.user.role)
  };

  const announcements = await Announcement.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json({ success: true, data: announcements.map(view) });
};

// ─── POST /api/announcements ────────────────────────────────────────────────
exports.createAnnouncement = async (req, res) => {
  const { title, message, audience, type, priority } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const announcement = await Announcement.create({
    organization: req.user.organizationId,
    organizationName: req.user.organizationName || '',
    createdBy: req.user._id,
    createdByName: req.user.name || '',
    title: title.trim(),
    message: message.trim(),
    audience: normalizeAudience(audience),
    type: type || 'announcement',
    priority: priority || 'Normal'
  });

  return res.status(201).json({ success: true, data: view(announcement) });
};

// ─── PATCH /api/announcements/:id ───────────────────────────────────────────
exports.updateAnnouncement = async (req, res) => {
  const ann = await Announcement.findOne({
    _id: req.params.id,
    organization: req.user.organizationId,
    isDeleted: false
  });

  if (!ann) {
    return res.status(404).json({ success: false, message: 'Announcement not found.' });
  }

  const { title, message, audience, type, priority } = req.body;

  if (title !== undefined) ann.title = title.trim();
  if (message !== undefined) ann.message = message.trim();
  if (audience !== undefined) ann.audience = normalizeAudience(audience);
  if (type !== undefined) ann.type = type;
  if (priority !== undefined) ann.priority = priority;

  await ann.save();

  return res.json({ success: true, data: view(ann) });
};

// ─── DELETE /api/announcements/:id ──────────────────────────────────────────
exports.deleteAnnouncement = async (req, res) => {
  const ann = await Announcement.findOne({
    _id: req.params.id,
    organization: req.user.organizationId,
    isDeleted: false
  });

  if (!ann) {
    return res.status(404).json({ success: false, message: 'Announcement not found.' });
  }

  ann.isDeleted = true;
  await ann.save();

  return res.json({ success: true, message: 'Announcement deleted.' });
};
