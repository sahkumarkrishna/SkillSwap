const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  availability: { type: String, default: '' },
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  favoriteSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  totalSwaps: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  // Admin-specific fields
  phone: { type: String, default: '' },
  department: { type: String, default: '' },
  permissions: [{ type: String, default: [] }],
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
