import { BookOpen, Search, Filter, Eye, Settings, PauseCircle } from 'lucide-react';
import { useState } from 'react';
import { mockCourses } from '../../data/mockData';

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Course Catalog</h1>
          <p style={{ color: 'var(--text-light)' }}>Monitor and manage all courses across the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Advanced Filters
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search courses by title or trainer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>
          <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Showing {filteredCourses.length} courses
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Course Details</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Trainer</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Modules</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{course.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>ID: {course.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.95rem' }}>{course.trainer}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-neutral">{course.category}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{course.modules.length}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                      backgroundColor: '#dcfce7', color: '#166534'
                    }}>
                      Published
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--secondary)' }} title="Preview">
                        <Eye size={18} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--warning)' }} title="Suspend">
                        <PauseCircle size={18} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--text-light)' }} title="Manage">
                        <Settings size={18} />
                      </button>
                    </div>
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

export default AdminCourses;
