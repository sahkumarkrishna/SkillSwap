const Message = require('../models/Message');
const { uploadToCloudinary } = require('../middleware/upload');

exports.sendMessage = async (req, res) => {
  try {
    const { swapRequest, content } = req.body;
    let fileUrl = null;

    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer);
    }

    const message = new Message({
      swapRequest,
      sender: req.user._id || req.user.id,
      content: content || 'File attachment',
      fileUrl
    });

    await message.save();
    await message.populate('sender', 'name profilePicture');

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ swapRequest: req.params.swapRequestId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
