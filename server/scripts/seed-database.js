const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../src/models/User');
const Emergency = require('../src/models/Emergency');
const Announcement = require('../src/models/Announcement');

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Emergency.deleteMany({});
    await Announcement.deleteMany({});
    console.log('✅ Data cleared\n');

    // Create Admin User
    console.log('👤 Creating Admin user...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@dream.com',
      phoneNumber: '09123456789',
      password: hashedAdminPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin created:', admin.email);

    // Create Sample Responders
    console.log('\n🚒 Creating Responders...');
    const hashedResponderPassword = await bcrypt.hash('responder123', 10);
    
    const responder1 = await User.create({
      name: 'Fire Officer Juan Santos',
      email: 'juan.santos@responder.com',
      phoneNumber: '09111111111',
      password: hashedResponderPassword,
      role: 'responder',
      responderDetails: {
        specialization: 'fire',
        availability: 'available'
      },
      isActive: true
    });

    const responder2 = await User.create({
      name: 'Medical Officer Maria Cruz',
      email: 'maria.cruz@responder.com',
      phoneNumber: '09222222222',
      password: hashedResponderPassword,
      role: 'responder',
      responderDetails: {
        specialization: 'medical',
        availability: 'available'
      },
      isActive: true
    });

    const responder3 = await User.create({
      name: 'Police Officer Pedro Reyes',
      email: 'pedro.reyes@responder.com',
      phoneNumber: '09333333333',
      password: hashedResponderPassword,
      role: 'responder',
      responderDetails: {
        specialization: 'police',
        availability: 'available'
      },
      isActive: true
    });

    console.log('✅ Created 3 responders');

    // Create Sample Residents
    console.log('\n🏘️  Creating Residents...');
    const hashedResidentPassword = await bcrypt.hash('resident123', 10);
    
    const resident1 = await User.create({
      name: 'Juan Dela Cruz',
      email: 'juan@resident.com',
      phoneNumber: '09444444444',
      password: hashedResidentPassword,
      role: 'resident',
      isActive: true
    });

    const resident2 = await User.create({
      name: 'Maria Garcia',
      email: 'maria@resident.com',
      phoneNumber: '09555555555',
      password: hashedResidentPassword,
      role: 'resident',
      isActive: true
    });

    console.log('✅ Created 2 residents');

    // Create Sample Emergencies
    console.log('\n🆘 Creating Sample Emergencies...');
    
    const emergency1 = await Emergency.create({
      reportedBy: resident1._id,
      type: 'fire',
      description: 'House fire on Main Street. Smoke visible from outside.',
      location: {
        address: '123 Main Street, San Isidro Labrador I',
        coordinates: {
          latitude: 14.5995,
          longitude: 120.9842
        }
      },
      contactNumber: '09444444444',
      status: 'dispatched',
      priority: 'high',
      assignedResponders: [responder1._id],
      updates: [{
        updatedBy: admin._id,
        status: 'dispatched',
        notes: 'Fire unit dispatched to location',
        timestamp: new Date()
      }]
    });

    const emergency2 = await Emergency.create({
      reportedBy: resident2._id,
      type: 'medical',
      description: 'Elderly woman having difficulty breathing.',
      location: {
        address: '456 Oak Avenue, San Isidro Labrador I',
        coordinates: {
          latitude: 14.6005,
          longitude: 120.9852
        }
      },
      contactNumber: '09555555555',
      status: 'responding',
      priority: 'critical',
      assignedResponders: [responder2._id],
      updates: [
        {
          updatedBy: admin._id,
          status: 'dispatched',
          notes: 'Medical team dispatched',
          timestamp: new Date(Date.now() - 600000) // 10 minutes ago
        },
        {
          updatedBy: responder2._id,
          status: 'responding',
          notes: 'On route to location',
          timestamp: new Date(Date.now() - 300000) // 5 minutes ago
        }
      ]
    });

    const emergency3 = await Emergency.create({
      reportedBy: resident1._id,
      type: 'flood',
      description: 'Street flooding due to heavy rain. Water level rising.',
      location: {
        address: '789 River Road, San Isidro Labrador I',
        coordinates: {
          latitude: 14.5985,
          longitude: 120.9832
        }
      },
      contactNumber: '09444444444',
      status: 'pending',
      priority: 'medium'
    });

    const emergency4 = await Emergency.create({
      reportedBy: resident2._id,
      type: 'accident',
      description: 'Vehicle collision at intersection. Minor injuries.',
      location: {
        address: 'Corner of Main St and Oak Ave, San Isidro Labrador I',
        coordinates: {
          latitude: 14.6000,
          longitude: 120.9847
        }
      },
      contactNumber: '09555555555',
      status: 'resolved',
      priority: 'medium',
      assignedResponders: [responder3._id],
      resolvedAt: new Date(),
      updates: [
        {
          updatedBy: admin._id,
          status: 'dispatched',
          notes: 'Police unit dispatched',
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          updatedBy: responder3._id,
          status: 'responding',
          notes: 'Arrived at scene',
          timestamp: new Date(Date.now() - 3000000) // 50 minutes ago
        },
        {
          updatedBy: responder3._id,
          status: 'resolved',
          notes: 'Scene cleared, report filed',
          timestamp: new Date()
        }
      ]
    });

    console.log('✅ Created 4 sample emergencies');

    // Create Sample Announcements
    console.log('\n📢 Creating Sample Announcements...');
    
    const announcement1 = await Announcement.create({
      title: 'Typhoon Alert: Signal No. 2',
      message: 'A typhoon is approaching the area. Signal No. 2 has been raised. Residents are advised to stay indoors and prepare emergency kits. Monitor local news for updates.',
      type: 'warning',
      priority: 'high',
      createdBy: admin._id,
      isActive: true
    });

    const announcement2 = await Announcement.create({
      title: 'Community Clean-Up Drive',
      message: 'Join us for a community clean-up drive this Saturday, 8:00 AM at the barangay hall. Bring cleaning materials and let\'s keep our community clean!',
      type: 'info',
      priority: 'low',
      createdBy: admin._id,
      isActive: true
    });

    const announcement3 = await Announcement.create({
      title: 'Emergency Hotline Numbers',
      message: 'Save these numbers:\nFire: 09111111111\nMedical: 09222222222\nPolice: 09333333333\nBarangay: 09123456789',
      type: 'info',
      priority: 'medium',
      createdBy: admin._id,
      isActive: true
    });

    console.log('✅ Created 3 sample announcements');

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📊 SUMMARY:');
    console.log('├─ 1 Admin user');
    console.log('├─ 3 Responders (fire, medical, police)');
    console.log('├─ 2 Residents');
    console.log('├─ 4 Emergency reports (various statuses)');
    console.log('└─ 3 Announcements\n');

    console.log('🔐 TEST CREDENTIALS:\n');
    console.log('Admin:');
    console.log('  📧 Email: admin@dream.com');
    console.log('  🔑 Password: admin123\n');
    
    console.log('Responders:');
    console.log('  📧 juan.santos@responder.com (Fire)');
    console.log('  📧 maria.cruz@responder.com (Medical)');
    console.log('  📧 pedro.reyes@responder.com (Police)');
    console.log('  🔑 Password: responder123\n');
    
    console.log('Residents:');
    console.log('  📧 juan@resident.com');
    console.log('  📧 maria@resident.com');
    console.log('  🔑 Password: resident123\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change passwords after testing!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
