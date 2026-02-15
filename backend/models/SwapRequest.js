const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillWanted: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  skillOffered: { type: String, required: false, default: '' },
  message: { type: String },
  preferredSchedule: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
