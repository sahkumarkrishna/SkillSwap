const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.post('/', auth, upload.single('file'), messageController.sendMessage);
router.get('/:swapRequestId', auth, messageController.getMessages);
router.patch('/read', auth, messageController.markAsRead);
router.patch('/:id/star', auth, messageController.starMessage);
router.delete('/:id', auth, messageController.deleteMessage);
router.post('/:id/reaction', auth, messageController.addReaction);
router.post('/call/log', auth, messageController.logCall);
router.post('/:id/poll/vote', auth, messageController.votePoll);

module.exports = router;
