const express = require('express');
const auth = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

router.get('/skills', auth, recommendationController.getRecommendations);
router.get('/users', auth, recommendationController.getSimilarUsers);

module.exports = router;
