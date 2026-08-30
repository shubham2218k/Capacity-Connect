import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const TrainerApplication = () => {
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
      return undefined;
    }

    const timer = setTimeout(() => { verifyKey(key); }, 500);
    return () => clearTimeout(timer);
  }, [formData.accessKey, verifyKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'accessKey' && !value.trim()) {
      setOrgDetected(null);
      setKeyError('');
    }
    setFormData({ ...formData, [name]: value });
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
      fd.append('highestQualification', formData.highestQualification);
      fd.append('institution', formData.institution);
      fd.append('experienceYears', formData.experienceYears);
      fd.append('bio', formData.bio);
      fd.append('expertiseAreas', skills.join(', '));

      if (qualificationFile) fd.append('qualificationDoc', qualificationFile);
      if (experienceFile) fd.append('experienceDoc', experienceFile);
      if (identityFile) fd.append('identityDoc', identityFile);

      const result = await applyAsTrainer(fd);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || 'Application submission failed');
      }
    } catch (err) {
      setError(err?.message || 'Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '3rem 1.5rem', textAlign: 'center', boxSizing: 'border-box' }}>
          <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Application Submitted</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Thank you for applying as a Trainer for <strong>{formData.organization || 'your organization'}</strong>.
          </p>
          <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--primary)' }}>What happens next?</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.5' }}>
              <li>Your Organization Administrator will review your qualifications & credentials.</li>
              <li>Once approved, your account will be activated with Verified Trainer course creation privileges.</li>
              <li>You can log in to check your approval status using your email and password.</li>
            </ul>
          </div>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', display: 'inline-block', minHeight: '48px', lineHeight: '24px' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem', boxSizing: 'border-box' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/login" aria-label="Back to Sign In" style={{ color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', flexShrink: 0 }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Apply as Trainer</h1>
            <p style={{ color: 'var(--text-light)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>Join Capacity Connect to create courses and train participants.</p>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Section 0: Access Key */}
          <div className="card" style={{ padding: '1.75rem 1.25rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-color-alt)', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', color: 'var(--primary)' }}>
              Organization Verification
            </h2>
            
            <div className="input-group" style={{ marginBottom: orgDetected || keyError ? '0.5rem' : '0' }}>
              <label htmlFor="accessKey" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Organization Access Key (Trainer) *</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  id="accessKey"
                  name="accessKey"
                  value={formData.accessKey}
                  onChange={handleChange}
                  placeholder="e.g. CC-TNR-XXXXXX"
                  autoComplete="off"
                  style={{ flex: 1, minWidth: '180px', minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }}
                  required
                />
                <button type="button" onClick={() => verifyKey(formData.accessKey)} disabled={!formData.accessKey.trim()} className="btn btn-secondary" style={{ minHeight: '44px', padding: '0.65rem 1.25rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {keyValidating ? 'Verifying...' : 'Verify Key'}
                </button>
              </div>
            </div>

            {keyError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>{keyError}</p>
            )}
            
            {orgDetected && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>
                <CheckCircle size={16} /> <span>Organization verified: {orgDetected}</span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="card" style={{ padding: '1.75rem 1.25rem', marginBottom: '1.5rem', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Personal Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Dr. Jane Doe" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane.doe@example.com" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Phone Number *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="card" style={{ padding: '1.75rem 1.25rem', marginBottom: '1.5rem', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Professional Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Organization</label>
                <input type="text" name="organization" value={formData.organization} readOnly placeholder="Verified from Access Key" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-light)', minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Department / Division *</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="e.g. Earth Sciences" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Designation *</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g. Senior Scientist / Assoc. Professor" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Employee ID / Faculty Reg. No. *</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required placeholder="e.g. EMP-99201" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Highest Academic Qualification *</label>
                <select name="highestQualification" value={formData.highestQualification} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%', minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }}>
                  <option value="">Select Qualification</option>
                  <option value="Ph.D. / Doctorate">Ph.D. / Doctorate</option>
                  <option value="Master Degree (M.Tech / M.Sc)">Master's Degree (M.Tech / M.Sc)</option>
                  <option value="Bachelor Degree (B.Tech / B.Sc)">Bachelor's Degree (B.Tech / B.Sc)</option>
                  <option value="Other Certification">Other Professional Credential</option>
                </select>
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Granting University / Institute *</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} required placeholder="e.g. IIT Bombay / IISc" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Years of Domain Experience *</label>
                <input type="number" name="experienceYears" min="0" max="60" value={formData.experienceYears} onChange={handleChange} required placeholder="e.g. 8" style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '1.25rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Expertise & Professional Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Brief description of teaching background and research specialization..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>

            {/* Expertise Skills Selection */}
            <div className="input-group" style={{ marginTop: '1.25rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Expertise Areas / Competencies</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {availableSkills.map(skill => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleAddSkill(skill)}
                    style={{
                      padding: '0.65rem 1rem',
                      minHeight: '44px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: skills.includes(skill) ? 'var(--primary)' : 'var(--bg-color-alt)',
                      color: skills.includes(skill) ? 'white' : 'var(--text-dark)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>

              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', width: '100%', fontWeight: 600 }}>Selected Competencies:</span>
                  {skills.map(skill => (
                    <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '16px', fontSize: '0.85rem' }}>
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', padding: 0, minWidth: '20px', minHeight: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Qualification Verification Proof Documents */}
          <div className="card" style={{ padding: '1.75rem 1.25rem', marginBottom: '2rem', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Verification Documents
            </h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Admin approval requires verified proof documents for qualification and institutional appointment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
              
              {/* Doc 1: Qualification Proof (Required) */}
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.25rem', textAlign: 'center', backgroundColor: 'var(--bg-color-alt)' }}>
                <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Qualification Degree Proof *</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>Ph.D. / Master Certificate (PDF/Image)</div>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setQualificationFile(e.target.files[0])}
                  style={{ fontSize: '0.8rem', width: '100%', minHeight: '44px' }} 
                  required
                />
                {qualificationFile && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <FileText size={14} /> {qualificationFile.name}
                  </div>
                )}
              </div>

              {/* Doc 2: Experience Proof (Optional) */}
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.25rem', textAlign: 'center', backgroundColor: 'var(--bg-color-alt)' }}>
                <Upload size={32} color="var(--secondary)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Experience / Service Letter</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>Appointment / Relieving Proof (Optional)</div>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setExperienceFile(e.target.files[0])}
                  style={{ fontSize: '0.8rem', width: '100%', minHeight: '44px' }} 
                />
                {experienceFile && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <FileText size={14} /> {experienceFile.name}
                  </div>
                )}
              </div>

              {/* Doc 3: Govt/Org ID Proof (Optional) */}
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.25rem', textAlign: 'center', backgroundColor: 'var(--bg-color-alt)' }}>
                <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Govt / Institution ID Card</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>Employee ID / Official ID (Optional)</div>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setIdentityFile(e.target.files[0])}
                  style={{ fontSize: '0.8rem', width: '100%', minHeight: '44px' }} 
                />
                {identityFile && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <FileText size={14} /> {identityFile.name}
                  </div>
                )}
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.85rem 3rem', minHeight: '48px', fontSize: '1.1rem', minWidth: 'min(100%, 280px)', width: '100%', maxWidth: '360px', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Submitting Application...' : 'Submit Trainer Application'}
            </button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
              Already registered? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600, padding: '0.5rem 0' }}>Sign in here</Link>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

export default TrainerApplication;
