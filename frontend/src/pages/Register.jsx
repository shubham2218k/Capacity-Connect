import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    department: '',
    designation: '',
    qualification: '',
    password: '',
    confirmPassword: '',
    accessKey: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [keyValidating, setKeyValidating] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [orgDetected, setOrgDetected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Checks the key and returns the result, so the submit handler can reuse it
  // instead of depending on state that may not have landed yet.
  const verifyKey = useCallback(async (rawKey) => {
    const key = (rawKey || '').trim();

    if (!key) {
      setOrgDetected(null);
      setKeyError('');
      setFormData(prev => ({ ...prev, organization: '' }));
      return { ok: false, message: 'Please enter your Organization Trainee Access Key.' };
    }

    setKeyValidating(true);
    setKeyError('');

    try {
      const response = await api.post('/auth/validate-key', { key, type: 'Trainee' });
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

  // Verify shortly after the user stops typing - no blur or button click needed.
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      // If the key has not been confirmed yet (or is still being checked),
      // verify it now rather than refusing to submit.
      let organizationName = orgDetected;
      if (!organizationName) {
        const check = await verifyKey(formData.accessKey);
        if (!check.ok) {
          setError(check.message);
          return;
        }
        organizationName = check.organizationName;
      }

      const result = await register({
        traineeAccessKey: formData.accessKey.trim(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        qualification: formData.qualification,
        password: formData.password
      });

      if (result.success) {
        navigate('/trainee/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Capacity Connect</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Trainee Registration</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          
          {/* Section 0: Access Key */}
          <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Organization Verification</h3>
            
            <div className="input-group" style={{ marginBottom: orgDetected || keyError ? '0.5rem' : '0' }}>
              <label htmlFor="accessKey">Organization Access Key (Trainee) *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  id="accessKey"
                  name="accessKey"
                  value={formData.accessKey}
                  onChange={handleChange}
                  placeholder="e.g. CC-TRN-XXXXXX"
                  autoComplete="off"
                  style={{ flex: 1, minWidth: 0 }}
                  required
                />
                <button type="button" onClick={() => verifyKey(formData.accessKey)} disabled={!formData.accessKey.trim()} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Section 1: Basic Info */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Basic Information</h3>
              
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="input-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" name="password" 
                    value={formData.password} onChange={handleChange} 
                    required 
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            {/* Section 2: Professional Info */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Professional Information</h3>
              
              <div className="input-group">
                <label htmlFor="organization">Organization / Institution</label>
                <input type="text" id="organization" name="organization" value={formData.organization} readOnly placeholder="Verified from Access Key" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-light)' }} />
              </div>
              
              <div className="input-group">
                <label htmlFor="department">Department</label>
                <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="designation">Designation</label>
                <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="qualification">Highest Qualification</label>
                <select id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%' }}>
                  <option value="">Select Qualification</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D. / Doctorate</option>
                  <option value="diploma">Diploma</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', minWidth: '200px', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Creating Account...' : 'Create Trainee Account'}
            </button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
