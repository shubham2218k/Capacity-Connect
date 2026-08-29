import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Video, FileText, PlayCircle, File, CheckCircle, ArrowLeft, MessageSquare, ExternalLink, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const idOf = (item) => item?._id || item?.id;

const LearningPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/courses/${id}`);
      if (res?.data) {
        setCourse(res.data);
        const progressData = JSON.parse(localStorage.getItem(`courseProgress_${id}`) || '[]');
        setCompletedLessons(progressData);
      } else {
        setError('Course details not found.');
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
      setError(err.message || 'Course details unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading course content...</div>;
  }

  if (error || !course) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/trainee/library" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-light)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Library
        </Link>
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={44} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Unavailable</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>{error || 'Course not found.'}</p>
          <button onClick={() => navigate('/trainee/library')} className="btn btn-primary">Return to Library</button>
        </div>
      </div>
    );
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];
  const currentModule = modules[currentModuleIndex] || null;
  const lessons = currentModule && Array.isArray(currentModule.lessons) ? currentModule.lessons : [];
  const currentLesson = lessons[currentLessonIndex] || null;

  const totalLessons = modules.reduce((acc, m) => acc + (Array.isArray(m.lessons) ? m.lessons.length : 0), 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const isCurrentCompleted = currentLesson ? completedLessons.includes(idOf(currentLesson)) : false;

  const toggleLessonComplete = () => {
    if (!currentLesson) return;
    const lid = idOf(currentLesson);
    let updated;
    if (isCurrentCompleted) {
      updated = completedLessons.filter(i => i !== lid);
    } else {
      updated = [...completedLessons, lid];
    }
    setCompletedLessons(updated);
    localStorage.setItem(`courseProgress_${id}`, JSON.stringify(updated));
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    alert('Thank you! Your feedback has been submitted.');
    setShowFeedbackModal(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/trainee/library" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Library
          </Link>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
              {course.title}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Category: {course.category || 'General'} • Trainer: {typeof course.trainer === 'object' ? course.trainer?.name : 'Organization Trainer'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Overall Progress</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary-hover)' }}>{progressPercent}%</div>
          </div>
          <button onClick={() => setShowFeedbackModal(true)} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <MessageSquare size={16} /> Feedback
          </button>
        </div>
      </div>

      {/* Main Grid: Player on Left, Module Sidebar on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column - Lesson Content Player */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {currentLesson ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                    Module {currentModuleIndex + 1}: {currentModule?.title}
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                    Lesson {currentLessonIndex + 1}: {currentLesson.title}
                  </h2>
                </div>
                <button 
                  onClick={toggleLessonComplete} 
                  className={`btn ${isCurrentCompleted ? 'btn-success' : 'btn-outline'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <CheckCircle size={16} /> {isCurrentCompleted ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>

              {currentLesson.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {currentLesson.description}
                </p>
              )}

              {/* Lesson Resource Media Box */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                {currentLesson.type === 'link' ? (
                  <div>
                    <ExternalLink size={40} style={{ color: 'var(--secondary)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>External Web Resource</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
                      This lesson points to external learning documentation or material.
                    </p>
                    <a href={currentLesson.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      Open Learning Material <ExternalLink size={16} />
                    </a>
                  </div>
                ) : currentLesson.fileUrl ? (
                  <div>
                    <FileText size={40} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {currentLesson.originalFilename || `${currentLesson.type.toUpperCase()} File`}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
                      Uploaded Material • Type: {currentLesson.type.toUpperCase()}
                    </p>
                    <a href={currentLesson.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      View / Download Resource
                    </a>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-light)', margin: 0 }}>No media link or file attached to this lesson.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
              Select a lesson from the module outline on the right.
            </div>
          )}
        </div>

        {/* Right Column - Modules & Lessons Navigation Sidebar */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Course Modules ({modules.length})
          </h3>

          {modules.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No modules added to this course yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {modules.map((mod, mIdx) => (
                <div key={idOf(mod) || mIdx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: mIdx === currentModuleIndex ? 'var(--secondary-bg)' : 'var(--bg-color)', padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.9rem', color: mIdx === currentModuleIndex ? 'var(--secondary-hover)' : 'var(--text-dark)' }}>
                    Module {mIdx + 1}: {mod.title}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {Array.isArray(mod.lessons) && mod.lessons.map((les, lIdx) => {
                      const lid = idOf(les);
                      const isSelected = mIdx === currentModuleIndex && lIdx === currentLessonIndex;
                      const isDone = completedLessons.includes(lid);

                      return (
                        <button
                          key={lid || lIdx}
                          onClick={() => { setCurrentModuleIndex(mIdx); setCurrentLessonIndex(lIdx); }}
                          style={{
                            padding: '0.65rem 1rem 0.65rem 1.5rem',
                            border: 'none',
                            borderTop: '1px solid var(--border-color)',
                            backgroundColor: isSelected ? '#f0f9ff' : 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            color: isSelected ? 'var(--secondary-hover)' : 'var(--text-dark)',
                            fontWeight: isSelected ? 600 : 400
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            {les.type === 'link' ? <PlayCircle size={14} /> : <FileText size={14} />}
                            {les.title}
                          </span>
                          {isDone && <CheckCircle size={14} style={{ color: 'var(--success)' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
              Course Feedback
            </h3>
            <form onSubmit={submitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Your Rating (1 - 5 Stars)</label>
                <select value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })} required>
                  <option value="">Select rating...</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="input-group">
                <label>Comments / Feedback</label>
                <textarea value={feedback.comment} onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })} placeholder="Share your learning experience..." style={{ minHeight: '100px' }} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowFeedbackModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningPlayer;
