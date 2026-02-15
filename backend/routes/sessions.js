const express = require('express');
const auth = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.post('/', auth, sessionController.createSession);
router.get('/', auth, sessionController.getSessions);
router.put('/:id', auth, sessionController.updateSession);
router.put('/:id/status', auth, sessionController.updateSessionStatus);
router.delete('/:id', auth, sessionController.deleteSession);

module.exports = router;
