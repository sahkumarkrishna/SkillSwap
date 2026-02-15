const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platform: {
    siteName: { type: String, default: 'SkillSwap' },
    siteDescription: { type: String, default: 'Connect, Learn, and Grow Together' },
    maintenanceMode: { type: Boolean, default: false },
    registrationEnabled: { type: Boolean, default: true }
  },
  email: {
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    fromEmail: { type: String, default: '' },
    fromName: { type: String, default: 'SkillSwap' }
  },
  security: {
    passwordMinLength: { type: Number, default: 8 },
    sessionTimeout: { type: Number, default: 24 },
    maxLoginAttempts: { type: Number, default: 5 },
    requireEmailVerification: { type: Boolean, default: true }
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);