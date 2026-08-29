import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Upload, FileText, ArrowLeft, Shield } from 'lucide-react';
import { api } from '../../services/api';

const TrainerApplicationStatus = () => {
  const [isResubmitted, setIsResubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    department: '',
    designation: '',
    employeeId: '',
    highestQualification: '',
    institution: '',
    experienceYears: '',
    bio: ''
  });

  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Files
  const [qualificationFile, setQualificationFile] = useState(null);
  const [experienceFile, setExperienceFile] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);

  const availableSkills = ['GIS', 'Remote Sensing', 'Climate Science', 'Data Analytics', 'Management', 'Communication', 'Earthquake Eng.', 'Meteorology'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!formData.email || !formData.password) {
      setError('Please enter your account email and password to verify your application revision.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      if (formData.department) fd.append('department', formData.department);
      if (formData.designation) fd.append('designation', formData.designation);
      if (formData.employeeId) fd.append('employeeId', formData.employeeId);
      if (formData.highestQualification) fd.append('qualification', formData.highestQualification);
      if (formData.institution) fd.append('institution', formData.institution);
      if (formData.experienceYears) fd.append('experience', formData.experienceYears);
      if (formData.bio) fd.append('bio', formData.bio);
      if (skills.length > 0) fd.append('expertise', skills.join(','));

      if (qualificationFile) fd.append('qualificationProof', qualificationFile);
      if (experienceFile) fd.append('experienceProof', experienceFile);
      if (identityFile) fd.append('identityProof', identityFile);

      const response = await api.postFormData('/auth/trainer-resubmit', fd);
      if (response.success) {
        setIsResubmitted(true);
      } else {
        setError(response.message || 'Resubmission failed');
      }
    } catch (err) {
      setError(err.message || 'Resubmission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isResubmitted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Application Resubmitted Successfully</h1>
          <div className="badge badge-warning" style={{ fontSize: '1rem', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
            Status: Pending Review
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your revised application and updated documents have been sent to your organization administrator for re-inspection.
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
      <div className="container" style={{ maxWidth: '750px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/login" style={{ color: 'var(--text-light)', display: 'flex' }}>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>Update Trainer Application</h1>
            <p style={{ color: 'var(--text-light)' }}>Revise your application details and upload requested documents.</p>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Identity Verification */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-color-alt)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
              Application Credentials
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="input-group">
                <label>Account Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Registered Email" />
              </div>
              <div className="input-group">
                <label>Account Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Account Password" />
              </div>
            </div>
          </div>

          {/* Revised Fields */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
              Revise Professional Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="input-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Climate Research" />
              </div>
              <div className="input-group">
                <label>Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Scientist" />
              </div>
              <div className="input-group">
                <label>Employee ID / Code</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="e.g. EMP-9921" />
              </div>
              <div className="input-group">
                <label>Highest Qualification</label>
                <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} placeholder="e.g. Ph.D. in Physics" />
              </div>
              <div className="input-group">
                <label>Institution / University</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. IIT Delhi" />
              </div>
              <div className="input-group">
                <label>Years of Experience</label>
                <select name="experienceYears" value={formData.experienceYears} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="0-2">0 - 2 Years</option>
                  <option value="3-5">3 - 5 Years</option>
                  <option value="5-10">5 - 10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label>Expertise Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {availableSkills.map(skill => (
                  <button 
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    style={{
                      padding: '0.35rem 0.75rem',
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
            </div>

            <div className="input-group">
              <label>Professional Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange}
                rows={3}
                placeholder="Updated professional background..."
              ></textarea>
            </div>
          </div>

          {/* Upload New Documents */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
              Upload New / Replacement Documents
            </h2>
            <p className="text-light" style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Upload clearer or requested verification documents. (PDF, JPG, PNG).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Qualification Proof Document</label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(e) => setQualificationFile(e.target.files[0] || null)}
                />
              </div>

              <div className="input-group">
                <label>Experience Proof Document</label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(e) => setExperienceFile(e.target.files[0] || null)}
                />
              </div>

              <div className="input-group">
                <label>Identity Proof Document</label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(e) => setIdentityFile(e.target.files[0] || null)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '4rem' }}>
            <Link to="/login" className="btn btn-outline">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {isSubmitting ? 'Resubmitting...' : 'Resubmit Application'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TrainerApplicationStatus;
