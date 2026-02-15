const express = require('express');
const auth = require('../middleware/auth');
const swapController = require('../controllers/swapController');

const router = express.Router();

router.get('/', auth, swapController.getAllSwapRequests);
router.get('/received', auth, swapController.getReceivedRequests);
router.get('/sent', auth, swapController.getSentRequests);
router.get('/:id', auth, swapController.getSwapRequestById);
router.post('/', auth, swapController.createSwapRequest);
router.patch('/:id', auth, swapController.updateRequestStatus);
router.delete('/:id', auth, swapController.deleteSwapRequest);

module.exports = router;
