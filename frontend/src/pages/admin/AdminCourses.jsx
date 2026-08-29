import { BookOpen, Search, Filter, Eye, Archive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminCourses();
  }, []);

  const fetchAdminCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses');
      setCourses(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load courses.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (courseId) => {
    if (!window.confirm('Are you sure you want to archive this course?')) return;
    try {
      await api.patch(`/courses/${courseId}/archive`);
      fetchAdminCourses();
    } catch (err) {
      alert(err.message || 'Failed to archive course');
    }
  };

  const filteredCourses = (courses || []).filter(course => {
    const title = course.title || '';
    const trainerName = typeof course.trainer === 'object' ? course.trainer?.name : (course.trainer || '');
    const query = searchTerm.toLowerCase();
    return title.toLowerCase().includes(query) || trainerName.toLowerCase().includes(query);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Organization Course Catalog</h1>
          <p style={{ color: 'var(--text-light)' }}>Monitor all training courses created across your organization.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading courses...
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
            {error}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Course Details</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Trainer</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Modules</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(course => {
                  const courseId = course._id || course.id;
                  const trainerName = typeof course.trainer === 'object' ? course.trainer?.name : (course.trainer || 'Trainer');
                  const status = (course.status || 'draft').toLowerCase();

                  return (
                    <tr key={courseId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{course.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{course.shortDescription?.substring(0, 60)}...</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>{trainerName}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-neutral">{course.category || 'General'}</span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{course.modules?.length || 0}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${status === 'published' ? 'badge-success' : status === 'draft' ? 'badge-warning' : 'badge-neutral'}`} style={{ textTransform: 'capitalize' }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link to={`/admin/courses/${courseId}`} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.85rem' }} title="Preview Course">
                            <Eye size={16} /> Preview
                          </Link>
                          {status !== 'archived' && (
                            <button onClick={() => handleArchive(courseId)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', color: 'var(--warning)' }} title="Archive Course">
                              <Archive size={16} />
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
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No courses found for your organization catalog.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
