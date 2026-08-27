const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organizationType: { type: String, trim: true, default: '' },
    officialEmail: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },

    // Trainees and trainers each get their own key, so one never works for the other.
    traineeAccessKey: { type: String, required: true, unique: true, uppercase: true, trim: true },
    trainerAccessKey: { type: String, required: true, unique: true, uppercase: true, trim: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
