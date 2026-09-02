import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User, Briefcase, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { FormProgress } from '../components/auth/FormProgress';
import { FormSection } from '../components/auth/FormSection';
import { AnimatedActionButton } from '../components/auth/AnimatedActionButton';
import { FormAlertBanner, FieldFeedback, AccessKeyStatusBadge } from '../components/auth/FieldFeedback';
import { api } from '../services/api';

const STEPS = [
  { title: 'Verify Organization' },
  { title: 'Personal Details' },
  { title: 'Profile & Review' }
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [keyValidating, setKeyValidating] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [orgDetected, setOrgDetected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'accessKey' && !value.trim()) {
      setOrgDetected(null);
      setKeyError('');
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const verifyKey = useCallback(async (rawKey) => {
    const key = (rawKey || '').trim();

    if (!key) {
      setOrgDetected(null);
      setKeyError('');
      setFormData((prev) => ({ ...prev, organization: '' }));
      return { ok: false, message: 'Please enter your Organization Trainee Access Key.' };
    }

    setKeyValidating(true);
    setKeyError('');

    try {
      const response = await api.post('/auth/validate-key', { key, type: 'Trainee' });
      const organizationName = response?.data?.organizationName || null;

      if (!organizationName) {
        setOrgDetected(null);
        setFormData((prev) => ({ ...prev, organization: '' }));
        setKeyError('Invalid organization access key.');
        return { ok: false, message: 'Invalid organization access key.' };
      }

      setOrgDetected(organizationName);
      setFormData((prev) => ({ ...prev, organization: organizationName }));
      return { ok: true, organizationName };
    } catch (err) {
      const message = err?.message || 'Invalid organization access key.';
      setOrgDetected(null);
      setFormData((prev) => ({ ...prev, organization: '' }));
      setKeyError(message);
      return { ok: false, message };
    } finally {
      setKeyValidating(false);
    }
  }, []);

  useEffect(() => {
    const key = formData.accessKey.trim();
    if (!key) return undefined;

    const timer = setTimeout(() => {
      verifyKey(key);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.accessKey, verifyKey]);

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.accessKey.trim()) {
        errors.accessKey = 'Trainee Access Key is required';
      } else if (!orgDetected && !keyValidating) {
        errors.accessKey = keyError || 'Please verify your access key before continuing';
      }
    } else if (step === 2) {
      if (!formData.name.trim()) errors.name = 'Full Name is required';
      if (!formData.email.trim()) errors.email = 'Email Address is required';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const elem = document.getElementById(firstKey);
      if (elem) elem.focus();
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    setError('');
    if (currentStep === 1 && !orgDetected) {
      const check = await verifyKey(formData.accessKey);
      if (!check.ok) {
        setFieldErrors({ accessKey: check.message });
        return;
      }
    }
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepNum) => {
    if (stepNum < currentStep) {
      setCurrentStep(stepNum);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
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
        setError(result.message || 'Trainee registration failed.');
      }
    } catch (err) {
      setError(err?.message || 'Server error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      illustrationType="register"
      currentStep={currentStep}
      title="Trainee Registration"
      subtitle="Join your institutional learning & capacity program"
    >
      <FormProgress steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />

      <FormAlertBanner error={error} />

      <form onSubmit={handleRegister} noValidate>
        
        {/* Stage 1: Verify Organization */}
        {currentStep === 1 && (
          <FormSection
            title="Organization Verification"
            icon={KeyRound}
            description="Enter the Trainee Access Key provided by your organization."
            highlight
          >
            <div className="cc-form-group">
              <label htmlFor="accessKey" className="cc-form-label">
                <span>Organization Trainee Access Key <span className="cc-form-label-required">*</span></span>
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  id="accessKey"
                  name="accessKey"
                  value={formData.accessKey}
                  onChange={handleChange}
                  placeholder="e.g. CC-TRN-XXXXXX"
                  className={`cc-input ${fieldErrors.accessKey ? 'cc-input-error' : ''}`}
                  style={{ flex: 1, minWidth: '220px' }}
                  autoComplete="off"
                  required
                />
                <AnimatedActionButton
                  type="button"
                  variant="secondary"
                  onClick={() => verifyKey(formData.accessKey)}
                  disabled={!formData.accessKey.trim() || keyValidating}
                  isLoading={keyValidating}
                  loadingText="Verifying..."
                  style={{ minHeight: '46px', padding: '0.65rem 1.25rem' }}
                >
                  Verify Key
                </AnimatedActionButton>
              </div>

              <AccessKeyStatusBadge
                isValidating={keyValidating}
                isVerified={!!orgDetected}
                organizationName={orgDetected}
                keyError={keyError}
              />
              <FieldFeedback error={fieldErrors.accessKey} />
            </div>
          </FormSection>
        )}

        {/* Stage 2: Personal Details */}
        {currentStep === 2 && (
          <FormSection
            title="Personal Details"
            icon={User}
            description="Provide your account information for participant identification."
          >
            <div className="cc-form-group">
              <label htmlFor="name" className="cc-form-label">
                <span>Full Name <span className="cc-form-label-required">*</span></span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`cc-input ${fieldErrors.name ? 'cc-input-error' : ''}`}
                autoComplete="name"
                required
              />
              <FieldFeedback error={fieldErrors.name} />
            </div>

            <div className="cc-form-grid-2">
              <div className="cc-form-group">
                <label htmlFor="email" className="cc-form-label">
                  <span>Email Address <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane.doe@example.com"
                  className={`cc-input ${fieldErrors.email ? 'cc-input-error' : ''}`}
                  autoComplete="email"
                  required
                />
                <FieldFeedback error={fieldErrors.email} />
              </div>

              <div className="cc-form-group">
                <label htmlFor="phone" className="cc-form-label">
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className="cc-input"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="cc-form-grid-2">
              <div className="cc-form-group">
                <label htmlFor="password" className="cc-form-label">
                  <span>Password <span className="cc-form-label-required">*</span></span>
                </label>
                <div className="cc-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className={`cc-input ${fieldErrors.password ? 'cc-input-error' : ''}`}
                    autoComplete="new-password"
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
                <FieldFeedback error={fieldErrors.password} />
              </div>

              <div className="cc-form-group">
                <label htmlFor="confirmPassword" className="cc-form-label">
                  <span>Confirm Password <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`cc-input ${fieldErrors.confirmPassword ? 'cc-input-error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <FieldFeedback error={fieldErrors.confirmPassword} />
              </div>
            </div>
          </FormSection>
        )}

        {/* Stage 3: Professional Profile & Review */}
        {currentStep === 3 && (
          <>
            <FormSection
              title="Professional Profile"
              icon={Briefcase}
              description="Information used for certificate issuance and competency mapping."
            >
              <div className="cc-form-group">
                <label htmlFor="organization" className="cc-form-label">
                  <span>Verified Organization</span>
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  readOnly
                  placeholder="Verified from Access Key"
                  className="cc-input"
                />
              </div>

              <div className="cc-form-grid-2">
                <div className="cc-form-group">
                  <label htmlFor="department" className="cc-form-label">
                    <span>Department / Section</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Earth & Environmental Studies"
                    className="cc-input"
                  />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="designation" className="cc-form-label">
                    <span>Designation / Role</span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Junior Research Fellow"
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="cc-form-group">
                <label htmlFor="qualification" className="cc-form-label">
                  <span>Highest Academic Qualification</span>
                </label>
                <select
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="cc-input cc-select"
                >
                  <option value="">Select Qualification</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D. / Doctorate</option>
                  <option value="diploma">Diploma</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </FormSection>

            {/* Review Summary */}
            <div className="cc-review-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cc-cyan)', margin: 0 }}>Review Registration</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--cc-text-dim)' }}>Confirm details</span>
              </div>

              <div className="cc-review-item">
                <span className="cc-review-label">Organization</span>
                <span className="cc-review-val">{formData.organization || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Full Name</span>
                <span className="cc-review-val">{formData.name || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Email Address</span>
                <span className="cc-review-val">{formData.email || '—'}</span>
              </div>
            </div>
          </>
        )}

        {/* Step Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem' }}>
          {currentStep > 1 ? (
            <AnimatedActionButton
              type="button"
              variant="secondary"
              onClick={handlePrevStep}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} /> Back
            </AnimatedActionButton>
          ) : (
            <Link to="/login" className="cc-btn cc-btn-ghost" style={{ fontSize: '0.875rem' }}>
              Already registered? Sign in
            </Link>
          )}

          {currentStep < STEPS.length ? (
            <AnimatedActionButton
              type="button"
              variant="primary"
              onClick={handleNextStep}
              icon={ArrowRight}
            >
              Continue
            </AnimatedActionButton>
          ) : (
            <AnimatedActionButton
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Creating Account..."
              icon={CheckCircle}
              style={{ minWidth: '220px' }}
            >
              Create Trainee Account
            </AnimatedActionButton>
          )}
        </div>

      </form>
    </AuthPageShell>
  );
};

export default Register;
