import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Mail, Eye, AlertCircle, RefreshCw, XCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals state
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to load organization users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await api.patch(`/admin/users/${suspendTarget._id || suspendTarget.id}/suspend`);
      setNotice(`${suspendTarget.name}'s account has been suspended.`);
      setSuspendTarget(null);
      await fetchUsers();
    } catch (err) {
      setActionError(err.message || 'Failed to suspend user account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async (u) => {
    try {
      setError(null);
      setNotice(null);
      await api.patch(`/admin/users/${u._id || u.id}/reactivate`);
      setNotice(`${u.name}'s account has been reactivated.`);
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to reactivate account.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await api.delete(`/admin/users/${deleteTarget._id || deleteTarget.id}`);
      setNotice(`${deleteTarget.name}'s account has been permanently deleted.`);
      setDeleteTarget(null);
      await fetchUsers();
    } catch (err) {
      setActionError(err.message || 'Failed to permanently delete account.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'pending':
        return { backgroundColor: '#fffbe8', color: '#855900' };
      case 'suspended':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'rejected':
        return { backgroundColor: '#f3f4f6', color: '#4b5563' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#4b5563' };
    }
  };

  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'Active';
      case 'pending': return 'Pending Approval';
      case 'suspended': return 'Suspended';
      case 'rejected': return 'Rejected';
      default: return status || 'Unknown';
    }
  };

  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === 'All' || 
                      (filterRole === 'Trainees' && user.role === 'Trainee') ||
                      (filterRole === 'Trainers' && user.role === 'Trainer') ||
                      (filterRole === 'Admins' && user.role === 'Admin');

    const statusMatch = filterStatus === 'All' || 
                        (user.status || '').toLowerCase() === filterStatus.toLowerCase();

    const searchStr = searchTerm.toLowerCase();
    const nameMatch = (user.name || '').toLowerCase().includes(searchStr);
    const emailMatch = (user.email || '').toLowerCase().includes(searchStr);
    const deptMatch = (user.department || '').toLowerCase().includes(searchStr);
    const textMatch = nameMatch || emailMatch || deptMatch;

    return roleMatch && statusMatch && textMatch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>User Management</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage all Trainees, Trainers, and Administrators in your organization.</p>
        </div>
        <button onClick={fetchUsers} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <RefreshCw size={15} /> Refresh Users
        </button>
      </div>

      {notice && (
        <div style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {notice}
        </div>
      )}

      {/* Filter and Search Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by name, email, department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
            />
          </div>

          {/* Filter Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Role Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>Role:</span>
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', fontSize: '0.85rem' }}
              >
                <option value="All">All Roles</option>
                <option value="Trainees">Trainees</option>
                <option value="Trainers">Trainers</option>
                <option value="Admins">Admins</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>Status:</span>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', fontSize: '0.85rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          Showing {filteredUsers.length} of {users.length} organization users
        </div>
      </div>

      {/* Users Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading users...
          </div>
        ) : error ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--danger)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchUsers} className="btn btn-outline">Try Again</button>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>User Info</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Department</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Date Joined</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const uid = user._id || user.id;
                  const isAdmin = user.role === 'Admin';
                  const isPendingTrainer = user.role === 'Trainer' && user.status === 'pending';

                  return (
                    <tr key={uid} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                              <Link to={`/admin/users/${uid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {user.name}
                              </Link>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Mail size={12} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge ${
                          user.role === 'Admin' ? 'badge-danger' : 
                          user.role === 'Trainer' ? 'badge-primary' : 'badge-neutral'
                        }`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}>
                          {user.role === 'Admin' && <Shield size={12} />}
                          {user.role}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                        {user.department || '-'}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ 
                          display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600,
                          ...getStatusBadgeStyle(user.status)
                        }}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          
                          {/* View link */}
                          <Link 
                            to={isPendingTrainer ? `/admin/trainer-approvals/${uid}` : `/admin/users/${uid}`} 
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Eye size={15} /> {isPendingTrainer ? 'Review' : 'View'}
                          </Link>

                          {/* Suspend or Reactivate button (non-admin only) */}
                          {!isAdmin && !isPendingTrainer && (
                            user.status === 'suspended' ? (
                              <button 
                                onClick={() => handleReactivate(user)}
                                className="btn btn-outline" 
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#166534', borderColor: '#166534', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                title="Reactivate Account"
                              >
                                <CheckCircle2 size={15} /> Reactivate
                              </button>
                            ) : (
                              <button 
                                onClick={() => { setActionError(null); setSuspendTarget(user); }}
                                className="btn btn-outline" 
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#b45309', borderColor: '#fcd34d', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                title="Suspend Account"
                              >
                                <XCircle size={15} /> Suspend
                              </button>
                            )
                          )}

                          {/* Permanent Delete button (non-admin only) */}
                          {!isAdmin && (
                            <button 
                              onClick={() => { setActionError(null); setDeleteTarget(user); }}
                              className="btn btn-outline" 
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              title="Delete Account Permanently"
                            >
                              <Trash2 size={15} /> Delete
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No users found matching your search and filter criteria.
          </div>
        )}
      </div>

      {/* --- SUSPEND CONFIRMATION MODAL --- */}
      {suspendTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={22} /> Suspend User Account
            </h3>
            
            <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Suspend <strong>{suspendTarget.name}</strong>'s account? The user will no longer be able to log in or use Capacity Connect until reactivated.
            </p>

            {actionError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setSuspendTarget(null)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: '#b45309', borderColor: '#b45309' }} onClick={handleSuspend} disabled={actionLoading}>
                {actionLoading ? 'Suspending...' : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trash2 size={22} /> Delete Account Permanently
            </h3>
            
            <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
            </p>

            <div style={{ backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.85rem', color: '#a8071a', marginBottom: '1.5rem' }}>
              This permanently removes the user's account and profile from Capacity Connect. This action cannot be undone.
            </div>

            {actionError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setDeleteTarget(null)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Delete Account Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
