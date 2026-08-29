import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Eye, FileSearch, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { api } from '../../services/api';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
};

const asText = (value) => (Array.isArray(value) ? value.join(', ') : (value || '-'));

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'approved') {
    return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={12} /> Active</span>;
  }
  if (s === 'changes_requested') {
    return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#fef3c7', color: '#92400e' }}><AlertTriangle size={12} /> Changes Requested</span>;
  }
  if (s === 'rejected') {
    return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={12} /> Rejected</span>;
  }
  return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> Pending Review</span>;
};

const TrainerApprovals = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = `/admin/trainer-applications?status=${statusFilter}`;
      const response = await api.get(endpoint);
      setApplications(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.message || 'Could not load trainer applications.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const idOf = (app) => app._id || app.id;

  const term = searchTerm.toLowerCase();
  const filteredApps = applications.filter(app =>
    (app.name || '').toLowerCase().includes(term) ||
    (app.email || '').toLowerCase().includes(term) ||
    (app.department || '').toLowerCase().includes(term) ||
    (app.qualification || '').toLowerCase().includes(term)
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainer Approvals & Verification</h1>
        <p style={{ color: 'var(--text-light)' }}>Inspect, verify credentials, and approve trainer applications for your organization.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Search by name, department, qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}
            >
              <option value="pending">Pending Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="active">Approved / Active</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Statuses</option>
            </select>
          </div>

          <div className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
            {applications.length} Applications ({statusFilter === 'pending' ? 'Pending' : statusFilter})
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-light)' }}>
            Loading trainer applications...
          </div>
        ) : filteredApps.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Applicant Name</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Department & Designation</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Qualification</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Experience</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Applied On</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Inspection</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => (
                  <tr key={idOf(app)} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{app.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{app.department || '-'}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{app.designation || '-'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{app.qualification || '-'}</td>
                    <td style={{ padding: '1rem' }}>{app.experience ? `${app.experience} Yrs` : '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{formatDate(app.appliedOn || app.createdAt)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => navigate(`/admin/trainer-approvals/${idOf(app)}`)} 
                        className="btn btn-primary" 
                        style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <FileSearch size={16} /> Inspect Application
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
            <Shield size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No applications found</h3>
            <p style={{ color: 'var(--text-light)' }}>There are no trainer applications matching your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerApprovals;
