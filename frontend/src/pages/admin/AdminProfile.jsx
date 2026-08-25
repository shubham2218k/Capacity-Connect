import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Building } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Admin Profile</h1>
        <p style={{ color: 'var(--text-light)' }}>Manage your administrative account settings.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--danger)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {user?.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user?.name}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>
              <Shield size={14} /> System Administrator
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Mail size={20} style={{ color: 'var(--text-light)' }} />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Email Address</p>
              <p style={{ fontWeight: 500 }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Building size={20} style={{ color: 'var(--text-light)' }} />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Organization</p>
              <p style={{ fontWeight: 500 }}>{user?.organization}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <User size={20} style={{ color: 'var(--text-light)' }} />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Department</p>
              <p style={{ fontWeight: 500 }}>{user?.department}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
