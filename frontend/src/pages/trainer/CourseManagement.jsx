import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Clock, BookOpen, Users, PlayCircle, 
  FileText, Plus, MoreVertical, Edit2, Trash2, GripVertical,
  Upload, File, Video, ChevronUp, ChevronDown, PenTool, X
} from 'lucide-react';
import { mockTrainerCourses, mockAssessments } from '../../data/mockData';

const CourseManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Curriculum State
  const [modules, setModules] = useState([
    { id: 1, title: 'Module 1: Introduction', lessons: [
      { id: 101, title: 'Introduction Lecture', type: 'video', duration: '18 min', size: '' },
      { id: 102, title: 'Course Overview Notes', type: 'pdf', duration: '', size: '2.4 MB' }
    ]},
  ]);
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [uploadData, setUploadData] = useState({ title: '', type: 'video', file: null });

  useEffect(() => {
    // Load from local storage or mock data
    const localCourses = JSON.parse(localStorage.getItem('trainer_mock_courses'));
    let foundCourse = null;
    
    if (localCourses) {
      foundCourse = localCourses.find(c => c.id === id);
    }
    if (!foundCourse) {
      foundCourse = mockTrainerCourses.find(c => c.id === id);
    }
    
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [id]);

  const tabs = ['Overview', 'Curriculum', 'Resources', 'Assessments', 'Trainees', 'Feedback'];

  const handlePublish = () => {
    if(course) {
      const updatedCourse = { ...course, status: 'Published' };
      setCourse(updatedCourse);
      
      // Save locally
      const localCourses = JSON.parse(localStorage.getItem('trainer_mock_courses')) || mockTrainerCourses;
      const updatedCourses = localCourses.map(c => c.id === id ? updatedCourse : c);
      localStorage.setItem('trainer_mock_courses', JSON.stringify(updatedCourses));

      // Trigger mock notification for trainees
      const localNotifs = JSON.parse(localStorage.getItem('cc_mock_notifications') || '[]');
      localNotifs.unshift({
        id: `n_${Date.now()}`,
        type: 'course_published',
        title: 'New Course Published',
        message: `${course.title} has been updated and is now live.`,
        date: 'Just now',
        read: false
      });
      localStorage.setItem('cc_mock_notifications', JSON.stringify(localNotifs));
      window.dispatchEvent(new Event('new_notification'));
    }
  };

  // --- Curriculum Builders Actions ---
  const addModule = () => {
    const newId = Date.now();
    setModules([...modules, { id: newId, title: `Module ${modules.length + 1}: New Module`, lessons: [] }]);
  };

  const removeModule = (modId) => {
    setModules(modules.filter(m => m.id !== modId));
  };

  const moveModule = (index, direction) => {
    const newModules = [...modules];
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < modules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    }
    setModules(newModules);
  };

  const openUploadModal = (modId) => {
    setCurrentModuleId(modId);
    setUploadData({ title: '', type: 'video', file: null });
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.title) return;
    
    const newLesson = {
      id: Date.now(),
      title: uploadData.title,
      type: uploadData.type,
      duration: uploadData.type === 'video' ? '15 min' : '',
      size: uploadData.type !== 'video' ? '3.2 MB' : ''
    };

    setModules(modules.map(mod => {
      if (mod.id === currentModuleId) {
        return { ...mod, lessons: [...mod.lessons, newLesson] };
      }
      return mod;
    }));

    // Trigger mock notification for trainees
    const localNotifs = JSON.parse(localStorage.getItem('cc_mock_notifications') || '[]');
    localNotifs.unshift({
      id: `n_${Date.now()}`,
      type: 'resource_added',
      title: 'New Learning Material',
      message: `A new material "${uploadData.title}" was added to ${course?.title}.`,
      date: 'Just now',
      read: false
    });
    localStorage.setItem('cc_mock_notifications', JSON.stringify(localNotifs));
    window.dispatchEvent(new Event('new_notification'));

    setShowUploadModal(false);
  };

  const removeLesson = (modId, lessonId) => {
    setModules(modules.map(mod => {
      if (mod.id === modId) {
        return { ...mod, lessons: mod.lessons.filter(l => l.id !== lessonId) };
      }
      return mod;
    }));
  };

  if (!course) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading course details...</div>;
  }

  // Related Assessments
  const courseAssessments = mockAssessments.filter(a => a.courseId === course.id);
  const localAssessments = JSON.parse(localStorage.getItem('trainer_mock_assessments')) || [];
  const allAssessments = [...localAssessments, ...courseAssessments].filter(a => a.courseId === course.id);

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      
      {/* Breadcrumb & Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/trainer/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to My Courses
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{course.title}</h1>
              <span className={`badge ${course.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>
                {course.status}
              </span>
            </div>
            <p className="text-light" style={{ maxWidth: '600px' }}>{course.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary"><Edit2 size={16} /> Edit Details</button>
            {course.status === 'Draft' && (
              <button onClick={handlePublish} className="btn btn-primary"><CheckCircle size={16} /> Publish Course</button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--secondary)' : 'transparent'}`,
              color: activeTab === tab ? 'var(--secondary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '400px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>About Course</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {course.detailedDescription || 'No detailed description provided yet.'}
                </p>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Learning Objectives</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                  {course.objectives?.map((obj, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{obj}</li>
                  )) || <li>No objectives defined.</li>}
                </ul>
              </div>
            </div>
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Course Info</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Category:</span>
                    <span style={{ fontWeight: 500 }}>{course.category}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Difficulty:</span>
                    <span style={{ fontWeight: 500 }}>{course.difficulty}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Duration:</span>
                    <span style={{ fontWeight: 500 }}>{course.duration}</span>
                  </li>
                </ul>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {course.skills?.map(skill => (
                    <span key={skill} className="badge badge-neutral">{skill}</span>
                  )) || <span className="text-muted">No skills defined.</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CURRICULUM TAB (MODULE BUILDER) */}
        {activeTab === 'Curriculum' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Course Curriculum</h2>
              <button onClick={addModule} className="btn btn-primary"><Plus size={16} /> Add Module</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {modules.map((mod, index) => (
                <div key={mod.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  
                  {/* Module Header */}
                  <div style={{ 
                    padding: '1rem 1.5rem', 
                    backgroundColor: 'var(--bg-color-alt)', 
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'pointer', color: 'var(--text-light)' }}>
                        <button onClick={() => moveModule(index, 'up')} disabled={index === 0} style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: 'inherit' }}><ChevronUp size={16} /></button>
                        <button onClick={() => moveModule(index, 'down')} disabled={index === modules.length - 1} style={{ border: 'none', background: 'none', cursor: index === modules.length - 1 ? 'not-allowed' : 'pointer', color: 'inherit' }}><ChevronDown size={16} /></button>
                      </div>
                      <input 
                        type="text" 
                        value={mod.title} 
                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m))}
                        style={{ fontSize: '1.1rem', fontWeight: 600, border: '1px solid transparent', backgroundColor: 'transparent', padding: '0.25rem 0.5rem', flex: 1, borderRadius: '4px', outline: 'none' }}
                        onFocus={(e) => e.target.style.backgroundColor = 'var(--white)'}
                        onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                      />
                    </div>
                    <div>
                      <button onClick={() => removeModule(mod.id)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Module Lessons */}
                  <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mod.lessons.length > 0 ? mod.lessons.map(lesson => (
                      <div key={lesson.id} style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px',
                        backgroundColor: 'var(--white)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <GripVertical size={16} className="text-light" style={{ cursor: 'grab' }} />
                          <div style={{ color: lesson.type === 'video' ? '#3b82f6' : '#ef4444' }}>
                            {lesson.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
                          </div>
                          <div>
                            <p style={{ fontWeight: 500, fontSize: '0.95rem', margin: 0 }}>{lesson.title}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>
                              {lesson.type} • {lesson.duration || lesson.size}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-ghost" style={{ padding: '0.4rem' }}><Edit2 size={16} /></button>
                          <button onClick={() => removeLesson(mod.id, lesson.id)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-light" style={{ fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No materials added yet.</p>
                    )}
                    
                    <button 
                      onClick={() => openUploadModal(mod.id)}
                      className="btn btn-outline" 
                      style={{ marginTop: '0.5rem', alignSelf: 'flex-start', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      <Plus size={16} /> Add Learning Material
                    </button>
                  </div>
                </div>
              ))}
              
              {modules.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                  <p className="text-light" style={{ marginBottom: '1rem' }}>Start building your curriculum by adding a module.</p>
                  <button onClick={addModule} className="btn btn-primary"><Plus size={16} /> Add First Module</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'Assessments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Course Assessments</h2>
              <Link to={`/trainer/assessments/create?courseId=${course.id}`} className="btn btn-primary"><Plus size={16} /> Create Assessment</Link>
            </div>

            {allAssessments.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {allAssessments.map(assessment => (
                  <div key={assessment.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '0.75rem', borderRadius: '8px', color: 'var(--secondary)' }}>
                        <PenTool size={24} />
                      </div>
                      <span className={`badge ${assessment.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>
                        {assessment.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{assessment.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{assessment.subject}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {assessment.duration}</span>
                      <span>{assessment.questions} Questions</span>
                    </div>
                    
                    <div style={{ marginTop: 'auto' }}>
                      <Link to={`/trainer/assessments/${assessment.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                        Manage Assessment
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                  <PenTool size={48} className="text-light" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Assessments Found</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                  Create quizzes and assignments to evaluate trainee progress.
                </p>
                <Link to={`/trainer/assessments/create?courseId=${course.id}`} className="btn btn-primary">
                  <Plus size={18} /> Create Your First Assessment
                </Link>
              </div>
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'Resources' && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <FileText size={48} className="text-light" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Additional Resources</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              You haven't uploaded any supplementary resources for this course yet.
            </p>
          </div>
        )}

        {/* TRAINEES TAB */}
        {activeTab === 'Trainees' && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Users size={48} className="text-light" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Trainees Enrolled</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              No trainees are currently enrolled in this course.
            </p>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'Feedback' && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <BookOpen size={48} className="text-light" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Feedback Yet</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Trainees haven't submitted any feedback for this course.
            </p>
          </div>
        )}

      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add Learning Material</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} className="text-light" /></button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div className="input-group">
                <label>Resource Title *</label>
                <input type="text" required value={uploadData.title} onChange={(e) => setUploadData({...uploadData, title: e.target.value})} placeholder="e.g. Introduction PDF" />
              </div>
              
              <div className="input-group">
                <label>Resource Type</label>
                <select value={uploadData.type} onChange={(e) => setUploadData({...uploadData, type: e.target.value})}>
                  <option value="video">Recorded Video (.mp4)</option>
                  <option value="pdf">Document (.pdf)</option>
                  <option value="ppt">Presentation (.pptx)</option>
                  <option value="doc">Study Notes (.docx)</option>
                </select>
              </div>
              
              <div className="input-group" style={{ marginTop: '1.5rem' }}>
                <label>Upload File</label>
                {uploadData.file ? (
                  <div style={{ 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--white)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <File size={24} style={{ color: 'var(--primary)' }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: 'var(--text-dark)' }}>{uploadData.file.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                          {uploadData.file.name.split('.').pop().toUpperCase()} • {(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setUploadData({...uploadData, file: null})} 
                      className="btn btn-ghost" 
                      style={{ color: 'var(--danger)', fontSize: '0.85rem' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '2rem 1rem', 
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-color-alt)',
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="file" 
                      required 
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadData({...uploadData, file: e.target.files[0]});
                        }
                      }} 
                    />
                    <Upload size={32} className="text-light" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: 'var(--primary)' }}>
                      Browse Files <span style={{ color: 'var(--text-dark)' }}>or drag and drop here</span>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      Supported: PDF, DOC, PPT, MP4 (Max 50MB)
                    </p>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseManagement;
