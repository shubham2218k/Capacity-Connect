import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, Edit, Copy, Archive, Trash2, 
  BookOpen, Users, FileText, CheckCircle 
} from 'lucide-react';
import { api } from '../../services/api';

const TrainerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/my');
      setCourses(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to load your courses.');
      setCourses([]); // Safe initialization
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['All', 'Published', 'Draft', 'Archived'];

  const filteredCourses = (courses || []).filter(course => {
    // Backend returns status as lowercase (e.g. 'published'), map tab safely
    const normalizedStatus = (course.status || '').toLowerCase();
    
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Published' && normalizedStatus === 'published') ||
                      (activeTab === 'Draft' && normalizedStatus === 'draft') ||
                      (activeTab === 'Archived' && normalizedStatus === 'archived');
    
    const title = course.title || '';
    const category = course.category || '';
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>My Courses</h1>
          <p className="text-light">Create, organize and manage your training programs.</p>
        </div>
        <Link to="/trainer/courses/create" className="btn btn-primary">
          <Plus size={18} /> Create Course
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="search-bar" style={{ width: '300px' }}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p className="text-light">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.5rem' }}>Error</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={fetchCourses} className="btn btn-primary">Try Again</button>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map(course => {
            const rawThumb = typeof course.thumbnail === 'string' ? course.thumbnail : course.thumbnail?.url;
            const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
            const thumbUrl = rawThumb ? (rawThumb.startsWith('http') ? rawThumb : `${baseUrl}${rawThumb.startsWith('/') ? '' : '/'}${rawThumb}`) : null;
            const resourceCount = course.modules ? course.modules.reduce((sum, m) => sum + (m.lessons ? m.lessons.length : 0), 0) : (course.resources?.length || course.resources || 0);

            return (
              <div key={course._id || course.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: '160px', backgroundColor: 'var(--bg-color-alt)' }}>
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={course.title || 'Course'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)' }}>
                      <BookOpen size={48} opacity={0.2} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '0.5rem' }}>
                    <span className={`badge ${(course.status || '').toLowerCase() === 'published' ? 'badge-success' : (course.status || '').toLowerCase() === 'draft' ? 'badge-warning' : 'badge-neutral'}`} style={{ textTransform: 'capitalize' }}>
                      {course.status || 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                    {course.category || 'Uncategorized'}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>
                    {course.title || 'Untitled Course'}
                  </h3>
                  
                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <BookOpen size={16} /> {course.modules?.length || 0} Modules
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <FileText size={16} /> {resourceCount} Resources
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Users size={16} /> {course.enrolledTrainees || 0} Trainees
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <CheckCircle size={16} /> {course.assessments?.length || course.assessments || 0} Quizzes
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {course.updatedAt ? `Updated ${new Date(course.updatedAt).toLocaleDateString()}` : 'Recently updated'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/trainer/courses/${course._id || course.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <BookOpen size={48} className="text-light" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No courses created yet.</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            {searchQuery ? "No courses match your search criteria." : "Create your first course to start building a training program."}
          </p>
          {!searchQuery && (
            <Link to="/trainer/courses/create" className="btn btn-primary">
              <Plus size={18} /> Create New Course
            </Link>
          )}
        </div>
      )}

    </div>
  );
};

export default TrainerCourses;
