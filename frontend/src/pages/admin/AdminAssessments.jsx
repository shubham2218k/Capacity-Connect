import { useState } from 'react';
import { Search, PenTool, CheckCircle, XCircle } from 'lucide-react';

const AdminAssessments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock global assessments results
  const [assessments] = useState([
    { id: 'as1', user: 'Aarav Sharma', course: 'Fundamentals of Remote Sensing', title: 'Module 1 Quiz', score: 85, passingScore: 70, date: '2026-08-20', status: 'Passed' },
    { id: 'as2', user: 'Priya Singh', course: 'Fundamentals of Remote Sensing', title: 'Final Assessment', score: 92, passingScore: 70, date: '2026-08-21', status: 'Passed' },
    { id: 'as3', user: 'Rahul Kumar', course: 'Climate Change Adaptation', title: 'Module 2 Quiz', score: 65, passingScore: 70, date: '2026-08-22', status: 'Failed' },
    { id: 'as4', user: 'Aarav Sharma', course: 'Advanced GIS Mapping', title: 'Module 1 Quiz', score: 100, passingScore: 75, date: '2026-08-23', status: 'Passed' }
  ]);

  const filtered = assessments.filter(a => 
    a.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Global Assessments</h1>
        <p style={{ color: 'var(--text-light)' }}>Monitor platform-wide assessment scores and pass rates.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by trainee or course..." 
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
                <th style={{ padding: '1rem', fontWeight: 600 }}>Trainee</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Assessment</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Score</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-dark)' }}>{a.user}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <PenTool size={16} style={{ color: 'var(--secondary)' }} />
                      <span>{a.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>{a.course}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: 600, color: a.score >= a.passingScore ? 'var(--success)' : 'var(--danger)' }}>
                      {a.score}%
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '0.25rem' }}>(Req: {a.passingScore}%)</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{a.date}</td>
                  <td style={{ padding: '1rem' }}>
                    {a.status === 'Passed' ? (
                      <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.85rem' }}>
                        <CheckCircle size={16} /> Passed
                      </span>
                    ) : (
                      <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.85rem' }}>
                        <XCircle size={16} /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAssessments;
