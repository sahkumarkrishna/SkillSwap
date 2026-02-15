const User = require('../models/User');
const Skill = require('../models/Skill');

exports.getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userSkillsWanted = currentUser.skillsWanted;
    const userLocation = currentUser.location;

    const recommendations = await Skill.find({
      title: { $in: userSkillsWanted },
      user: { $ne: req.user.id },
      isApproved: true
    })
      .populate('user', 'name profilePicture location availability rating')
      .limit(10);

    const scored = recommendations.map(skill => {
      let score = 0;
      if (skill.user.location === userLocation) score += 5;
      if (skill.user.availability) score += 3;
      score += skill.user.rating || 0;
      return { ...skill.toObject(), matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSimilarUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const similarUsers = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { skillsOffered: { $in: currentUser.skillsWanted } },
        { skillsWanted: { $in: currentUser.skillsOffered } }
      ]
    })
      .select('name profilePicture skillsOffered skillsWanted location rating')
      .limit(10);

    res.json(similarUsers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
