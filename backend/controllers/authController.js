const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || ''
    });

    await user.save();

    await Wallet.create({ user: user._id, credits: 50 });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(201).json({ 
      token: accessToken,
      refreshToken,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        location: user.location,
        availability: user.availability,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        role: user.role,
        isVerified: user.isVerified,
        totalSwaps: user.totalSwaps,
        rating: user.rating
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Content-Type:', req.headers['content-type']);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('Validation failed - Missing fields:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!email.trim() || !password.trim()) {
      console.log('Validation failed - Empty fields');
      return res.status(400).json({ message: 'Email and password cannot be empty' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    console.log('Looking up user with email:', email);
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password matched, generating tokens');
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    const userData = { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      availability: user.availability,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      role: user.role,
      isVerified: user.isVerified,
      totalSwaps: user.totalSwaps,
      rating: user.rating,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    // Add admin-specific fields if user is admin
    if (user.role === 'admin') {
      userData.phone = user.phone;
      userData.department = user.department;
      userData.permissions = user.permissions;
    }

    console.log('Login successful for user:', user.email);
    res.json({ 
      token: accessToken,
      refreshToken,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    res.json({ 
      token: accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
