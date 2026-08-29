import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Shield, Mail, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

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
                {filteredUsers.map(user => (
                  <tr key={user.id || user._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                            <Link to={`/admin/users/${user.id || user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                      <Link to={`/admin/users/${user.id || user._id}`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Eye size={15} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No users found matching your search and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
