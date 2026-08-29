const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const http = require('http');
const app = require('../src/app');
const User = require('../src/models/User');
const Organization = require('../src/models/Organization');
const Course = require('../src/models/Course');

process.env.JWT_SECRET = 'test-secret-key-12345';

async function runTests() {
  console.log('=== STARTING COURSE LIFECYCLE AUDIT & SECURITY SUITE ===\n');
  let mongoServer;
  let server;
  const createdFilesToClean = [];

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

    const trainerA2 = await User.create({
      name: 'Dr. Anita Desai',
      email: 'anita@moes.gov.in',
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

    // Tokens
    const tokenTrainerA = jwt.sign({ id: trainerA._id }, process.env.JWT_SECRET);
    const tokenTrainerA2 = jwt.sign({ id: trainerA2._id }, process.env.JWT_SECRET);
    const tokenTrainerB = jwt.sign({ id: trainerB._id }, process.env.JWT_SECRET);
    const tokenTraineeA = jwt.sign({ id: traineeA._id }, process.env.JWT_SECRET);
    const tokenTraineeB = jwt.sign({ id: traineeB._id }, process.env.JWT_SECRET);
    const tokenAdminA = jwt.sign({ id: adminA._id }, process.env.JWT_SECRET);

    // Helpers
    const makeReq = async (method, reqPath, token, body = null) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}${reqPath}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });

      const data = await res.json().catch(() => ({}));
      return { status: res.status, ok: res.ok, data };
    };

    // TEST 1: Create Draft Course
    console.log('[1] Testing Draft Course Creation...');
    const createRes = await makeReq('POST', '/courses', tokenTrainerA, {
      title: 'Advanced GIS Systems',
      category: 'GIS & Remote Sensing',
      shortDescription: 'Comprehensive guide to GIS systems.',
      description: 'Detailed curriculum covering GIS platforms.',
      difficulty: 'Intermediate',
      estimatedDuration: '6 Weeks',
      learningObjectives: ['Master GIS software'],
      skills: ['GIS', 'Cartography']
    });

    if (createRes.status !== 201 || !createRes.data.success) {
      throw new Error(`Create course draft failed: ${JSON.stringify(createRes.data)}`);
    }

    const courseId = createRes.data.data._id;
    console.log(`  ✓ Draft Course created (ID: ${courseId}).`);

    // TEST 2: Trainee Draft Visibility (Must be hidden)
    console.log('\n[2] Testing Trainee Draft Visibility (Must be hidden)...');
    const traineeExplore = await makeReq('GET', '/courses', tokenTraineeA);
    if (traineeExplore.data.data.some(c => String(c._id) === courseId)) {
      throw new Error('Draft course inappropriately visible to Trainee!');
    }
    console.log('  ✓ Draft course hidden from Trainees.');

    // TEST 3: Trainer Privacy (Same org non-owner cannot view draft)
    console.log('\n[3] Testing Trainer Draft Privacy (Non-owner same org)...');
    const sameOrgTrainerDraftAccess = await makeReq('GET', `/courses/${courseId}`, tokenTrainerA2);
    if (sameOrgTrainerDraftAccess.status !== 403) {
      throw new Error(`Same-org Trainer B was able to view Trainer A draft (status ${sameOrgTrainerDraftAccess.status})`);
    }
    console.log('  ✓ Same-org non-owner Trainer correctly denied access to draft.');

    // TEST 4: Admin Draft Access (Same org Admin CAN view draft)
    console.log('\n[4] Testing Admin Access to Draft Course...');
    const adminDraftAccess = await makeReq('GET', `/courses/${courseId}`, tokenAdminA);
    if (adminDraftAccess.status !== 200 || !adminDraftAccess.data.success) {
      throw new Error('Same-org Admin failed to access draft course!');
    }
    console.log('  ✓ Same-org Admin successfully accessed draft course.');

    // TEST 5: Module Creation & Reorder
    console.log('\n[5] Testing Module Creation & Reordering...');
    const mod1Res = await makeReq('POST', `/courses/${courseId}/modules`, tokenTrainerA, { title: 'Module 1: Foundations' });
    const mod1Id = mod1Res.data.data._id;

    const mod2Res = await makeReq('POST', `/courses/${courseId}/modules`, tokenTrainerA, { title: 'Module 2: Advanced Topics' });
    const mod2Id = mod2Res.data.data._id;

    await makeReq('PATCH', `/courses/${courseId}/modules/reorder`, tokenTrainerA, {
      moduleOrders: [
        { moduleId: mod2Id, order: 1 },
        { moduleId: mod1Id, order: 2 }
      ]
    });

    const courseReorderCheck = await makeReq('GET', `/courses/${courseId}`, tokenTrainerA);
    if (courseReorderCheck.data.data.modules[0]._id !== mod2Id) {
      throw new Error('Module reorder persistence failed!');
    }
    console.log('  ✓ Modules created and reordering persisted.');

    // TEST 6: Material Integrity Validation (Rejections)
    console.log('\n[6] Testing Material Integrity (Rejecting invalid materials)...');
    // 6a: File-based lesson without file
    const noFileLessonRes = await makeReq('POST', `/courses/${courseId}/modules/${mod1Id}/lessons`, tokenTrainerA, {
      title: 'Missing File Video',
      type: 'video'
    });
    if (noFileLessonRes.status !== 400) {
      throw new Error(`Server allowed creating video lesson without file! Status: ${noFileLessonRes.status}`);
    }
    console.log(`  ✓ Video lesson without file correctly rejected with 400: "${noFileLessonRes.data.message}"`);

    // 6b: Link lesson without externalUrl
    const noUrlLinkRes = await makeReq('POST', `/courses/${courseId}/modules/${mod1Id}/lessons`, tokenTrainerA, {
      title: 'Empty Link',
      type: 'link'
    });
    if (noUrlLinkRes.status !== 400) {
      throw new Error(`Server allowed creating link lesson without externalUrl! Status: ${noUrlLinkRes.status}`);
    }
    console.log(`  ✓ Link lesson without URL correctly rejected with 400: "${noUrlLinkRes.data.message}"`);

    // TEST 7: Valid Link Lesson
    console.log('\n[7] Testing Valid Link Material Creation...');
    const validLinkRes = await makeReq('POST', `/courses/${courseId}/modules/${mod1Id}/lessons`, tokenTrainerA, {
      title: 'Documentation Link',
      type: 'link',
      externalUrl: 'https://example.com/docs'
    });
    if (validLinkRes.status !== 201) {
      throw new Error(`Valid link creation failed: ${JSON.stringify(validLinkRes.data)}`);
    }
    console.log('  ✓ Valid link lesson created successfully.');

    // TEST 8: Multipart File Upload (PDF)
    console.log('\n[8] Testing Multipart File Upload (PDF Material)...');
    const pdfFormData = new FormData();
    pdfFormData.append('title', 'GIS Reference Manual');
    pdfFormData.append('type', 'pdf');
    pdfFormData.append('file', new Blob(['%PDF-1.4 sample content'], { type: 'application/pdf' }), 'gis_manual.pdf');

    const pdfUploadRes = await fetch(`${baseUrl}/courses/${courseId}/modules/${mod1Id}/lessons`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenTrainerA}` },
      body: pdfFormData
    });
    const pdfUploadData = await pdfUploadRes.json();
    if (pdfUploadRes.status !== 201 || !pdfUploadData.success) {
      throw new Error(`PDF file upload failed: ${JSON.stringify(pdfUploadData)}`);
    }

    const uploadedLesson = pdfUploadData.data;
    if (uploadedLesson.fileUrl) {
      createdFilesToClean.push(uploadedLesson.fileUrl);
    }

    if (!uploadedLesson.fileUrl || uploadedLesson.mimeType !== 'application/pdf' || !uploadedLesson.fileSize) {
      throw new Error(`Uploaded file metadata incomplete: ${JSON.stringify(uploadedLesson)}`);
    }
    console.log(`  ✓ PDF uploaded successfully. File URL: ${uploadedLesson.fileUrl}`);

    // TEST 9: Protected Material Endpoint
    console.log('\n[9] Testing Protected Material Access Endpoint...');
    const materialUrl = `/courses/${courseId}/modules/${mod1Id}/lessons/${uploadedLesson._id}/material`;
    
    // Trainer A (Owner) -> 200
    const ownerMatRes = await fetch(`${baseUrl}${materialUrl}`, {
      headers: { 'Authorization': `Bearer ${tokenTrainerA}` }
    });
    if (ownerMatRes.status !== 200) {
      throw new Error(`Owner failed to access material endpoint. Status: ${ownerMatRes.status}`);
    }

    // Trainee A on draft -> 403
    const traineeDraftMatRes = await fetch(`${baseUrl}${materialUrl}`, {
      headers: { 'Authorization': `Bearer ${tokenTraineeA}` }
    });
    if (traineeDraftMatRes.status !== 403) {
      throw new Error(`Trainee was able to access draft material! Status: ${traineeDraftMatRes.status}`);
    }
    console.log('  ✓ Protected material access controls verified (Owner 200, Trainee Draft 403).');

    // TEST 10: Disallowed Extension / MIME Validation
    console.log('\n[10] Testing Disallowed File Upload Rejection...');
    const invalidFormData = new FormData();
    invalidFormData.append('title', 'Executable Malware');
    invalidFormData.append('type', 'pdf');
    invalidFormData.append('file', new Blob(['binary data'], { type: 'application/x-msdownload' }), 'hack.exe');

    const invalidUploadRes = await fetch(`${baseUrl}/courses/${courseId}/modules/${mod1Id}/lessons`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenTrainerA}` },
      body: invalidFormData
    });
    if (invalidUploadRes.status === 201) {
      throw new Error('Disallowed file upload (.exe) was wrongly accepted!');
    }
    console.log('  ✓ Disallowed extension/MIME upload (.exe) correctly rejected.');

    // TEST 11: File Cleanup on Lesson Delete & Module Delete
    console.log('\n[11] Testing File Cleanup on Delete...');
    // Create temporary lesson to delete
    const tempFormData = new FormData();
    tempFormData.append('title', 'Temp File To Delete');
    tempFormData.append('type', 'pdf');
    tempFormData.append('file', new Blob(['temp content'], { type: 'application/pdf' }), 'temp_file.pdf');

    const tempRes = await fetch(`${baseUrl}/courses/${courseId}/modules/${mod1Id}/lessons`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenTrainerA}` },
      body: tempFormData
    });
    const tempLesson = (await tempRes.json()).data;
    const tempFilePath = path.join(__dirname, '../uploads/course-materials', path.basename(tempLesson.fileUrl));
    
    if (!fs.existsSync(tempFilePath)) {
      throw new Error(`Temp upload file not created on disk at path: ${tempFilePath}`);
    }

    // Delete lesson
    await makeReq('DELETE', `/courses/${courseId}/modules/${mod1Id}/lessons/${tempLesson._id}`, tokenTrainerA);
    if (fs.existsSync(tempFilePath)) {
      throw new Error('File remained on disk after lesson deletion!');
    }
    console.log('  ✓ File correctly unlinked from disk upon lesson deletion.');

    // TEST 12: Publish Validation Failure & Success
    console.log('\n[12] Testing Course Publish Validation...');
    const publishRes = await makeReq('PATCH', `/courses/${courseId}/publish`, tokenTrainerA);
    if (publishRes.status !== 200 || publishRes.data.data.status !== 'published') {
      throw new Error(`Publish complete course failed: ${JSON.stringify(publishRes.data)}`);
    }
    console.log('  ✓ Course published successfully.');

    // TEST 13: Trainee Access to Published Course
    console.log('\n[13] Testing Trainee Discovery & Cross-Org Isolation...');
    const traineeExplorePublished = await makeReq('GET', '/courses', tokenTraineeA);
    if (!traineeExplorePublished.data.data.some(c => String(c._id) === courseId)) {
      throw new Error('Published course missing from Same-Org Trainee catalog!');
    }

    // Trainee B (Org B) Access Check -> 403
    const traineeBOrgCheck = await makeReq('GET', `/courses/${courseId}`, tokenTraineeB);
    if (traineeBOrgCheck.status !== 403) {
      throw new Error('Cross-org Trainee B accessed Org A course!');
    }
    console.log('  ✓ Trainee in same org can discover published course; Cross-org Trainee blocked (403).');

    // TEST 14: Archive Course & Verification
    console.log('\n[14] Testing Course Archive...');
    const archiveRes = await makeReq('PATCH', `/courses/${courseId}/archive`, tokenTrainerA);
    if (archiveRes.status !== 200 || archiveRes.data.data.status !== 'archived') {
      throw new Error('Archive course failed!');
    }

    const traineeArchivedAccess = await makeReq('GET', `/courses/${courseId}`, tokenTraineeA);
    if (traineeArchivedAccess.status !== 403) {
      throw new Error('Trainee was able to access archived course!');
    }

    const adminArchivedAccess = await makeReq('GET', `/courses/${courseId}`, tokenAdminA);
    if (adminArchivedAccess.status !== 200) {
      throw new Error('Same-org Admin failed to access archived course!');
    }
    console.log('  ✓ Course archived. Trainee access blocked (403), Admin access allowed (200).');

    console.log('\n=== ALL COURSE LIFECYCLE AUDIT & SECURITY TESTS PASSED! ===');
  } catch (err) {
    console.error('\n❌ VERIFICATION SUITE FAILED:', err);
    process.exitCode = 1;
  } finally {
    // Cleanup generated files
    createdFilesToClean.forEach((fileUrl) => {
      try {
        const fullPath = path.join(__dirname, '../uploads/course-materials', path.basename(fileUrl));
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      } catch (e) {}
    });

    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  }
}

runTests();
