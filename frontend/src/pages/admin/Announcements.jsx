import { useState } from 'react';
import { Bell, Plus, Edit2, Trash2 } from 'lucide-react';

const Announcements = () => {
  const [announcements] = useState([
    { id: 'an1', title: 'System Maintenance Notice', content: 'Capacity Connect will undergo scheduled maintenance this Sunday from 02:00 AM to 04:00 AM IST. Please save your work.', target: 'All Users', date: '2026-08-25', status: 'Active' },
    { id: 'an2', title: 'New Course: Advanced GIS', content: 'We are thrilled to announce the launch of a new course on Advanced GIS Mapping by Dr. Rajesh Kumar. Enrollments are now open.', target: 'Trainees', date: '2026-08-24', status: 'Active' },
    { id: 'an3', title: 'Trainer Workshop', content: 'Mandatory workshop for all Trainers regarding the new assessment creation tools. Check your email for meeting links.', target: 'Trainers', date: '2026-08-20', status: 'Expired' }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Announcements</h1>
          <p style={{ color: 'var(--text-light)' }}>Publish global notices to Trainees and Trainers.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {announcements.map(notice => (
          <div key={notice.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', borderLeft: notice.status === 'Active' ? '4px solid var(--primary)' : '4px solid var(--border-color)' }}>
            <div style={{ color: notice.status === 'Active' ? 'var(--primary)' : 'var(--text-light)' }}>
              <Bell size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: notice.status === 'Active' ? 'var(--text-dark)' : 'var(--text-light)' }}>{notice.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }} title="Edit"><Edit2 size={16} /></button>
                  <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ color: notice.status === 'Active' ? 'var(--text-dark)' : 'var(--text-light)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {notice.content}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-light)' }}><strong>Target:</strong> {notice.target}</span>
                <span style={{ color: 'var(--text-light)' }}><strong>Date:</strong> {notice.date}</span>
                <span style={{ 
                  padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 600,
                  backgroundColor: notice.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                  color: notice.status === 'Active' ? '#166534' : '#4b5563'
                }}>
                  {notice.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
