import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockCourses } from '../data/mockData';
import { Clock, Book, Award, PlayCircle, FileText, File, Video, ArrowLeft, CheckCircle } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const found = mockCourses.find(c => c.id === id);
    if (found) {
      setCourse(found);
    }
    // Check local storage for mock enrollment state
    const enrollments = JSON.parse(localStorage.getItem('mockEnrollments') || '[]');
    if (enrollments.includes(id)) {
      setEnrolled(true);
    }
  }, [id]);

  const handleEnroll = () => {
    // Mock enrollment persistence
    const enrollments = JSON.parse(localStorage.getItem('mockEnrollments') || '[]');
    if (!enrollments.includes(id)) {
      enrollments.push(id);
      localStorage.setItem('mockEnrollments', JSON.stringify(enrollments));
    }
    setEnrolled(true);
  };

  if (!course) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading course details...</div>;
  }

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.875rem' }}
      >
        <ArrowLeft size={16} /> Back to Courses
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Content */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Info */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{course.subject}</span>
              <span className="badge badge-neutral">{course.level}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
              {course.title}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {course.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} /> {course.duration}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Book size={18} /> {course.modulesCount} Modules
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

          {/* Learning Outcomes */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What you will learn</h2>
            <div className="card" style={{ backgroundColor: '#f8fafc', border: 'none' }}>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {course.learningOutcomes.map((outcome, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle size={18} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem' }}>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Curriculum */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Course Curriculum</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {course.modules.map((mod, index) => (
                <div key={mod.id} style={{ padding: '1rem 1.5rem', borderBottom: index < course.modules.length - 1 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: 'var(--secondary)' }}>
                      {mod.type === 'video' && <Video size={20} />}
                      {mod.type === 'document' && <FileText size={20} />}
                      {mod.type === 'presentation' && <PlayCircle size={20} />}
                      {mod.type === 'pdf' && <File size={20} />}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 500, fontSize: '0.95rem' }}>{mod.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>{mod.type}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{mod.duration}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ position: 'sticky', top: '100px', padding: 0, overflow: 'hidden' }}>
            <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            
            <div style={{ padding: '1.5rem' }}>
              {enrolled ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: '6px', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} /> You are enrolled
                  </div>
                  <Link to={`/trainee/learning/${course.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Go to Course
                  </Link>
                </div>
              ) : (
                <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem' }}>
                  Enroll in Course
                </button>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>This course includes:</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={16} /> On-demand videos</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} /> Reading materials</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={16} /> Certificate of completion</li>
                </ul>
              </div>
              
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Instructor</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>{course.trainer}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>MoES Training Department</p>
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Skills Covered</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {course.skills.map(skill => (
                    <span key={skill} style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-dark)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
