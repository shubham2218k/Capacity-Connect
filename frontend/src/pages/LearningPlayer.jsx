import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockCourses } from '../data/mockData';
import { Video, FileText, PlayCircle, File, CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react';

const LearningPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    const found = mockCourses.find(c => c.id === id);
    if (found) {
      setCourse(found);
      
      // Load progress
      const progressData = JSON.parse(localStorage.getItem(`courseProgress_${id}`) || '[]');
      setCompletedModules(progressData);
    } else {
      navigate('/trainee/learning');
    }
  }, [id, navigate]);

  if (!course) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const currentModule = course.modules[currentModuleIndex];
  const isCompleted = completedModules.includes(currentModule.id);
  const progressPercent = Math.round((completedModules.length / course.modules.length) * 100);

  const toggleComplete = () => {
    let newCompleted;
    if (isCompleted) {
      newCompleted = completedModules.filter(mId => mId !== currentModule.id);
    } else {
      newCompleted = [...completedModules, currentModule.id];
    }
    setCompletedModules(newCompleted);
    localStorage.setItem(`courseProgress_${id}`, JSON.stringify(newCompleted));
  };

  const handleNext = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    alert('Thank you! Your feedback has been submitted.');
    setShowFeedbackModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/trainee/learning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to My Learning
        </Link>
        <button 
          onClick={() => setShowFeedbackModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          <MessageSquare size={16} /> Provide Feedback
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* Player Area */}
        <div style={{ flex: 3, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: 'var(--primary)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' }}>
            {/* Mock Player Content based on type */}
            {currentModule.type === 'video' && <PlayCircle size={64} style={{ opacity: 0.8 }} />}
            {currentModule.type === 'document' && <FileText size={64} style={{ opacity: 0.8 }} />}
            {currentModule.type === 'presentation' && <Video size={64} style={{ opacity: 0.8 }} />}
            {currentModule.type === 'pdf' && <File size={64} style={{ opacity: 0.8 }} />}
            
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{currentModule.title}</h2>
              <p style={{ opacity: 0.8 }}>Previewing {currentModule.type} content</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentModule.title}</h2>
            <button 
              onClick={toggleComplete}
              className={isCompleted ? "btn btn-outline" : "btn btn-primary"}
              style={{ padding: '0.5rem 1rem' }}
            >
              {isCompleted ? (
                <><CheckCircle size={18} /> Completed</>
              ) : (
                'Mark as Complete'
              )}
            </button>
          </div>
          
          <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <p>This is a placeholder for the actual learning content which would be rendered here depending on the resource type. Trainers would upload these resources through the Trainer Portal.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button 
              onClick={handlePrev} 
              disabled={currentModuleIndex === 0}
              className="btn btn-outline"
              style={{ opacity: currentModuleIndex === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentModuleIndex === course.modules.length - 1}
              className="btn btn-primary"
              style={{ opacity: currentModuleIndex === course.modules.length - 1 ? 0.5 : 1 }}
            >
              Next Lesson
            </button>
          </div>
        </div>

        {/* Course Modules Sidebar */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Content</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '6px', borderRadius: '3px' }}>
                  <div style={{ width: `${progressPercent}%`, backgroundColor: 'var(--secondary)', height: '100%', borderRadius: '3px' }}></div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{progressPercent}%</span>
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {course.modules.map((mod, index) => {
                const isModCompleted = completedModules.includes(mod.id);
                const isActive = index === currentModuleIndex;

                return (
                  <div 
                    key={mod.id} 
                    onClick={() => setCurrentModuleIndex(index)}
                    style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex', 
                      gap: '1rem',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#e0f2fe' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ color: isModCompleted ? 'var(--success)' : 'var(--text-light)', marginTop: '2px' }}>
                      {isModCompleted ? <CheckCircle size={20} /> : (
                        mod.type === 'video' ? <Video size={20} /> :
                        mod.type === 'document' ? <FileText size={20} /> :
                        mod.type === 'presentation' ? <PlayCircle size={20} /> :
                        <File size={20} />
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem', color: isActive ? 'var(--primary)' : 'var(--text-dark)', marginBottom: '0.25rem' }}>
                        {index + 1}. {mod.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{mod.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Course Feedback</h2>
            <form onSubmit={submitFeedback}>
              <div className="input-group">
                <label>Overall Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} type="button" 
                      onClick={() => setFeedback({...feedback, rating: star})}
                      style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: feedback.rating >= star ? '#f59e0b' : 'var(--border-color)' }}
                    >★</button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label>Additional Comments</label>
                <textarea 
                  rows="4" 
                  value={feedback.comment} 
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                  placeholder="How can we improve this course?"
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={feedback.rating === 0}>Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningPlayer;
