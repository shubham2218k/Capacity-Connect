import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Upload, ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import { AuthPageShell } from '../../components/auth/AuthPageShell';
import { FormSection } from '../../components/auth/FormSection';
import { AnimatedActionButton } from '../../components/auth/AnimatedActionButton';
import { FormAlertBanner } from '../../components/auth/FieldFeedback';
import { api } from '../../services/api';

const TrainerApplicationStatus = () => {
  const [isResubmitted, setIsResubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    department: '',
    designation: '',
    employeeId: '',
    highestQualification: '',
    institution: '',
    experienceYears: '',
    bio: ''
  });

  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Files
  const [qualificationFile, setQualificationFile] = useState(null);
  const [experienceFile, setExperienceFile] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);

  const availableSkills = ['GIS', 'Remote Sensing', 'Climate Science', 'Data Analytics', 'Management', 'Communication', 'Earthquake Eng.', 'Meteorology'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your account email and password to verify your application revision.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      if (formData.department) fd.append('department', formData.department);
      if (formData.designation) fd.append('designation', formData.designation);
      if (formData.employeeId) fd.append('employeeId', formData.employeeId);
      if (formData.highestQualification) fd.append('qualification', formData.highestQualification);
      if (formData.institution) fd.append('institution', formData.institution);
      if (formData.experienceYears) fd.append('experience', formData.experienceYears);
      if (formData.bio) fd.append('bio', formData.bio);
      if (skills.length > 0) fd.append('expertise', skills.join(','));

      if (qualificationFile) fd.append('qualificationProof', qualificationFile);
      if (experienceFile) fd.append('experienceProof', experienceFile);
      if (identityFile) fd.append('identityProof', identityFile);

      const response = await api.postFormData('/auth/trainer-resubmit', fd);
      if (response.success) {
        setIsResubmitted(true);
      } else {
        setError(response.message || 'Resubmission failed');
      }
    } catch (err) {
      setError(err?.message || 'Resubmission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isResubmitted) {
    return (
      <AuthPageShell
        illustrationType="trainer-apply"
        title="Application Resubmitted"
        subtitle="Your revised credentials have been sent for admin inspection"
      >
        <div className="cc-key-handoff-card">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--cc-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <CheckCircle size={36} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cc-text)', margin: '0 0 0.5rem 0' }}>
            Revision Dispatched
          </h3>
          <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Status: <strong>Pending Review</strong>
          </p>
          <p style={{ color: 'var(--cc-text-dim)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Your revised application and updated verification documents have been sent to your organization administrator.
          </p>
          <AnimatedActionButton
            type="button"
            variant="primary"
            fullWidth
            onClick={() => window.location.href = '/login'}
          >
            Return to Login
          </AnimatedActionButton>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      illustrationType="trainer-apply"
      title="Update Application"
      subtitle="Revise credentials or upload replacement documents"
      wide
    >
      <FormAlertBanner error={error} />

      <form onSubmit={handleSubmit} noValidate>
        {/* Credentials Verification */}
        <FormSection title="Application Credentials" icon={Shield} highlight>
          <div className="cc-form-grid-2">
            <div className="cc-form-group">
              <label className="cc-form-label">Account Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Registered Email"
                className="cc-input"
              />
            </div>
            <div className="cc-form-group">
              <label className="cc-form-label">Account Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Account Password"
                className="cc-input"
              />
            </div>
          </div>
        </FormSection>

        {/* Revised Professional Information */}
        <FormSection title="Revise Professional Info" icon={RefreshCw}>
          <div className="cc-form-grid-2">
            <div className="cc-form-group">
              <label className="cc-form-label">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Climate Research"
                className="cc-input"
              />
            </div>
            <div className="cc-form-group">
              <label className="cc-form-label">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Scientist"
                className="cc-input"
              />
            </div>
            <div className="cc-form-group">
              <label className="cc-form-label">Employee ID / Code</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. EMP-9921"
                className="cc-input"
              />
            </div>
            <div className="cc-form-group">
              <label className="cc-form-label">Highest Qualification</label>
              <input
                type="text"
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                placeholder="e.g. Ph.D. in Physics"
                className="cc-input"
              />
            </div>
          </div>

          <div className="cc-form-group">
            <label className="cc-form-label">Expertise Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.4rem 0' }}>
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => (skills.includes(skill) ? handleRemoveSkill(skill) : handleAddSkill(skill))}
                  className={`cc-skill-tag-btn ${skills.includes(skill) ? 'selected' : ''}`}
                >
                  {skills.includes(skill) ? '✓ ' : '+ '}
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="cc-form-group">
            <label className="cc-form-label">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Updated professional background..."
              className="cc-input"
            />
          </div>
        </FormSection>

        {/* Upload Replacement Documents */}
        <FormSection title="Replacement Documents" icon={Upload}>
          <div className="cc-form-grid-3">
            <div className="cc-form-group">
              <label className="cc-form-label">Qualification Degree</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setQualificationFile(e.target.files[0] || null)}
                className="cc-input"
                style={{ fontSize: '0.8rem', padding: '0.4rem' }}
              />
            </div>
            <div className="cc-form-group">
              <label className="cc-form-label">Experience Proof</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setExperienceFile(e.target.files[0] || null)}
                className="cc-input"
                style={{ fontSize: '0.8rem', padding: '0.4rem' }}
              />
            </div>
            <div className="cc-form-group">
              <label className="cc-form-label">Identity Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setIdentityFile(e.target.files[0] || null)}
                className="cc-input"
                style={{ fontSize: '0.8rem', padding: '0.4rem' }}
              />
            </div>
          </div>
        </FormSection>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/login" className="cc-btn cc-btn-outline">
            <ArrowLeft size={16} /> Cancel
          </Link>
          <AnimatedActionButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Resubmitting..."
          >
            Resubmit Application
          </AnimatedActionButton>
        </div>
      </form>
    </AuthPageShell>
  );
};

export default TrainerApplicationStatus;
