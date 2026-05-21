const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Wishlist'
  },
  jdText: { type: String, default: '' },
  link: { type: String, default: '' },
  appliedDate: { type: String, default: '' },
  notes: { type: String, default: '' },
  salary: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
