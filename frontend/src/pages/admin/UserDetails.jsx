import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Building, MapPin } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Users
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>User Profile: {id}</h1>
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-color-alt)', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
            U
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Detailed View Placeholder</h2>
            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Active User
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} style={{ color: 'var(--text-light)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Email</div>
                  <div style={{ fontWeight: 500 }}>user@capacityconnect.demo</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building size={18} style={{ color: 'var(--text-light)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Department</div>
                  <div style={{ fontWeight: 500 }}>General</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Admin Actions</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary">Edit User Details</button>
            <button className="btn btn-outline" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>Suspend Account</button>
            <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete User</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
