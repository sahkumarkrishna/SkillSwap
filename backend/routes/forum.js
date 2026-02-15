const express = require('express');
const auth = require('../middleware/auth');
const forumController = require('../controllers/forumController');

const router = express.Router();

router.post('/', auth, forumController.createPost);
router.get('/', forumController.getPosts);
router.put('/:postId', auth, forumController.updatePost);
router.delete('/:postId', auth, forumController.deletePost);
router.post('/:postId/answers', auth, forumController.addAnswer);
router.put('/:postId/upvote', auth, forumController.upvotePost);
router.put('/:postId/answers/:answerId/upvote', auth, forumController.upvoteAnswer);
router.put('/:postId/answers/:answerId/accept', auth, forumController.acceptAnswer);

module.exports = router;
