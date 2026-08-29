/**
 * Capacity Connect — Demo Seed Script
 *
 * Populates the database with a clean set of demo data
 * for walkthroughs and UI demonstrations.
 *
 * Usage:
 *   cd server
 *   node scripts/seedDemo.js
 *
 * ⚠️  This will CLEAR all existing data in the database.
 *    Do NOT run against a production database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Organization = require('../src/models/Organization');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Announcement = require('../src/models/Announcement');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacityconnect';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  // ── Wipe existing collections ──────────────────────────────────────────────
  console.log('\nClearing existing data…');
  await Announcement.deleteMany({});
  await Course.deleteMany({});
  await User.deleteMany({});
  await Organization.deleteMany({});
  console.log('Cleared.');

  // ── Organization ───────────────────────────────────────────────────────────
  const org = await Organization.create({
    name: 'Ministry of Earth Sciences',
    organizationType: 'Government',
    officialEmail: 'admin@moes.gov.in',
    phone: '+91-11-2436-3800',
    address: '12 – 14 Mahadev Road, Prithvi Bhavan',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    traineeAccessKey: 'CC-TRN-DEMO1',
    trainerAccessKey: 'CC-TNR-DEMO1'
  });
  console.log('\n✅ Organization created:', org.name);
  console.log('   Trainee key :', org.traineeAccessKey);
  console.log('   Trainer key :', org.trainerAccessKey);

  // ── Admin ──────────────────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Demo Admin',
    email: 'admin@moes.gov.in',
    password: 'demo1234',
    phone: '+91-11-2436-3800',
    role: 'Admin',
    status: 'active',
    organizationId: org._id,
    organizationName: org.name,
    department: 'Administration'
  });
  org.createdBy = admin._id;
  await org.save();
  console.log('✅ Admin created  :', admin.email, '/ password: demo1234');

  // ── Trainer ────────────────────────────────────────────────────────────────
  const trainer = await User.create({
    name: 'Dr. Ananya Krishnan',
    email: 'ananya.k@moes.gov.in',
    password: 'demo1234',
    phone: '+91 98765 11111',
    role: 'Trainer',
    status: 'active',
    organizationId: org._id,
    organizationName: org.name,
    department: 'Oceanography',
    designation: 'Senior Scientist',
    qualification: 'Ph.D. in Marine Sciences',
    expertise: ['Marine Biology', 'Data Analytics', 'GIS'],
    experience: '5-10',
    professionalBio: 'Senior scientist specialising in marine ecology and data-driven research.'
  });
  console.log('✅ Trainer created :', trainer.email, '/ password: demo1234');

  // ── Trainee ────────────────────────────────────────────────────────────────
  const trainee = await User.create({
    name: 'Rahul Verma',
    email: 'rahul.v@moes.gov.in',
    password: 'demo1234',
    phone: '+91 99000 22222',
    role: 'Trainee',
    status: 'active',
    organizationId: org._id,
    organizationName: org.name,
    department: 'Climate Research',
    designation: 'Research Analyst',
    qualification: 'M.Sc. Environmental Science'
  });
  console.log('✅ Trainee created :', trainee.email, '/ password: demo1234');

  // ── Pending Trainer (for approval workflow demo) ───────────────────────────
  const pendingTrainer = await User.create({
    name: 'Sneha Patel',
    email: 'sneha.p@moes.gov.in',
    password: 'demo1234',
    phone: '+91 91234 56780',
    role: 'Trainer',
    status: 'pending',
    organizationId: org._id,
    organizationName: org.name,
    department: 'Meteorology',
    designation: 'Research Associate',
    qualification: 'M.Sc. Atmospheric Science',
    expertise: ['Meteorology', 'Climate Science'],
    experience: '3-5'
  });
  console.log('✅ Pending Trainer :', pendingTrainer.email, '(status: pending)');

  // ── Courses ────────────────────────────────────────────────────────────────
  const course1 = await Course.create({
    title: 'Introduction to Marine Biology',
    shortDescription: 'An overview of marine ecosystems and biodiversity.',
    description: 'This course covers the fundamentals of marine biology including ocean zones, marine organisms, and ecosystem dynamics.',
    category: 'Biology',
    difficulty: 'Beginner',
    estimatedDuration: '8 hours',
    learningObjectives: ['Understand ocean zones', 'Identify key marine organisms', 'Explain ecosystem dynamics'],
    skills: ['Marine Biology', 'Research', 'Data Analysis'],
    trainer: trainer._id,
    organization: org._id,
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'Ocean Zones & Ecosystems',
        description: 'Overview of ocean depth zones.',
        order: 0,
        lessons: [
          {
            title: 'Introduction to Ocean Zones',
            description: 'The five major ocean zones and their characteristics.',
            type: 'link',
            externalUrl: 'https://oceanservice.noaa.gov/facts/oceanzones.html',
            order: 0
          }
        ]
      }
    ]
  });

  const course2 = await Course.create({
    title: 'GIS & Remote Sensing Fundamentals',
    shortDescription: 'Practical introduction to geographic information systems.',
    description: 'Learn the basics of GIS data collection, analysis, and remote sensing technology for environmental monitoring.',
    category: 'Technology',
    difficulty: 'Intermediate',
    estimatedDuration: '12 hours',
    learningObjectives: ['Set up a GIS project', 'Interpret satellite imagery', 'Perform spatial analysis'],
    skills: ['GIS', 'Remote Sensing', 'Data Analysis'],
    trainer: trainer._id,
    organization: org._id,
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'GIS Fundamentals',
        description: 'Core concepts and tools.',
        order: 0,
        lessons: [
          {
            title: 'What is GIS?',
            type: 'link',
            externalUrl: 'https://www.esri.com/en-us/what-is-gis/overview',
            order: 0
          }
        ]
      }
    ]
  });

  const course3 = await Course.create({
    title: 'Climate Data Analysis',
    shortDescription: 'Statistical methods for climate research data.',
    category: 'Data Science',
    difficulty: 'Advanced',
    estimatedDuration: '16 hours',
    trainer: trainer._id,
    organization: org._id,
    status: 'draft',
    modules: []
  });

  console.log('\n✅ Courses created :', course1.title);
  console.log('                   ', course2.title);
  console.log('                   ', course3.title, '(draft)');

  // ── Announcements ──────────────────────────────────────────────────────────
  await Announcement.create({
    organization: org._id,
    organizationName: org.name,
    createdBy: admin._id,
    createdByName: admin.name,
    title: 'System Maintenance Notice',
    message: 'Capacity Connect will undergo scheduled maintenance this Sunday from 02:00 AM to 04:00 AM IST. Please save your work.',
    audience: 'all',
    type: 'important',
    priority: 'Important'
  });

  await Announcement.create({
    organization: org._id,
    organizationName: org.name,
    createdBy: admin._id,
    createdByName: admin.name,
    title: 'New Courses Now Available',
    message: 'Two new published courses are now available — Introduction to Marine Biology and GIS & Remote Sensing Fundamentals. Enroll today!',
    audience: 'trainees',
    type: 'learning-content',
    priority: 'Normal'
  });

  await Announcement.create({
    organization: org._id,
    organizationName: org.name,
    createdBy: admin._id,
    createdByName: admin.name,
    title: 'Trainer Workshop & Assessment Tools',
    message: 'Mandatory workshop for all Trainers on the new assessment creation tools. Check your email for the meeting link.',
    audience: 'trainers',
    type: 'announcement',
    priority: 'Normal'
  });

  console.log('✅ 3 Announcements created');

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SEED COMPLETE');
  console.log('══════════════════════════════════════════════════');
  console.log('  Organization : Ministry of Earth Sciences');
  console.log('  Trainee key  : CC-TRN-DEMO1');
  console.log('  Trainer key  : CC-TNR-DEMO1');
  console.log('');
  console.log('  Login credentials (password: demo1234)');
  console.log('  Admin   : admin@moes.gov.in');
  console.log('  Trainer : ananya.k@moes.gov.in');
  console.log('  Trainee : rahul.v@moes.gov.in');
  console.log('══════════════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
