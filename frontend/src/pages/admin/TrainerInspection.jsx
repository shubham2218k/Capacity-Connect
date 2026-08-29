import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, CheckCircle2, AlertTriangle, XCircle, Clock, 
  FileText, Download, Eye, Award, Briefcase, User, Building, Mail, Phone, Check, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toLocaleString();
};

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'approved') {
    return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={14} /> Active</span>;
  }
  if (s === 'changes_requested') {
    return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#fef3c7', color: '#92400e' }}><AlertTriangle size={14} /> Changes Requested</span>;
  }
  if (s === 'rejected') {
    return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={14} /> Rejected</span>;
  }
  return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> Pending Review</span>;
};

const TrainerInspection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingChecklist, setSavingChecklist] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  // Modals
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesReason, setChangesReason] = useState('');
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Local checklist state
  const [checklist, setChecklist] = useState({
    organizationVerified: false,
    profileComplete: false,
    qualificationReviewed: false,
    experienceReviewed: false,
    expertiseReviewed: false,
    documentsReviewed: false
  });
  const [verifiedExpertise, setVerifiedExpertise] = useState([]);
  const [adminRemarks, setAdminRemarks] = useState('');

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/trainer-applications/${id}`);
      const data = response?.data;
      if (data) {
        setApplication(data);
        const review = data.trainerReview || {};
        setChecklist({
          organizationVerified: Boolean(review.organizationVerified),
          profileComplete: Boolean(review.profileComplete),
          qualificationReviewed: Boolean(review.qualificationReviewed),
          experienceReviewed: Boolean(review.experienceReviewed),
          expertiseReviewed: Boolean(review.expertiseReviewed),
          documentsReviewed: Boolean(review.documentsReviewed)
        });
        setVerifiedExpertise(Array.isArray(review.verifiedExpertise) ? review.verifiedExpertise : []);
        setAdminRemarks(review.adminRemarks || '');
      } else {
        setError('Trainer application payload empty.');
      }
    } catch (err) {
      setError(err?.message || 'Could not load trainer application.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadDetails(); }, [loadDetails]);

  const handleChecklistChange = (field) => {
    const next = { ...checklist, [field]: !checklist[field] };
    setChecklist(next);
    saveChecklist(next, verifiedExpertise, adminRemarks);
  };

  const toggleVerifiedExpertise = (tag) => {
    const nextTags = verifiedExpertise.includes(tag)
      ? verifiedExpertise.filter(t => t !== tag)
      : [...verifiedExpertise, tag];
    setVerifiedExpertise(nextTags);
    saveChecklist(checklist, nextTags, adminRemarks);
  };

  const saveChecklist = async (nextChecklist, nextVerified, nextRemarks) => {
    setSavingChecklist(true);
    try {
      await api.patch(`/admin/trainer-applications/${id}/review-checklist`, {
        ...nextChecklist,
        verifiedExpertise: nextVerified,
        adminRemarks: nextRemarks
      });
    } catch (err) {
      console.error('Checklist auto-save failed:', err);
    } finally {
      setSavingChecklist(false);
    }
  };

  const isChecklistComplete = () => {
    const req = [
      checklist.organizationVerified,
      checklist.profileComplete,
      checklist.qualificationReviewed,
      checklist.expertiseReviewed,
      checklist.documentsReviewed
    ];
    if (application?.experience && String(application.experience).trim() !== '') {
      req.push(checklist.experienceReviewed);
    }
    return req.every(Boolean);
  };

  const handleApprove = async () => {
    if (!isChecklistComplete()) {
      setError('Complete the trainer verification checklist before approval.');
      return;
    }

    setActionBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await api.patch(`/admin/trainer-applications/${id}/approve`);
      setNotice(response?.message || 'Trainer approved successfully.');
      loadDetails();
    } catch (err) {
      setError(err?.message || 'Approval failed.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleRequestChangesSubmit = async (e) => {
    e.preventDefault();
    if (!changesReason.trim()) {
      setError('Please provide a reason for requesting changes.');
      return;
    }

    setActionBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await api.patch(`/admin/trainer-applications/${id}/request-changes`, {
        reason: changesReason.trim()
      });
      setShowChangesModal(false);
      setNotice(response?.message || 'Changes requested from trainer.');
      loadDetails();
    } catch (err) {
      setError(err?.message || 'Requesting changes failed.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setError('Please provide a rejection reason.');
      return;
    }

    setActionBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await api.patch(`/admin/trainer-applications/${id}/reject`, {
        reason: rejectReason.trim()
      });
      setShowRejectModal(false);
      setNotice(response?.message || 'Trainer application rejected.');
      loadDetails();
    } catch (err) {
      setError(err?.message || 'Rejection failed.');
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-light)' }}>
        Loading trainer inspection details...
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ padding: '2rem' }}>
        <Link to="/admin/trainer-approvals" className="btn btn-outline" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Approvals
        </Link>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
          {error || 'Trainer application not found.'}
        </div>
      </div>
    );
  }

  const docs = application.trainerDocuments || [];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin/trainer-approvals" style={{ color: 'var(--text-light)', display: 'flex' }}>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
              Trainer Application Inspection
            </h1>
            <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem' }}>
              Review credentials, verify supporting documents, and complete checklist.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <StatusBadge status={application.status} />
          <div className="badge badge-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Application Completeness: {application.completenessScore}%
          </div>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {notice && (
        <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {notice}
        </div>
      )}

      {application.status === 'changes_requested' && application.changesRequestedReason && (
        <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', color: '#873800', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <strong>Changes Currently Requested by Admin:</strong>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.92rem' }}>{application.changesRequestedReason}</p>
        </div>
      )}

      {application.status === 'rejected' && application.rejectionReason && (
        <div style={{ backgroundColor: '#fff2f0', border: '1px solid #ffccc7', color: '#a8071a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <strong>Rejection Reason:</strong>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.92rem' }}>{application.rejectionReason}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Details & Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section A: Application Summary */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} /> Application Summary
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem', fontSize: '0.92rem' }}>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Full Name</span>
                <strong style={{ fontSize: '1.05rem' }}>{application.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Organization</span>
                <strong>{application.organizationName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Email Address</span>
                <span>{application.email}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Phone Number</span>
                <span>{application.phone || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Department</span>
                <span>{application.department || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Designation</span>
                <span>{application.designation || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Employee ID</span>
                <span>{application.employeeId || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Applied On</span>
                <span>{formatDate(application.appliedOn)}</span>
              </div>
            </div>
          </div>

          {/* Section B: Professional Profile */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} /> Professional Profile
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Highest Qualification</span>
                <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{application.qualification || '-'}</strong>
              </div>
              <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Institution / University</span>
                <strong style={{ fontSize: '1rem' }}>{application.institution || '-'}</strong>
              </div>
              <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Years of Experience</span>
                <strong style={{ fontSize: '1rem' }}>{application.experience ? `${application.experience} Years` : '-'}</strong>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                Professional Bio
              </span>
              <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-dark)', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {application.professionalBio || 'No bio provided.'}
              </p>
            </div>
          </div>

          {/* Section C: Competency Review (Declared vs Verified Expertise) */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} /> Competency Review (Expertise Verification)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
              Select which of the trainer's declared skills are verified after reviewing their qualification and experience proofs.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', display: 'block', marginBottom: '0.5rem' }}>
                Declared Expertise Skills (Click to toggle verification):
              </span>

              {application.expertise && application.expertise.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {application.expertise.map(skill => {
                    const isVerified = verifiedExpertise.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleVerifiedExpertise(skill)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '20px',
                          border: `1px solid ${isVerified ? 'var(--success)' : 'var(--border-color)'}`,
                          backgroundColor: isVerified ? '#f6ffed' : '#f8fafc',
                          color: isVerified ? '#389e0d' : 'var(--text-dark)',
                          fontWeight: isVerified ? 600 : 400,
                          fontSize: '0.88rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isVerified ? <CheckCircle2 size={14} /> : <span style={{ width: 14, height: 14, border: '1px solid #d9d9d9', borderRadius: '50%' }} />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>No declared expertise skills.</p>
              )}
            </div>

            {verifiedExpertise.length > 0 && (
              <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.88rem', color: '#274e13' }}>
                <strong>Verified Expertise:</strong> {verifiedExpertise.join(', ')}
              </div>
            )}
          </div>

          {/* Section D: Supporting Documents */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} /> Supporting Verification Documents
            </h2>

            {docs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {docs.map((doc, idx) => {
                  const docId = doc._id || doc.id || idx;
                  const streamUrl = `/api/admin/trainer-applications/${application._id || application.id}/documents/${docId}`;
                  return (
                    <div 
                      key={docId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-color-alt)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <FileText size={28} style={{ color: 'var(--primary)' }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize' }}>
                            {doc.type} Proof
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                            {doc.originalFilename || doc.filename}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a 
                          href={streamUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={14} /> View Document
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px', color: 'var(--text-light)' }}>
                No supporting documents were uploaded with this application.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Verification Checklist & Decision Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section E: Admin Verification Checklist */}
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={18} /> Admin Verification Checklist
              </h2>
              {savingChecklist && <RefreshCw size={14} className="spin" style={{ color: 'var(--text-light)' }} />}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
              You must verify and tick all required criteria before approving this trainer account.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={checklist.organizationVerified} 
                  onChange={() => handleChecklistChange('organizationVerified')}
                  style={{ marginTop: '0.2rem' }}
                />
                <span>Organization membership & trainer access key verified</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={checklist.profileComplete} 
                  onChange={() => handleChecklistChange('profileComplete')}
                  style={{ marginTop: '0.2rem' }}
                />
                <span>Professional profile fields are complete</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={checklist.qualificationReviewed} 
                  onChange={() => handleChecklistChange('qualificationReviewed')}
                  style={{ marginTop: '0.2rem' }}
                />
                <span>Qualification degree/certificate reviewed</span>
              </label>

              {application?.experience && String(application.experience).trim() !== '' && (
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklist.experienceReviewed} 
                    onChange={() => handleChecklistChange('experienceReviewed')}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <span>Experience information & proof reviewed</span>
                </label>
              )}

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={checklist.expertiseReviewed} 
                  onChange={() => handleChecklistChange('expertiseReviewed')}
                  style={{ marginTop: '0.2rem' }}
                />
                <span>Expertise competency skills verified</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={checklist.documentsReviewed} 
                  onChange={() => handleChecklistChange('documentsReviewed')}
                  style={{ marginTop: '0.2rem' }}
                />
                <span>Supporting verification documents inspected</span>
              </label>
            </div>

            {/* Admin Remarks */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Admin Inspection Remarks
              </label>
              <textarea 
                value={adminRemarks} 
                onChange={(e) => {
                  setAdminRemarks(e.target.value);
                  saveChecklist(checklist, verifiedExpertise, e.target.value);
                }}
                rows={3}
                placeholder="Internal verification notes..."
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              ></textarea>
            </div>

            {/* Section G: Decision Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleApprove}
                disabled={!isChecklistComplete() || actionBusy || application.status === 'active'}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: isChecklistComplete() ? 'var(--success)' : '#d9d9d9', 
                  borderColor: isChecklistComplete() ? 'var(--success)' : '#d9d9d9',
                  cursor: isChecklistComplete() ? 'pointer' : 'not-allowed'
                }}
              >
                {application.status === 'active' ? 'Trainer Currently Active' : 'Approve Trainer'}
              </button>

              {!isChecklistComplete() && application.status !== 'active' && (
                <p style={{ fontSize: '0.78rem', color: 'var(--danger)', margin: 0, textAlign: 'center' }}>
                  Complete all checklist items above to enable approval.
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button 
                  onClick={() => setShowChangesModal(true)}
                  disabled={actionBusy}
                  className="btn btn-outline"
                  style={{ color: '#d97706', borderColor: '#d97706', fontSize: '0.82rem', padding: '0.6rem' }}
                >
                  Request Changes
                </button>
                <button 
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionBusy || application.status === 'rejected'}
                  className="btn btn-outline"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)', fontSize: '0.82rem', padding: '0.6rem' }}
                >
                  Reject
                </button>
              </div>
            </div>

          </div>

          {/* Section F: Review History Timeline */}
          {application.reviewHistory && application.reviewHistory.length > 0 && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Application History Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {application.reviewHistory.map((item, index) => (
                  <div key={index} style={{ borderLeft: '2px solid var(--secondary)', paddingLeft: '0.75rem', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-dark)' }}>
                      {item.action.replace('_', ' ')}
                    </div>
                    {item.note && <div style={{ color: 'var(--text-muted)', margin: '0.2rem 0' }}>{item.note}</div>}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{formatDate(item.timestamp)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>Request Changes from Trainer</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Specify the corrections or additional documents required. The trainer will see this remark when logging in.
            </p>
            <form onSubmit={handleRequestChangesSubmit}>
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Admin Remark / Required Corrections *</label>
                <textarea 
                  required
                  rows={4}
                  value={changesReason}
                  onChange={(e) => setChangesReason(e.target.value)}
                  placeholder="e.g. Please upload a clearer qualification certificate and update your professional bio."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowChangesModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={actionBusy} className="btn btn-primary" style={{ backgroundColor: '#d97706', borderColor: '#d97706' }}>
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '1rem' }}>Reject Trainer Application</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Provide a clear reason for rejecting this application.
            </p>
            <form onSubmit={handleRejectSubmit}>
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Rejection Reason *</label>
                <textarea 
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Qualifications do not meet current organizational requirements."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={actionBusy} className="btn btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  Reject Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerInspection;
