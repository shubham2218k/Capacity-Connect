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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 8000;

// Only these endpoints are served by the real backend. Everything else
// (courses, assessments, certificates, ...) keeps running on local data.
const BACKEND_PREFIXES = ['/health', '/auth/', '/admin/trainer-applications', '/courses'];

const usesBackend = (endpoint) => BACKEND_PREFIXES.some((prefix) => endpoint.startsWith(prefix));

const safeJSONParse = (str, fallback) => {
  try {
    return JSON.parse(str) || fallback;
  } catch (e) {
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

    const { password, ...safeAdmin } = newAdmin;
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
      const { password, ...safeUser } = user;

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

    const { password, ...safeUser } = newUser;
    return { status: 201, ok: true, data: { success: true, data: { ...safeUser, token: `local-token-${newUser._id}` } } };
  }

  if (endpoint.startsWith('/auth/trainer-apply') && method === 'POST') {
    const key = String(body?.trainerAccessKey || body?.accessKey || '').trim().toUpperCase();
    const org = orgs.find(o => o.trainerKey === key);
    if (!org) {
      const crossed = orgs.find(o => o.traineeKey === key);
      return { status: 400, ok: false, data: { message: crossed
        ? "That is a Trainee access key. Please use your organization's Trainer access key."
        : 'Invalid organization access key.' } };
    }
    if (users.some(u => u.email === body?.email)) {
      return { status: 409, ok: false, data: { message: 'Email already registered.' } };
    }

    const newUser = {
      _id: 'tnr' + Date.now(),
      name: body?.name,
      email: body?.email,
      password: body?.password,
      phone: body?.phone,
      role: 'Trainer',
      status: 'pending', // Awaiting Admin approval
      department: body?.department,
      designation: body?.designation,
      qualification: body?.qualification,
      expertise: body?.expertise || [],
      experience: body?.experience,
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

    const approveMatch = endpoint.match(/^\/admin\/trainer-applications\/([^/]+)\/approve/);
    const rejectMatch = endpoint.match(/^\/admin\/trainer-applications\/([^/]+)\/reject/);

    if (approveMatch && method === 'PATCH') {
      const id = approveMatch[1];
      const index = users.findIndex(u => String(u._id) === id);
      if (index === -1) return { status: 404, ok: false, data: { message: 'Trainer application not found.' } };
      users[index] = { ...users[index], status: 'active', rejectionReason: '' };
      setDB('mock_users', users);
      return { status: 200, ok: true, data: { success: true, message: `${users[index].name} has been approved.`, data: users[index] } };
    }

    if (rejectMatch && method === 'PATCH') {
      const id = rejectMatch[1];
      const reason = (body?.reason || '').trim();
      if (!reason) return { status: 400, ok: false, data: { message: 'A rejection reason is required.' } };
      const index = users.findIndex(u => String(u._id) === id);
      if (index === -1) return { status: 404, ok: false, data: { message: 'Trainer application not found.' } };
      users[index] = { ...users[index], status: 'rejected', rejectionReason: reason };
      setDB('mock_users', users);
      return { status: 200, ok: true, data: { success: true, message: `${users[index].name}'s application was rejected.`, data: users[index] } };
    }

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
          const { password, ...rest } = u;
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

  // --- Admin Data ---
  if (endpoint.includes('/users') || endpoint.includes('/admin/')) {
    return { status: 200, ok: true, data: { success: true, data: [] } };
  }

  // --- Trainer Trainees & Feedback ---
  if (endpoint.includes('/trainees') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockTrainerTrainees } };
  }
  if (endpoint.includes('/feedback') && method === 'GET') {
    return { status: 200, ok: true, data: { success: true, data: mockTrainerFeedback } };
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

let offlineNoticeLogged = false;

const noteOffline = () => {
  if (!offlineNoticeLogged) {
    console.info('Backend unavailable, using local fallback.');
    offlineNoticeLogged = true;
  }
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
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    return await fetch(`${API_URL}${endpoint}`, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const request = async (method, endpoint, body, isFormData = false) => {
  const token = getAuthToken();
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body !== undefined && body !== null) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  // Intercept demo logins so they always work (using local mock) even if the real backend is running
  if (endpoint === '/auth/login' && method === 'POST') {
    if (body?.email === 'admin@capacityconnect.in' || body?.email === 'trainer@capacityconnect.in') {
      return localRequest(endpoint, method, body);
    }
  }

  const isLocalToken = token && String(token).startsWith('local-token-');

  if (usesBackend(endpoint) && !isLocalToken) {
    let response;
    try {
      response = await backendFetch(endpoint, options);
    } catch (err) {
      // fetch only throws when the request never reached the server
      // (connection refused, DNS failure, timeout, offline browser).
      noteOffline();
      return localRequest(endpoint, method, body);
    }
    return handleResponse(response, endpoint);
  }

  return localRequest(endpoint, method, body);
};

export const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, body) => request('POST', endpoint, body),
  patch: (endpoint, body) => request('PATCH', endpoint, body),
  put: (endpoint, body) => request('PUT', endpoint, body),
  delete: (endpoint) => request('DELETE', endpoint),
  postFormData: (endpoint, formData) => request('POST', endpoint, formData, true),
  patchFormData: (endpoint, formData) => request('PATCH', endpoint, formData, true)
};
