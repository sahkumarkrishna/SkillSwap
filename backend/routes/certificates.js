const express = require('express');
const auth = require('../middleware/auth');
const certificateController = require('../controllers/certificateController');

const router = express.Router();

router.post('/generate', auth, certificateController.generateCertificate);
router.get('/user/:userId', certificateController.getCertificates);
router.get('/verify/:certificateId', certificateController.verifyCertificate);

module.exports = router;
