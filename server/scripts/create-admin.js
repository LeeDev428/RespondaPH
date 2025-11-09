const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../src/models/User');

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@dream.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@dream.com');
      console.log('If you forgot the password, please delete the existing admin from the database first.');
      process.exit(0);
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    console.log('👤 Creating admin user...');
    const admin = new User({
      name: 'Admin User',
      email: 'admin@dream.com',
      phoneNumber: '09123456789',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@dream.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('\nYou can now login to the web dashboard at http://localhost:3000\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdmin();
