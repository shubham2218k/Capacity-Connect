import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Building2, MapPin, Edit2, Check, ShieldCheck, UserCheck } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Organization Admin',
    email: user?.email || 'admin@organization.org',
    phone: user?.phone || '+91 98765 43210',
    department: user?.department || 'Administration',
    designation: user?.designation || 'Head of Capacity Development',
    organizationName: user?.organizationName || user?.organization || 'Organization Workspace',
    organizationType: user?.organizationType || 'Government Agency',
    officialEmail: user?.officialEmail || user?.email || 'contact@organization.org',
    officialPhone: user?.officialPhone || user?.phone || '+91 11 2345 6789',
    city: user?.city || 'New Delhi',
    state: user?.state || 'Delhi',
    country: user?.country || 'India'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Persist in AuthContext / localStorage
    const localUser = JSON.parse(localStorage.getItem('cc_user') || '{}');
    const updated = { ...localUser, ...profile };
    localStorage.setItem('cc_user', JSON.stringify(updated));
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Admin Profile
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            Manage your personal profile and administrative details.
          </p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', pb: '1.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.25rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-sm)'
          }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>{profile.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={14} /> Organization Admin
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 500 }}>
                {profile.organizationName}
              </span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Personal Information
              </h3>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Full Name *</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} required />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Admin Email *</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} required />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Phone Number</label>
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Administrative & Department Details
              </h3>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Department</label>
              <input type="text" value={profile.department} onChange={(e) => setProfile({...profile, department: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Designation</label>
              <input type="text" value={profile.designation} onChange={(e) => setProfile({...profile, designation: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Organization Details
              </h3>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Organization Name</label>
              <input type="text" value={profile.organizationName} onChange={(e) => setProfile({...profile, organizationName: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Official Email</label>
              <input type="email" value={profile.officialEmail} onChange={(e) => setProfile({...profile, officialEmail: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <input type="text" value={profile.city} onChange={(e) => setProfile({...profile, city: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Country</label>
              <input type="text" value={profile.country} onChange={(e) => setProfile({...profile, country: e.target.value})} />
            </div>

          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* Personal Info */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Personal Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Full Name</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={16} style={{ color: 'var(--text-light)' }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Admin Email</span>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={16} style={{ color: 'var(--text-light)' }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Phone Number</span>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Info */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Administrative Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Administrative Role</span>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Organization Admin</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Department</span>
                  <div style={{ fontWeight: 500 }}>{profile.department}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Designation</span>
                  <div style={{ fontWeight: 500 }}>{profile.designation}</div>
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Organization Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Building2 size={16} style={{ color: 'var(--text-light)' }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Organization Name</span>
                    <div style={{ fontWeight: 600 }}>{profile.organizationName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={16} style={{ color: 'var(--text-light)' }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Location</span>
                    <div style={{ fontWeight: 500 }}>{profile.city}, {profile.country}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <UserCheck size={16} style={{ color: 'var(--success)' }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Account Status</span>
                    <div><span className="badge badge-success">Active Administrator</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProfile;
