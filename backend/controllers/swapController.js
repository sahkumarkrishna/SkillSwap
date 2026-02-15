const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../config/email');

exports.getAllSwapRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const requests = await SwapRequest.find({
      $or: [
        { requester: userId },
        { mentor: userId }
      ]
    })
      .populate('requester', 'name profilePicture')
      .populate('mentor', 'name profilePicture')
      .populate('skillWanted', 'title')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSwapRequest = async (req, res) => {
  try {
    const { mentor, skillWanted, skillOffered, message, preferredSchedule } = req.body;
    const userId = req.user._id || req.user.id;

    if (!mentor || !skillWanted) {
      return res.status(400).json({ message: 'Mentor and skill are required' });
    }

    const swapRequest = new SwapRequest({
      requester: userId,
      mentor,
      skillWanted,
      skillOffered: skillOffered || '',
      message: message || '',
      preferredSchedule: Array.isArray(preferredSchedule) ? preferredSchedule.join(', ') : (preferredSchedule || '')
    });

    await swapRequest.save();

    try {
      const mentorUser = await User.findById(mentor);
      const requesterUser = await User.findById(userId);

      if (mentorUser && requesterUser) {
        await Notification.create({
          user: mentor,
          type: 'request',
          title: 'New Swap Request',
          message: `${requesterUser.name} wants to learn from you`,
          link: `/swaps/${swapRequest._id}`
        });

        if (mentorUser.email) {
          await sendEmail(
            mentorUser.email,
            'New Swap Request',
            `<h3>New Swap Request</h3><p>${requesterUser.name} wants to learn from you!</p>`
          );
        }
      }
    } catch (notifError) {
      console.log('Notification/Email error:', notifError);
    }

    res.status(201).json(swapRequest);
  } catch (err) {
    console.error('Create swap request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const requests = await SwapRequest.find({ mentor: userId })
      .populate('requester', 'name profilePicture')
      .populate('skillWanted', 'title')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const requests = await SwapRequest.find({ requester: userId })
      .populate('mentor', 'name profilePicture')
      .populate('skillWanted', 'title')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email profilePicture')
      .populate('mentor', 'name email profilePicture')
      .populate('skillWanted', 'title description');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    res.json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user._id || req.user.id;
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (swapRequest.mentor.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    swapRequest.status = status;
    await swapRequest.save();
    await swapRequest.populate(['requester', 'mentor', 'skillWanted'], 'name profilePicture title');

    await Notification.create({
      user: swapRequest.requester,
      type: 'request',
      title: `Swap Request ${status}`,
      message: `Your swap request has been ${status.toLowerCase()}`,
      link: `/swaps/${swapRequest._id}`
    });

    res.json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSwapRequest = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (swapRequest.requester.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SwapRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
