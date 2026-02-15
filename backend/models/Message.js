const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  
  // Message Type
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'video', 'audio', 'document', 'voice', 'sticker', 'gif', 'location', 'contact', 'call', 'poll', 'link'],
    default: 'text' 
  },
  
  // File Attachments
  fileUrl: { type: String },
  fileType: { type: String, enum: ['image', 'document', 'audio', 'video', 'other'], default: 'other' },
  fileName: { type: String },
  fileSize: { type: Number },
  thumbnailUrl: { type: String },
  duration: { type: Number }, // For audio/video duration in seconds
  
  // Reply & Forward
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  isForwarded: { type: Boolean, default: false },
  forwardedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Read Receipts
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  
  // Message Status
  isStarred: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Delete for me/everyone
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  
  // Reactions
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Call Information
  callInfo: {
    callType: { type: String, enum: ['audio', 'video'] },
    duration: { type: Number }, // Call duration in seconds
    status: { type: String, enum: ['missed', 'declined', 'completed', 'cancelled', 'busy'], default: 'completed' },
    startedAt: { type: Date },
    endedAt: { type: Date }
  },
  
  // Location Sharing
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String },
    name: { type: String } // Place name
  },
  
  // Contact Sharing
  contact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  
  // Poll
  poll: {
    question: { type: String },
    options: [{
      text: { type: String },
      votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    allowMultipleAnswers: { type: Boolean, default: false },
    expiresAt: { type: Date }
  },
  
  // Link Preview
  linkPreview: {
    url: { type: String },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    siteName: { type: String }
  },
  
  // Mentions
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Voice Message
  voiceMessage: {
    duration: { type: Number },
    waveform: [{ type: Number }] // Audio waveform data for visualization
  },
  
  // Message Priority
  isPinned: { type: Boolean, default: false },
  pinnedAt: { type: Date },
  
  // Encryption (for future use)
  isEncrypted: { type: Boolean, default: false },
  encryptionKey: { type: String }
  
}, { timestamps: true });

// Indexes for better query performance
messageSchema.index({ swapRequest: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ isStarred: 1 });
messageSchema.index({ 'callInfo.callType': 1 });

module.exports = mongoose.model('Message', messageSchema);
