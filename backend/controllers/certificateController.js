const Certificate = require('../models/Certificate');
const Session = require('../models/Session');
const User = require('../models/User');
const crypto = require('crypto');

exports.generateCertificate = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId)
      .populate({
        path: 'swapRequest',
        populate: [
          { path: 'mentor', select: 'name' },
          { path: 'skillWanted', select: 'title' }
        ]
      });

    if (!session || session.status !== 'Completed') {
      return res.status(400).json({ message: 'Session not completed' });
    }

    const certificateId = crypto.randomBytes(16).toString('hex');

    const certificate = new Certificate({
      user: req.user.id,
      session: sessionId,
      skillName: session.swapRequest.skillWanted.title,
      mentorName: session.swapRequest.mentor.name,
      duration: session.duration,
      certificateId
    });

    await certificate.save();
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.params.userId })
      .populate('session')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('user', 'name email')
      .populate('session');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
