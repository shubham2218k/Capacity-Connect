import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Key, Sliders, Bell, Copy, Check, Save } from 'lucide-react';

const SystemSettings = () => {
  const { user } = useAuth();
  const [copiedKey, setCopiedKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [orgData, setOrgData] = useState({
    organizationName: user?.organizationName || user?.organization || 'Organization Workspace',
    organizationType: user?.organizationType || 'Government Agency',
    officialEmail: user?.officialEmail || user?.email || 'admin@organization.org',
    officialPhone: user?.officialPhone || user?.phone || '+91 11 2345 6789',
    address: user?.address || 'Administrative Block, Technology Complex',
    city: user?.city || 'New Delhi',
    state: user?.state || 'Delhi',
    country: user?.country || 'India'
  });

  const [preferences, setPreferences] = useState({
    allowSelfRegistration: true,
    requireApprovalForTrainers: true,
    emailAlertNewTrainer: true,
    emailAlertCompletions: false
  });

  const handleCopy = (key, type) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Organization Settings
        </h1>
        <p style={{ color: 'var(--text-light)' }}>
          Manage your organization's Capacity Connect workspace credentials and preferences.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: 'var(--success-bg)', color: '#065f46', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Check size={18} /> Organization settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* SECTION 1: ORGANIZATION ACCESS KEYS */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--primary)', color: 'white', borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Key size={22} style={{ color: 'var(--secondary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Organization Access Credentials</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
            Authorized registration credentials for <strong>{orgData.organizationName}</strong>. Members enter these keys during signup to join your workspace.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem' }}>
                Trainee Access Key
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={user?.traineeKey || 'CC-TRN-DEMO123'} 
                  readOnly 
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }} 
                />
                <button 
                  type="button" 
                  onClick={() => handleCopy(user?.traineeKey || 'CC-TRN-DEMO123', 'Trainee')} 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', border: 'none' }}
                >
                  <Copy size={16} /> {copiedKey === 'Trainee' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem' }}>
                Trainer Access Key
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={user?.trainerKey || 'CC-TNR-DEMO456'} 
                  readOnly 
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }} 
                />
                <button 
                  type="button" 
                  onClick={() => handleCopy(user?.trainerKey || 'CC-TNR-DEMO456', 'Trainer')} 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', border: 'none' }}
                >
                  <Copy size={16} /> {copiedKey === 'Trainer' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ORGANIZATION PROFILE INFORMATION */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Building2 size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Organization Information</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Organization Name *</label>
              <input 
                type="text" 
                value={orgData.organizationName}
                onChange={(e) => setOrgData({ ...orgData, organizationName: e.target.value })}
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Organization Type</label>
              <select 
                value={orgData.organizationType}
                onChange={(e) => setOrgData({ ...orgData, organizationType: e.target.value })}
              >
                <option value="Government Agency">Government Agency</option>
                <option value="University / Academic">University / Academic</option>
                <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                <option value="Corporate Enterprise">Corporate Enterprise</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Official Email *</label>
              <input 
                type="email" 
                value={orgData.officialEmail}
                onChange={(e) => setOrgData({ ...orgData, officialEmail: e.target.value })}
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Official Phone</label>
              <input 
                type="tel" 
                value={orgData.officialPhone}
                onChange={(e) => setOrgData({ ...orgData, officialPhone: e.target.value })}
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
              <label>Address</label>
              <input 
                type="text" 
                value={orgData.address}
                onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <input 
                type="text" 
                value={orgData.city}
                onChange={(e) => setOrgData({ ...orgData, city: e.target.value })}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Country</label>
              <input 
                type="text" 
                value={orgData.country}
                onChange={(e) => setOrgData({ ...orgData, country: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TRAINING PREFERENCES & NOTIFICATIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Sliders size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Training Governance</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.allowSelfRegistration}
                  onChange={(e) => setPreferences({ ...preferences, allowSelfRegistration: e.target.checked })}
                />
                <span>Allow Trainee self-registration with valid access key</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.requireApprovalForTrainers}
                  onChange={(e) => setPreferences({ ...preferences, requireApprovalForTrainers: e.target.checked })}
                />
                <span>Trainer applications require Admin review & approval</span>
              </label>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Bell size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Admin Notification Preferences</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.emailAlertNewTrainer}
                  onChange={(e) => setPreferences({ ...preferences, emailAlertNewTrainer: e.target.checked })}
                />
                <span>Notify me when a new Trainer application is submitted</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.emailAlertCompletions}
                  onChange={(e) => setPreferences({ ...preferences, emailAlertCompletions: e.target.checked })}
                />
                <span>Notify me when Trainees complete required courses</span>
              </label>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> Save Organization Settings
          </button>
        </div>

      </form>
    </div>
  );
};

export default SystemSettings;
