import {
  mockCourses,
  mockTrainerCourses,
  mockAssessments,
  mockNotifications,
  mockLibrary,
  mockCertificates,
  mockTrainerTrainees,
  mockTrainerFeedback
} from '../data/mockData';

const DEFAULT_API_ORIGIN = 'https://capacity-connect-8dfa.onrender.com';

const rawApiBase = import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN;

const API_BASE_URL = `${rawApiBase
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/, '')}/api`;

const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 45000;

// ── Demo accounts ─────────────────────────────────────────────────────────────
// These two email addresses are hardcoded demo/walkthrough accounts.
// They are NOT stored in MongoDB and always use the local mock fallback.
const DEMO_EMAILS = [
  'admin@capacityconnect.in',
  'trainer@capacityconnect.in'
];

// ── Core backend prefixes ──────────────────────────────────────────────────────
// Requests to these endpoints MUST always reach the real Express/MongoDB backend
// when the user is authenticated with a real JWT (not a demo token).
// A network error on these will surface as a user-visible error — never a silent
// local fallback — to keep MongoDB as the true source of truth.
const CORE_PREFIXES = [
  '/health',
  '/auth/',
  '/admin/',
  '/courses',
  '/resources',
  '/announcements'
];

const isCoreEndpoint = (endpoint) =>
  CORE_PREFIXES.some((prefix) => endpoint.startsWith(prefix));

const safeJSONParse = (str, fallback) => {
  try {
    return JSON.parse(str) || fallback;
  } catch {
    return fallback;
  }
};

const getStoredUser = () => safeJSONParse(localStorage.getItem('capacityConnect_user'), null);

const getAuthToken = () => getStoredUser()?.token || null;

// Simple local DB implementation
const getDB = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return safeJSONParse(data, defaultData);
};

const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const isPending = (status) => String(status || '').toLowerCase() === 'pending';

const demoTrainerApplications = (organizationId, organizationName) => ([
  {
    _id: 'demo_app1', name: 'Dr. Rajesh Kumar', email: 'rajesh.k@moes.gov.in', phone: '+91 98765 43210',
    role: 'Trainer', status: 'pending', department: 'Oceanography', designation: 'Senior Scientist',
    qualification: 'Ph.D. in Marine Sciences', expertise: ['Marine Biology', 'Data Analytics'],
    experience: '5-10', organizationId, organizationName, createdAt: '2026-08-20T09:00:00.000Z'
  },
  {
    _id: 'demo_app2', name: 'Sneha Patel', email: 'sneha.patel@external.org', phone: '+91 91234 56780',
    role: 'Trainer', status: 'pending', department: 'Meteorology', designation: 'Research Associate',
    qualification: 'M.Sc. Atmospheric Science', expertise: ['Meteorology', 'Climate Science'],
    experience: '3-5', organizationId, organizationName, createdAt: '2026-08-22T09:00:00.000Z'
  },
  {
    _id: 'demo_app3', name: 'Vikram Singh', email: 'vikram.s@niot.res.in', phone: '+91 99887 76655',
    role: 'Trainer', status: 'pending', department: 'Technology', designation: 'Principal Engineer',
    qualification: 'M.Tech Remote Sensing', expertise: ['Remote Sensing', 'GIS'],
    experience: '10+', organizationId, organizationName, createdAt: '2026-08-24T09:00:00.000Z'
  }
]);

const getLocalData = (endpoint, method, body) => {
  const courses = getDB('mock_courses', mockCourses);
  const trainerCourses = getDB('mock_trainer_courses', mockTrainerCourses);

  // --- Auth ---
  const orgs = getDB('mock_organizations', []);
  const users = getDB('mock_users', []); // Unified user storage

  if (endpoint.startsWith('/auth/admin-register') && method === 'POST') {
    if (users.some(u => u.email === body?.email)) {
      return { status: 409, ok: false, data: { message: 'Email already registered.' } };
    }

    const newOrgId = 'org_' + Date.now();
    const newAdminId = 'adm_' + Date.now();
    const traineeKey = 'CC-TRN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const trainerKey = 'CC-TNR-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newOrg = {
      id: newOrgId,
      organizationName: body.organizationName,
      organizationType: body.organizationType,
      adminId: newAdminId,
      traineeKey,
      trainerKey
    };
    orgs.push(newOrg);
    setDB('mock_organizations', orgs);

    const newAdmin = {
      _id: newAdminId,
      name: body.name,
      email: body.email,
      password: body.password, // local demo data only
      role: 'Admin',
      status: 'active',
      organizationId: newOrgId,
      organizationName: body.organizationName
    };
    users.push(newAdmin);
    setDB('mock_users', users);

    const safeAdmin = { ...newAdmin };
    delete safeAdmin.password;
    return {
      status: 201,
      ok: true,
      data: {
        success: true,
        data: { ...safeAdmin, token: `local-token-${newAdminId}`, traineeKey, trainerKey }
      }
    };
  }

  if (endpoint.startsWith('/auth/validate-key') && method === 'POST') {
    const { key, type } = body || {};
    const wanted = String(key || '').trim().toUpperCase();
    const org = orgs.find(o => (type === 'Trainer' ? o.trainerKey : o.traineeKey) === wanted);
    if (org) {
      return { status: 200, ok: true, data: { success: true, data: { organizationName: org.organizationName, organizationId: org.id } } };
    }
    const crossed = orgs.find(o => (type === 'Trainer' ? o.traineeKey : o.trainerKey) === wanted);
    return {
      status: 400,
      ok: false,
      data: { message: crossed
        ? `That is a ${type === 'Trainer' ? 'Trainee' : 'Trainer'} access key. Please use your organization's ${type} access key.`
        : 'Invalid organization access key.' }
    };
  }

  if (endpoint.startsWith('/auth/login') && method === 'POST') {
    const user = users.find(u => u.email === body?.email && u.password === body?.password);

    if (user) {
      if (body?.role && user.role !== body.role) {
        return { status: 401, ok: false, data: { message: `This email is registered as a ${user.role}. Please select ${user.role} and try again.` } };
      }

      const org = orgs.find(o => o.id === user.organizationId);
      const safeUser = { ...user };
      delete safeUser.password;

      if (user.role === 'Admin') {
        return {
          status: 200,
          ok: true,
          data: {
            success: true,
            data: { ...safeUser, token: `local-token-${user._id}`, traineeKey: org?.traineeKey, trainerKey: org?.trainerKey }
          }
        };
      }

      if (!body?.accessKey) {
        return { status: 400, ok: false, data: { message: `Organization ${user.role} access key is required.` } };
      }

      const expectedKey = user.role === 'Trainee' ? org?.traineeKey : org?.trainerKey;
      if (String(body.accessKey).trim().toUpperCase() !== expectedKey) {
        return { status: 401, ok: false, data: { message: 'Invalid organization access key.' } };
      }

      if (user.role === 'Trainer' && isPending(user.status)) {
        return { status: 403, ok: false, data: { message: 'Your Trainer account is awaiting Admin approval.' } };
      }
      if (String(user.status).toLowerCase() === 'rejected') {
        return { status: 403, ok: false, data: { message: 'Your Trainer application was rejected.' } };
      }

      return { status: 200, ok: true, data: { success: true, data: { ...safeUser, token: `local-token-${user._id}` } } };
    }

    // Demo accounts kept so the portals can always be opened for a walkthrough.
    if (body?.email === 'trainer@capacityconnect.in' && body?.password === 'password123' && body?.role === 'Trainer') {
      return { status: 200, ok: true, data: { success: true, data: { _id: 't1', name: 'Trainer Name', email: body.email, role: 'Trainer', status: 'active', token: 'local-token-t1', organizationName: 'Demo Organization' } } };
    }
    if (body?.email === 'admin@capacityconnect.in' && body?.password === 'admin123' && (!body?.role || body?.role === 'Admin')) {
      return { status: 200, ok: true, data: { success: true, data: { _id: 'a1', name: 'Admin Name', email: body.email, role: 'Admin', status: 'active', token: 'local-token-a1', organizationName: 'Demo Organization', organizationId: 'org_demo' } } };
    }

    const localTrainees = getDB('mock_trainees', []);
    const trainee = localTrainees.find(u => u.email === body?.email && u.password === body?.password);
    if (trainee && body?.role === 'Trainee') {
      return { status: 200, ok: true, data: { success: true, data: { ...trainee, token: `local-token-${trainee._id}`, organizationName: trainee.organizationName || 'Demo Organization' } } };
    }

    return { status: 401, ok: false, data: { message: 'Invalid email or password.' } };
  }

  if ((endpoint.startsWith('/auth/trainee-register') || endpoint.startsWith('/auth/register')) && method === 'POST') {
    const key = String(body?.traineeAccessKey || body?.accessKey || '').trim().toUpperCase();
    const org = orgs.find(o => o.traineeKey === key);
    if (!org) {
      return { status: 400, ok: false, data: { message: 'Invalid organization access key.' } };
    }
    if (users.some(u => u.email === body?.email)) {
      return { status: 409, ok: false, data: { message: 'Email already registered.' } };
    }

    const newUser = {
      _id: 'tr' + Date.now(),
      name: body?.name,
      email: body?.email,
      password: body?.password,
      phone: body?.phone,
      role: 'Trainee',
      status: 'active',
      department: body?.department,
      designation: body?.designation,
      qualification: body?.qualification,
      organizationId: org.id,
      organizationName: org.organizationName
    };
    users.push(newUser);
    setDB('mock_users', users);

    const safeUser = { ...newUser };
    delete safeUser.password;
    return { status: 201, ok: true, data: { success: true, data: { ...safeUser, token: `local-token-${newUser._id}` } } };
  }

  if (endpoint.startsWith('/auth/trainer-apply') && method === 'POST') {
    // body can be a plain JSON object OR a FormData (multipart file upload).
    // FormData fields are NOT accessible as regular object properties, so we
    // must extract them explicitly.
    const data = (body instanceof FormData)
      ? Object.fromEntries([...body.entries()].filter(([, v]) => typeof v === 'string'))
      : (body || {});

    const key = String(data.trainerAccessKey || data.accessKey || '').trim().toUpperCase();
    const org = orgs.find(o => o.trainerKey === key);
    if (!org) {
      const crossed = orgs.find(o => o.traineeKey === key);
      return { status: 400, ok: false, data: { message: crossed
        ? "That is a Trainee access key. Please use your organization's Trainer access key."
        : 'Invalid organization access key.' } };
    }
    if (users.some(u => u.email === data.email)) {
      return { status: 409, ok: false, data: { message: 'Email already registered.' } };
    }

    // expertise may arrive as a comma-separated string from FormData
    const rawExpertise = data.expertise || '';
    const expertise = rawExpertise
      ? rawExpertise.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const newUser = {
      _id: 'tnr' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'Trainer',
      status: 'pending', // Awaiting Admin approval
      department: data.department,
      designation: data.designation,
      qualification: data.qualification,
      expertise,
      experience: data.experience,
      organizationId: org.id,
      organizationName: org.organizationName,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setDB('mock_users', users);

    return { status: 201, ok: true, data: { success: true, message: 'Trainer application submitted successfully. Your account is awaiting Admin approval.', data: { _id: newUser._id, name: newUser.name, email: newUser.email, role: 'Trainer', status: 'pending', organizationName: org.organizationName } } };
  }

  if (endpoint.startsWith('/auth/me') && method === 'GET') {
    const stored = getStoredUser();
    if (!stored) return { status: 401, ok: false, data: { message: 'Not authorized.' } };
    return { status: 200, ok: true, data: { success: true, data: stored } };
  }

  // --- Admin: trainer applications ---
  if (endpoint.startsWith('/admin/trainer-applications')) {
    const admin = getStoredUser();
    const orgId = admin?.organizationId || null;
    const orgName = admin?.organizationName || 'Demo Organization';

    const approveMatch     = endpoint.match(/^\/admin\/trainer-applications\/([^/]+)\/approve/);
    const rejectMatch      = endpoint.match(/^\/admin\/trainer-applications\/([^/]+)\/reject/);
    const checklistMatch   = endpoint.match(/^\/admin\/trainer-applications\/([^/]+)\/review-checklist/);
    const changesMatch     = endpoint.match(/^\/admin\/trainer-applications\/([^/]+)\/request-changes/);
    const singleDetailMatch= endpoint.match(/^\/admin\/trainer-applications\/([^/]+)$/);

    // ── APPROVE ────────────────────────────────────────────────────────────
    if (approveMatch && method === 'PATCH') {
      const id = approveMatch[1];
      const index = users.findIndex(u => String(u._id) === id || String(u.id) === id);
      if (index === -1) return { status: 404, ok: false, data: { message: 'Trainer application not found.' } };
      users[index] = { ...users[index], status: 'active', rejectionReason: '' };
      setDB('mock_users', users);
      return { status: 200, ok: true, data: { success: true, message: `${users[index].name} has been approved.`, data: users[index] } };
    }

    // ── REJECT ─────────────────────────────────────────────────────────────
    if (rejectMatch && method === 'PATCH') {
      const id = rejectMatch[1];
      const reason = (body?.reason || '').trim();
      if (!reason) return { status: 400, ok: false, data: { message: 'A rejection reason is required.' } };
      const index = users.findIndex(u => String(u._id) === id || String(u.id) === id);
      if (index === -1) return { status: 404, ok: false, data: { message: 'Trainer application not found.' } };
      users[index] = { ...users[index], status: 'rejected', rejectionReason: reason };
      setDB('mock_users', users);
      return { status: 200, ok: true, data: { success: true, message: `${users[index].name}'s application was rejected.`, data: users[index] } };
    }

    // ── SAVE REVIEW CHECKLIST ──────────────────────────────────────────────
    if (checklistMatch && method === 'PATCH') {
      const id = checklistMatch[1];
      const index = users.findIndex(u => String(u._id) === id || String(u.id) === id);
      if (index === -1) return { status: 404, ok: false, data: { message: 'Trainer not found.' } };
      users[index] = {
        ...users[index],
        trainerReview: {
          ...(users[index].trainerReview || {}),
          organizationVerified: Boolean(body?.organizationVerified),
          profileComplete: Boolean(body?.profileComplete),
          qualificationReviewed: Boolean(body?.qualificationReviewed),
          experienceReviewed: Boolean(body?.experienceReviewed),
          expertiseReviewed: Boolean(body?.expertiseReviewed),
          documentsReviewed: Boolean(body?.documentsReviewed),
          verifiedExpertise: Array.isArray(body?.verifiedExpertise) ? body.verifiedExpertise : [],
          adminRemarks: body?.adminRemarks || ''
        }
      };
      setDB('mock_users', users);
      return { status: 200, ok: true, data: { success: true, message: 'Checklist saved.' } };
    }

    // ── REQUEST CHANGES ────────────────────────────────────────────────────
    if (changesMatch && method === 'PATCH') {
      const id = changesMatch[1];
      const reason = (body?.reason || '').trim();
      if (!reason) return { status: 400, ok: false, data: { message: 'A reason is required.' } };
      const index = users.findIndex(u => String(u._id) === id || String(u.id) === id);
      if (index === -1) return { status: 404, ok: false, data: { message: 'Trainer not found.' } };
      users[index] = { ...users[index], status: 'changes_requested', changesRequestedReason: reason };
      setDB('mock_users', users);
      return { status: 200, ok: true, data: { success: true, message: 'Changes requested from trainer.' } };
    }

    // ── SINGLE DETAIL GET ──────────────────────────────────────────────────
    if (singleDetailMatch && method === 'GET') {
      // Seed demo apps so the detail can always be reached
      if (!localStorage.getItem('mock_demo_apps_seeded') && !users.some(u => u.role === 'Trainer')) {
        users.push(...demoTrainerApplications(orgId, orgName));
        setDB('mock_users', users);
        localStorage.setItem('mock_demo_apps_seeded', '1');
      }

      const targetId = singleDetailMatch[1];
      const found = users.find(u => String(u._id) === targetId || String(u.id) === targetId);
      if (!found) return { status: 404, ok: false, data: { message: 'Trainer application not found.' } };

      // Compute a simple completeness score (0–100) for the badge
      const fields = ['name', 'email', 'phone', 'department', 'designation', 'qualification', 'experience'];
      const filled = fields.filter(f => found[f] && String(found[f]).trim() !== '').length;
      const hasExpertise = Array.isArray(found.expertise) && found.expertise.length > 0;
      const completenessScore = Math.round(((filled + (hasExpertise ? 1 : 0)) / (fields.length + 1)) * 100);

      const rest = { ...found };
      delete rest.password;
      return {
        status: 200,
        ok: true,
        data: {
          success: true,
          data: {
            ...rest,
            id: found._id,
            appliedOn: found.createdAt,
            trainerReview: found.trainerReview || {},
            trainerDocuments: found.trainerDocuments || [],
            completenessScore
          }
        }
      };
    }

    // ── LIST GET ───────────────────────────────────────────────────────────
    if (method === 'GET') {
      // Seed a few demo applications once, so the screen is not empty during a walkthrough.
      if (!localStorage.getItem('mock_demo_apps_seeded') && !users.some(u => u.role === 'Trainer' && isPending(u.status))) {
        users.push(...demoTrainerApplications(orgId, orgName));
        setDB('mock_users', users);
        localStorage.setItem('mock_demo_apps_seeded', '1');
      }

      const pending = users
        .filter(u => u.role === 'Trainer' && isPending(u.status))
        .filter(u => !orgId || !u.organizationId || String(u.organizationId) === String(orgId))
        .map(u => {
          const rest = { ...u };
          delete rest.password;
          return { ...rest, id: u._id, appliedOn: u.createdAt };
        })
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      return { status: 200, ok: true, data: { success: true, data: pending } };
    }
  }

  // --- Courses ---
  if (endpoint.includes('/courses/my') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: trainerCourses } };
  }

  // Specific course details
  if (endpoint.match(/^\/courses\/[a-zA-Z0-9_-]+$/) && method === 'GET') {
    const courseId = endpoint.split('/').pop();
    const course = courses.find(c => c.id === courseId) || courses[0];
    return { status: 200, ok: true, data: { success: true, data: course } };
  }

  if (endpoint === '/courses' && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: courses } };
  }

  if (endpoint === '/courses' && method === 'POST') {
    const newCourse = { id: 'c' + Date.now(), ...body, modules: [] };
    courses.push(newCourse);
    trainerCourses.push(newCourse);
    setDB('mock_courses', courses);
    setDB('mock_trainer_courses', trainerCourses);
    return { status: 201, ok: true, data: { success: true, data: newCourse } };
  }

  if (endpoint.match(/^\/courses\/[a-zA-Z0-9_-]+$/) && (method === 'PATCH' || method === 'PUT')) {
    const courseId = endpoint.split('/').pop();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if(courseIndex !== -1) {
      courses[courseIndex] = { ...courses[courseIndex], ...body };
      setDB('mock_courses', courses);
      return { status: 200, ok: true, data: { success: true, data: courses[courseIndex] } };
    }
  }

  if (endpoint.match(/\/courses\/.+\/modules/)) {
    return { status: 200, ok: true, data: { success: true, data: { id: 'm_new', title: body?.title || 'New Module' } } };
  }

  if (endpoint.includes('/enroll')) {
    return { status: 200, ok: true, data: { success: true, data: { message: 'Enrolled' } } };
  }

  if (endpoint.includes('/enrollment')) {
    return { status: 200, ok: true, data: { success: true, data: { enrolled: true } } };
  }

  // --- General Data ---
  if (endpoint.includes('/assessments') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockAssessments } };
  }
  if (endpoint.includes('/library') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockLibrary } };
  }
  if (endpoint.includes('/certificates') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockCertificates } };
  }
  if (endpoint.includes('/notifications') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockNotifications } };
  }

  if (endpoint === '/admin/dashboard' && method === 'GET') {
    const admin = getStoredUser();
    const orgId = admin?.organizationId || null;
    const users = getDB('mock_users', []);
    const orgUsers = users.filter((u) => (!orgId || String(u.organizationId) === String(orgId)) && !u.isDeleted);
    return {
      status: 200,
      ok: true,
      data: {
        success: true,
        data: {
          totalUsers: orgUsers.length,
          activeTrainees: orgUsers.filter(u => u.role === 'Trainee' && u.status === 'active').length,
          activeTrainers: orgUsers.filter(u => u.role === 'Trainer' && u.status === 'active').length,
          suspendedUsers: orgUsers.filter(u => u.status === 'suspended').length,
          pendingTrainerApprovals: orgUsers.filter(u => u.role === 'Trainer' && isPending(u.status)).length,
          totalCourses: courses.length,
          publishedCourses: courses.filter(c => c.status === 'published').length,
          draftCourses: courses.filter(c => c.status === 'draft').length,
          announcementsCount: 3,
          recentActivity: []
        }
      }
    };
  }

  // --- Admin Data ---
  if (endpoint.includes('/users') || endpoint.includes('/admin/')) {
    const admin = getStoredUser();
    const orgId = admin?.organizationId || null;
    const users = getDB('mock_users', []);
    const orgUsers = users.filter((u) => (!orgId || String(u.organizationId) === String(orgId)) && !u.isDeleted);

    if (endpoint.startsWith('/admin/users/')) {
      const parts = endpoint.split('/');
      const targetId = parts[3];
      const found = users.find((u) => String(u._id || u.id) === String(targetId));
      if (found && !found.isDeleted) {
        const rest = { ...found };
        delete rest.password;
        return { status: 200, ok: true, data: { success: true, data: { ...rest, id: found._id || found.id } } };
      }
      return { status: 404, ok: false, data: { success: false, message: 'User not found.' } };
    }

    return {
      status: 200,
      ok: true,
      data: {
        success: true,
        data: orgUsers.map((u) => {
          const rest = { ...u };
          delete rest.password;
          return { ...rest, id: u._id || u.id };
        })
      }
    };
  }

  // --- Trainer Trainees & Feedback ---
  if (endpoint.includes('/trainees') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockTrainerTrainees } };
  }
  if (endpoint.includes('/feedback') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockTrainerFeedback } };
  }

  // --- Admin: announcements (demo-mode only) -----------------------------------
  // For real users this endpoint always goes to the backend.
  // The local fallback below is ONLY reached by demo sessions.
  if (endpoint.startsWith('/announcements')) {
    const admin = getStoredUser();
    const orgId = admin?.organizationId || 'demo-org';
    const orgName = admin?.organizationName || 'Demo Organization';
    const demoAnns = getDB('mock_announcements', [
      { _id: 'ann_d1', id: 'ann_d1', organization: orgId, organizationName: orgName, createdByName: 'System Admin',
        title: 'System Maintenance Notice', message: 'Capacity Connect will undergo scheduled maintenance this Sunday from 02:00–04:00 AM IST.',
        audience: 'all', type: 'important', priority: 'Important', createdAt: new Date('2026-08-25T10:00:00Z').toISOString() },
      { _id: 'ann_d2', id: 'ann_d2', organization: orgId, organizationName: orgName, createdByName: 'Admin',
        title: 'New Course: Advanced GIS Mapping', message: 'A new course on Advanced GIS Mapping is now open for enrollment.',
        audience: 'trainees', type: 'learning-content', priority: 'Normal', createdAt: new Date('2026-08-24T14:30:00Z').toISOString() },
      { _id: 'ann_d3', id: 'ann_d3', organization: orgId, organizationName: orgName, createdByName: 'Admin',
        title: 'Trainer Workshop', message: 'Mandatory workshop for Trainers on new assessment tools. Check email for meeting link.',
        audience: 'trainers', type: 'announcement', priority: 'Normal', createdAt: new Date('2026-08-20T09:00:00Z').toISOString() }
    ]);

    if (method === 'GET') {
      return { status: 200, ok: true, data: { success: true, data: demoAnns } };
    }
    if (method === 'POST') {
      const a = { _id: 'ann_' + Date.now(), id: 'ann_' + Date.now(), organization: orgId, organizationName: orgName,
        createdByName: admin?.name || 'Admin', title: body?.title || '', message: body?.message || '',
        audience: body?.audience || 'all', type: body?.type || 'announcement', priority: body?.priority || 'Normal',
        createdAt: new Date().toISOString() };
      demoAnns.unshift(a);
      setDB('mock_announcements', demoAnns);
      return { status: 201, ok: true, data: { success: true, data: a } };
    }
    if (method === 'PATCH') {
      const id = endpoint.split('/').pop();
      const idx = demoAnns.findIndex(a => a._id === id || a.id === id);
      if (idx !== -1) {
        demoAnns[idx] = { ...demoAnns[idx], ...body, updatedAt: new Date().toISOString() };
        setDB('mock_announcements', demoAnns);
        return { status: 200, ok: true, data: { success: true, data: demoAnns[idx] } };
      }
      return { status: 404, ok: false, data: { message: 'Announcement not found.' } };
    }
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      const filtered = demoAnns.filter(a => a._id !== id && a.id !== id);
      setDB('mock_announcements', filtered);
      return { status: 200, ok: true, data: { success: true, message: 'Deleted.' } };
    }
  }

  // Fallback generic response (avoids crashes)
  return { status: 200, ok: true, data: { success: true, data: Array.isArray(body) ? [] : {} } };
};

const localRequest = async (endpoint, method, body) => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const result = getLocalData(endpoint, method, body);

  if (!result.ok) {
    const error = new Error(result.data?.message || 'Request failed');
    error.status = result.status;
    throw error;
  }
  return result.data;
};

// Reads the response. HTTP errors are real answers from the server and are
// always surfaced to the user - they must never trigger the local fallback.
const handleResponse = async (response, endpoint) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Expired/invalid session on a protected call - send the user back to login.
    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
      localStorage.removeItem('capacityConnect_user');
      window.location.href = '/login';
    }
    const error = new Error(data.message || response.statusText || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
};

const backendFetch = async (endpoint, options) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const requestUrl = `${API_BASE_URL}${normalizedPath}`;
    return await fetch(requestUrl, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const request = async (method, endpoint, body, isFormData = false) => {
  const isFD = isFormData || (typeof FormData !== 'undefined' && body instanceof FormData);
  const token = getAuthToken();
  const headers = {};
  if (!isFD) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body !== undefined && body !== null) {
    options.body = isFD ? body : JSON.stringify(body);
  }

  // ── DEMO MODE ──────────────────────────────────────────────────────────────
  // The two hardcoded demo accounts always use local mock data for login,
  // regardless of whether the backend is running.
  if (endpoint === '/auth/login' && method === 'POST') {
    if (DEMO_EMAILS.includes(body?.email)) {
      return localRequest(endpoint, method, body);
    }
  }

  // An active demo session (token starts with 'local-token-') means the user
  // logged in via a demo account or a locally-registered mock account.
  // ALL their requests use the local mock fallback — they are not MongoDB users.
  const isDemoSession = token && String(token).startsWith('local-token-');
  if (isDemoSession) {
    return localRequest(endpoint, method, body);
  }

  // ── REAL BACKEND MODE ────────────────────────────────────────────────────
  // Core features MUST reach the real backend. We deliberately never fall back
  // to local data here — doing so would silently create phantom records and
  // break the MongoDB-as-source-of-truth guarantee.
  if (isCoreEndpoint(endpoint)) {
    let response;
    try {
      response = await backendFetch(endpoint, options);
    } catch (networkErr) {
      if (networkErr?.name === 'AbortError') {
        throw new Error(
          'The server is taking longer than expected to respond. Please try again.',
          { cause: networkErr }
        );
      }
      throw new Error(
        'Unable to connect to Capacity Connect server. Please try again shortly.',
        { cause: networkErr }
      );
    }

    return handleResponse(response, endpoint);
  }

  // Non-core features (assessments, certificates, library, etc.) still use
  // mock data — they have not been migrated to the backend yet.
  return localRequest(endpoint, method, body);
};

let healthPinged = false;

export const pingHealth = () => {
  if (healthPinged || typeof window === 'undefined') return;
  healthPinged = true;
  
  const requestUrl = `${API_BASE_URL}/health`;
  fetch(requestUrl, { method: 'GET' }).catch(() => {
    // Silent warm-up ping for Render cold starts; ignores errors.
  });
};

pingHealth();

export const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, body) => request('POST', endpoint, body),
  patch: (endpoint, body) => request('PATCH', endpoint, body),
  put: (endpoint, body) => request('PUT', endpoint, body),
  delete: (endpoint) => request('DELETE', endpoint),
  postFormData: (endpoint, formData) => request('POST', endpoint, formData, true),
  patchFormData: (endpoint, formData) => request('PATCH', endpoint, formData, true)
};
