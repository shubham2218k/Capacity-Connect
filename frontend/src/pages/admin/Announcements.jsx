import { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const initialAnnouncements = [
  { 
    id: 'an1', 
    title: 'System Maintenance Notice', 
    content: 'Capacity Connect will undergo scheduled maintenance this Sunday from 02:00 AM to 04:00 AM IST. Please save your work.', 
    target: 'All Organization Users', 
    type: 'Important Update',
    priority: 'Important',
    date: '2026-08-25', 
    status: 'Active' 
  },
  { 
    id: 'an2', 
    title: 'New Course: Advanced GIS', 
    content: 'We are thrilled to announce the launch of a new course on Advanced GIS Mapping by Dr. Rajesh Kumar. Enrollments are now open.', 
    target: 'Trainees', 
    type: 'New Learning Content',
    priority: 'Normal',
    date: '2026-08-24', 
    status: 'Active' 
  },
  { 
    id: 'an3', 
    title: 'Trainer Workshop', 
    content: 'Mandatory workshop for all Trainers regarding the new assessment creation tools. Check your email for meeting links.', 
    target: 'Trainers', 
    type: 'General Announcement',
    priority: 'Normal',
    date: '2026-08-20', 
    status: 'Active' 
  }
];

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'All Organization Users',
    type: 'General Announcement',
    priority: 'Normal',
    date: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  useEffect(() => {
    const stored = localStorage.getItem('cc_announcements');
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    } else {
      localStorage.setItem('cc_announcements', JSON.stringify(initialAnnouncements));
      setAnnouncements(initialAnnouncements);
    }
  }, []);

  const saveAnnouncementsToStorage = (newList) => {
    setAnnouncements(newList);
    localStorage.setItem('cc_announcements', JSON.stringify(newList));
    // Trigger custom event so other components update real-time
    window.dispatchEvent(new Event('announcements_updated'));
  };

  const handleOpenCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      target: 'All Organization Users',
      type: 'General Announcement',
      priority: 'Normal',
      date: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      target: notice.target,
      type: notice.type || 'General Announcement',
      priority: notice.priority || 'Normal',
      date: notice.date,
      status: notice.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingNotice) {
      const updated = announcements.map(a => a.id === editingNotice.id ? { ...a, ...formData } : a);
      saveAnnouncementsToStorage(updated);
    } else {
      const newNotice = {
        id: `an_${Date.now()}`,
        ...formData
      };
      saveAnnouncementsToStorage([newNotice, ...announcements]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const filtered = announcements.filter(a => a.id !== id);
    saveAnnouncementsToStorage(filtered);
    setDeleteConfirmId(null);
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {announcements.length > 0 ? (
          announcements.map(notice => (
            <div 
              key={notice.id} 
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
                      onClick={() => setDeleteConfirmId(notice.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }} 
                      title="Delete Announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-dark)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {notice.content}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-light)' }}><strong>Audience:</strong> {notice.target}</span>
                  <span style={{ color: 'var(--text-light)' }}><strong>Type:</strong> {notice.type || 'General'}</span>
                  <span style={{ color: 'var(--text-light)' }}><strong>Date:</strong> {notice.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
            No announcements published yet. Click "New Announcement" to publish one.
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
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter full announcement details for users..."
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Target Audience *</label>
                  <select 
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  >
                    <option value="All Organization Users">All Organization Users</option>
                    <option value="Trainees">Trainees Only</option>
                    <option value="Trainers">Trainers Only</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Announcement Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="General Announcement">General Announcement</option>
                    <option value="Important Update">Important Update</option>
                    <option value="New Learning Content">New Learning Content</option>
                    <option value="Achievement">Achievement</option>
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
