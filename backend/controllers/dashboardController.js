const SwapRequest = require('../models/SwapRequest');
const Session = require('../models/Session');
const Skill = require('../models/Skill');
const Review = require('../models/Review');

exports.getUserDashboard = async (req, res) => {
  try {
    const activeSwaps = await SwapRequest.find({
      $or: [{ requester: req.user.id }, { mentor: req.user.id }],
      status: 'Accepted'
    }).populate('skillWanted', 'title');

    const pendingRequests = await SwapRequest.find({
      requester: req.user.id,
      status: 'Pending'
    }).populate('mentor', 'name profilePicture');

    const completedSwaps = await Session.find({
      status: 'Completed'
    }).populate({
      path: 'swapRequest',
      match: { $or: [{ requester: req.user.id }, { mentor: req.user.id }] }
    });

    const skillPosts = await Skill.find({ user: req.user.id });

    res.json({
      activeSwaps,
      pendingRequests,
      completedSwaps: completedSwaps.filter(s => s.swapRequest),
      skillPosts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMentorDashboard = async (req, res) => {
  try {
    const incomingRequests = await SwapRequest.find({
      mentor: req.user.id,
      status: 'Pending'
    }).populate('requester', 'name profilePicture').populate('skillWanted', 'title');

    const upcomingSessions = await Session.find({
      status: 'Scheduled',
      date: { $gte: new Date() }
    }).populate({
      path: 'swapRequest',
      match: { mentor: req.user.id },
      populate: { path: 'requester', select: 'name profilePicture' }
    });

    const reviews = await Review.find({ reviewee: req.user.id })
      .populate('reviewer', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      incomingRequests,
      upcomingSessions: upcomingSessions.filter(s => s.swapRequest),
      reviews,
      avgRating
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
