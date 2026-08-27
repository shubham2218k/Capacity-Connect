// Shared Announcement & Notification Service for Capacity Connect

const STORAGE_KEY = 'cc_announcements';

// Helper to normalize organization identifier
export const getUserOrgId = (user) => {
  if (!user) return 'default_org';
  const org = user.organizationId || user.organizationName || user.organization || 'default_org';
  return String(org).trim().toLowerCase();
};

// Helper to normalize user ID for read states
export const getUserId = (user) => {
  if (!user) return 'anonymous';
  const id = user.id || user._id || user.email || 'anonymous';
  return String(id).trim().toLowerCase();
};

// Normalize audience keys
export const normalizeAudience = (audienceInput) => {
  if (!audienceInput) return 'all';
  const lower = String(audienceInput).toLowerCase().trim();
  if (lower.includes('trainee')) return 'trainees';
  if (lower.includes('trainer')) return 'trainers';
  return 'all';
};

// UI label mapping
export const getAudienceLabel = (audienceKey) => {
  const norm = normalizeAudience(audienceKey);
  if (norm === 'trainees') return 'Trainees Only';
  if (norm === 'trainers') return 'Trainers Only';
  return 'All Organization Users';
};

// Default seed data if local storage is empty
const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann_seed_1',
    organizationId: 'demo-org',
    organizationName: 'Demo-Org',
    title: 'System Maintenance Notice',
    message: 'Capacity Connect will undergo scheduled maintenance this Sunday from 02:00 AM to 04:00 AM IST. Please save your work.',
    audience: 'all',
    type: 'important',
    priority: 'Important',
    createdBy: 'System Admin',
    createdAt: new Date('2026-08-25T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-08-25T10:00:00.000Z').toISOString(),
    status: 'Active'
  },
  {
    id: 'ann_seed_2',
    organizationId: 'demo-org',
    organizationName: 'Demo-Org',
    title: 'New Course: Advanced GIS Mapping',
    message: 'We are thrilled to announce the launch of a new course on Advanced GIS Mapping. Enrollments are now open.',
    audience: 'trainees',
    type: 'learning-content',
    priority: 'Normal',
    createdBy: 'Dr. Meera Nair',
    createdAt: new Date('2026-08-24T14:30:00.000Z').toISOString(),
    updatedAt: new Date('2026-08-24T14:30:00.000Z').toISOString(),
    status: 'Active'
  },
  {
    id: 'ann_seed_3',
    organizationId: 'demo-org',
    organizationName: 'Demo-Org',
    title: 'Trainer Workshop & Assessment Tools',
    message: 'Mandatory workshop for all Trainers regarding the new assessment creation tools. Check your email for meeting links.',
    audience: 'trainers',
    type: 'announcement',
    priority: 'Normal',
    createdBy: 'Admin',
    createdAt: new Date('2026-08-20T09:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-08-20T09:00:00.000Z').toISOString(),
    status: 'Active'
  }
];

export const getAllAnnouncements = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      return DEFAULT_ANNOUNCEMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_ANNOUNCEMENTS;
    return parsed;
  } catch (e) {
    return DEFAULT_ANNOUNCEMENTS;
  }
};

const saveAnnouncements = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  notifyUpdate();
};

export const notifyUpdate = () => {
  window.dispatchEvent(new CustomEvent('announcement_updated'));
};

// Admin list for their organization
export const getAnnouncementsForAdmin = (user) => {
  const all = getAllAnnouncements();
  const userOrg = getUserOrgId(user);
  return all.filter(a => getUserOrgId(a) === userOrg);
};

// Filter notifications for a specific logged-in user (Trainee, Trainer, Admin)
export const getNotificationsForUser = (user) => {
  if (!user) return [];
  const all = getAllAnnouncements();
  const userOrg = getUserOrgId(user);
  const userRole = String(user.role || '').toLowerCase().trim();
  const readIds = getReadAnnouncementIds(user);

  return all
    .filter(a => {
      // 1. Organization Isolation check
      const announcementOrg = getUserOrgId(a);
      if (announcementOrg !== userOrg && announcementOrg !== 'demo-org' && userOrg !== 'demo-org') {
        // If exact match fails, check if org names match
        const orgNameA = String(a.organizationName || a.organizationId || '').toLowerCase().trim();
        const orgNameUser = String(user.organizationName || user.organization || '').toLowerCase().trim();
        if (orgNameA !== orgNameUser) return false;
      }

      // 2. Audience Filtering Logic
      const audience = normalizeAudience(a.audience);
      
      if (audience === 'all') return true;

      if (audience === 'trainees') {
        return userRole === 'trainee';
      }

      if (audience === 'trainers') {
        return userRole === 'trainer';
      }

      // Admins see all for their org
      if (userRole === 'admin') return true;

      return false;
    })
    .map(a => ({
      ...a,
      read: readIds.includes(a.id)
    }));
};

// User-Specific Read State
export const getReadAnnouncementIds = (user) => {
  if (!user) return [];
  const userId = getUserId(user);
  const key = `cc_read_announcements_${userId}`;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const markAnnouncementAsRead = (user, announcementId) => {
  if (!user || !announcementId) return;
  const userId = getUserId(user);
  const key = `cc_read_announcements_${userId}`;
  const currentRead = getReadAnnouncementIds(user);
  if (!currentRead.includes(announcementId)) {
    const updated = [...currentRead, announcementId];
    localStorage.setItem(key, JSON.stringify(updated));
    notifyUpdate();
  }
};

export const markAllAnnouncementsAsRead = (user) => {
  if (!user) return;
  const userId = getUserId(user);
  const key = `cc_read_announcements_${userId}`;
  const visible = getNotificationsForUser(user);
  const visibleIds = visible.map(a => a.id);
  const currentRead = getReadAnnouncementIds(user);
  
  const merged = Array.from(new Set([...currentRead, ...visibleIds]));
  localStorage.setItem(key, JSON.stringify(merged));
  notifyUpdate();
};

// Admin CRUD Actions
export const createAnnouncement = (user, formData) => {
  const all = getAllAnnouncements();
  const orgName = user?.organizationName || user?.organization || 'Organization Workspace';
  const orgId = getUserOrgId(user);

  const newAnnouncement = {
    id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    organizationId: orgId,
    organizationName: orgName,
    title: formData.title.trim(),
    message: (formData.message || formData.content || '').trim(),
    content: (formData.message || formData.content || '').trim(),
    audience: normalizeAudience(formData.audience || formData.target),
    target: getAudienceLabel(formData.audience || formData.target),
    type: formData.type || 'announcement',
    priority: formData.priority || 'Normal',
    createdBy: user?.name || 'Organization Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: formData.date || new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  const updatedList = [newAnnouncement, ...all];
  saveAnnouncements(updatedList);
  return newAnnouncement;
};

export const updateAnnouncement = (user, id, formData) => {
  const all = getAllAnnouncements();
  const updatedList = all.map(a => {
    if (a.id === id) {
      const messageText = (formData.message || formData.content || a.message || a.content).trim();
      return {
        ...a,
        title: formData.title ? formData.title.trim() : a.title,
        message: messageText,
        content: messageText,
        audience: formData.audience || formData.target ? normalizeAudience(formData.audience || formData.target) : a.audience,
        target: formData.audience || formData.target ? getAudienceLabel(formData.audience || formData.target) : a.target,
        type: formData.type || a.type,
        priority: formData.priority || a.priority,
        date: formData.date || a.date,
        updatedAt: new Date().toISOString()
      };
    }
    return a;
  });

  saveAnnouncements(updatedList);
};

export const deleteAnnouncement = (user, id) => {
  const all = getAllAnnouncements();
  const updatedList = all.filter(a => a.id !== id);
  saveAnnouncements(updatedList);
};
