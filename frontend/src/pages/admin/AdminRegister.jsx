import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Copy, CheckCircle, ArrowRight, ArrowLeft, Shield, Building, MapPin, UserCheck } from 'lucide-react';
import { AuthPageShell } from '../../components/auth/AuthPageShell';
import { FormProgress } from '../../components/auth/FormProgress';
import { FormSection } from '../../components/auth/FormSection';
import { AnimatedActionButton } from '../../components/auth/AnimatedActionButton';
import { FormAlertBanner, FieldFeedback } from '../../components/auth/FieldFeedback';

const STEPS = [
  { title: 'Admin Identity' },
  { title: 'Organization' },
  { title: 'Location & Review' }
];

const AdminRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null); // 'trainee' | 'trainer' | null

  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Admin Full Name is required';
      if (!formData.email.trim()) errors.email = 'Admin Email Address is required';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.organizationName.trim()) errors.organizationName = 'Organization Name is required';
      if (!formData.officialEmail.trim()) errors.officialEmail = 'Official Organization Email is required';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Focus first invalid field
      const firstKey = Object.keys(errors)[0];
      const elem = document.getElementById(firstKey);
      if (elem) elem.focus();
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
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

    if (!validateStep(1) || !validateStep(2)) {
      setError('Please resolve validation errors in prior steps before submitting.');
      return;
    }

    const adminData = { ...formData };
    delete adminData.confirmPassword;

    setIsSubmitting(true);
    try {
      const result = await registerAdmin(adminData);
      if (result.success) {
        setSuccessData(result.data);
      } else {
        setError(result.message || 'Organization registration failed.');
      }
    } catch (err) {
      setError(err?.message || 'A server error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, keyType) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  /* FLAGSHIP SUCCESS STATE: Secure Access-Key Handoff */
  if (successData) {
    return (
      <AuthPageShell
        illustrationType="admin-register"
        title="Organization Provisioned"
        subtitle="Secure key handoff for your organization governance"
        wide
      >
        <div className="cc-key-handoff-card">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cc-success-bg)', color: 'var(--cc-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid var(--cc-success-border)' }}>
            <CheckCircle size={36} />
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cc-text)', margin: '0 0 0.35rem 0' }}>
            {successData.organizationName}
          </h3>
          <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.95rem', margin: '0 0 2rem 0' }}>
            Organization successfully registered. Store and distribute these access keys securely.
          </p>

          <div style={{ backgroundColor: 'var(--cc-bg-surface)', border: '1px solid var(--cc-border)', borderRadius: 'var(--cc-radius-md)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cc-amber)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--cc-border)' }}>
              <Shield size={18} />
              <span>Important: Access keys provide authorization to register under your organization.</span>
            </div>

            {/* Trainee Key Box */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--cc-text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Trainee Registration Key
              </label>
              <div className="cc-key-box">
                <span className="cc-key-code">{successData.traineeKey}</span>
                <AnimatedActionButton
                  type="button"
                  variant="secondary"
                  style={{ minHeight: '40px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => copyToClipboard(successData.traineeKey, 'trainee')}
                >
                  {copiedKey === 'trainee' ? (
                    <span className="cc-copied-feedback"><CheckCircle size={14} /> Copied</span>
                  ) : (
                    <><Copy size={14} /> Copy Key</>
                  )}
                </AnimatedActionButton>
              </div>
            </div>

            {/* Trainer Key Box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--cc-text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Trainer Application Key
              </label>
              <div className="cc-key-box">
                <span className="cc-key-code">{successData.trainerKey}</span>
                <AnimatedActionButton
                  type="button"
                  variant="secondary"
                  style={{ minHeight: '40px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => copyToClipboard(successData.trainerKey, 'trainer')}
                >
                  {copiedKey === 'trainer' ? (
                    <span className="cc-copied-feedback"><CheckCircle size={14} /> Copied</span>
                  ) : (
                    <><Copy size={14} /> Copy Key</>
                  )}
                </AnimatedActionButton>
              </div>
            </div>
          </div>

          <AnimatedActionButton
            type="button"
            variant="primary"
            fullWidth
            onClick={() => navigate('/admin/dashboard')}
            icon={ArrowRight}
            style={{ minHeight: '52px', fontSize: '1.05rem' }}
          >
            Continue to Admin Dashboard
          </AnimatedActionButton>
        </div>
      </AuthPageShell>
    );
  }

  /* FLAGSHIP MULTI-STEP REGISTRATION FORM */
  return (
    <AuthPageShell
      illustrationType="admin-register"
      currentStep={currentStep}
      title="Organization Registration"
      subtitle="Establish an institutional capacity-building ecosystem"
      wide
    >
      <FormProgress steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />

      <FormAlertBanner error={error} />

      <form onSubmit={handleRegister} noValidate>
        
        {/* Stage 1: Admin Identity */}
        {currentStep === 1 && (
          <FormSection
            title="Administrator Credentials"
            icon={UserCheck}
            description="Create the primary governance account for your organization administrator."
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
                placeholder="Dr. Eleanor Vance"
                className={`cc-input ${fieldErrors.name ? 'cc-input-error' : ''}`}
                autoComplete="name"
                required
              />
              <FieldFeedback error={fieldErrors.name} />
            </div>

            <div className="cc-form-grid-2">
              <div className="cc-form-group">
                <label htmlFor="email" className="cc-form-label">
                  <span>Admin Email <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@organization.org"
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
                  placeholder="+1 (555) 000-0000"
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
                    placeholder="Create secure password"
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
                  placeholder="Re-enter password"
                  className={`cc-input ${fieldErrors.confirmPassword ? 'cc-input-error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <FieldFeedback error={fieldErrors.confirmPassword} />
              </div>
            </div>
          </FormSection>
        )}

        {/* Stage 2: Organization Details */}
        {currentStep === 2 && (
          <FormSection
            title="Organization Profile"
            icon={Building}
            description="Provide details regarding your institution, government agency, or corporate division."
          >
            <div className="cc-form-group">
              <label htmlFor="organizationName" className="cc-form-label">
                <span>Organization Name <span className="cc-form-label-required">*</span></span>
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="e.g. National Disaster Management Institute"
                className={`cc-input ${fieldErrors.organizationName ? 'cc-input-error' : ''}`}
                autoComplete="organization"
                required
              />
              <FieldFeedback error={fieldErrors.organizationName} />
            </div>

            <div className="cc-form-grid-2">
              <div className="cc-form-group">
                <label htmlFor="organizationType" className="cc-form-label">
                  <span>Organization Type</span>
                </label>
                <select
                  id="organizationType"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="cc-input cc-select"
                >
                  <option value="">Select Category</option>
                  <option value="Government">Government Agency</option>
                  <option value="University">University / Academic</option>
                  <option value="NGO">NGO / Non-Profit</option>
                  <option value="Corporate">Corporate / Enterprise</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="cc-form-group">
                <label htmlFor="department" className="cc-form-label">
                  <span>Department / Division</span>
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Capacity & Training Directorate"
                  className="cc-input"
                />
              </div>
            </div>

            <div className="cc-form-grid-2">
              <div className="cc-form-group">
                <label htmlFor="officialEmail" className="cc-form-label">
                  <span>Official Email <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="email"
                  id="officialEmail"
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  placeholder="contact@ndmi.gov.org"
                  className={`cc-input ${fieldErrors.officialEmail ? 'cc-input-error' : ''}`}
                  required
                />
                <FieldFeedback error={fieldErrors.officialEmail} />
              </div>

              <div className="cc-form-group">
                <label htmlFor="officialPhone" className="cc-form-label">
                  <span>Official Phone</span>
                </label>
                <input
                  type="tel"
                  id="officialPhone"
                  name="officialPhone"
                  value={formData.officialPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className="cc-input"
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* Stage 3: Location & Review */}
        {currentStep === 3 && (
          <>
            <FormSection
              title="Location Details"
              icon={MapPin}
              description="Enter institutional postal address and location info."
            >
              <div className="cc-form-group">
                <label htmlFor="address" className="cc-form-label">
                  <span>Street Address</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="100 Technology Plaza, Suite 400"
                  className="cc-input"
                  autoComplete="street-address"
                />
              </div>

              <div className="cc-form-grid-3">
                <div className="cc-form-group">
                  <label htmlFor="city" className="cc-form-label">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Metropolis"
                    className="cc-input"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="state" className="cc-form-label">State / Region</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Capital Region"
                    className="cc-input"
                    autoComplete="address-level1"
                  />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="country" className="cc-form-label">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="cc-input"
                    autoComplete="country-name"
                  />
                </div>
              </div>
            </FormSection>

            {/* Compact Review Summary */}
            <div className="cc-review-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cc-cyan)', margin: 0 }}>Registration Summary</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--cc-text-dim)' }}>Review before final submit</span>
              </div>

              <div className="cc-review-item">
                <span className="cc-review-label">Admin Name</span>
                <span className="cc-review-val">{formData.name || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Admin Email</span>
                <span className="cc-review-val">{formData.email || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Organization Name</span>
                <span className="cc-review-val">{formData.organizationName || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Official Email</span>
                <span className="cc-review-val">{formData.officialEmail || '—'}</span>
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
              loadingText="Registering Organization..."
              icon={CheckCircle}
              style={{ minWidth: '220px' }}
            >
              Register Organization
            </AnimatedActionButton>
          )}
        </div>

      </form>
    </AuthPageShell>
  );
};

export default AdminRegister;
