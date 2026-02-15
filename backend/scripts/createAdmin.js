const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'kumarkrishna9801552@gmail.com';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Krishna@123', 10);

    const admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      verifiedAt: new Date(),
      phone: '+1234567890',
      department: 'Administration',
      permissions: ['read', 'write', 'delete', 'manage_users', 'system_config']
    });

    console.log('Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: Krishna@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
