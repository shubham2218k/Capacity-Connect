import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: '',
    department: '',
    officialEmail: '',
    officialPhone: '',
    address: '',
    city: '',
    state: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.organizationName || !formData.officialEmail) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const adminData = { ...formData };
    delete adminData.confirmPassword;

    setIsSubmitting(true);
    const result = await registerAdmin(adminData);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessData(result.data);
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  if (successData) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem', boxSizing: 'border-box' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem 1.5rem', textAlign: 'center', boxSizing: 'border-box' }}>
          <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Organization Created Successfully</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '2rem' }}>
            {successData.organizationName}
          </p>

          <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.25rem', borderRadius: '8px', textAlign: 'left', marginBottom: '2rem', boxSizing: 'border-box' }}>
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <strong>Important:</strong> Share these keys only with authorized members of your organization.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', fontWeight: 600 }}>Trainee Access Key</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input type="text" value={successData.traineeKey} readOnly style={{ flex: 1, minWidth: '180px', minHeight: '44px', fontSize: '16px', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', fontWeight: 600, fontFamily: 'monospace', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => copyToClipboard(successData.traineeKey)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '44px', padding: '0.75rem 1.25rem' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', fontWeight: 600 }}>Trainer Access Key</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input type="text" value={successData.trainerKey} readOnly style={{ flex: 1, minWidth: '180px', minHeight: '44px', fontSize: '16px', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', fontWeight: 600, fontFamily: 'monospace', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => copyToClipboard(successData.trainerKey)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '44px', padding: '0.75rem 1.25rem' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/admin/dashboard')} className="btn btn-primary" style={{ minHeight: '48px', padding: '0.85rem 2rem', fontSize: '1.1rem', width: '100%' }}>
            Continue to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem', boxSizing: 'border-box' }}>
      <div className="card" style={{ maxWidth: '900px', width: '100%', padding: '2.5rem 1.5rem', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ color: 'var(--primary)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Capacity Connect</h1>
          </Link>
          <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Organization Registration (Admin)</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2rem' }}>
            
            {/* Section 1: Admin Info */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Admin Information</h3>
              
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              
              <div className="input-group">
                <label htmlFor="email">Admin Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" name="password" 
                    value={formData.password} onChange={handleChange} 
                    required 
                    style={{ width: '100%', minHeight: '44px', fontSize: '16px', paddingRight: '3rem', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Section 2: Organization Info */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Organization Information</h3>
              
              <div className="input-group">
                <label htmlFor="organizationName">Organization Name *</label>
                <input type="text" id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleChange} required style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>

              <div className="input-group">
                <label htmlFor="organizationType">Organization Type</label>
                <select id="organizationType" name="organizationType" value={formData.organizationType} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%', minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }}>
                  <option value="">Select Type</option>
                  <option value="Government">Government Agency</option>
                  <option value="University">University / Academic</option>
                  <option value="NGO">NGO / Non-Profit</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="department">Department / Division</label>
                <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '1rem' }}>
                <div className="input-group">
                  <label htmlFor="officialEmail">Official Email *</label>
                  <input type="email" id="officialEmail" name="officialEmail" value={formData.officialEmail} onChange={handleChange} required style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
                <div className="input-group">
                  <label htmlFor="officialPhone">Official Phone</label>
                  <input type="tel" id="officialPhone" name="officialPhone" value={formData.officialPhone} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 100px), 1fr))', gap: '1rem' }}>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
                <div className="input-group">
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
                <div className="input-group">
                  <label htmlFor="country">Country</label>
                  <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} style={{ minHeight: '44px', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.85rem 3rem', minHeight: '48px', fontSize: '1.1rem', minWidth: 'min(100%, 250px)', width: '100%', maxWidth: '320px', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Registering...' : 'Register Organization'}
            </button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Already registered? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600, padding: '0.5rem 0' }}>Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
