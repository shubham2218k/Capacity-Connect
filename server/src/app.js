const express = require('express');
const cors = require('cors');

const path = require('path');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Allow the Vite dev server locally, plus CLIENT_URL for deployments.
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No origin = curl / server-to-server calls.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);

app.use(express.json());

// Serve static uploads (course materials and thumbnails)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Capacity Connect API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Central error handler - always answers with { success, message }.
app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return res.status(409).json({
      success: false,
      message: field === 'email' ? 'Email already registered.' : `That ${field || 'value'} is already in use.`
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((e) => e.message).join(' ')
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server.'
  });
});

module.exports = app;
