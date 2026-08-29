const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const Organization = require('../src/models/Organization');
const Course = require('../src/models/Course');
const http = require('http');

process.env.JWT_SECRET = 'test-secret-key-12345';

async function runTests() {
  console.log('=== STARTING COURSE LIFECYCLE BACKEND VERIFICATION ===');
  let mongoServer;
  let server;

  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api`;

    // 1. Setup Organizations
    const orgA = await Organization.create({
      name: 'MoES Earth Sciences Org',
      officialEmail: 'contact@moes.gov.in',
      traineeAccessKey: 'ORG-A-TRN',
      trainerAccessKey: 'ORG-A-TNR'
    });

    const orgB = await Organization.create({
      name: 'ISRO Remote Sensing Org',
      officialEmail: 'contact@isro.gov.in',
      traineeAccessKey: 'ORG-B-TRN',
      trainerAccessKey: 'ORG-B-TNR'
    });

    // 2. Setup Users
    const trainerA = await User.create({
      name: 'Dr. Ramesh Kumar',
      email: 'ramesh@moes.gov.in',
      password: 'password123',
      role: 'Trainer',
      status: 'active',
      organizationId: orgA._id,
      organizationName: orgA.name
    });

    const trainerB = await User.create({
      name: 'Dr. Sunita Sharma',
      email: 'sunita@isro.gov.in',
      password: 'password123',
      role: 'Trainer',
      status: 'active',
      organizationId: orgB._id,
      organizationName: orgB.name
    });

    const traineeA = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@moes.gov.in',
      password: 'password123',
      role: 'Trainee',
      status: 'active',
      organizationId: orgA._id,
      organizationName: orgA.name
    });

    const traineeB = await User.create({
      name: 'Priya Patel',
      email: 'priya@isro.gov.in',
      password: 'password123',
      role: 'Trainee',
      status: 'active',
      organizationId: orgB._id,
      organizationName: orgB.name
    });

    const adminA = await User.create({
      name: 'Admin Ramesh',
      email: 'admin@moes.gov.in',
      password: 'password123',
      role: 'Admin',
      status: 'active',
      organizationId: orgA._id,
      organizationName: orgA.name
    });

    // Generate Tokens
    const tokenTrainerA = jwt.sign({ id: trainerA._id }, process.env.JWT_SECRET);
    const tokenTrainerB = jwt.sign({ id: trainerB._id }, process.env.JWT_SECRET);
    const tokenTraineeA = jwt.sign({ id: traineeA._id }, process.env.JWT_SECRET);
    const tokenTraineeB = jwt.sign({ id: traineeB._id }, process.env.JWT_SECRET);
    const tokenAdminA = jwt.sign({ id: adminA._id }, process.env.JWT_SECRET);

    // Helper for HTTP requests
    const makeReq = async (method, path, token, body = null) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });

      const data = await res.json();
      return { status: res.status, ok: res.ok, data };
    };

    // TEST 1: Create Course Draft (Trainer A)
    console.log('\n[1] Testing Course Creation Draft...');
    const createRes = await makeReq('POST', '/courses', tokenTrainerA, {
      title: 'Advanced GIS Systems',
      category: 'GIS & Remote Sensing',
      shortDescription: 'Comprehensive guide to GIS systems.',
      description: 'Detailed curriculum covering GIS platforms and spatial analysis.',
      difficulty: 'Intermediate',
      estimatedDuration: '6 Weeks',
      learningObjectives: ['Master GIS software', 'Analyze spatial maps'],
      skills: ['GIS', 'Cartography']
    });

    if (createRes.status !== 201 || !createRes.data.success) {
      throw new Error(`Create course draft failed: ${JSON.stringify(createRes.data)}`);
    }

    const courseId = createRes.data.data._id;
    console.log(`✓ Draft Course created successfully with ID: ${courseId}`);

    // Verify Organization Ownership on backend
    const savedCourse = await Course.findById(courseId);
    if (String(savedCourse.trainer) !== String(trainerA._id) || String(savedCourse.organization) !== String(orgA._id)) {
      throw new Error('Course owner/org mismatch!');
    }
    console.log('✓ Trainer & Organization derived securely from JWT.');

    // TEST 2: Draft course should NOT appear in Trainee Explore
    console.log('\n[2] Testing Draft Visibility (Must NOT appear to Trainees)...');
    const traineeExploreDraft = await makeReq('GET', '/courses', tokenTraineeA);
    if (traineeExploreDraft.data.data.some(c => String(c._id) === courseId)) {
      throw new Error('Draft course inappropriately appeared to Trainee!');
    }
    console.log('✓ Draft course hidden from Trainee.');

    // TEST 3: Module Management & Reordering
    console.log('\n[3] Testing Module Creation, Edit & Reordering...');
    const mod1Res = await makeReq('POST', `/courses/${courseId}/modules`, tokenTrainerA, {
      title: 'Module 1: Introduction to GIS'
    });
    const mod1Id = mod1Res.data.data._id;

    const mod2Res = await makeReq('POST', `/courses/${courseId}/modules`, tokenTrainerA, {
      title: 'Module 2: Spatial Data Processing'
    });
    const mod2Id = mod2Res.data.data._id;

    // Rename Module 1
    await makeReq('PATCH', `/courses/${courseId}/modules/${mod1Id}`, tokenTrainerA, {
      title: 'Module 1: Intro to Remote Sensing & GIS'
    });

    // Reorder Modules (Put Module 2 first)
    await makeReq('PATCH', `/courses/${courseId}/modules/reorder`, tokenTrainerA, {
      moduleOrders: [
        { moduleId: mod2Id, order: 1 },
        { moduleId: mod1Id, order: 2 }
      ]
    });

    const courseAfterReorder = await makeReq('GET', `/courses/${courseId}`, tokenTrainerA);
    if (courseAfterReorder.data.data.modules[0]._id !== mod2Id) {
      throw new Error('Module reordering failed!');
    }
    console.log('✓ Modules created, renamed, and reorder persisted in MongoDB.');

    // TEST 4: Lesson / Material Creation
    console.log('\n[4] Testing Learning Material Creation...');
    const lessonRes = await makeReq('POST', `/courses/${courseId}/modules/${mod1Id}/lessons`, tokenTrainerA, {
      title: 'GIS Overview Video',
      type: 'video',
      duration: '15 mins',
      externalUrl: 'https://example.com/video.mp4'
    });

    if (!lessonRes.data.success) {
      throw new Error('Lesson creation failed!');
    }
    console.log('✓ Learning material added to module.');

    // TEST 5: Publish Validation Failure
    console.log('\n[5] Testing Publish Validation...');
    // Create an incomplete course (no modules/lessons)
    const incompleteCourse = await makeReq('POST', '/courses', tokenTrainerA, {
      title: 'Empty Course',
      category: 'Meteorology'
    });
    const emptyId = incompleteCourse.data.data._id;

    const failPublishRes = await makeReq('PATCH', `/courses/${emptyId}/publish`, tokenTrainerA);
    if (failPublishRes.status !== 400 || failPublishRes.data.success !== false) {
      throw new Error('Incomplete course was published without validation failure!');
    }
    console.log(`✓ Publish validation correctly blocked publishing missing requirements: ${failPublishRes.data.missing.join(', ')}`);

    // TEST 6: Publish Complete Course
    console.log('\n[6] Testing Course Publication...');
    const publishRes = await makeReq('PATCH', `/courses/${courseId}/publish`, tokenTrainerA);
    if (!publishRes.data.success || publishRes.data.data.status !== 'published') {
      throw new Error('Course publish failed!');
    }
    console.log('✓ Complete course published successfully.');

    // TEST 7: Trainee Discovery in SAME Organization
    console.log('\n[7] Testing Trainee Discovery (SAME Organization)...');
    const traineeExplorePublished = await makeReq('GET', '/courses', tokenTraineeA);
    const foundPublished = traineeExplorePublished.data.data.find(c => String(c._id) === courseId);
    if (!foundPublished) {
      throw new Error('Published course did not appear to Trainee in same organization!');
    }
    console.log(`✓ Trainee in Same Organization can see published course: "${foundPublished.title}".`);

    // TEST 8: Trainee Discovery in OTHER Organization (Isolation Security)
    console.log('\n[8] Testing Cross-Organization Isolation...');
    const traineeBExplore = await makeReq('GET', '/courses', tokenTraineeB);
    if (traineeBExplore.data.data.some(c => String(c._id) === courseId)) {
      throw new Error('SECURITY VIOLATION: Trainee B from another org accessed Org A course!');
    }

    const traineeBDirectAccess = await makeReq('GET', `/courses/${courseId}`, tokenTraineeB);
    if (traineeBDirectAccess.status !== 403) {
      throw new Error('SECURITY VIOLATION: Trainee B directly accessed Org A course detail!');
    }
    console.log('✓ Cross-Organization isolation verified (Access denied to Org B users).');

    // TEST 9: Admin Course Monitoring (SAME Organization)
    console.log('\n[9] Testing Admin Monitoring...');
    const adminCourseList = await makeReq('GET', '/courses', tokenAdminA);
    const adminFound = adminCourseList.data.data.find(c => String(c._id) === courseId);
    if (!adminFound) {
      throw new Error('Admin in same org cannot view course catalog!');
    }
    console.log(`✓ Admin in Same Organization can monitor course "${adminFound.title}".`);

    // TEST 10: Cross-Trainer Authorization (Trainer B trying to edit Trainer A course)
    console.log('\n[10] Testing Cross-Trainer Edit Authorization...');
    const forbiddenEdit = await makeReq('PATCH', `/courses/${courseId}`, tokenTrainerB, {
      title: 'Hacked Title'
    });
    if (forbiddenEdit.status !== 403) {
      throw new Error('SECURITY VIOLATION: Trainer B edited Trainer A course!');
    }
    console.log('✓ Trainer ownership enforced (Trainer B blocked from editing Trainer A course).');

    console.log('\n=== ALL LIFECYCLE BACKEND TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('\n❌ VERIFICATION TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  }
}

runTests();
