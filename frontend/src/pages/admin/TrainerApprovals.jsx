import { useState } from 'react';
import { Search, UserCheck, XCircle, Eye, Shield } from 'lucide-react';

const TrainerApprovals = () => {
  // Mock pending trainer applications
  const [applications, setApplications] = useState([
    {
      id: 'app1',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.k@moes.gov.in',
      department: 'Oceanography',
      expertise: 'Marine Biology, Data Analysis',
      status: 'Pending',
      date: '2026-08-20'
    },
    {
      id: 'app2',
      name: 'Sneha Patel',
      email: 'sneha.patel@external.org',
      department: 'Meteorology',
      expertise: 'Weather Forecasting, Climate Modeling',
      status: 'Pending',
      date: '2026-08-22'
    },
    {
      id: 'app3',
      name: 'Vikram Singh',
      email: 'vikram.s@niot.res.in',
      department: 'Technology',
      expertise: 'Remote Sensing, GIS',
      status: 'Pending',
      date: '2026-08-24'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    // In a real app, API call to approve and create Trainer user
  };

  const handleReject = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    // In a real app, API call to reject application
  };

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainer Approvals</h1>
        <p style={{ color: 'var(--text-light)' }}>Review and approve new trainer applications for the platform.</p>
      </div>

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

        {filteredApps.length > 0 ? (
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
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{app.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{app.department}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.expertise}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{app.date}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--secondary)' }} title="View Details">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleApprove(app.id)} className="btn btn-primary" style={{ padding: '0.4rem', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }} title="Approve">
                          <UserCheck size={18} />
                        </button>
                        <button onClick={() => handleReject(app.id)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} title="Reject">
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
    </div>
  );
};

export default TrainerApprovals;
