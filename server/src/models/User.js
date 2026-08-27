const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false keeps the hash out of every normal query result.
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true, default: '' },

    role: {
      type: String,
      enum: ['Admin', 'Trainee', 'Trainer'],
      required: true
    },

    status: {
      type: String,
      enum: ['active', 'pending', 'rejected', 'suspended'],
      default: 'active'
    },

    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    organizationName: { type: String, trim: true, default: '' },

    department: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    qualification: { type: String, trim: true, default: '' },

    // Trainer only
    expertise: { type: [String], default: [] },
    experience: { type: String, trim: true, default: '' },
    rejectionReason: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

// Hash the password whenever it is set or changed.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

// Extra safety: never let the hash leak through res.json().
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
