import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const TrainerApplication = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organization: '',
    department: '',
    designation: '',
    employeeId: '',
    highestQualification: '',
    institution: '',
    experienceYears: '',
    bio: ''
  });

  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSkills = ['GIS', 'Remote Sensing', 'Climate Science', 'Data Analytics', 'Management', 'Communication', 'Earthquake Eng.', 'Meteorology'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        organization: formData.organization,
        department: formData.department,
        designation: formData.designation,
        qualification: formData.highestQualification,
        expertise: skills,
        experience: formData.experienceYears
      };
      const response = await api.post('/auth/trainer-apply', payload);
      if (response.success) {
        setIsSubmitted(true);
      } else {
        setError(response.message || 'Application failed');
      }
    } catch (err) {
      setError('An error occurred during application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Application Submitted</h1>
          <div className="badge badge-warning" style={{ fontSize: '1rem', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
            Status: Pending Admin Approval
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Thank you for applying to be a trainer on Capacity Connect. Your application is currently under review by the administration team. You will receive an email once your account has been approved and activated.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/login" style={{ color: 'var(--text-light)', display: 'flex' }}>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>Apply as Trainer</h1>
            <p style={{ color: 'var(--text-light)' }}>Join Capacity Connect to create courses and train participants.</p>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Personal Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Dr. Jane Doe" />
              </div>
              <div className="input-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane.doe@example.com" />
              </div>
              <div className="input-group">
                <label>Phone Number *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="input-group">
                <label>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
              </div>
              <div className="input-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Professional Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group">
                <label>Organization *</label>
                <input type="text" name="organization" value={formData.organization} onChange={handleChange} required placeholder="e.g. Ministry of Earth Sciences" />
              </div>
              <div className="input-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Climate Research" />
              </div>
              <div className="input-group">
                <label>Designation *</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g. Senior Scientist" />
              </div>
              <div className="input-group">
                <label>Employee ID</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Qualifications & Expertise */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Qualifications & Expertise
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="input-group">
                <label>Highest Qualification *</label>
                <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} required placeholder="e.g. Ph.D. in Physics" />
              </div>
              <div className="input-group">
                <label>Institution</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. IIT Delhi" />
              </div>
            </div>

            <div className="input-group">
              <label>Trainer Expertise (Select relevant tags) *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {availableSkills.map(skill => (
                  <button 
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '20px',
                      border: `1px solid ${skills.includes(skill) ? 'var(--secondary)' : 'var(--border-color)'}`,
                      backgroundColor: skills.includes(skill) ? 'var(--secondary-bg)' : 'var(--white)',
                      color: skills.includes(skill) ? 'var(--secondary-hover)' : 'var(--text-muted)',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Selected Expertise:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skills.map(skill => (
                      <span key={skill} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="input-group">
              <label>Years of Training Experience</label>
              <select name="experienceYears" value={formData.experienceYears} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="0-2">0 - 2 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5-10">5 - 10 Years</option>
                <option value="10+">10+ Years</option>
              </select>
            </div>

            <div className="input-group">
              <label>Professional Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange}
                placeholder="Briefly describe your professional background and training style..."
              ></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '4rem' }}>
            <Link to="/login" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Submit Trainer Application</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TrainerApplication;
