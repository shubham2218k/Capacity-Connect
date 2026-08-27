import { useState, useEffect, useCallback } from 'react';
import { Search, UserCheck, XCircle, Eye, Shield } from 'lucide-react';
import { api } from '../../services/api';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
};

const asText = (value) => (Array.isArray(value) ? value.join(', ') : (value || '-'));

const TrainerApprovals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [details, setDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/trainer-applications');
      setApplications(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.message || 'Could not load trainer applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const idOf = (app) => app._id || app.id;

  const handleApprove = async (app) => {
    setBusyId(idOf(app));
    setError('');
    setNotice('');
    try {
      const response = await api.patch(`/admin/trainer-applications/${idOf(app)}/approve`);
      setApplications(prev => prev.filter(a => idOf(a) !== idOf(app)));
      setNotice(response?.message || `${app.name} has been approved.`);
    } catch (err) {
      setError(err?.message || 'Could not approve this trainer.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (app) => {
    const reason = window.prompt(`Reason for rejecting ${app.name}:`);
    if (reason === null) return; // cancelled
    if (!reason.trim()) {
      setError('A rejection reason is required.');
      return;
    }

    setBusyId(idOf(app));
    setError('');
    setNotice('');
    try {
      const response = await api.patch(`/admin/trainer-applications/${idOf(app)}/reject`, { reason: reason.trim() });
      setApplications(prev => prev.filter(a => idOf(a) !== idOf(app)));
      setNotice(response?.message || `${app.name}'s application was rejected.`);
    } catch (err) {
      setError(err?.message || 'Could not reject this trainer.');
    } finally {
      setBusyId(null);
    }
  };

  const term = searchTerm.toLowerCase();
  const filteredApps = applications.filter(app =>
    (app.name || '').toLowerCase().includes(term) ||
    (app.email || '').toLowerCase().includes(term) ||
    (app.department || '').toLowerCase().includes(term)
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainer Approvals</h1>
        <p style={{ color: 'var(--text-light)' }}>Review and approve new trainer applications for your organization.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {notice && (
        <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {notice}
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>
          <div className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
            {applications.length} Pending Approvals
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-light)' }}>
            Loading applications...
          </div>
        ) : filteredApps.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Applicant Name</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Department</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Expertise</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Applied On</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => (
                  <tr key={idOf(app)} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{app.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{app.department || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {asText(app.expertise)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{formatDate(app.appliedOn || app.createdAt)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setDetails(app)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--secondary)' }} title="View Details">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleApprove(app)} disabled={busyId === idOf(app)} className="btn btn-primary" style={{ padding: '0.4rem', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }} title="Approve">
                          <UserCheck size={18} />
                        </button>
                        <button onClick={() => handleReject(app)} disabled={busyId === idOf(app)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} title="Reject">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
            <UserCheck size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No pending applications</h3>
            <p style={{ color: 'var(--text-light)' }}>All trainer applications have been processed.</p>
          </div>
        )}
      </div>

      {details && (
        <div
          onClick={() => setDetails(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}
        >
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>{details.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.6rem 1.25rem', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Email</span><span>{details.email}</span>
              <span style={{ color: 'var(--text-light)' }}>Phone</span><span>{details.phone || '-'}</span>
              <span style={{ color: 'var(--text-light)' }}>Organization</span><span>{details.organizationName || '-'}</span>
              <span style={{ color: 'var(--text-light)' }}>Department</span><span>{details.department || '-'}</span>
              <span style={{ color: 'var(--text-light)' }}>Designation</span><span>{details.designation || '-'}</span>
              <span style={{ color: 'var(--text-light)' }}>Qualification</span><span>{details.qualification || '-'}</span>
              <span style={{ color: 'var(--text-light)' }}>Expertise</span><span>{asText(details.expertise)}</span>
              <span style={{ color: 'var(--text-light)' }}>Experience</span><span>{details.experience || '-'}</span>
              <span style={{ color: 'var(--text-light)' }}>Applied On</span><span>{formatDate(details.appliedOn || details.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetails(null)} className="btn btn-outline">Close</button>
              <button onClick={() => { const app = details; setDetails(null); handleReject(app); }} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Reject</button>
              <button onClick={() => { const app = details; setDetails(null); handleApprove(app); }} className="btn btn-primary" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerApprovals;
