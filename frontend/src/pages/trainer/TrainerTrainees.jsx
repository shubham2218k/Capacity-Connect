import { useState } from 'react';
import { mockTrainerTrainees, mockCourses } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { Search, Filter, Mail, Award, CheckCircle, AlertTriangle } from 'lucide-react';

const TrainerTrainees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTrainees = mockTrainerTrainees.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Active') return matchesSearch && t.status === 'Active';
    if (activeFilter === 'Completed') return matchesSearch && t.status === 'Completed';
    if (activeFilter === 'Needs Attention') return matchesSearch && t.status === 'Needs Attention';
    return matchesSearch;
  });

  const getCourseName = (courseId) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? course.title : courseId;
  };

  const activeCount = mockTrainerTrainees.filter(t => t.status === 'Active').length;
  const completedCount = mockTrainerTrainees.filter(t => t.status === 'Completed').length;
  const attentionCount = mockTrainerTrainees.filter(t => t.status === 'Needs Attention').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainees</h1>
        <p style={{ color: 'var(--text-light)' }}>Monitor progress and performance of trainees enrolled in your courses.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{mockTrainerTrainees.length}</span>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total Enrolled</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '50%' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeCount}</span>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Learners</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completedCount}</span>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Completed</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '50%' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{attentionCount}</span>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Needs Attention</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Active', 'Completed', 'Needs Attention'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: `1px solid ${activeFilter === filter ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: activeFilter === filter ? 'var(--primary-light)' : 'var(--white)',
                  color: activeFilter === filter ? 'var(--primary)' : 'var(--text-light)',
                  fontWeight: activeFilter === filter ? 600 : 500,
                  cursor: 'pointer'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="search-bar" style={{ width: '250px' }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search trainees..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Trainee Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Enrolled Course</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Course Progress</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Assessment Avg</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainees.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.designation} • {t.department}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    {getCourseName(t.enrolledCourse)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', width: '80px' }}>
                        <div style={{ width: `${t.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                    {t.assessmentAverage ? `${t.assessmentAverage}%` : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'Needs Attention' ? 'badge-danger' : 'badge-primary'}`}>
                      {t.status === 'Needs Attention' && <AlertTriangle size={12} style={{ marginRight: '4px' }}/>}
                      {t.status === 'Completed' && <CheckCircle size={12} style={{ marginRight: '4px' }}/>}
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }} title="Message">
                        <Mail size={16} />
                      </button>
                      <Link to={`/trainer/trainees/${t.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                        Profile
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTrainees.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    No trainees found matching your criteria.
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

export default TrainerTrainees;
