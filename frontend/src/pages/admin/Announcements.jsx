import { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchAnnouncementsForAdmin, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  getAudienceLabel,
  normalizeAudience
} from '../../services/announcementService';

const idOf = (item) => item?._id || item?.id;

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'all',
    type: 'announcement',
    priority: 'Normal',
    date: new Date().toISOString().split('T')[0]
  });

  const loadAdminAnnouncements = async () => {
    if (!user) return;
    try {
      setError('');
      const data = await fetchAnnouncementsForAdmin(user);
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
      setError(err?.message || 'Failed to load announcements.');
    }
  };

  useEffect(() => {
    loadAdminAnnouncements();

    const handleUpdate = () => {
      loadAdminAnnouncements();
    };

    window.addEventListener('announcement_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('announcement_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user]);

  const handleOpenCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      message: '',
      audience: 'all',
      type: 'announcement',
      priority: 'Normal',
      date: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || '',
      message: notice.message || notice.content || '',
      audience: normalizeAudience(notice.audience || notice.target),
      type: notice.type || 'announcement',
      priority: notice.priority || 'Normal',
      date: notice.date || (notice.createdAt ? notice.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    try {
      setError('');
      if (editingNotice) {
        await updateAnnouncement(user, idOf(editingNotice), formData);
      } else {
        await createAnnouncement(user, formData);
      }
      await loadAdminAnnouncements();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save announcement:', err);
      setError(err?.message || 'Failed to save announcement.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await deleteAnnouncement(user, id);
      await loadAdminAnnouncements();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      setError(err?.message || 'Failed to delete announcement.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Announcements & Notices
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            Publish organization-wide announcements for {user?.organizationName || 'your workspace'}.
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Announcement
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {announcements.length > 0 ? (
          announcements.map(notice => (
            <div 
              key={idOf(notice)} 
              className="card" 
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                gap: '1.5rem', 
                borderLeft: notice.priority === 'Important' ? '4px solid var(--danger)' : '4px solid var(--primary)' 
              }}
            >
              <div style={{ color: notice.priority === 'Important' ? 'var(--danger)' : 'var(--primary)' }}>
                <Bell size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)', display: 'inline-block', marginRight: '0.75rem' }}>
                      {notice.title}
                    </h3>
                    <span className={`badge ${notice.priority === 'Important' ? 'badge-danger' : 'badge-primary'}`}>
                      {notice.priority || 'Normal'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleOpenEditModal(notice)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.25rem' }} 
                      title="Edit Announcement"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(idOf(notice))}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }} 
                      title="Delete Announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-dark)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {notice.message || notice.content}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-light)' }}>
                    <strong>Audience:</strong> {getAudienceLabel(notice.audience || notice.target)}
                  </span>
                  <span style={{ color: 'var(--text-light)' }}>
                    <strong>Organization:</strong> {notice.organizationName || user?.organizationName || 'Current Org'}
                  </span>
                  <span style={{ color: 'var(--text-light)' }}>
                    <strong>Date:</strong> {notice.date || (notice.createdAt ? notice.createdAt.split('T')[0] : '')}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
            No announcements published for {user?.organizationName || 'your organization'}. Click "New Announcement" to publish one.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                {editingNotice ? 'Edit Announcement' : 'Publish New Announcement'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Announcement Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Upcoming Maintenance Notice"
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Message Content *</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter full announcement details for users..."
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Target Audience *</label>
                  <select 
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  >
                    <option value="all">All Organization Users</option>
                    <option value="trainees">Trainees Only</option>
                    <option value="trainers">Trainers Only</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Announcement Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="announcement">General Announcement</option>
                    <option value="important">Important Update</option>
                    <option value="learning-content">New Learning Content</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Publish Date</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNotice ? 'Save Changes' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Announcement?</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove this announcement? It will no longer be displayed to users.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Announcements;
