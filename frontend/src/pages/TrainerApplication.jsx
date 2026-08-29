import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const TrainerApplication = () => {
  const navigate = useNavigate();
  const { applyAsTrainer } = useAuth();
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
    bio: '',
    accessKey: ''
  });

  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [keyValidating, setKeyValidating] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [orgDetected, setOrgDetected] = useState(null);

  // Document Upload File States
  const [qualificationFile, setQualificationFile] = useState(null);
  const [experienceFile, setExperienceFile] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);

  const availableSkills = ['GIS', 'Remote Sensing', 'Climate Science', 'Data Analytics', 'Management', 'Communication', 'Earthquake Eng.', 'Meteorology'];

  const verifyKey = useCallback(async (rawKey) => {
    const key = (rawKey || '').trim();

    if (!key) {
      setOrgDetected(null);
      setKeyError('');
      setFormData(prev => ({ ...prev, organization: '' }));
      return { ok: false, message: 'Please enter your Organization Trainer Access Key.' };
    }

    setKeyValidating(true);
    setKeyError('');

    try {
      const response = await api.post('/auth/validate-key', { key, type: 'Trainer' });
      const organizationName = response?.data?.organizationName || null;

      if (!organizationName) {
        setOrgDetected(null);
        setFormData(prev => ({ ...prev, organization: '' }));
        setKeyError('Invalid organization access key.');
        return { ok: false, message: 'Invalid organization access key.' };
      }

      setOrgDetected(organizationName);
      setFormData(prev => ({ ...prev, organization: organizationName }));
      return { ok: true, organizationName };
    } catch (err) {
      const message = err?.message || 'Invalid organization access key.';
      setOrgDetected(null);
      setFormData(prev => ({ ...prev, organization: '' }));
      setKeyError(message);
      return { ok: false, message };
    } finally {
      setKeyValidating(false);
    }
  }, []);

  useEffect(() => {
    const key = formData.accessKey.trim();

    if (!key) {
      setOrgDetected(null);
      setKeyError('');
      return undefined;
    }

    const timer = setTimeout(() => { verifyKey(key); }, 500);
    return () => clearTimeout(timer);
  }, [formData.accessKey, verifyKey]);

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

    if (!qualificationFile) {
      setError('Please upload your Qualification Proof document (PDF or Image).');
      return;
    }

    setIsSubmitting(true);
    try {
      let organizationName = orgDetected;
      if (!organizationName) {
        const result = await verifyKey(formData.accessKey);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        organizationName = result.organizationName;
      }

      const fd = new FormData();
      fd.append('trainerAccessKey', formData.accessKey.trim());
      fd.append('name', formData.fullName);
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      fd.append('phone', formData.phone);
      fd.append('department', formData.department);
      fd.append('designation', formData.designation);
      fd.append('employeeId', formData.employeeId);
      fd.append('qualification', formData.highestQualification);
      fd.append('institution', formData.institution);
      fd.append('experience', formData.experienceYears);
      fd.append('bio', formData.bio);
      fd.append('expertise', skills.join(','));

      if (qualificationFile) fd.append('qualificationProof', qualificationFile);
      if (experienceFile) fd.append('experienceProof', experienceFile);
      if (identityFile) fd.append('identityProof', identityFile);

      const result = await api.postFormData('/auth/trainer-apply', fd);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || 'Application failed');
      }
    } catch (err) {
      setError(err.message || 'Application submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Trainer application submitted successfully.</h1>
          <div className="badge badge-warning" style={{ fontSize: '1rem', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
            Status: Pending Admin Review
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your professional application and supporting documents have been submitted. An administrator of your organization will inspect your application before approving access.
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
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Section 0: Access Key */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-color-alt)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', color: 'var(--primary)' }}>
              Organization Verification
            </h2>
            
            <div className="input-group" style={{ marginBottom: orgDetected || keyError ? '0.5rem' : '0' }}>
              <label htmlFor="accessKey">Organization Access Key (Trainer) *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  id="accessKey"
                  name="accessKey"
                  value={formData.accessKey}
                  onChange={handleChange}
                  placeholder="e.g. CC-TNR-XXXXXX"
                  autoComplete="off"
                  style={{ flex: 1, minWidth: 0 }}
                  required
                />
                <button type="button" onClick={() => verifyKey(formData.accessKey)} disabled={!formData.accessKey.trim()} className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap' }}>
                  {keyValidating ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            {keyError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', margin: 0 }}>{keyError}</p>
            )}
            
            {orgDetected && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle size={16} /> <span>Organization verified: {orgDetected}</span>
              </div>
            )}
          </div>

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
                <input type="text" name="organization" value={formData.organization} readOnly placeholder="Verified from Access Key" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-light)' }} />
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
                <label>Employee ID / Code</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="e.g. EMP-9921" />
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
                <label>Institution / University</label>
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
                rows={3}
                placeholder="Briefly describe your professional background and training style..."
              ></textarea>
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Supporting Documents
            </h2>
            <p className="text-light" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Upload verification proof for administrator inspection. PDF, JPG, JPEG, PNG (Max 10MB per file).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Qualification Proof (Required) */}
              <div className="input-group">
                <label>Qualification Certificate / Degree *</label>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#f8fafc', position: 'relative', textAlign: 'center', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    required
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={(e) => setQualificationFile(e.target.files[0] || null)}
                  />
                  <Upload size={24} style={{ color: 'var(--primary)', margin: '0 auto 0.4rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--primary)' }}>
                    {qualificationFile ? qualificationFile.name : 'Upload Qualification Certificate'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    Degree, Ph.D. certificate, or professional accreditation
                  </p>
                </div>
              </div>

              {/* Experience Proof (Optional) */}
              <div className="input-group">
                <label>Experience Proof (Optional)</label>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#f8fafc', position: 'relative', textAlign: 'center', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={(e) => setExperienceFile(e.target.files[0] || null)}
                  />
                  <FileText size={24} style={{ color: 'var(--secondary)', margin: '0 auto 0.4rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--secondary)' }}>
                    {experienceFile ? experienceFile.name : 'Upload Experience Proof'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    Service letter, teaching record, or employment proof
                  </p>
                </div>
              </div>

              {/* Identity / Employee Proof (Optional) */}
              <div className="input-group">
                <label>Identity / Employee ID Proof (Optional)</label>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#f8fafc', position: 'relative', textAlign: 'center', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={(e) => setIdentityFile(e.target.files[0] || null)}
                  />
                  <FileText size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 0.4rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                    {identityFile ? identityFile.name : 'Upload Employee / Identity Card'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    Official employee badge or organization ID
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '4rem' }}>
            <Link to="/login" className="btn btn-outline">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.75rem 2rem', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Submitting Application...' : 'Submit Trainer Application'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TrainerApplication;
