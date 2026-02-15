const express = require('express');
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/', auth, reviewController.createReview);
router.get('/:userId', reviewController.getReviews);

module.exports = router;
