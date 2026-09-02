import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, UserCheck, Shield, GraduationCap, Building2 } from 'lucide-react';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { FormSection } from '../components/auth/FormSection';
import { AnimatedActionButton } from '../components/auth/AnimatedActionButton';
import { FormAlertBanner } from '../components/auth/FieldFeedback';

const Login = () => {
  const [role, setRole] = useState('Trainee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if ((role === 'Trainee' || role === 'Trainer') && !accessKey.trim()) {
      setError(`Please enter your Organization ${role} Access Key.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password, role, accessKey.trim());
      if (result.success) {
        if (result.role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (result.role === 'Trainer') {
          navigate('/trainer/dashboard');
        } else {
          navigate('/trainee/dashboard');
        }
      } else {
        setError(result.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err?.message || 'Login request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      illustrationType="login"
      activeRole={role}
      title="Welcome Back"
      subtitle="Access your Capacity Connect ecosystem gateway"
      reverseLayout
    >
      <FormAlertBanner error={error} />

      <form onSubmit={handleSubmit} noValidate>
        <FormSection
          title="Sign In Gateway"
          icon={LogIn}
          description="Select your portal role and authenticate with your account credentials."
        >
          {/* Accessible Role Selector Tabs */}
          <div className="cc-form-group">
            <label className="cc-form-label">
              <span>Account Role <span className="cc-form-label-required">*</span></span>
            </label>
            <div className="cc-role-selector" role="radiogroup" aria-label="Portal Role">
              {[
                { id: 'Trainee', label: 'Trainee', icon: GraduationCap },
                { id: 'Trainer', label: 'Trainer', icon: UserCheck },
                { id: 'Admin', label: 'Admin', icon: Shield }
              ].map((r) => {
                const IconComp = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    className={`cc-role-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setRole(r.id);
                      setAccessKey('');
                      setError('');
                    }}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    <IconComp size={18} style={{ marginBottom: '4px' }} />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Address Field */}
          <div className="cc-form-group">
            <label htmlFor="login-email" className="cc-form-label">
              <span>Email Address <span className="cc-form-label-required">*</span></span>
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              className="cc-input"
              autoComplete="email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="cc-form-group">
            <div className="cc-form-label">
              <span>Password <span className="cc-form-label-required">*</span></span>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.8rem', color: 'var(--cc-cyan)', fontWeight: 600 }}>
                Forgot Password?
              </a>
            </div>
            <div className="cc-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                className="cc-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="cc-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Conditional Organization Access Key Field */}
          {role !== 'Admin' && (
            <div className="cc-form-group">
              <label htmlFor="login-access-key" className="cc-form-label">
                <span>Organization Access Key ({role}) <span className="cc-form-label-required">*</span></span>
              </label>
              <input
                type="text"
                id="login-access-key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder={`e.g. CC-${role === 'Trainee' ? 'TRN' : 'TNR'}-XXXXXX`}
                className="cc-input"
                autoComplete="off"
                required
              />
              <span className="cc-field-helper">Enter the key provided by your organization administrator.</span>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            <input type="checkbox" id="remember" style={{ width: '18px', height: '18px', accentColor: 'var(--cc-cyan)', cursor: 'pointer' }} />
            <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--cc-text-muted)', cursor: 'pointer' }}>
              Remember this device
            </label>
          </div>

          {/* Primary Action Button */}
          <AnimatedActionButton
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            loadingText="Signing In..."
            icon={LogIn}
            style={{ marginTop: '0.5rem', minHeight: '50px', fontSize: '1rem' }}
          >
            Sign In
          </AnimatedActionButton>
        </FormSection>

        {/* Secondary Portal Routes */}
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--cc-text-dim)', fontSize: '0.825rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--cc-border)' }} />
            <span>Need an account?</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--cc-border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Link to="/register" className="cc-btn cc-btn-secondary" style={{ minHeight: '44px', fontSize: '0.875rem' }}>
              <GraduationCap size={16} /> Register Trainee
            </Link>
            <Link to="/trainer/apply" className="cc-btn cc-btn-outline" style={{ minHeight: '44px', fontSize: '0.875rem' }}>
              <UserCheck size={16} /> Apply as Trainer
            </Link>
          </div>

          <Link to="/admin/register" style={{ fontSize: '0.875rem', color: 'var(--cc-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem', padding: '0.5rem' }}>
            <Building2 size={16} /> Register Organization as Admin
          </Link>
        </div>
      </form>
    </AuthPageShell>
  );
};

export default Login;
