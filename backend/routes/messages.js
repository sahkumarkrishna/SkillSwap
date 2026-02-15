const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.post('/', auth, upload.single('file'), messageController.sendMessage);
router.get('/:swapRequestId', auth, messageController.getMessages);

module.exports = router;
