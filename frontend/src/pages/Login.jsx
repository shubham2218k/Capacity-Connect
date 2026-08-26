import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Use the auth context login which handles mock validation
    const result = await login(email, password);
    
    if (result.success) {
      if (result.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (result.role === 'Trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/trainee/dashboard');
      }
    } else {
      setError(result.message || 'Login failed'); // Use result.message because AuthContext uses message, not error
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'Trainee') {
      setEmail('aarav@moes.gov.in');
      setPassword('password123');
    } else if (role === 'Trainer') {
      setEmail('trainer@capacityconnect.demo');
      setPassword('password123');
    } else if (role === 'Admin') {
      setEmail('admin@capacityconnect.in');
      setPassword('admin123');
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>Remember me</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            Sign In
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
        </div>

        <div style={{ marginTop: '2.5rem', backgroundColor: 'var(--bg-color-alt)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Demo Access:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleDemoLogin('Trainee')} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', flex: 1, fontSize: '0.8rem' }}>Load Trainee</button>
            <button onClick={() => handleDemoLogin('Trainer')} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', flex: 1, fontSize: '0.8rem' }}>Load Trainer</button>
            <button onClick={() => handleDemoLogin('Admin')} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', flex: 1, fontSize: '0.8rem' }}>Load Admin</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
