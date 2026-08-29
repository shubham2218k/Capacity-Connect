const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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
    console.log('=== STARTING TRAINER VERIFICATION & APPROVAL WORKFLOW AUTOMATED SUITE ===\n');

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

    // Create Organizations
    const orgA = await Organization.create({
      name: 'ISRO Telemetry Org',
      code: 'ISTR',
      domain: 'isro.gov.in',
      officialEmail: 'contact@isro.gov.in',
      trainerAccessKey: 'ISRO-TR-KEY',
      traineeAccessKey: 'ISRO-TE-KEY'
    });

    const orgB = await Organization.create({
      name: 'DRDO Defense Org',
      code: 'DRDO',
      domain: 'drdo.gov.in',
      officialEmail: 'contact@drdo.gov.in',
      trainerAccessKey: 'DRDO-TR-KEY',
      traineeAccessKey: 'DRDO-TE-KEY'
    });

    // Create Admin Accounts
    const adminA = await User.create({
      name: 'Admin ISRO',
      email: 'admin@isro.gov.in',
      password: 'Password123!',
      role: 'Admin',
      status: 'active',
      organizationId: orgA._id,
      organizationName: orgA.name
    });

    const adminB = await User.create({
      name: 'Admin DRDO',
      email: 'admin@drdo.gov.in',
      password: 'Password123!',
      role: 'Admin',
      status: 'active',
      organizationId: orgB._id,
      organizationName: orgB.name
    });

    const tokenAdminA = jwt.sign({ id: adminA._id, role: adminA.role, organizationId: adminA.organizationId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const tokenAdminB = jwt.sign({ id: adminB._id, role: adminB.role, organizationId: adminB.organizationId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // TEST A — COMPLETE TRAINER APPLICATION
    console.log('[1] Testing Complete Trainer Application Submission (POST /api/auth/trainer-apply)...');
    const applyRes = await makeReq('POST', '/auth/trainer-apply', null, {
      trainerAccessKey: 'ISRO-TR-KEY',
      name: 'Dr. Sunita Sharma',
      email: 'sunita.sharma@isro.gov.in',
      password: 'Password123!',
      phone: '9876543210',
      department: 'Satellite Navigation',
      designation: 'Lead Scientist',
      employeeId: 'ISRO-EMP-504',
      highestQualification: 'Ph.D. Geoinformatics',
      institution: 'IIT Bombay',
      experienceYears: '5-10',
      expertise: ['GIS', 'Remote Sensing', 'Data Analytics'],
      professionalBio: 'Over 8 years of satellite positioning and remote sensing teaching.'
    });

    if (applyRes.status !== 201 || applyRes.data.data.status !== 'pending') {
      throw new Error(`Trainer application failed: ${JSON.stringify(applyRes.data)}`);
    }
    const trainerId = applyRes.data.data._id;
    console.log('  ✓ Trainer applied successfully. Status: pending. ID:', trainerId);

    // TEST B — ADMIN INSPECTION DETAILS
    console.log('\n[2] Testing Admin Inspection View (GET /api/admin/trainer-applications/:id)...');
    const inspectRes = await makeReq('GET', `/admin/trainer-applications/${trainerId}`, tokenAdminA);
    if (inspectRes.status !== 200 || !inspectRes.data.data.completenessScore) {
      throw new Error(`Inspection failed: ${JSON.stringify(inspectRes.data)}`);
    }
    console.log(`  ✓ Application retrieved. Completeness Score: ${inspectRes.data.data.completenessScore}%.`);

    // TEST C — EARLY APPROVAL BLOCK (CHECKLIST INCOMPLETE)
    console.log('\n[3] Testing Early Approval Prevention (Incomplete Checklist)...');
    const earlyApproveRes = await makeReq('PATCH', `/admin/trainer-applications/${trainerId}/approve`, tokenAdminA);
    if (earlyApproveRes.status !== 400 || !earlyApproveRes.data.message.includes('checklist')) {
      throw new Error(`Early approval was not blocked with 400! Status: ${earlyApproveRes.status}, Data: ${JSON.stringify(earlyApproveRes.data)}`);
    }
    console.log('  ✓ Early approval correctly blocked with 400: "' + earlyApproveRes.data.message + '"');

    // TEST D — REQUEST CHANGES
    console.log('\n[4] Testing Request Changes Flow (PATCH /api/admin/trainer-applications/:id/request-changes)...');
    const reqChangesRes = await makeReq('PATCH', `/admin/trainer-applications/${trainerId}/request-changes`, tokenAdminA, {
      reason: 'Please upload a clearer copy of your Ph.D. degree certificate.'
    });

    if (reqChangesRes.status !== 200 || reqChangesRes.data.data.status !== 'changes_requested') {
      throw new Error(`Request changes failed: ${JSON.stringify(reqChangesRes.data)}`);
    }
    console.log('  ✓ Application status updated to changes_requested.');

    // Verify Trainer Login is blocked with changes_requested message
    const loginChangesRes = await makeReq('POST', '/auth/login', null, {
      email: 'sunita.sharma@isro.gov.in',
      password: 'Password123!',
      role: 'Trainer',
      accessKey: 'ISRO-TR-KEY'
    });

    if (loginChangesRes.status !== 403 || loginChangesRes.data.status !== 'changes_requested') {
      throw new Error(`Trainer login did not return changes_requested status! Data: ${JSON.stringify(loginChangesRes.data)}`);
    }
    console.log('  ✓ Trainer login blocked with clear changes_requested status & remark: "' + loginChangesRes.data.changesRequestedReason + '"');

    // TEST E — TRAINER RESUBMIT
    console.log('\n[5] Testing Trainer Resubmission Flow (POST /api/auth/trainer-resubmit)...');
    const resubmitRes = await makeReq('POST', '/auth/trainer-resubmit', null, {
      email: 'sunita.sharma@isro.gov.in',
      password: 'Password123!',
      qualification: 'Ph.D. Geoinformatics (Verified Copy Attached)',
      institution: 'IIT Bombay (Earth Sciences Dept)'
    });

    if (resubmitRes.status !== 200 || resubmitRes.data.data.status !== 'pending') {
      throw new Error(`Resubmission failed: ${JSON.stringify(resubmitRes.data)}`);
    }
    console.log('  ✓ Application resubmitted. Status returned to: pending.');

    // TEST F — CHECKLIST COMPLETION & APPROVAL -> ACTIVE
    console.log('\n[6] Testing Verification Checklist Persistence & Approval...');
    
    // Admin ticks checklist and verifies competency tags
    const checklistRes = await makeReq('PATCH', `/admin/trainer-applications/${trainerId}/review-checklist`, tokenAdminA, {
      organizationVerified: true,
      profileComplete: true,
      qualificationReviewed: true,
      experienceReviewed: true,
      expertiseReviewed: true,
      documentsReviewed: true,
      verifiedExpertise: ['GIS', 'Remote Sensing'],
      adminRemarks: 'Credentials and satellite training experience fully verified.'
    });

    if (checklistRes.status !== 200) {
      throw new Error(`Checklist update failed: ${JSON.stringify(checklistRes.data)}`);
    }
    console.log('  ✓ Verification checklist updated and persisted.');

    // Approve Trainer
    const approveRes = await makeReq('PATCH', `/admin/trainer-applications/${trainerId}/approve`, tokenAdminA);
    if (approveRes.status !== 200 || approveRes.data.data.status !== 'active') {
      throw new Error(`Approval failed: ${JSON.stringify(approveRes.data)}`);
    }
    console.log('  ✓ Trainer application approved! Status: active.');

    // Verify Trainer Login Now Succeeds
    const loginActiveRes = await makeReq('POST', '/auth/login', null, {
      email: 'sunita.sharma@isro.gov.in',
      password: 'Password123!',
      role: 'Trainer',
      accessKey: 'ISRO-TR-KEY'
    });

    if (loginActiveRes.status !== 200 || !loginActiveRes.data.data.token) {
      throw new Error(`Approved trainer login failed! Status: ${loginActiveRes.status}, Data: ${JSON.stringify(loginActiveRes.data)}`);
    }
    console.log('  ✓ Approved Trainer logged in successfully to Trainer Portal.');

    // TEST G — REJECT FLOW
    console.log('\n[7] Testing Application Rejection Flow...');
    const apply2Res = await makeReq('POST', '/auth/trainer-apply', null, {
      trainerAccessKey: 'ISRO-TR-KEY',
      name: 'Unqualified Applicant',
      email: 'unqualified@isro.gov.in',
      password: 'Password123!',
      phone: '9999999999',
      department: 'General',
      designation: 'Trainee Assistant',
      highestQualification: 'High School',
      expertise: ['Basic Computer']
    });

    const trainer2Id = apply2Res.data.data._id;
    const rejectRes = await makeReq('PATCH', `/admin/trainer-applications/${trainer2Id}/reject`, tokenAdminA, {
      reason: 'Qualifications do not meet minimum trainer criteria.'
    });

    if (rejectRes.status !== 200 || rejectRes.data.data.status !== 'rejected') {
      throw new Error(`Rejection failed: ${JSON.stringify(rejectRes.data)}`);
    }
    console.log('  ✓ Application rejected with stored reason.');

    const loginRejectedRes = await makeReq('POST', '/auth/login', null, {
      email: 'unqualified@isro.gov.in',
      password: 'Password123!',
      role: 'Trainer',
      accessKey: 'ISRO-TR-KEY'
    });

    if (loginRejectedRes.status !== 403 || !loginRejectedRes.data.message.includes('rejected')) {
      throw new Error(`Rejected trainer login was not blocked! Status: ${loginRejectedRes.status}`);
    }
    console.log('  ✓ Rejected trainer login blocked with message: "' + loginRejectedRes.data.message + '"');

    // TEST H — ORGANIZATION ISOLATION
    console.log('\n[8] Testing Organization Isolation (Admin Org B vs Org A Trainer)...');
    const crossOrgInspect = await makeReq('GET', `/admin/trainer-applications/${trainerId}`, tokenAdminB);
    if (crossOrgInspect.status !== 403 && crossOrgInspect.status !== 404) {
      throw new Error(`Cross-org inspection was not denied with 403/404! Status: ${crossOrgInspect.status}`);
    }
    console.log('  ✓ Cross-organization inspection attempt denied with status:', crossOrgInspect.status);

    console.log('\n=== ALL TRAINER APPROVAL & VERIFICATION TESTS PASSED! ===');

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
