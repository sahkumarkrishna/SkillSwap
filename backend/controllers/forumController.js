const ForumPost = require('../models/ForumPost');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = new ForumPost({
      user: req.user._id || req.user.id,
      title,
      content,
      category
    });

    await post.save();
    await post.populate('user', 'name profilePicture');

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const posts = await ForumPost.find(query)
      .populate('user', 'name profilePicture')
      .populate('answers.user', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await ForumPost.findById(req.params.postId);
    
    post.answers.push({
      user: req.user._id || req.user.id,
      content
    });

    await post.save();
    await post.populate('user', 'name profilePicture');
    await post.populate('answers.user', 'name profilePicture');

    res.json(post);
  } catch (err) {
    console.error('Add answer error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    const userId = req.user._id || req.user.id;

    const index = post.upvotes.indexOf(userId);
    if (index > -1) {
      post.upvotes.splice(index, 1);
    } else {
      post.upvotes.push(userId);
    }

    await post.save();
    await post.populate('user', 'name profilePicture');
    await post.populate('answers.user', 'name profilePicture');
    
    res.json(post);
  } catch (err) {
    console.error('Upvote post error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.upvoteAnswer = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    const answer = post.answers.id(req.params.answerId);
    const userId = req.user._id || req.user.id;

    const index = answer.upvotes.indexOf(userId);
    if (index > -1) {
      answer.upvotes.splice(index, 1);
    } else {
      answer.upvotes.push(userId);
    }

    await post.save();
    await post.populate('user', 'name profilePicture');
    await post.populate('answers.user', 'name profilePicture');
    
    res.json(post);
  } catch (err) {
    console.error('Upvote answer error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.acceptAnswer = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    const userId = req.user._id || req.user.id;
    
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const answer = post.answers.id(req.params.answerId);
    answer.isAccepted = true;

    await post.save();
    await post.populate('user', 'name profilePicture');
    await post.populate('answers.user', 'name profilePicture');
    
    res.json(post);
  } catch (err) {
    console.error('Accept answer error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await ForumPost.findById(req.params.postId);
    const userId = req.user._id || req.user.id;

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    await post.save();
    await post.populate('user', 'name profilePicture');
    await post.populate('answers.user', 'name profilePicture');

    res.json(post);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    const userId = req.user._id || req.user.id;

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ForumPost.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
