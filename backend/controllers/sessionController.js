const Session = require('../models/Session');
const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { checkAndAwardBadges } = require('./badgeController');

exports.createSession = async (req, res) => {
  try {
    const { date, duration, meetingLink, notes, skill } = req.body;

    const session = new Session({
      skill: skill || 'General Skill Exchange',
      scheduledAt: date,
      duration: duration || 60,
      meetingLink,
      notes,
      participants: [{
        user: req.user.id,
        name: req.user.name,
        role: 'teacher'
      }],
      status: 'pending'
    });

    await session.save();

    await Notification.create({
      user: req.user.id,
      type: 'session',
      title: 'Session Scheduled',
      message: `Your session has been scheduled for ${new Date(date).toLocaleString()}`,
      link: `/sessions/${session._id}`
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      'participants.user': req.user.id
    })
      .populate('participants.user', 'name profilePicture')
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = status;
    await session.save();

    if (status === 'completed' && session.participants.length >= 2) {
      const participant1 = session.participants[0].user;
      const participant2 = session.participants[1].user;

      await User.findByIdAndUpdate(participant1, { $inc: { totalSwaps: 1 } });
      await User.findByIdAndUpdate(participant2, { $inc: { totalSwaps: 1 } });

      await checkAndAwardBadges(participant1);
      await checkAndAwardBadges(participant2);
    }

    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { skill, date, duration, meetingLink, notes } = req.body;
    
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (skill) session.skill = skill;
    if (date) session.scheduledAt = date;
    if (duration) session.duration = duration;
    if (meetingLink !== undefined) session.meetingLink = meetingLink;
    if (notes !== undefined) session.notes = notes;

    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
