import { Settings, Shield, Globe, Database } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>System Settings</h1>
        <p style={{ color: 'var(--text-light)' }}>Configure global platform behavior and security policies.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Globe size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>General Configuration</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Platform Name</label>
              <input type="text" defaultValue="Capacity Connect" />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Support Email</label>
              <input type="email" defaultValue="support@capacityconnect.in" />
            </div>
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Changes</button>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Security Policies</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span style={{ fontWeight: 500 }}>Require 2FA for Admins</span>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 500 }}>Allow External Trainer Registration</span>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 500 }}>Session Timeout (minutes)</span>
              <input type="number" defaultValue={60} style={{ width: '80px', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Database size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Data Management</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Manage system backups and archiving policies.</p>
            <button className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Trigger Manual Backup</button>
            <button className="btn btn-outline" style={{ width: '100%', textAlign: 'center', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Clear System Cache</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemSettings;
