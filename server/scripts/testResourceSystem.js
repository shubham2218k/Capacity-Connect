const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';

// Models
const User = require('../src/models/User');
const Organization = require('../src/models/Organization');
const Course = require('../src/models/Course');

// App & Routes
const authRoutes = require('../src/routes/authRoutes');
const adminRoutes = require('../src/routes/adminRoutes');
const courseRoutes = require('../src/routes/courseRoutes');
const resourceRoutes = require('../src/routes/resourceRoutes');

async function runTests() {
  let mongoServer;
  let server;
  let baseUrl;

  try {
    console.log('=== STARTING REAL LEARNING RESOURCE SYSTEM AUTOMATED AUDIT ===\n');

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/resources', resourceRoutes);

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}/api`;
        resolve();
      });
    });

    // Helper for requests
    const makeReq = async (method, endpoint, token = null, body = null) => {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';

      const opts = { method, headers };
      if (body) opts.body = body instanceof FormData ? body : JSON.stringify(body);

      const res = await fetch(`${baseUrl}${endpoint}`, opts);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : await res.text();
      return { status: res.status, data, headers: res.headers };
    };

    // 1. Create Organizations & Users
    const orgA = await Organization.create({ 
      name: 'Org A Space', 
      code: 'ORGA', 
      domain: 'orga.com',
      officialEmail: 'admin@orga.com',
      trainerAccessKey: 'TR-ORGA-KEY',
      traineeAccessKey: 'TE-ORGA-KEY'
    });
    const orgB = await Organization.create({ 
      name: 'Org B Terra', 
      code: 'ORGB', 
      domain: 'orgb.com',
      officialEmail: 'admin@orgb.com',
      trainerAccessKey: 'TR-ORGB-KEY',
      traineeAccessKey: 'TE-ORGB-KEY'
    });

    const trainerA = await User.create({
      name: 'Dr. Meera Nair',
      email: 'trainerA@orga.com',
      password: 'Password123!',
      role: 'Trainer',
      organizationId: orgA._id,
      isApproved: true
    });

    const traineeA = await User.create({
      name: 'Rohan Sharma',
      email: 'traineeA@orga.com',
      password: 'Password123!',
      role: 'Trainee',
      organizationId: orgA._id,
      isApproved: true
    });

    const adminA = await User.create({
      name: 'Admin Meena',
      email: 'adminA@orga.com',
      password: 'Password123!',
      role: 'Admin',
      organizationId: orgA._id,
      isApproved: true
    });

    const traineeB = await User.create({
      name: 'Cross Org User',
      email: 'traineeB@orgb.com',
      password: 'Password123!',
      role: 'Trainee',
      organizationId: orgB._id,
      isApproved: true
    });

    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const tokenTrainerA = jwt.sign({ id: trainerA._id, role: trainerA.role, organizationId: trainerA.organizationId }, jwtSecret, { expiresIn: '1h' });
    const tokenTraineeA = jwt.sign({ id: traineeA._id, role: traineeA.role, organizationId: traineeA.organizationId }, jwtSecret, { expiresIn: '1h' });
    const tokenAdminA = jwt.sign({ id: adminA._id, role: adminA.role, organizationId: adminA.organizationId }, jwtSecret, { expiresIn: '1h' });
    const tokenTraineeB = jwt.sign({ id: traineeB._id, role: traineeB.role, organizationId: traineeB.organizationId }, jwtSecret, { expiresIn: '1h' });

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads/course-materials');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // 2. Create Course & Modules (Draft Status)
    console.log('[1] Testing Resource Creation under Course/Module...');
    const courseRes = await makeReq('POST', '/courses', tokenTrainerA, {
      title: 'Oceanography & Remote Sensing',
      category: 'Marine Biology',
      description: 'Comprehensive study of ocean current mapping using satellite data.',
      learningObjectives: ['Understand satellite radar fundamentals and ocean currents'],
      skills: ['Satellite Mapping', 'Oceanography']
    });
    if (courseRes.status !== 201) {
      throw new Error(`Create course failed: ${JSON.stringify(courseRes.data)}`);
    }
    const courseId = courseRes.data.data._id;

    const modRes = await makeReq('POST', `/courses/${courseId}/modules`, tokenTrainerA, { title: 'Module 1: Satellite Radar Basics' });
    const moduleId = modRes.data.data._id;

    // Upload PDF Lesson
    const pdfFormData = new FormData();
    pdfFormData.append('title', 'Ocean Satellite Fundamentals');
    pdfFormData.append('description', 'Introduction to synthetic aperture radar.');
    pdfFormData.append('type', 'pdf');
    pdfFormData.append('file', new Blob(['%PDF-1.4 Mock Ocean PDF Content'], { type: 'application/pdf' }), 'Ocean_Radar_Intro.pdf');

    const pdfRes = await fetch(`${baseUrl}/courses/${courseId}/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenTrainerA}` },
      body: pdfFormData
    });
    const pdfLesson = (await pdfRes.json()).data;
    console.log('  ✓ Created PDF Lesson:', pdfLesson.title);

    // Upload Link Lesson
    const linkRes = await makeReq('POST', `/courses/${courseId}/modules/${moduleId}/lessons`, tokenTrainerA, {
      title: 'NOAA Ocean Data Portal',
      description: 'Live sea surface temperature measurements.',
      type: 'link',
      externalUrl: 'https://www.noaa.gov/ocean-data'
    });
    const linkLesson = linkRes.data.data;
    console.log('  ✓ Created Link Lesson:', linkLesson.title);

    // 3. Test GET /api/resources Role Behavior in DRAFT State
    console.log('\n[2] Testing GET /api/resources Role Behavior in Draft State...');
    
    // Trainee A should see 0 (course is draft)
    const traineeDraftRes = await makeReq('GET', '/resources', tokenTraineeA);
    if (traineeDraftRes.data.data.length !== 0) {
      throw new Error(`Trainee saw draft resources! Count: ${traineeDraftRes.data.data.length}`);
    }
    console.log('  ✓ Trainee correctly returned 0 resources for unpublished course.');

    // Trainer A should see 2 resources (their own course)
    const trainerDraftRes = await makeReq('GET', '/resources', tokenTrainerA);
    if (trainerDraftRes.data.data.length !== 2) {
      throw new Error(`Trainer failed to see owned draft resources! Count: ${trainerDraftRes.data.data.length}`);
    }
    console.log('  ✓ Trainer correctly returned 2 resources for owned course in draft.');

    // Admin A should see 2 resources (org draft)
    const adminDraftRes = await makeReq('GET', '/resources', tokenAdminA);
    if (adminDraftRes.data.data.length !== 2) {
      throw new Error(`Admin failed to see org draft resources! Count: ${adminDraftRes.data.data.length}`);
    }
    console.log('  ✓ Admin correctly returned 2 resources for org course in draft.');

    // 4. Publish Course & Re-Test Trainee Access
    console.log('\n[3] Publishing Course & Testing Trainee Resource Discovery...');
    const pubRes = await makeReq('PATCH', `/courses/${courseId}/publish`, tokenTrainerA);
    if (pubRes.status !== 200) {
      throw new Error(`Publish course failed with status ${pubRes.status}: ${JSON.stringify(pubRes.data)}`);
    }

    const traineePubRes = await makeReq('GET', '/resources', tokenTraineeA);
    if (traineePubRes.data.data.length !== 2) {
      throw new Error(`Trainee failed to discover published resources! Count: ${traineePubRes.data.data.length}, data: ${JSON.stringify(traineePubRes.data)}`);
    }
    const sampleRes = traineePubRes.data.data[0];
    if (!sampleRes.courseTitle || !sampleRes.moduleTitle || !sampleRes.trainerName) {
      throw new Error(`Resource normalized payload missing required attributes: ${JSON.stringify(sampleRes)}`);
    }
    console.log('  ✓ Trainee successfully retrieved 2 published resources with normalized metadata (Course: ' + sampleRes.courseTitle + ', Trainer: ' + sampleRes.trainerName + ').');

    // 5. Test Organization Isolation
    console.log('\n[4] Testing Cross-Organization Resource Isolation...');
    const traineeBRes = await makeReq('GET', '/resources', tokenTraineeB);
    if (traineeBRes.data.data.length !== 0) {
      throw new Error(`Cross-org Trainee B leaked resources! Count: ${traineeBRes.data.data.length}`);
    }
    
    const traineeBDirectRes = await makeReq('GET', `/resources/${courseId}/${moduleId}/${pdfLesson._id}`, tokenTraineeB);
    if (traineeBDirectRes.status !== 403) {
      throw new Error(`Cross-org Trainee B direct lookup was not blocked with 403! Status: ${traineeBDirectRes.status}`);
    }
    console.log('  ✓ Cross-organization isolation verified (0 resources listed, 403 on direct lookup).');

    // 6. Test Inline View Endpoint GET /api/resources/:courseId/:moduleId/:lessonId/view
    console.log('\n[5] Testing Real View Endpoint (Inline Streaming)...');
    
    // PDF View
    const pdfViewRes = await makeReq('GET', `/resources/${courseId}/${moduleId}/${pdfLesson._id}/view`, tokenTraineeA);
    if (pdfViewRes.status !== 200) {
      throw new Error(`PDF view failed with status ${pdfViewRes.status}`);
    }
    const contentType = pdfViewRes.headers.get('content-type');
    const contentDisp = pdfViewRes.headers.get('content-disposition');
    if (!contentType.includes('application/pdf') || !contentDisp.includes('inline')) {
      throw new Error(`Invalid PDF view headers. Content-Type: ${contentType}, Content-Disposition: ${contentDisp}`);
    }
    console.log('  ✓ PDF View endpoint served file with Content-Type: application/pdf and Content-Disposition: inline.');

    // Link View
    const linkViewRes = await makeReq('GET', `/resources/${courseId}/${moduleId}/${linkLesson._id}/view`, tokenTraineeA);
    if (linkViewRes.status !== 200 || linkViewRes.data.type !== 'link' || !linkViewRes.data.externalUrl) {
      throw new Error(`Link view failed: ${JSON.stringify(linkViewRes.data)}`);
    }
    console.log('  ✓ Link View endpoint returned external URL:', linkViewRes.data.externalUrl);

    // 7. Test Download Endpoint GET /api/resources/:courseId/:moduleId/:lessonId/download
    console.log('\n[6] Testing Real Download Endpoint (Attachment Disposition)...');
    const pdfDownloadRes = await makeReq('GET', `/resources/${courseId}/${moduleId}/${pdfLesson._id}/download`, tokenTraineeA);
    if (pdfDownloadRes.status !== 200) {
      throw new Error(`PDF download failed with status ${pdfDownloadRes.status}`);
    }
    const dlDisp = pdfDownloadRes.headers.get('content-disposition');
    if (!dlDisp.includes('attachment') || !dlDisp.includes('Ocean_Radar_Intro.pdf')) {
      throw new Error(`Invalid download headers. Content-Disposition: ${dlDisp}`);
    }
    console.log('  ✓ PDF Download endpoint served file with Content-Disposition: attachment; filename="Ocean_Radar_Intro.pdf".');

    // 8. Test Broken Physical File Handling
    console.log('\n[7] Testing Broken Physical File Handling...');
    const createdFilename = path.basename(pdfLesson.fileUrl);
    const physicalPath = path.join(uploadsDir, createdFilename);
    
    if (fs.existsSync(physicalPath)) {
      fs.unlinkSync(physicalPath); // Simulates missing disk file
    }

    const brokenViewRes = await makeReq('GET', `/resources/${courseId}/${moduleId}/${pdfLesson._id}/view`, tokenTraineeA);
    if (brokenViewRes.status !== 404 || !brokenViewRes.data.message.includes('unavailable')) {
      throw new Error(`Broken file did not return clean 404! Status: ${brokenViewRes.status}, Data: ${JSON.stringify(brokenViewRes.data)}`);
    }
    console.log('  ✓ Missing physical file handled gracefully with 404: "Resource file is unavailable."');

    console.log('\n=== ALL REAL LEARNING RESOURCE SYSTEM TESTS PASSED! ===');
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
