const express = require('express');
const auth = require('../middleware/auth');
const badgeController = require('../controllers/badgeController');

const router = express.Router();

router.get('/user/:userId', badgeController.getUserBadges);
router.get('/all', badgeController.getAllBadges);
router.post('/', auth, badgeController.createBadge);

module.exports = router;
