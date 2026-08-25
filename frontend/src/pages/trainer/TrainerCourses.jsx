import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, Edit, Copy, Archive, Trash2, 
  BookOpen, Users, FileText, CheckCircle 
} from 'lucide-react';
import { mockTrainerCourses } from '../../data/mockData';

const TrainerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Try to load from localStorage first (for courses created in session)
    const localCourses = JSON.parse(localStorage.getItem('trainer_mock_courses'));
    if (localCourses && localCourses.length > 0) {
      setCourses(localCourses);
    } else {
      setCourses(mockTrainerCourses);
    }
  }, []);

  const tabs = ['All', 'Published', 'Draft', 'Archived'];

  const filteredCourses = courses.filter(course => {
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Published' && course.status === 'Published') ||
                      (activeTab === 'Draft' && course.status === 'Draft') ||
                      (activeTab === 'Archived' && course.status === 'Archived');
    
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
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
      {filteredCourses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map(course => (
            <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Thumbnail */}
              <div style={{ position: 'relative', height: '160px', backgroundColor: 'var(--bg-color-alt)' }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)' }}>
                    <BookOpen size={48} opacity={0.2} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${course.status === 'Published' ? 'badge-success' : course.status === 'Draft' ? 'badge-warning' : 'badge-neutral'}`}>
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  {course.category}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>
                  {course.title}
                </h3>
                
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <BookOpen size={16} /> {course.modules || 0} Modules
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <FileText size={16} /> {course.resources || 0} Resources
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Users size={16} /> {course.enrolledTrainees || 0} Trainees
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <CheckCircle size={16} /> {course.assessments || 0} Quizzes
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Updated {course.lastUpdated}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/trainer/courses/${course.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                      Manage
                    </Link>
                    <div style={{ position: 'relative' }} className="menu-container">
                      <button className="btn btn-ghost" style={{ padding: '0.4rem' }}>
                        <MoreVertical size={18} />
                      </button>
                      {/* Dropdown would go here in full implementation */}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <BookOpen size={48} className="text-light" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            {searchQuery ? "No courses match your search criteria." : "You haven't created any courses yet."}
          </p>
          {!searchQuery && (
            <Link to="/trainer/courses/create" className="btn btn-primary">
              <Plus size={18} /> Create Your First Course
            </Link>
          )}
        </div>
      )}

    </div>
  );
};

export default TrainerCourses;
