const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: String, default: '' },
  timeSlots: [{
    day: { type: String, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' }
  }],
  tags: [{ type: String, trim: true }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0, min: 0 },
  requestCount: { type: Number, default: 0, min: 0 },
  favoriteCount: { type: Number, default: 0, min: 0 },
  isApproved: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  price: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD' }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);