import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, UserCheck, ShieldAlert, Activity, FileText, CheckCircle, Clock, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Mock Stats for Admin
  const stats = {
    totalUsers: 1240,
    activeTrainers: 45,
    pendingApprovals: 8,
    activeCourses: 32,
    completionRate: 76,
    systemAlerts: 2
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          System Overview
        </h1>
        <p style={{ color: 'var(--text-light)' }}>Welcome to the Capacity Connect Administration Portal, {user.name}.</p>
      </div>

      {user.traineeKey && user.trainerKey && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--primary-light)', borderLeft: '4px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>Organization Access Keys</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
            Share these keys with your members to allow them to register under <strong>{user.organizationName}</strong>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Trainee Access Key</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={user.traineeKey} readOnly style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', fontWeight: 600, fontFamily: 'monospace' }} />
                <button type="button" onClick={() => { navigator.clipboard.writeText(user.traineeKey); alert('Copied to clipboard'); }} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Trainer Access Key</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={user.trainerKey} readOnly style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', fontWeight: 600, fontFamily: 'monospace' }} />
                <button type="button" onClick={() => { navigator.clipboard.writeText(user.trainerKey); alert('Copied to clipboard'); }} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Platform Users</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.pendingApprovals}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Pending Trainer Approvals</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '50%' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.activeCourses}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Active Courses</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '50%' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.systemAlerts}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>System Alerts</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
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
            <Link to="/admin/reports" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', height: 'auto', justifyContent: 'center' }}>
              <Activity size={24} style={{ color: 'var(--success)' }} />
              <span style={{ fontWeight: 600 }}>Generate Report</span>
            </Link>
            <Link to="/admin/competencies" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', height: 'auto', justifyContent: 'center' }}>
              <Users size={24} style={{ color: 'var(--warning)' }} />
              <span style={{ fontWeight: 600 }}>Manage Roles</span>
            </Link>
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Platform Activity</h2>
            <Link to="/admin/reports" style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>View All</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--secondary)', marginTop: '2px' }}><CheckCircle size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>System Backup</strong> completed successfully</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>10 mins ago</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--primary)', marginTop: '2px' }}><UserCheck size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>New Trainer Application</strong> received from Dr. Rajesh Kumar</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>1 hour ago</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: '#b45309', marginTop: '2px' }}><BookOpen size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>New Course Published:</strong> <em>Advanced GIS Mapping</em></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>3 hours ago</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--danger)', marginTop: '2px' }}><ShieldAlert size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Failed Login Attempts</strong> spike detected</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
