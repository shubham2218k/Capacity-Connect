const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Reads "Authorization: Bearer <token>" and puts the user on req.user.
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists.' });
    }

    if (user.status === 'suspended' || user.status === 'rejected') {
      return res.status(403).json({ success: false, message: 'This account is not active.' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token is invalid or expired.' });
  }
};

// Usage: authorizeRoles('Admin') or authorizeRoles('Admin', 'Trainer')
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have permission to do that.' });
  }
  return next();
};

module.exports = { protect, authorizeRoles };
