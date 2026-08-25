import { useState } from 'react';
import { Search, Award, Download, Eye } from 'lucide-react';

const AdminCertifications = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Certificates
  const [certificates] = useState([
    { id: 'CERT-2026-001', user: 'Priya Singh', course: 'Fundamentals of Remote Sensing', issuedBy: 'Dr. Meera Nair', date: '2026-08-21' },
    { id: 'CERT-2026-002', user: 'Aarav Sharma', course: 'Advanced GIS Mapping', issuedBy: 'Dr. Rajesh Kumar', date: '2026-08-23' }
  ]);

  const filtered = certificates.filter(c => 
    c.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Global Certifications</h1>
        <p style={{ color: 'var(--text-light)' }}>Track and verify all certificates issued by the platform.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by Trainee or Certificate ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Certificate ID</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Trainee</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Issued By</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Issue Date</th>
                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cert => (
                <tr key={cert.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={16} /> {cert.id}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-dark)' }}>{cert.user}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{cert.course}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{cert.issuedBy}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{cert.date}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--secondary)' }} title="View">
                        <Eye size={18} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--primary)' }} title="Download PDF">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                    No certificates found.
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

export default AdminCertifications;
