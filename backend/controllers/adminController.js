const User = require('../models/User');
const Session = require('../models/Session');
const Settings = require('../models/Settings');
const Skill = require('../models/Skill');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified, verifiedAt: isVerified ? new Date() : null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const totalSessions = await Session.countDocuments();
    const activeSessions = await Session.countDocuments({ status: 'active' });
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const totalSkills = await User.aggregate([
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered' } },
      { $count: 'total' }
    ]);

    res.json({
      userStats: { total: totalUsers, active: activeUsers, newThisMonth },
      sessionStats: { total: totalSessions, completed: completedSessions, active: activeSessions },
      skillStats: { total: totalSkills[0]?.total || 0, popular: [] }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Sessions management
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('participants.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    ).populate('participants.user', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reports management
exports.getReports = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [userStats, sessionStats, popularSkills, totalSkills] = await Promise.all([
      {
        total: await User.countDocuments(),
        active: await User.countDocuments({ isVerified: true }),
        newThisMonth: await User.countDocuments({ createdAt: { $gte: startDate } })
      },
      {
        total: await Session.countDocuments(),
        completed: await Session.countDocuments({ status: 'completed' }),
        active: await Session.countDocuments({ status: 'active' })
      },
      User.aggregate([
        { $unwind: '$skillsOffered' },
        { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { name: '$_id', userCount: '$count', category: 'General' } }
      ]),
      User.aggregate([
        { $unwind: '$skillsOffered' },
        { $group: { _id: '$skillsOffered' } },
        { $count: 'total' }
      ])
    ]);

    res.json({
      userStats,
      sessionStats,
      skillStats: { 
        total: totalSkills[0]?.total || 0, 
        popular: popularSkills 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const { type } = req.query;
    let data = [];

    if (type === 'users') {
      const users = await User.find().select('name email role isVerified createdAt');
      data = users.map(user => `${user.name},${user.email},${user.role},${user.isVerified ? 'Verified' : 'Pending'},${user.createdAt.toLocaleDateString()}`);
      data.unshift('Name,Email,Role,Status,Join Date');
    } else if (type === 'sessions') {
      const sessions = await Session.find();
      data = sessions.map(session => `${session.title},${session.skill},${session.status},${session.participants.length},${session.createdAt.toLocaleDateString()}`);
      data.unshift('Title,Skill,Status,Participants,Created Date');
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report.csv`);
    res.send(data.join('\n'));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Settings management
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Skills management
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSkillStatus = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { isApproved } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { isApproved },
      { new: true }
    ).populate('user', 'name email');

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const skill = await Skill.findByIdAndDelete(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};