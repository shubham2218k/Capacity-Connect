import { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { Search, Filter } from 'lucide-react';
import { api } from '../services/api';

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExploreCourses();
  }, []);

  const fetchExploreCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load courses.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All', 
    'Earth Sciences', 
    'Meteorology', 
    'Oceanography', 
    'Seismology', 
    'Data Analytics', 
    'GIS & Remote Sensing'
  ];

  const filteredCourses = (courses || []).filter(course => {
    const title = course.title || '';
    const desc = course.description || course.shortDescription || '';
    const cat = course.category || course.subject || '';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || cat.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Explore Courses</h1>
        <p className="text-light" style={{ fontSize: '1.05rem' }}>Discover training programs published for your organization.</p>
      </div>

      <div className="card" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 2rem' }}>
        
        {/* Search Bar */}
        <div className="search-bar" style={{ width: '100%', maxWidth: '600px' }}>
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search for courses, skills, or subjects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
            <Filter size={16} /> Filter by Category
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '24px',
                  border: `1px solid ${activeCategory === category ? 'var(--secondary)' : 'var(--border-color)'}`,
                  backgroundColor: activeCategory === category ? 'var(--secondary-bg)' : 'var(--white)',
                  color: activeCategory === category ? 'var(--secondary-hover)' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p className="text-light">Loading published courses...</p>
          </div>
        ) : error ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchExploreCourses} className="btn btn-primary">Try Again</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </h2>
            
            {filteredCourses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredCourses.map(course => (
                  <CourseCard key={course._id || course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px dashed var(--border-color)' }}>
                <div style={{ backgroundColor: 'var(--bg-color-alt)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Search size={40} style={{ color: 'var(--text-light)' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>No published courses found</h3>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>
                  {searchTerm || activeCategory !== 'All' ? 'Try adjusting your search filters.' : 'There are currently no published courses for your organization.'}
                </p>
                {(searchTerm || activeCategory !== 'All') && (
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                    className="btn btn-outline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default ExploreCourses;
