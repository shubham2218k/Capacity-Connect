import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, UserCheck, Activity, FileText, CheckCircle, Clock, Copy, AlertCircle, Award, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setDashboardData(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
      setError(err.message || 'Unable to load organization overview.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(dateStr);
    }
  };

  const stats = dashboardData || {
    totalUsers: 0,
    activeTrainees: 0,
    activeTrainers: 0,
    suspendedUsers: 0,
    pendingTrainerApprovals: 0,
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    announcementsCount: 0,
    recentActivity: []
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Organization Overview
        </h1>
        <p style={{ color: 'var(--text-light)' }}>
          Welcome to the Capacity Connect Administration Portal, {user.name}. Overview for <strong>{user.organizationName || 'your organization'}</strong>.
        </p>
      </div>

      {user.traineeKey && user.trainerKey && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--primary)', borderLeft: '4px solid var(--secondary)', color: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Organization Access Keys</h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
            Share these keys with your members to allow them to register under <strong style={{ color: 'white' }}>{user.organizationName}</strong>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem' }}>Trainee Access Key</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={user.traineeKey} readOnly style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }} />
                <button type="button" onClick={() => { navigator.clipboard.writeText(user.traineeKey); alert('Copied to clipboard'); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', border: 'none' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem' }}>Trainer Access Key</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={user.trainerKey} readOnly style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }} />
                <button type="button" onClick={() => { navigator.clipboard.writeText(user.trainerKey); alert('Copied to clipboard'); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', border: 'none' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{loading ? '-' : stats.totalUsers}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Organization Users</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{loading ? '-' : stats.pendingTrainerApprovals}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Pending Trainer Approvals</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '50%' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{loading ? '-' : stats.publishedCourses}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Published Courses ({stats.totalCourses} Total)</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '50%' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{loading ? '-' : stats.activeTrainers}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Active Verified Trainers</div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Quick Actions */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link to="/admin/trainer-approvals" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', height: 'auto', justifyContent: 'center' }}>
              <UserCheck size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 600 }}>Review Trainers</span>
            </Link>
            <Link to="/admin/announcements" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', height: 'auto', justifyContent: 'center' }}>
              <FileText size={24} style={{ color: 'var(--secondary)' }} />
              <span style={{ fontWeight: 600 }}>Post Announcement</span>
            </Link>
            <Link to="/admin/users" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', height: 'auto', justifyContent: 'center' }}>
              <Users size={24} style={{ color: 'var(--success)' }} />
              <span style={{ fontWeight: 600 }}>Manage Users</span>
            </Link>
            <Link to="/admin/competencies" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', height: 'auto', justifyContent: 'center' }}>
              <Activity size={24} style={{ color: 'var(--warning)' }} />
              <span style={{ fontWeight: 600 }}>Competency Map</span>
            </Link>
          </div>
        </div>

        {/* Recent Organization Activity */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Organization Activity</h2>
          </div>
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
              Loading recent activity...
            </div>
          ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.recentActivity.map((act, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', borderBottom: index < stats.recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '0.75rem' }}>
                  <div style={{ color: act.type === 'trainer_application' ? '#b45309' : act.type === 'course_created' ? 'var(--secondary)' : 'var(--primary)', marginTop: '2px' }}>
                    {act.type === 'trainer_application' ? <UserCheck size={18} /> : act.type === 'course_created' ? <BookOpen size={18} /> : <CheckCircle size={18} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                      <strong>{act.title}:</strong> {act.description}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>{formatDate(act.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
              No recent organization activity.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
