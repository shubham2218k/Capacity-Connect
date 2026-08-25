import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, 
  Award, GraduationCap, CheckCircle, Edit2, Save,
  BookOpen, Users, PenTool
} from 'lucide-react';

const TrainerProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock Profile Data
  const [profileData, setProfileData] = useState({
    fullName: user?.name || 'Dr. Meera Nair',
    email: user?.email || 'meera.nair@moes.gov.in',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    organization: 'Ministry of Earth Sciences',
    department: 'Climate Research & Training',
    designation: 'Senior Scientist',
    employeeId: 'MOES-2015-8472',
    bio: 'Experienced researcher and trainer specializing in remote sensing applications for climate monitoring.',
    expertise: ['Remote Sensing', 'GIS', 'Climate Science', 'Data Analytics', 'Research', 'Training'],
    qualifications: [
      { degree: 'Ph.D. in Atmospheric Physics', institution: 'IIT Delhi', year: '2012' },
      { degree: 'M.Sc. in Physics', institution: 'Delhi University', year: '2008' }
    ],
    experience: [
      { role: 'Senior Scientist', organization: 'MoES', duration: '2015 - Present' },
      { role: 'Research Associate', organization: 'ISRO', duration: '2012 - 2015' }
    ]
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, save to backend
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!profileData.expertise.includes(newSkill.trim())) {
        setProfileData({
          ...profileData,
          expertise: [...profileData.expertise, newSkill.trim()]
        });
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      expertise: profileData.expertise.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>My Profile</h1>
          <p className="text-light">Manage your professional information and trainer profile.</p>
        </div>
        {isEditing ? (
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={18} /> Save Changes
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
            <Edit2 size={18} /> Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Card */}
          <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--secondary)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold'
            }}>
              {profileData.fullName.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{profileData.fullName}</h2>
                <span className="badge badge-primary">Approved Trainer</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                {profileData.designation} • {profileData.department}
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                {profileData.organization}
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} className="text-light" /> Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                {isEditing ? (
                  <input type="text" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                ) : (
                  <p style={{ fontWeight: 500 }}>{profileData.fullName}</p>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                {isEditing ? (
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                ) : (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} className="text-light" /> {profileData.email}</p>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Phone Number</label>
                {isEditing ? (
                  <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                ) : (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} className="text-light" /> {profileData.phone}</p>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Location</label>
                {isEditing ? (
                  <input type="text" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} />
                ) : (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} className="text-light" /> {profileData.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} className="text-light" /> Professional Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Organization</label>
                {isEditing ? (
                  <input type="text" value={profileData.organization} onChange={(e) => setProfileData({...profileData, organization: e.target.value})} />
                ) : (
                  <p>{profileData.organization}</p>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Department</label>
                {isEditing ? (
                  <input type="text" value={profileData.department} onChange={(e) => setProfileData({...profileData, department: e.target.value})} />
                ) : (
                  <p>{profileData.department}</p>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Designation</label>
                {isEditing ? (
                  <input type="text" value={profileData.designation} onChange={(e) => setProfileData({...profileData, designation: e.target.value})} />
                ) : (
                  <p>{profileData.designation}</p>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Employee / Trainer ID</label>
                {isEditing ? (
                  <input type="text" value={profileData.employeeId} onChange={(e) => setProfileData({...profileData, employeeId: e.target.value})} />
                ) : (
                  <p>{profileData.employeeId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} className="text-light" /> Trainer Expertise
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {profileData.expertise.map(skill => (
                <span key={skill} className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: 'inherit', marginLeft: '0.5rem', cursor: 'pointer' }}>×</button>
                  )}
                </span>
              ))}
              {isEditing && (
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type skill & Enter"
                  style={{ border: '1px dashed var(--border-color)', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.85rem', width: '150px' }}
                />
              )}
            </div>
          </div>

          {/* Qualifications & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} className="text-light" /> Qualifications
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profileData.qualifications.map((q, idx) => (
                  <li key={idx}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{q.degree}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{q.institution} • {q.year}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} className="text-light" /> Experience
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profileData.experience.map((exp, idx) => (
                  <li key={idx}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exp.role}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{exp.organization} • {exp.duration}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Area (Stats) */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Trainer Statistics
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--secondary-hover)', padding: '0.75rem', borderRadius: '8px' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>4</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Courses Created</p>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px' }}>
                  <Users size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>142</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Active Trainees</p>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', padding: '0.75rem', borderRadius: '8px' }}>
                  <PenTool size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>8</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Assessments</p>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f3e8ff', color: '#9333ea', padding: '0.75rem', borderRadius: '8px' }}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>350+</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Training Hours</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerProfile;
