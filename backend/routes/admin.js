const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, updateUser, deleteUser, getStats, getAllSessions, updateSessionStatus, getReports, downloadReport, getSettings, updateSettings, getAllSkills, updateSkillStatus, deleteSkill } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apply auth and admin middleware to all routes
router.use(auth);
router.use(adminAuth);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

// Stats route
router.get('/stats', getStats);

// Sessions routes
router.get('/sessions', getAllSessions);
router.patch('/sessions/:sessionId/status', updateSessionStatus);

// Skills routes
router.get('/skills', getAllSkills);
router.patch('/skills/:skillId/status', updateSkillStatus);
router.delete('/skills/:skillId', deleteSkill);

// Reports routes
router.get('/reports', getReports);
router.get('/reports/download', downloadReport);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;