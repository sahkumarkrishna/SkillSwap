const Review = require('../models/Review');
const Session = require('../models/Session');
const Notification = require('../models/Notification');

exports.createReview = async (req, res) => {
  try {
    const { reviewee, rating, feedback } = req.body;
    const userId = req.user._id || req.user.id;

    if (!reviewee || !rating || !feedback) {
      return res.status(400).json({ message: 'Reviewee, rating, and feedback are required' });
    }

    const review = new Review({
      reviewer: userId,
      reviewee,
      rating,
      feedback
    });

    await review.save();
    await review.populate('reviewer', 'name profilePicture');
    await review.populate('reviewee', 'name profilePicture');

    await Notification.create({
      user: reviewee,
      type: 'review',
      title: 'New Review',
      message: `You received a ${rating}-star review`,
      link: `/reviews`
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const userId = req.params.userId;

    const reviews = await Review.find({
      $or: [
        { reviewer: userId },
        { reviewee: userId }
      ]
    })
      .populate('reviewer', 'name profilePicture')
      .populate('reviewee', 'name profilePicture')
      .populate('session', 'title date')
      .sort({ createdAt: -1 });

    const receivedReviews = reviews.filter(r => r.reviewee?._id?.toString() === userId);
    const avgRating = receivedReviews.length > 0
      ? receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length
      : 0;

    res.json({ reviews, avgRating });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
