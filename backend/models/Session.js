const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, default: 'Skill Exchange Session' },
  skill: { type: String, required: true },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: { type: String, enum: ['teacher', 'learner'], required: true }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  scheduledAt: { type: Date },
  duration: { type: Number, default: 60 }, // minutes
  meetingLink: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);