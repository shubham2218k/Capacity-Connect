import { useState } from 'react';
import { Search, Filter, GraduationCap, CheckCircle, Clock } from 'lucide-react';
import { mockCourses } from '../../data/mockData';

const AdminEnrollments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Enrollments (combining users and courses)
  const [enrollments] = useState([
    { id: 'en1', user: 'Aarav Sharma', email: 'aarav@moes.gov.in', courseId: 'c1', courseName: mockCourses[0]?.title || 'Course 1', date: '2026-08-15', status: 'In Progress', progress: 65 },
    { id: 'en2', user: 'Aarav Sharma', email: 'aarav@moes.gov.in', courseId: 'c3', courseName: mockCourses[2]?.title || 'Course 3', date: '2026-08-01', status: 'Completed', progress: 100 },
    { id: 'en3', user: 'Priya Singh', email: 'priya.s@incois.gov.in', courseId: 'c1', courseName: mockCourses[0]?.title || 'Course 1', date: '2026-08-20', status: 'Completed', progress: 100 },
    { id: 'en4', user: 'Rahul Kumar', email: 'rahul.k@imd.gov.in', courseId: 'c2', courseName: mockCourses[1]?.title || 'Course 2', date: '2026-08-22', status: 'In Progress', progress: 20 }
  ]);

  const filteredEnrollments = enrollments.filter(en => 
    en.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    en.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Global Enrollments</h1>
        <p style={{ color: 'var(--text-light)' }}>Track trainee course registrations and progress across the platform.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ position: 'relative', width: '350px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by trainee name or course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filters
            </button>
            <div className="badge badge-neutral" style={{ padding: '0.6rem 1rem' }}>
              Total: {enrollments.length}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Trainee</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Course Name</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Enrollment Date</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Progress</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map(en => (
                <tr key={en.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{en.user}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{en.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GraduationCap size={16} style={{ color: 'var(--secondary)' }} />
                      <span style={{ fontWeight: 500 }}>{en.courseName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{en.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', minWidth: '100px' }}>
                        <div style={{ width: `${en.progress}%`, height: '100%', backgroundColor: en.progress === 100 ? 'var(--success)' : 'var(--primary)', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '35px' }}>{en.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {en.status === 'Completed' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: '#dcfce7', color: '#166534' }}>
                        <CheckCircle size={14} /> Completed
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                        <Clock size={14} /> In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                    No enrollments found matching your search.
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

export default AdminEnrollments;
