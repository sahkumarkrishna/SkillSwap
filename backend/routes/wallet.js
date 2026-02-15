const express = require('express');
const auth = require('../middleware/auth');
const walletController = require('../controllers/walletController');

const router = express.Router();

router.get('/', auth, walletController.getWallet);
router.post('/add', auth, walletController.addCredits);
router.post('/spend', auth, walletController.spendCredits);

module.exports = router;
