const { uploadToCloudinary } = require('../middleware/upload');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);
    res.json({ url: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
};
