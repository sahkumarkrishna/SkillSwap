const Message = require('../models/Message');
const { uploadToCloudinary } = require('../middleware/upload');

exports.sendMessage = async (req, res) => {
  try {
    const { swapRequest, content, messageType, replyTo, location, contact, poll, mentions } = req.body;
    let fileUrl = null;
    let fileName = null;
    let fileSize = null;
    let thumbnailUrl = null;

    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer);
      fileName = req.file.originalname;
      fileSize = req.file.size;
    }

    const messageData = {
      swapRequest,
      sender: req.user._id || req.user.id,
      content: content || 'Attachment',
      messageType: messageType || 'text',
      fileUrl,
      fileName,
      fileSize,
      isDelivered: true,
      deliveredAt: new Date()
    };

    if (replyTo) messageData.replyTo = replyTo;
    if (location) messageData.location = JSON.parse(location);
    if (contact) messageData.contact = JSON.parse(contact);
    if (poll) messageData.poll = JSON.parse(poll);
    if (mentions) messageData.mentions = JSON.parse(mentions);

    const message = new Message(messageData);
    await message.save();
    await message.populate('sender', 'name profilePicture');
    await message.populate('replyTo');

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const messages = await Message.find({ 
      swapRequest: req.params.swapRequestId,
      $or: [
        { isDeleted: false },
        { deletedFor: { $ne: userId } }
      ]
    })
      .populate('sender', 'name profilePicture')
      .populate('replyTo')
      .populate('mentions', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { _id: { $in: req.body.messageIds }, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.starMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isStarred: !req.body.isStarred },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { deleteForEveryone } = req.body;
    const userId = req.user._id || req.user.id;
    
    if (deleteForEveryone) {
      await Message.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedAt: new Date()
      });
    } else {
      await Message.findByIdAndUpdate(req.params.id, {
        $addToSet: { deletedFor: userId }
      });
    }
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const userId = req.user._id || req.user.id;
    
    const message = await Message.findById(req.params.id);
    const existingReaction = message.reactions.find(r => r.user.toString() === userId.toString());
    
    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      message.reactions.push({ user: userId, emoji });
    }
    
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logCall = async (req, res) => {
  try {
    const { swapRequest, callType, duration, status } = req.body;
    
    const message = new Message({
      swapRequest,
      sender: req.user._id || req.user.id,
      content: `${callType} call`,
      messageType: 'call',
      callInfo: {
        callType,
        duration,
        status,
        startedAt: new Date(Date.now() - (duration * 1000)),
        endedAt: new Date()
      },
      isDelivered: true,
      deliveredAt: new Date()
    });
    
    await message.save();
    await message.populate('sender', 'name profilePicture');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const userId = req.user._id || req.user.id;
    
    const message = await Message.findById(req.params.id);
    message.poll.options[optionIndex].votes.push(userId);
    await message.save();
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
