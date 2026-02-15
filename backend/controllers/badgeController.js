const { Badge, UserBadge } = require('../models/Badge');
const User = require('../models/User');

exports.checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userBadges = await UserBadge.find({ user: userId });
    const earnedBadgeIds = userBadges.map(ub => ub.badge.toString());

    const badges = await Badge.find();

    for (const badge of badges) {
      if (earnedBadgeIds.includes(badge._id.toString())) continue;

      let shouldAward = false;

      if (badge.criteria === 'first_swap' && user.totalSwaps >= 1) shouldAward = true;
      if (badge.criteria === '10_swaps' && user.totalSwaps >= 10) shouldAward = true;
      if (badge.criteria === 'top_mentor' && user.rating >= 4.5) shouldAward = true;
      if (badge.criteria === 'verified' && user.isVerified) shouldAward = true;

      if (shouldAward) {
        await UserBadge.create({ user: userId, badge: badge._id });
      }
    }
  } catch (err) {
    console.error('Badge check error:', err);
  }
};

exports.getUserBadges = async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.params.userId })
      .populate('badge')
      .sort({ earnedAt: -1 });

    res.json(userBadges);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBadge = async (req, res) => {
  try {
    const { name, description, icon, criteria } = req.body;

    const badge = new Badge({ name, description, icon, criteria });
    await badge.save();

    res.status(201).json(badge);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
