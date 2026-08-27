/*
 * End-to-end verification against the running API + MongoDB.
 * Not part of the app - run manually with: node verify.js
 */
const mongoose = require('mongoose');
require('dotenv').config();

const BASE = 'http://localhost:5000/api';
const stamp = Date.now();

const results = [];
const check = (label, pass, detail = '') => {
  results.push({ label, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
};

const call = async (method, path, body, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

(async () => {
  // ---------- ADMIN REGISTRATION ----------
  const adminEmail = `admin${stamp}@moes.gov.in`;
  const reg = await call('POST', '/auth/admin-register', {
    name: 'Shubham Admin',
    email: adminEmail,
    phone: '+91 90000 00001',
    password: 'Admin@123',
    organizationName: 'Ministry of Earth Sciences',
    organizationType: 'Government',
    officialEmail: `office${stamp}@moes.gov.in`,
    officialPhone: '+91 11 2222 3333',
    address: 'Prithvi Bhavan, Lodhi Road',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India'
  });

  check('Admin registration returns 201', reg.status === 201, `status ${reg.status} ${reg.data.message || ''}`);
  const traineeKey = reg.data?.data?.traineeKey;
  const trainerKey = reg.data?.data?.trainerKey;
  const adminToken = reg.data?.data?.token;

  check('Two different access keys generated',
    !!traineeKey && !!trainerKey && traineeKey !== trainerKey,
    `${traineeKey} / ${trainerKey}`);
  check('Trainee key uses CC-TRN- prefix, trainer key uses CC-TNR-',
    /^CC-TRN-[A-Z0-9]{6}$/.test(traineeKey) && /^CC-TNR-[A-Z0-9]{6}$/.test(trainerKey));
  check('JWT returned on admin registration', typeof adminToken === 'string' && adminToken.split('.').length === 3);
  check('Password never returned', reg.data?.data?.password === undefined);

  // ---------- DUPLICATE ADMIN EMAIL ----------
  const dup = await call('POST', '/auth/admin-register', {
    name: 'Copy', email: adminEmail, password: 'Admin@123',
    organizationName: 'Another Org', officialEmail: `x${stamp}@x.com`
  });
  check('Duplicate admin email rejected (409)', dup.status === 409, dup.data.message);

  // ---------- AUTH/ME ----------
  const me = await call('GET', '/auth/me', null, adminToken);
  check('GET /auth/me returns the admin', me.status === 200 && me.data?.data?.email === adminEmail);
  const noToken = await call('GET', '/auth/me');
  check('GET /auth/me without token rejected (401)', noToken.status === 401);

  // ---------- KEY VALIDATION ----------
  const vk = await call('POST', '/auth/validate-key', { key: traineeKey, type: 'Trainee' });
  check('validate-key resolves the organization', vk.status === 200 && vk.data?.data?.organizationName === 'Ministry of Earth Sciences');
  const vkBad = await call('POST', '/auth/validate-key', { key: 'CC-TRN-XXXXXX', type: 'Trainee' });
  check('validate-key rejects an unknown key', vkBad.status === 400, vkBad.data.message);
  const vkCross = await call('POST', '/auth/validate-key', { key: trainerKey, type: 'Trainee' });
  check('validate-key rejects trainer key on trainee form', vkCross.status === 400, vkCross.data.message);

  // ---------- TRAINEE REGISTRATION ----------
  const traineeEmail = `trainee${stamp}@moes.gov.in`;
  const tr = await call('POST', '/auth/trainee-register', {
    traineeAccessKey: traineeKey.toLowerCase(), // also proves keys are case-insensitive
    name: 'Anita Trainee',
    email: traineeEmail,
    password: 'Trainee@123',
    phone: '+91 90000 00002',
    department: 'Oceanography',
    designation: 'Scientist B',
    qualification: 'masters',
    organizationName: 'HACKER ORG - should be ignored'
  });
  check('Trainee registration returns 201', tr.status === 201, `status ${tr.status} ${tr.data.message || ''}`);
  check('Trainee role/status correct', tr.data?.data?.role === 'Trainee' && tr.data?.data?.status === 'active');
  check('Organization taken from key, not request body',
    tr.data?.data?.organizationName === 'Ministry of Earth Sciences',
    tr.data?.data?.organizationName);
  check('Trainee got a JWT', typeof tr.data?.data?.token === 'string');

  const trWrongKey = await call('POST', '/auth/trainee-register', {
    traineeAccessKey: trainerKey, name: 'X', email: `x${stamp}@x.com`, password: 'Pass@123'
  });
  check('Trainer key rejected on trainee registration', trWrongKey.status === 400, trWrongKey.data.message);

  const trDup = await call('POST', '/auth/trainee-register', {
    traineeAccessKey: traineeKey, name: 'Dup', email: traineeEmail, password: 'Pass@123'
  });
  check('Duplicate trainee email rejected (409)', trDup.status === 409, trDup.data.message);

  // ---------- TRAINER APPLICATION ----------
  const trainerEmail = `trainer${stamp}@moes.gov.in`;
  const ta = await call('POST', '/auth/trainer-apply', {
    trainerAccessKey: trainerKey,
    name: 'Dr. Rajesh Trainer',
    email: trainerEmail,
    password: 'Trainer@123',
    phone: '+91 90000 00003',
    department: 'Meteorology',
    designation: 'Senior Scientist',
    qualification: 'Ph.D. in Atmospheric Science',
    expertise: ['Remote Sensing', 'Climate Science'],
    experience: '5-10'
  });
  check('Trainer application returns 201', ta.status === 201, `status ${ta.status} ${ta.data.message || ''}`);
  check('Trainer created with status pending', ta.data?.data?.status === 'pending');
  check('Trainer application returns no token', ta.data?.data?.token === undefined);

  const taWrongKey = await call('POST', '/auth/trainer-apply', {
    trainerAccessKey: traineeKey, name: 'X', email: `y${stamp}@x.com`, password: 'Pass@123'
  });
  check('Trainee key rejected on trainer application', taWrongKey.status === 400, taWrongKey.data.message);

  // ---------- LOGIN RULES ----------
  const adminLogin = await call('POST', '/auth/login', { email: adminEmail, password: 'Admin@123', role: 'Admin' });
  check('Admin logs in without an access key', adminLogin.status === 200 && adminLogin.data?.data?.role === 'Admin');
  check('Admin login returns both org keys',
    adminLogin.data?.data?.traineeKey === traineeKey && adminLogin.data?.data?.trainerKey === trainerKey);

  const badPass = await call('POST', '/auth/login', { email: adminEmail, password: 'wrong', role: 'Admin' });
  check('Wrong password rejected (401)', badPass.status === 401, badPass.data.message);

  const traineeLogin = await call('POST', '/auth/login', { email: traineeEmail, password: 'Trainee@123', role: 'Trainee', accessKey: traineeKey });
  check('Trainee logs in with the trainee key', traineeLogin.status === 200 && traineeLogin.data?.data?.role === 'Trainee');

  const traineeNoKey = await call('POST', '/auth/login', { email: traineeEmail, password: 'Trainee@123', role: 'Trainee' });
  check('Trainee login without a key rejected', traineeNoKey.status === 400, traineeNoKey.data.message);

  const traineeWrongKey = await call('POST', '/auth/login', { email: traineeEmail, password: 'Trainee@123', role: 'Trainee', accessKey: trainerKey });
  check('Trainee login with TRAINER key fails', traineeWrongKey.status === 401, traineeWrongKey.data.message);

  const pendingLogin = await call('POST', '/auth/login', { email: trainerEmail, password: 'Trainer@123', role: 'Trainer', accessKey: trainerKey });
  check('Pending trainer login blocked with 403 + right message',
    pendingLogin.status === 403 && pendingLogin.data.message === 'Your Trainer account is awaiting Admin approval.',
    `${pendingLogin.status} ${pendingLogin.data.message}`);

  const trainerWrongKey = await call('POST', '/auth/login', { email: trainerEmail, password: 'Trainer@123', role: 'Trainer', accessKey: traineeKey });
  check('Trainer login with TRAINEE key fails', trainerWrongKey.status === 401, trainerWrongKey.data.message);

  const roleMismatch = await call('POST', '/auth/login', { email: traineeEmail, password: 'Trainee@123', role: 'Trainer', accessKey: trainerKey });
  check('Role mismatch on login rejected', roleMismatch.status === 401, roleMismatch.data.message);

  // ---------- ADMIN: TRAINER APPLICATIONS ----------
  const apps = await call('GET', '/admin/trainer-applications', null, adminToken);
  check('Admin sees the pending trainer application',
    apps.status === 200 && apps.data.data.length === 1 && apps.data.data[0].email === trainerEmail,
    `${apps.data.data?.length} application(s)`);
  const app = apps.data.data[0];
  check('Application carries the fields the UI shows',
    !!app.name && !!app.email && !!app.department && !!app.designation && !!app.qualification &&
    Array.isArray(app.expertise) && !!app.organizationName && !!app.appliedOn);
  check('Application list never leaks passwords', app.password === undefined);

  const appsNoAuth = await call('GET', '/admin/trainer-applications');
  check('Trainer applications require auth (401)', appsNoAuth.status === 401);
  const appsAsTrainee = await call('GET', '/admin/trainer-applications', null, traineeLogin.data.data.token);
  check('Trainee cannot read trainer applications (403)', appsAsTrainee.status === 403, appsAsTrainee.data.message);

  // ---------- CROSS-ORGANIZATION ISOLATION ----------
  const orgB = await call('POST', '/auth/admin-register', {
    name: 'Other Admin', email: `otheradmin${stamp}@niot.res.in`, password: 'Admin@123',
    organizationName: 'NIOT', organizationType: 'Government', officialEmail: `niot${stamp}@niot.res.in`
  });
  const orgBToken = orgB.data.data.token;
  const orgBApps = await call('GET', '/admin/trainer-applications', null, orgBToken);
  check('Admin B sees none of Admin A\'s applications', orgBApps.status === 200 && orgBApps.data.data.length === 0);
  const crossApprove = await call('PATCH', `/admin/trainer-applications/${app._id}/approve`, null, orgBToken);
  check('Admin B cannot approve Admin A\'s trainer (403)', crossApprove.status === 403, crossApprove.data.message);

  // ---------- REJECT ----------
  const rejectEmail = `reject${stamp}@moes.gov.in`;
  await call('POST', '/auth/trainer-apply', {
    trainerAccessKey: trainerKey, name: 'To Be Rejected', email: rejectEmail, password: 'Trainer@123',
    department: 'Geology', designation: 'Officer', qualification: 'M.Sc.', expertise: ['GIS'], experience: '0-2'
  });
  const apps2 = await call('GET', '/admin/trainer-applications', null, adminToken);
  const toReject = apps2.data.data.find(a => a.email === rejectEmail);

  const noReason = await call('PATCH', `/admin/trainer-applications/${toReject._id}/reject`, {}, adminToken);
  check('Reject without a reason rejected (400)', noReason.status === 400, noReason.data.message);

  const rejected = await call('PATCH', `/admin/trainer-applications/${toReject._id}/reject`,
    { reason: 'Qualification does not meet the required level.' }, adminToken);
  check('Reject sets status rejected', rejected.status === 200 && rejected.data.data.status === 'rejected');

  const rejectedLogin = await call('POST', '/auth/login', { email: rejectEmail, password: 'Trainer@123', role: 'Trainer', accessKey: trainerKey });
  check('Rejected trainer login blocked with the right message',
    rejectedLogin.status === 403 && rejectedLogin.data.message === 'Your Trainer application was rejected.',
    `${rejectedLogin.status} ${rejectedLogin.data.message}`);

  // ---------- APPROVE ----------
  const approved = await call('PATCH', `/admin/trainer-applications/${app._id}/approve`, null, adminToken);
  check('Approve sets status active', approved.status === 200 && approved.data.data.status === 'active');

  const approvedLogin = await call('POST', '/auth/login', { email: trainerEmail, password: 'Trainer@123', role: 'Trainer', accessKey: trainerKey });
  check('Approved trainer can now log in', approvedLogin.status === 200 && approvedLogin.data?.data?.role === 'Trainer');

  const appsAfter = await call('GET', '/admin/trainer-applications', null, adminToken);
  check('Pending list is empty after approve + reject', appsAfter.status === 200 && appsAfter.data.data.length === 0,
    `${appsAfter.data.data.length} left`);

  // ---------- DIRECT DATABASE PROOF ----------
  await mongoose.connect(process.env.MONGODB_URI);
  const orgDoc = await mongoose.connection.db.collection('organizations').findOne({ officialEmail: `office${stamp}@moes.gov.in` });
  const adminDoc = await mongoose.connection.db.collection('users').findOne({ email: adminEmail });
  const traineeDoc = await mongoose.connection.db.collection('users').findOne({ email: traineeEmail });
  const trainerDoc = await mongoose.connection.db.collection('users').findOne({ email: trainerEmail });
  const rejectedDoc = await mongoose.connection.db.collection('users').findOne({ email: rejectEmail });

  check('DB: organization document exists with both keys',
    !!orgDoc && orgDoc.traineeAccessKey === traineeKey && orgDoc.trainerAccessKey === trainerKey);
  check('DB: admin document exists, role Admin, linked to organization',
    !!adminDoc && adminDoc.role === 'Admin' && String(adminDoc.organizationId) === String(orgDoc._id));
  check('DB: organization.createdBy points at the admin', String(orgDoc.createdBy) === String(adminDoc._id));
  check('DB: admin password is a bcrypt hash, not plain text',
    !!adminDoc.password && adminDoc.password.startsWith('$2') && adminDoc.password !== 'Admin@123');
  check('DB: trainee organizationId matches the admin organization',
    !!traineeDoc && String(traineeDoc.organizationId) === String(adminDoc.organizationId));
  check('DB: approved trainer status is active', trainerDoc.status === 'active');
  check('DB: rejected trainer kept with reason, not deleted',
    !!rejectedDoc && rejectedDoc.status === 'rejected' && !!rejectedDoc.rejectionReason);

  const orgCount = await mongoose.connection.db.collection('organizations').countDocuments();
  const userCount = await mongoose.connection.db.collection('users').countDocuments();
  console.log(`\nCollections now hold ${orgCount} organizations and ${userCount} users.`);

  await mongoose.disconnect();

  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach(f => console.log(`  - ${f.label} (${f.detail})`));
    process.exit(1);
  }
  console.log('Keys for manual UI testing:', { traineeKey, trainerKey, adminEmail, adminPassword: 'Admin@123' });
})().catch((err) => {
  console.error('Verification crashed:', err);
  process.exit(1);
});
