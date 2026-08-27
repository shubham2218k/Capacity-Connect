import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('Trainee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in email and password');
      return;
    }

    if ((role === 'Trainee' || role === 'Trainer') && !accessKey) {
      setError(`Please enter your Organization ${role} Access Key`);
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password, role, accessKey);
    setIsSubmitting(false);

    if (result.success) {
      if (result.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (result.role === 'Trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/trainee/dashboard');
      }
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem 2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>
            CC
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Capacity Connect</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Digital Capacity Building & LMS</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>I am logging in as a:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Trainee', 'Trainer', 'Admin'].map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => { setRole(r); setAccessKey(''); }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: `1px solid ${role === r ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: role === r ? 'var(--primary-light)' : 'var(--white)',
                    color: role === r ? 'var(--primary)' : 'var(--text-dark)',
                    fontWeight: role === r ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Forgot Password?</a>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {role !== 'Admin' && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Organization Access Key ({role})</label>
              <input 
                type="text" 
                value={accessKey} 
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder={`Enter your ${role} access key`}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>Remember me</label>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderTop: '1px solid var(--border-color)', position: 'relative' }}>
            <span style={{ backgroundColor: 'var(--white)', padding: '0 1rem', color: 'var(--text-light)', fontSize: '0.85rem', position: 'relative', top: '-10px' }}>or</span>
          </div>
          
          <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
            Create Trainee Account
          </Link>
          <Link to="/trainer/apply" className="btn btn-outline" style={{ width: '100%' }}>
            Apply as Trainer
          </Link>
          <Link to="/admin/register" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem' }}>
            Register Organization as Admin
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
