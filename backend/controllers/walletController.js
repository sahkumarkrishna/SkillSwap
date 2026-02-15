const Wallet = require('../models/Wallet');

exports.getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      wallet = new Wallet({ user: req.user.id });
      await wallet.save();
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCredits = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const wallet = await Wallet.findOne({ user: req.user.id });
    
    wallet.credits += amount;
    wallet.transactions.push({
      type: 'earned',
      amount,
      description
    });

    await wallet.save();
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.spendCredits = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const wallet = await Wallet.findOne({ user: req.user.id });
    
    if (wallet.credits < amount) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    wallet.credits -= amount;
    wallet.transactions.push({
      type: 'spent',
      amount,
      description
    });

    await wallet.save();
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
