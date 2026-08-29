/**
 * Announcement Service — Capacity Connect
 *
 * All announcement data now lives in MongoDB (via /api/announcements).
 * This service is a thin async wrapper around those API calls.
 *
 * "Read" state (which notifications the user has already seen) is still stored
 * in localStorage — it is pure UI state, not application data, and does not
 * need to survive a database reset.
 */

import { api } from './api';

// ─── Audience helpers (unchanged — used by UI components) ───────────────────

export const normalizeAudience = (audienceInput) => {
  if (!audienceInput) return 'all';
  const lower = String(audienceInput).toLowerCase().trim();
  if (lower.includes('trainee')) return 'trainees';
  if (lower.includes('trainer')) return 'trainers';
  return 'all';
};

export const getAudienceLabel = (audienceKey) => {
  const norm = normalizeAudience(audienceKey);
  if (norm === 'trainees') return 'Trainees Only';
  if (norm === 'trainers') return 'Trainers Only';
  return 'All Organization Users';
};

export const getUserOrgId = (user) => {
  if (!user) return 'default_org';
  const org = user.organizationId || user.organizationName || 'default_org';
  return String(org).trim().toLowerCase();
};

export const getUserId = (user) => {
  if (!user) return 'anonymous';
  const id = user.id || user._id || user.email || 'anonymous';
  return String(id).trim().toLowerCase();
};

// ─── Notify listeners that announcements changed ─────────────────────────────

export const notifyUpdate = () => {
  window.dispatchEvent(new CustomEvent('announcement_updated'));
};

// ─── Read state (localStorage — UI state only) ───────────────────────────────

export const getReadAnnouncementIds = (user) => {
  if (!user) return [];
  const key = `cc_read_announcements_${getUserId(user)}`;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markAnnouncementAsRead = (user, announcementId) => {
  if (!user || !announcementId) return;
  const key = `cc_read_announcements_${getUserId(user)}`;
  const current = getReadAnnouncementIds(user);
  if (!current.includes(announcementId)) {
    localStorage.setItem(key, JSON.stringify([...current, announcementId]));
    notifyUpdate();
  }
};

export const markAllAnnouncementsAsRead = (user, announcements) => {
  if (!user) return;
  const key = `cc_read_announcements_${getUserId(user)}`;
  const ids = (announcements || []).map(a => a._id || a.id).filter(Boolean);
  const current = getReadAnnouncementIds(user);
  const merged = Array.from(new Set([...current, ...ids]));
  localStorage.setItem(key, JSON.stringify(merged));
  notifyUpdate();
};

// ─── Backend API calls ────────────────────────────────────────────────────────

/**
 * Fetch all announcements for the current user.
 * The backend already applies org-scope + role-audience filtering.
 * Returns announcements enriched with a `read` boolean flag.
 */
export const fetchAnnouncements = async (user) => {
  const data = await api.get('/announcements');
  const list = Array.isArray(data?.data) ? data.data : [];
  const readIds = getReadAnnouncementIds(user);
  return list.map(a => ({ ...a, id: a._id || a.id, read: readIds.includes(a._id || a.id) }));
};

/**
 * Fetch announcements scoped to the admin's own org (same as fetchAnnouncements,
 * admin sees everything in their org).
 */
export const fetchAnnouncementsForAdmin = async (user) => {
  return fetchAnnouncements(user);
};

/** Admin: create a new announcement. */
export const createAnnouncement = async (user, formData) => {
  const result = await api.post('/announcements', {
    title: (formData.title || '').trim(),
    message: (formData.message || formData.content || '').trim(),
    audience: normalizeAudience(formData.audience || formData.target),
    type: formData.type || 'announcement',
    priority: formData.priority || 'Normal'
  });
  notifyUpdate();
  return result?.data;
};

/** Admin: update an existing announcement. */
export const updateAnnouncement = async (user, id, formData) => {
  const result = await api.patch(`/announcements/${id}`, {
    title: formData.title ? formData.title.trim() : undefined,
    message: formData.message || formData.content ? (formData.message || formData.content).trim() : undefined,
    audience: formData.audience || formData.target ? normalizeAudience(formData.audience || formData.target) : undefined,
    type: formData.type || undefined,
    priority: formData.priority || undefined
  });
  notifyUpdate();
  return result?.data;
};

/** Admin: delete an announcement (soft delete on backend). */
export const deleteAnnouncement = async (user, id) => {
  await api.delete(`/announcements/${id}`);
  notifyUpdate();
};
