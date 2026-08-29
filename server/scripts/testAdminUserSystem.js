const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';

// Models
const User = require('../src/models/User');
const Organization = require('../src/models/Organization');

// App & Routes
const authRoutes = require('../src/routes/authRoutes');
const adminRoutes = require('../src/routes/adminRoutes');

async function runTests() {
  let mongoServer;
  let server;
  let baseUrl;

  try {
    console.log('=== STARTING ADMIN USER MANAGEMENT SYSTEM AUTOMATED SUITE ===\n');

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}/api`;
        resolve();
      });
    });

    const makeReq = async (method, endpoint, token = null, body = null) => {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (body) headers['Content-Type'] = 'application/json';

      const opts = { method, headers };
      if (body) opts.body = JSON.stringify(body);

      const res = await fetch(`${baseUrl}${endpoint}`, opts);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : await res.text();
      return { status: res.status, data, headers: res.headers };
    };

    // 1. Create Organizations
    const orgA = await Organization.create({
      name: 'Tech Corp India',
      code: 'TECH',
      domain: 'techcorp.com',
      officialEmail: 'contact@techcorp.com',
      trainerAccessKey: 'TECH-TR-KEY',
      traineeAccessKey: 'TECH-TE-KEY'
    });

    const orgB = await Organization.create({
      name: 'Global Space Org',
      code: 'GLOB',
      domain: 'globalspace.org',
      officialEmail: 'contact@globalspace.org',
      trainerAccessKey: 'GLOB-TR-KEY',
      traineeAccessKey: 'GLOB-TE-KEY'
    });

    // Create Admins
    const adminA = await User.create({
      name: 'System Admin A',
      email: 'adminA@techcorp.com',
      password: 'Password123!',
      role: 'Admin',
      status: 'active',
      organizationId: orgA._id,
      organizationName: orgA.name
    });

    const adminB = await User.create({
      name: 'System Admin B',
      email: 'adminB@globalspace.org',
      password: 'Password123!',
      role: 'Admin',
      status: 'active',
      organizationId: orgB._id,
      organizationName: orgB.name
    });

    const tokenAdminA = jwt.sign({ id: adminA._id, role: adminA.role, organizationId: adminA.organizationId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const tokenAdminB = jwt.sign({ id: adminB._id, role: adminB.role, organizationId: adminB.organizationId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // TEST 1: Register Trainee & Verify in Admin Users List
    console.log('[1] Testing Trainee Registration & Admin Users List Appearance...');
    const traineeRegRes = await makeReq('POST', '/auth/trainee-register', null, {
      name: 'Ananya Roy',
      email: 'ananya.roy@techcorp.com',
      password: 'Password123!',
      phone: '9876543210',
      traineeAccessKey: 'TECH-TE-KEY',
      department: 'Data Engineering',
      designation: 'Junior Analyst',
      qualification: 'B.Tech CS'
    });

    if (traineeRegRes.status !== 201) {
      throw new Error(`Trainee registration failed: ${JSON.stringify(traineeRegRes.data)}`);
    }
    const traineeA = traineeRegRes.data.data;
    console.log('  ✓ Trainee registered:', traineeA.name);

    const adminUsersRes1 = await makeReq('GET', '/admin/users', tokenAdminA);
    const foundTrainee = adminUsersRes1.data.data.find(u => u.email === 'ananya.roy@techcorp.com');
    if (!foundTrainee || foundTrainee.status !== 'active') {
      throw new Error(`Newly registered Trainee not found in Admin user list: ${JSON.stringify(adminUsersRes1.data)}`);
    }
    console.log('  ✓ Newly registered Trainee automatically appeared in Admin Users list with status: active.');

    // TEST 2: Submit Trainer Application & Verify Pending Appearance
    console.log('\n[2] Testing Trainer Application & Pending Approval Status Appearance...');
    const trainerApplyRes = await makeReq('POST', '/auth/trainer-apply', null, {
      name: 'Dr. Vikram Seth',
      email: 'vikram.seth@techcorp.com',
      password: 'Password123!',
      phone: '9123456789',
      trainerAccessKey: 'TECH-TR-KEY',
      department: 'AI & Machine Learning',
      designation: 'Principal Researcher',
      qualification: 'Ph.D. AI',
      expertise: ['Deep Learning', 'Computer Vision'],
      experience: '8 years'
    });

    if (trainerApplyRes.status !== 201) {
      throw new Error(`Trainer application failed: ${JSON.stringify(trainerApplyRes.data)}`);
    }
    console.log('  ✓ Trainer application submitted.');

    const adminUsersRes2 = await makeReq('GET', '/admin/users', tokenAdminA);
    const foundTrainer = adminUsersRes2.data.data.find(u => u.email === 'vikram.seth@techcorp.com');
    if (!foundTrainer || foundTrainer.status !== 'pending') {
      throw new Error(`Applied Trainer not found as pending in Admin users list: ${JSON.stringify(adminUsersRes2.data)}`);
    }
    console.log('  ✓ Newly applied Trainer automatically appeared in Admin Users list with status: pending.');

    // TEST 3: User Profile Inspection
    console.log('\n[3] Testing User Profile Details Endpoint (GET /api/admin/users/:id)...');
    const profileRes = await makeReq('GET', `/admin/users/${traineeA._id}`, tokenAdminA);
    if (profileRes.status !== 200 || !profileRes.data.data.qualification) {
      throw new Error(`Profile inspection failed: ${JSON.stringify(profileRes.data)}`);
    }
    if (profileRes.data.data.password) {
      throw new Error('CRITICAL SECURITY LEAK: Password field returned in profile inspection!');
    }
    console.log('  ✓ User profile retrieved cleanly with professional information (Qualification: ' + profileRes.data.data.qualification + '). No password leaked.');

    // TEST 4: Suspend Trainee & Verify Suspended Login Block
    console.log('\n[4] Testing Account Suspension & Login Block...');
    const suspendRes = await makeReq('PATCH', `/admin/users/${traineeA._id}/suspend`, tokenAdminA);
    if (suspendRes.status !== 200 || suspendRes.data.data.status !== 'suspended') {
      throw new Error(`Suspend account failed: ${JSON.stringify(suspendRes.data)}`);
    }
    console.log('  ✓ Trainee account suspended.');

    const suspendedLoginRes = await makeReq('POST', '/auth/login', null, {
      email: 'ananya.roy@techcorp.com',
      password: 'Password123!',
      role: 'Trainee',
      accessKey: 'TECH-TE-KEY'
    });

    if (suspendedLoginRes.status !== 403 || !suspendedLoginRes.data.message.includes('suspended')) {
      throw new Error(`Suspended user login was not blocked with 403! Status: ${suspendedLoginRes.status}, Data: ${JSON.stringify(suspendedLoginRes.data)}`);
    }
    console.log('  ✓ Suspended user login rejected with 403: "' + suspendedLoginRes.data.message + '"');

    // TEST 5: Reactivate Trainee & Verify Login Restoration
    console.log('\n[5] Testing Account Reactivation & Login Restoration...');
    const reactivateRes = await makeReq('PATCH', `/admin/users/${traineeA._id}/reactivate`, tokenAdminA);
    if (reactivateRes.status !== 200 || reactivateRes.data.data.status !== 'active') {
      throw new Error(`Reactivate account failed: ${JSON.stringify(reactivateRes.data)}`);
    }
    console.log('  ✓ Trainee account reactivated.');

    const activeLoginRes = await makeReq('POST', '/auth/login', null, {
      email: 'ananya.roy@techcorp.com',
      password: 'Password123!',
      role: 'Trainee',
      accessKey: 'TECH-TE-KEY'
    });

    if (activeLoginRes.status !== 200 || !activeLoginRes.data.data.token) {
      throw new Error(`Reactivated user login failed! Status: ${activeLoginRes.status}, Data: ${JSON.stringify(activeLoginRes.data)}`);
    }
    console.log('  ✓ Reactivated user logged in successfully.');

    // TEST 6: Soft Delete User & Verify List Exclusion, Login Block, & DB Record Preservation
    console.log('\n[6] Testing Soft Delete User...');
    const deleteRes = await makeReq('DELETE', `/admin/users/${traineeA._id}`, tokenAdminA);
    if (deleteRes.status !== 200) {
      throw new Error(`Soft delete failed: ${JSON.stringify(deleteRes.data)}`);
    }
    console.log('  ✓ Soft delete endpoint succeeded.');

    // Verify user is excluded from normal Admin list
    const adminUsersRes3 = await makeReq('GET', '/admin/users', tokenAdminA);
    const deletedInList = adminUsersRes3.data.data.find(u => u.email === 'ananya.roy@techcorp.com');
    if (deletedInList) {
      throw new Error('Soft-deleted user still returned in normal Admin users query!');
    }
    console.log('  ✓ Soft-deleted user excluded from Admin Users list.');

    // Verify login is blocked
    const deletedLoginRes = await makeReq('POST', '/auth/login', null, {
      email: 'ananya.roy@techcorp.com',
      password: 'Password123!',
      role: 'Trainee',
      accessKey: 'TECH-TE-KEY'
    });
    if (deletedLoginRes.status !== 401) {
      throw new Error(`Soft-deleted user login was not blocked! Status: ${deletedLoginRes.status}`);
    }
    console.log('  ✓ Soft-deleted user login blocked.');

    // Verify database record still exists for historical compliance
    const dbRecord = await User.findById(traineeA._id);
    if (!dbRecord || !dbRecord.isDeleted || !dbRecord.deletedAt) {
      throw new Error('Database record was physically purged or missing isDeleted flag!');
    }
    console.log('  ✓ Historical database record preserved in MongoDB with isDeleted: true and deletedAt timestamp.');

    // TEST 7: Organization Isolation & Self Admin Protection
    console.log('\n[7] Testing Organization Isolation & Self Admin Protection...');
    
    // Cross-org inspection by Admin B on Org A user
    const crossOrgRes = await makeReq('GET', `/admin/users/${foundTrainer._id}`, tokenAdminB);
    if (crossOrgRes.status !== 403 && crossOrgRes.status !== 404) {
      throw new Error(`Cross-org inspection was not denied with 403/404! Status: ${crossOrgRes.status}`);
    }
    console.log('  ✓ Cross-organization inspection attempt denied with status:', crossOrgRes.status);

    // Self Admin suspend protection
    const selfSuspendRes = await makeReq('PATCH', `/admin/users/${adminA._id}/suspend`, tokenAdminA);
    if (selfSuspendRes.status !== 400 || !selfSuspendRes.data.message.includes('own Admin account')) {
      throw new Error(`Self-admin suspension was not blocked! Status: ${selfSuspendRes.status}, Data: ${JSON.stringify(selfSuspendRes.data)}`);
    }
    console.log('  ✓ Self-Admin suspension attempt blocked with 400: "' + selfSuspendRes.data.message + '"');

    console.log('\n=== ALL ADMIN USER MANAGEMENT TESTS PASSED! ===');

  } catch (err) {
    console.error('\n❌ VERIFICATION SUITE FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  }
}

runTests();
