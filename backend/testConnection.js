require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testConnection = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    const users = await User.find({});
    console.log(`\n📊 Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.name}) - Role: ${user.role}`);
      });
    } else {
      console.log('\n⚠️  No users found in database. You need to register first!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

testConnection();
