import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Building, User, Award, 
  Briefcase, AlertCircle, Shield, CheckCircle, XCircle, Clock, Trash2, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: loggedInAdmin } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users/${id}`);
      setUserData(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to load user profile.');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      const res = await api.patch(`/admin/users/${id}/suspend`);
      setUserData(res.data);
      setShowSuspendModal(false);
    } catch (err) {
      setActionError(err.message || 'Failed to suspend account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      const res = await api.patch(`/admin/users/${id}/reactivate`);
      setUserData(res.data);
    } catch (err) {
      alert(err.message || 'Failed to reactivate account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      await api.delete(`/admin/users/${id}`);
      setShowDeleteModal(false);
      navigate('/admin/users');
    } catch (err) {
      setActionError(err.message || 'Failed to remove user.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>
        Loading user profile...
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div>
        <Link to="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Users
        </Link>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>User Profile Unavailable</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'User not found or access denied.'}</p>
          <button onClick={() => navigate('/admin/users')} className="btn btn-primary">Back to Users</button>
        </div>
      </div>
    );
  }

  const isSelf = String(loggedInAdmin?._id) === String(userData._id);
  const isPendingTrainer = userData.role === 'Trainer' && userData.status === 'pending';

  return (
    <div style={{ maxWidth: '900px' }}>
      
      {/* Top Back Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to User Management
        </Link>
      </div>

      {/* Main User Profile Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.75rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, flexShrink: 0 }}>
            {(userData.name || 'U').charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                {userData.name}
              </h1>

              <span className={`badge ${
                userData.role === 'Admin' ? 'badge-danger' : 
                userData.role === 'Trainer' ? 'badge-primary' : 'badge-neutral'
              }`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                {userData.role === 'Admin' && <Shield size={13} />}
                {userData.role}
              </span>

              <span style={{ 
                display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                backgroundColor: userData.status === 'active' ? '#dcfce7' : userData.status === 'suspended' ? '#fee2e2' : userData.status === 'pending' ? '#fffbe8' : '#f3f4f6',
                color: userData.status === 'active' ? '#166534' : userData.status === 'suspended' ? '#991b1b' : userData.status === 'pending' ? '#855900' : '#4b5563'
              }}>
                {userData.status === 'active' ? 'Active Account' : userData.status === 'suspended' ? 'Suspended Account' : userData.status === 'pending' ? 'Pending Approval' : 'Rejected'}
              </span>
            </div>

            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
              {userData.designation ? `${userData.designation} • ` : ''}{userData.department || 'No department specified'}
            </p>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} /> Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '-'}
            </div>
          </div>
        </div>

        {/* Pending Trainer Warning Banner */}
        {isPendingTrainer && (
          <div style={{ backgroundColor: '#fffbe8', border: '1px solid #ffe58f', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#855900', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={18} /> Trainer Application Pending Approval
              </div>
              <p style={{ fontSize: '0.85rem', color: '#855900', margin: 0 }}>
                This user applied for a Trainer role and is awaiting verification by an Administrator.
              </p>
            </div>
            <Link to="/admin/trainer-approvals" className="btn btn-outline" style={{ backgroundColor: 'white', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              View Application <ExternalLink size={14} />
            </Link>
          </div>
        )}

        {/* Detailed Profile Grid */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.25rem' }}>
          Professional Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Mail size={18} style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Email Address</div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem', wordBreak: 'break-all' }}>{userData.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Phone size={18} style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Phone Number</div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{userData.phone || 'Not provided'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Building size={18} style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Organization</div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{userData.organizationName || 'Capacity Connect Organization'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Briefcase size={18} style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Department / Designation</div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                {userData.department ? `${userData.department}` : 'General'} {userData.designation ? `(${userData.designation})` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Award size={18} style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Qualification</div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{userData.qualification || 'Not specified'}</div>
            </div>
          </div>

          {userData.role === 'Trainer' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock size={18} style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Years of Experience</div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{userData.experience || 'Not specified'}</div>
              </div>
            </div>
          )}

        </div>

        {/* Trainer Specific Expertise Badges */}
        {userData.role === 'Trainer' && userData.expertise && userData.expertise.length > 0 && (
          <div style={{ marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              Areas of Expertise
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {userData.expertise.map((item, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Account Access Controls Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Account Access Management
        </h3>
        <p className="text-light" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          As an Administrator, you can suspend, reactivate, or remove users from your organization.
        </p>

        {isSelf ? (
          <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
            <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary)' }} />
            You are viewing your own Admin account. Self-suspension and self-deletion are disabled for security.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            
            {/* Suspend or Reactivate Button */}
            {!isPendingTrainer && userData.role !== 'Admin' && (
              userData.status === 'suspended' ? (
                <button 
                  onClick={handleReactivate} 
                  disabled={actionLoading}
                  className="btn btn-outline" 
                  style={{ color: '#166534', borderColor: '#166534', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle size={18} /> Reactivate Account
                </button>
              ) : (
                <button 
                  onClick={() => setShowSuspendModal(true)} 
                  disabled={actionLoading}
                  className="btn btn-outline" 
                  style={{ color: 'var(--warning)', borderColor: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <XCircle size={18} /> Suspend Account
                </button>
              )
            )}

            {/* Delete Button */}
            <button 
              onClick={() => setShowDeleteModal(true)} 
              disabled={actionLoading}
              className="btn btn-outline" 
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Trash2 size={18} /> Remove User
            </button>

          </div>
        )}
      </div>

      {/* --- SUSPEND CONFIRMATION MODAL --- */}
      {showSuspendModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={22} /> Suspend User Account
            </h3>
            
            <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Suspend <strong>{userData.name}</strong>'s account? The user will no longer be able to access Capacity Connect until reactivated by an administrator.
            </p>

            {actionError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setShowSuspendModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--warning)', borderColor: 'var(--warning)', color: '#000' }} onClick={handleSuspend} disabled={actionLoading}>
                {actionLoading ? 'Suspending...' : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trash2 size={22} /> Remove User from Organization
            </h3>
            
            <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Remove <strong>{userData.name}</strong> from your organization?
            </p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              The account will lose access immediately, while historical training records and course references will be preserved for compliance.
            </div>

            {actionError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDetails;
