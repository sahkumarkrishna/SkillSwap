const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/', auth, upload.single('image'), uploadController.uploadImage);

module.exports = router;
