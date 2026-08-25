import { useState } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Shield, Mail, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // Mock User Data
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Aarav Sharma', email: 'aarav@moes.gov.in', role: 'Trainee', department: 'Environmental Data Services', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'u2', name: 'Dr. Meera Nair', email: 'trainer@capacityconnect.demo', role: 'Trainer', department: 'Climate Research', status: 'Active', lastLogin: '1 day ago' },
    { id: 'u3', name: 'System Admin', email: 'admin@capacityconnect.in', role: 'Admin', department: 'Administration', status: 'Active', lastLogin: 'Just now' },
    { id: 'u4', name: 'Priya Singh', email: 'priya.s@incois.gov.in', role: 'Trainee', department: 'Ocean Observation', status: 'Inactive', lastLogin: '2 weeks ago' },
    { id: 'u5', name: 'Rahul Kumar', email: 'rahul.k@imd.gov.in', role: 'Trainee', department: 'Weather Forecasting', status: 'Active', lastLogin: '5 hours ago' }
  ]);

  const filteredUsers = users.filter(user => 
    (filterRole === 'All' || user.role === filterRole) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>User Management</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage all Trainees, Trainers, and Administrators.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ position: 'relative', width: '350px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <Filter size={16} /> Filter by Role:
            </div>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}
            >
              <option value="All">All Roles</option>
              <option value="Trainee">Trainees</option>
              <option value="Trainer">Trainers</option>
              <option value="Admin">Admins</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>User Info</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Last Login</th>
                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                            <Link to={`/admin/users/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{user.name}</Link>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${
                        user.role === 'Admin' ? 'badge-danger' : 
                        user.role === 'Trainer' ? 'badge-primary' : 'badge-neutral'
                      }`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {user.role === 'Admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{user.department}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                        backgroundColor: user.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                        color: user.status === 'Active' ? '#166534' : '#4b5563'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{user.lastLogin}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', color: 'var(--text-light)' }} title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', color: 'var(--danger)' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', color: 'var(--text-light)' }}>
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
