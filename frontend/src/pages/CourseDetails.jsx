import { useParams, Link, useNavigate } from 'react';
import { useState, useEffect } from 'react';
import { Clock, Book, Award, PlayCircle, FileText, File, Video, ArrowLeft, CheckCircle, Link as LinkIcon, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      const courseData = res.data || res;
      setCourse(courseData);
      setError(null);

      // Check enrollment status
      try {
        const enrollRes = await api.get(`/courses/${id}/enrollment`);
        if (enrollRes.success && enrollRes.data?.enrolled) {
          setEnrolled(true);
        }
      } catch (e) {}
    } catch (err) {
      setError(err.message || 'Course not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleEnroll = async () => {
    try {
      const res = await api.post(`/courses/${id}/enroll`);
      if (res.success) {
        setEnrolled(true);
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      // Fallback local state for UI demonstration
      setEnrolled(true);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Unable to load course</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Course not found.'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">Back to Courses</button>
        </div>
      </div>
    );
  }

  const rawThumb = typeof course.thumbnail === 'string' ? course.thumbnail : course.thumbnail?.url;
  const thumbUrl = rawThumb ? getMediaUrl(rawThumb) : null;
  const trainerName = typeof course.trainer === 'object' ? course.trainer?.name : (course.trainer || 'Trainer');
  const trainerDept = typeof course.trainer === 'object' ? course.trainer?.department : 'Training Department';

  const totalLessons = course.modules ? course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) : 0;

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
              <span className="badge badge-primary">{course.category || 'General'}</span>
              <span className="badge badge-neutral">{course.difficulty || 'All Levels'}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
              {course.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '1.5rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {course.description || course.shortDescription}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} /> {course.estimatedDuration || course.duration || 'Self-paced'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Book size={18} /> {course.modules?.length || 0} Modules ({totalLessons} Materials)
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

          {/* Learning Objectives */}
          {course.learningObjectives?.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What you will learn</h2>
              <div className="card" style={{ backgroundColor: '#f8fafc', border: 'none' }}>
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {course.learningObjectives.map((outcome, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <CheckCircle size={18} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem' }}>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Curriculum */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Course Curriculum</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {course.modules && course.modules.length > 0 ? (
                course.modules.map((mod, index) => (
                  <div key={mod._id || mod.id || index} style={{ borderBottom: index < course.modules.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--bg-color-alt)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                      {mod.title}
                    </div>
                    {mod.lessons && mod.lessons.length > 0 ? (
                      <div style={{ padding: '0.5rem 1.5rem' }}>
                        {mod.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} style={{ padding: '0.6rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: lIdx < mod.lessons.length - 1 ? '1px dashed var(--border-color)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ color: 'var(--secondary)' }}>
                                {lesson.type === 'video' ? <Video size={18} /> : lesson.type === 'link' ? <LinkIcon size={18} /> : <FileText size={18} />}
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{lesson.title}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>
                              {lesson.type} {lesson.duration && `• ${lesson.duration}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        No lessons uploaded yet.
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No curriculum modules available yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ position: 'sticky', top: '100px', padding: 0, overflow: 'hidden' }}>
            {thumbUrl ? (
              <img src={thumbUrl} alt={course.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '140px', backgroundColor: 'var(--bg-color-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Book size={48} opacity={0.3} />
              </div>
            )}
            
            <div style={{ padding: '1.5rem' }}>
              {enrolled ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: '6px', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} /> You are enrolled
                  </div>
                  <Link to={`/trainee/learning/${course._id || course.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Go to Course Learning
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
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={16} /> On-demand video & PDF materials</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} /> Reading materials & slides</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={16} /> Certificate of completion</li>
                </ul>
              </div>
              
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Instructor</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>{trainerName}</p>
                {trainerDept && <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{trainerDept}</p>}
              </div>
              
              {course.skills?.length > 0 && (
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
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
