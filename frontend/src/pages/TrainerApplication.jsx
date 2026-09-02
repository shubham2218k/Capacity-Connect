import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ArrowRight, Upload, FileText, KeyRound, User, Award, BookOpen, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { FormProgress } from '../components/auth/FormProgress';
import { FormSection } from '../components/auth/FormSection';
import { AnimatedActionButton } from '../components/auth/AnimatedActionButton';
import { FormAlertBanner, FieldFeedback, AccessKeyStatusBadge } from '../components/auth/FieldFeedback';
import { api } from '../services/api';

const STEPS = [
  { title: 'Verify Organization' },
  { title: 'Personal Identity' },
  { title: 'Credentials' },
  { title: 'Expertise & Review' }
];

const TrainerApplication = () => {
  const { applyAsTrainer } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
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
  const [fieldErrors, setFieldErrors] = useState({});
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
      setFormData((prev) => ({ ...prev, organization: '' }));
      return { ok: false, message: 'Please enter your Organization Trainer Access Key.' };
    }

    setKeyValidating(true);
    setKeyError('');

    try {
      const response = await api.post('/auth/validate-key', { key, type: 'Trainer' });
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

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.accessKey.trim()) {
        errors.accessKey = 'Trainer Access Key is required';
      } else if (!orgDetected && !keyValidating) {
        errors.accessKey = keyError || 'Please verify your access key before continuing';
      }
    } else if (step === 2) {
      if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
      if (!formData.email.trim()) errors.email = 'Email Address is required';
      if (!formData.phone.trim()) errors.phone = 'Phone Number is required';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 3) {
      if (!formData.department.trim()) errors.department = 'Department is required';
      if (!formData.designation.trim()) errors.designation = 'Designation is required';
      if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
      if (!formData.highestQualification) errors.highestQualification = 'Highest Qualification is required';
      if (!formData.institution.trim()) errors.institution = 'Granting Institution is required';
      if (!formData.experienceYears) errors.experienceYears = 'Years of Experience is required';
      if (!qualificationFile) errors.qualificationFile = 'Qualification Degree Proof document is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
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
        setError(result.message || 'Trainer application submission failed.');
      }
    } catch (err) {
      setError(err?.message || 'A server error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* REDESIGNED APPLICATION SUBMITTED SUCCESS VIEW */
  if (isSubmitted) {
    return (
      <AuthPageShell
        illustrationType="trainer-apply"
        title="Application Submitted"
        subtitle="Your trainer credentials have been dispatched for admin inspection"
      >
        <div className="cc-key-handoff-card">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--cc-success-bg)', color: 'var(--cc-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid var(--cc-success-border)' }}>
            <CheckCircle size={36} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cc-text)', margin: '0 0 0.5rem 0' }}>
            Application Sent
          </h3>
          <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
            Thank you for applying as a Verified Trainer for <strong>{formData.organization || 'your organization'}</strong>.
          </p>

          <div style={{ backgroundColor: 'var(--cc-bg-surface)', border: '1px solid var(--cc-border)', borderRadius: 'var(--cc-radius-md)', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--cc-cyan)', display: 'block', marginBottom: '0.5rem' }}>Next Steps:</strong>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--cc-text-muted)', lineHeight: '1.6' }}>
              <li>Organization Administrators will inspect your qualification proof and credentials.</li>
              <li>Once verified, your account receives course creation and assessment rights.</li>
              <li>You can log in at any time to monitor approval status.</li>
            </ul>
          </div>

          <AnimatedActionButton
            type="button"
            variant="primary"
            fullWidth
            onClick={() => window.location.href = '/login'}
            icon={ArrowRight}
          >
            Back to Sign In
          </AnimatedActionButton>
        </div>
      </AuthPageShell>
    );
  }

  /* MULTI-STEP TRAINER APPLICATION FORM */
  return (
    <AuthPageShell
      illustrationType="trainer-apply"
      currentStep={currentStep}
      title="Apply as Trainer"
      subtitle="Author courses and deliver institutional capability training"
      wide
    >
      <FormProgress steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />

      <FormAlertBanner error={error} />

      <form onSubmit={handleSubmit} noValidate>
        
        {/* Stage 1: Verify Organization */}
        {currentStep === 1 && (
          <FormSection
            title="Organization Verification"
            icon={KeyRound}
            description="Enter your Organization Trainer Access Key to verify institutional affiliation."
            highlight
          >
            <div className="cc-form-group">
              <label htmlFor="accessKey" className="cc-form-label">
                <span>Organization Trainer Access Key <span className="cc-form-label-required">*</span></span>
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  id="accessKey"
                  name="accessKey"
                  value={formData.accessKey}
                  onChange={handleChange}
                  placeholder="e.g. CC-TNR-XXXXXX"
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

        {/* Stage 2: Personal Identity */}
        {currentStep === 2 && (
          <FormSection
            title="Personal Identity"
            icon={User}
            description="Enter contact and authentication details for your trainer profile."
          >
            <div className="cc-form-group">
              <label htmlFor="fullName" className="cc-form-label">
                <span>Full Name <span className="cc-form-label-required">*</span></span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Dr. Jane Doe"
                className={`cc-input ${fieldErrors.fullName ? 'cc-input-error' : ''}`}
                autoComplete="name"
                required
              />
              <FieldFeedback error={fieldErrors.fullName} />
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
                  placeholder="jane.doe@organization.org"
                  className={`cc-input ${fieldErrors.email ? 'cc-input-error' : ''}`}
                  autoComplete="email"
                  required
                />
                <FieldFeedback error={fieldErrors.email} />
              </div>

              <div className="cc-form-group">
                <label htmlFor="phone" className="cc-form-label">
                  <span>Phone Number <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className={`cc-input ${fieldErrors.phone ? 'cc-input-error' : ''}`}
                  autoComplete="tel"
                  required
                />
                <FieldFeedback error={fieldErrors.phone} />
              </div>
            </div>

            <div className="cc-form-grid-2">
              <div className="cc-form-group">
                <label htmlFor="password" className="cc-form-label">
                  <span>Password <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className={`cc-input ${fieldErrors.password ? 'cc-input-error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <FieldFeedback error={fieldErrors.password} />
              </div>

              <div className="cc-form-group">
                <label htmlFor="confirmPassword" className="cc-form-label">
                  <span>Confirm Password <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="password"
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

        {/* Stage 3: Professional Credentials & Document Uploads */}
        {currentStep === 3 && (
          <>
            <FormSection
              title="Professional Information"
              icon={Award}
              description="Institutional position and academic qualifications."
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
                    <span>Department / Division <span className="cc-form-label-required">*</span></span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Earth & Climate Sciences"
                    className={`cc-input ${fieldErrors.department ? 'cc-input-error' : ''}`}
                    required
                  />
                  <FieldFeedback error={fieldErrors.department} />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="designation" className="cc-form-label">
                    <span>Designation <span className="cc-form-label-required">*</span></span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Scientist / Assoc. Professor"
                    className={`cc-input ${fieldErrors.designation ? 'cc-input-error' : ''}`}
                    required
                  />
                  <FieldFeedback error={fieldErrors.designation} />
                </div>
              </div>

              <div className="cc-form-grid-3">
                <div className="cc-form-group">
                  <label htmlFor="employeeId" className="cc-form-label">
                    <span>Employee ID / Reg No <span className="cc-form-label-required">*</span></span>
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. EMP-99201"
                    className={`cc-input ${fieldErrors.employeeId ? 'cc-input-error' : ''}`}
                    required
                  />
                  <FieldFeedback error={fieldErrors.employeeId} />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="highestQualification" className="cc-form-label">
                    <span>Highest Qualification <span className="cc-form-label-required">*</span></span>
                  </label>
                  <select
                    id="highestQualification"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleChange}
                    className={`cc-input cc-select ${fieldErrors.highestQualification ? 'cc-input-error' : ''}`}
                    required
                  >
                    <option value="">Select Qualification</option>
                    <option value="Ph.D. / Doctorate">Ph.D. / Doctorate</option>
                    <option value="Master Degree (M.Tech / M.Sc)">Master's Degree (M.Tech / M.Sc)</option>
                    <option value="Bachelor Degree (B.Tech / B.Sc)">Bachelor's Degree (B.Tech / B.Sc)</option>
                    <option value="Other Certification">Other Professional Credential</option>
                  </select>
                  <FieldFeedback error={fieldErrors.highestQualification} />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="experienceYears" className="cc-form-label">
                    <span>Experience (Years) <span className="cc-form-label-required">*</span></span>
                  </label>
                  <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    min="0"
                    max="60"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    className={`cc-input ${fieldErrors.experienceYears ? 'cc-input-error' : ''}`}
                    required
                  />
                  <FieldFeedback error={fieldErrors.experienceYears} />
                </div>
              </div>

              <div className="cc-form-group">
                <label htmlFor="institution" className="cc-form-label">
                  <span>Granting Institution / University <span className="cc-form-label-required">*</span></span>
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="e.g. IIT Bombay / IISc"
                  className={`cc-input ${fieldErrors.institution ? 'cc-input-error' : ''}`}
                  required
                />
                <FieldFeedback error={fieldErrors.institution} />
              </div>
            </FormSection>

            {/* Document Verification Proof Uploads */}
            <FormSection
              title="Verification Documents"
              icon={Upload}
              description="Upload proof files for credential inspection by organization admins."
            >
              <div className="cc-form-grid-3">
                
                {/* Doc 1: Qualification Proof (Required) */}
                <div style={{ border: `1.5px dashed ${fieldErrors.qualificationFile ? 'var(--cc-danger)' : 'var(--cc-border)'}`, borderRadius: 'var(--cc-radius-md)', padding: '1rem', textAlign: 'center', backgroundColor: 'var(--cc-bg-surface)' }}>
                  <Upload size={24} style={{ color: 'var(--cc-cyan)', margin: '0 auto 0.4rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--cc-text)' }}>Degree Proof <span className="cc-form-label-required">*</span></div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--cc-text-dim)', marginBottom: '0.75rem' }}>PDF/JPG/PNG</div>
                  <input
                    type="file"
                    id="qualificationFile"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      setQualificationFile(e.target.files[0] || null);
                      if (fieldErrors.qualificationFile) setFieldErrors((prev) => ({ ...prev, qualificationFile: '' }));
                    }}
                    style={{ fontSize: '0.75rem', width: '100%' }}
                    required
                  />
                  {qualificationFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--cc-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      <FileText size={12} /> {qualificationFile.name}
                    </div>
                  )}
                  <FieldFeedback error={fieldErrors.qualificationFile} />
                </div>

                {/* Doc 2: Experience Proof (Optional) */}
                <div style={{ border: '1.5px dashed var(--cc-border)', borderRadius: 'var(--cc-radius-md)', padding: '1rem', textAlign: 'center', backgroundColor: 'var(--cc-bg-surface)' }}>
                  <Upload size={24} style={{ color: 'var(--cc-blue)', margin: '0 auto 0.4rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--cc-text)' }}>Experience Proof</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--cc-text-dim)', marginBottom: '0.75rem' }}>Service Letter (Optional)</div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setExperienceFile(e.target.files[0] || null)}
                    style={{ fontSize: '0.75rem', width: '100%' }}
                  />
                  {experienceFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--cc-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      <FileText size={12} /> {experienceFile.name}
                    </div>
                  )}
                </div>

                {/* Doc 3: Identity Card (Optional) */}
                <div style={{ border: '1.5px dashed var(--cc-border)', borderRadius: 'var(--cc-radius-md)', padding: '1rem', textAlign: 'center', backgroundColor: 'var(--cc-bg-surface)' }}>
                  <Upload size={24} style={{ color: 'var(--cc-violet)', margin: '0 auto 0.4rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--cc-text)' }}>ID Card Proof</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--cc-text-dim)', marginBottom: '0.75rem' }}>Official ID (Optional)</div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setIdentityFile(e.target.files[0] || null)}
                    style={{ fontSize: '0.75rem', width: '100%' }}
                  />
                  {identityFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--cc-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      <FileText size={12} /> {identityFile.name}
                    </div>
                  )}
                </div>

              </div>
            </FormSection>
          </>
        )}

        {/* Stage 4: Expertise & Review */}
        {currentStep === 4 && (
          <>
            <FormSection
              title="Expertise & Teaching Bio"
              icon={BookOpen}
              description="Select domain competencies and add a brief professional bio."
            >
              {/* Skill Tag Selection Grid */}
              <div className="cc-form-group">
                <label className="cc-form-label">
                  <span>Competencies & Expertise Areas</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.5rem 0 1rem 0' }}>
                  {availableSkills.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        className={`cc-skill-tag-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => (isSelected ? handleRemoveSkill(skill) : handleAddSkill(skill))}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.75rem', backgroundColor: 'var(--cc-bg-surface)', borderRadius: 'var(--cc-radius-sm)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--cc-text-dim)', width: '100%', fontWeight: 600 }}>Selected Skills:</span>
                    {skills.map((s) => (
                      <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(34, 211, 238, 0.15)', color: 'var(--cc-cyan)', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {s}
                        <button type="button" onClick={() => handleRemoveSkill(s)} style={{ background: 'none', border: 'none', color: 'var(--cc-cyan)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="cc-form-group">
                <label htmlFor="bio" className="cc-form-label">
                  <span>Professional Bio</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Brief description of teaching experience, domain focus, and research background..."
                  className="cc-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </FormSection>

            {/* Review Summary */}
            <div className="cc-review-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cc-cyan)', margin: 0 }}>Application Review</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--cc-text-dim)' }}>Confirm details</span>
              </div>

              <div className="cc-review-item">
                <span className="cc-review-label">Organization</span>
                <span className="cc-review-val">{formData.organization || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Applicant Name</span>
                <span className="cc-review-val">{formData.fullName || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Email</span>
                <span className="cc-review-val">{formData.email || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Qualification</span>
                <span className="cc-review-val">{formData.highestQualification || '—'}</span>
              </div>
              <div className="cc-review-item">
                <span className="cc-review-label">Degree Document</span>
                <span className="cc-review-val">{qualificationFile ? qualificationFile.name : 'Not attached'}</span>
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
              loadingText="Submitting Application..."
              icon={CheckCircle}
              style={{ minWidth: '240px' }}
            >
              Submit Trainer Application
            </AnimatedActionButton>
          )}
        </div>

      </form>
    </AuthPageShell>
  );
};

export default TrainerApplication;
