import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Briefcase, MapPin, Building, GraduationCap, X, Check } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210', // Mock data
    location: 'New Delhi, India',
    organization: user?.organization || '',
    department: user?.department || '',
    designation: user?.designation || '',
    qualifications: [
      { degree: 'M.Sc. Environmental Science', institution: 'Delhi University', year: '2023' },
      { degree: 'B.Sc. Geography', institution: 'Delhi University', year: '2021' }
    ],
    experience: [
      { role: 'Scientific Assistant', org: 'MoES', duration: '2024 - Present' }
    ],
    skills: ['Data Analysis', 'Python', 'GIS', 'Climate Modeling', 'Communication']
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would make an API call to save the user profile
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>My Profile</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage your personal and professional information.</p>
        </div>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Basic Info Card */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1.5rem' 
            }}>
              {profileData.name.charAt(0)}
            </div>
            
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Email</label>
                  <input type="email" value={profileData.email} disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Phone</label>
                  <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Location</label>
                  <input type="text" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} />
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{profileData.name}</h2>
                <p style={{ color: 'var(--secondary)', fontWeight: 500, marginBottom: '1.5rem' }}>{profileData.designation}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                    <Mail size={16} style={{ color: 'var(--text-light)' }} /> {profileData.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                    <Phone size={16} style={{ color: 'var(--text-light)' }} /> {profileData.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                    <MapPin size={16} style={{ color: 'var(--text-light)' }} /> {profileData.location}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Professional Info */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} style={{ color: 'var(--primary)' }} /> Professional Details
            </h3>
            
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Organization</label>
                  <input type="text" value={profileData.organization} onChange={(e) => setProfileData({...profileData, organization: e.target.value})} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Department</label>
                  <input type="text" value={profileData.department} onChange={(e) => setProfileData({...profileData, department: e.target.value})} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Designation</label>
                  <input type="text" value={profileData.designation} onChange={(e) => setProfileData({...profileData, designation: e.target.value})} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Organization</div>
                  <div style={{ fontWeight: 500 }}>{profileData.organization}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Department</div>
                  <div style={{ fontWeight: 500 }}>{profileData.department}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Designation</div>
                  <div style={{ fontWeight: 500 }}>{profileData.designation}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Skills */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} style={{ color: 'var(--primary)' }} /> Skills & Competencies
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: isEditing ? '1.5rem' : 0 }}>
              {profileData.skills.map((skill, index) => (
                <div key={index} style={{ 
                  backgroundColor: 'var(--bg-color)', 
                  padding: '0.4rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  {skill}
                  {isEditing && (
                    <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  placeholder="Add a new skill..." 
                  style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button onClick={handleAddSkill} className="btn btn-secondary">Add</button>
              </div>
            )}
          </div>

          {/* Qualifications */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} style={{ color: 'var(--primary)' }} /> Educational Qualifications
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profileData.qualifications.map((qual, index) => (
                <div key={index} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{qual.degree}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{qual.institution}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{qual.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Work Experience
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profileData.experience.map((exp, index) => (
                <div key={index} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{exp.role}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{exp.org}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{exp.duration}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
