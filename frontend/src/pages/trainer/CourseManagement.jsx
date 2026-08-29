import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Clock, BookOpen, Users, PlayCircle, 
  FileText, Plus, Edit2, Trash2, GripVertical,
  Upload, File, Video, ChevronUp, ChevronDown, PenTool, X, Eye, Link as LinkIcon, Save, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const CourseManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Curriculum State
  const [modules, setModules] = useState([]);
  
  // Edit Module Inline State
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');

  // Edit Course Details Modal State
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    difficulty: 'Beginner',
    estimatedDuration: '',
    learningObjectives: [''],
    skills: []
  });
  const [editSkillInput, setEditSkillInput] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);

  // Upload Material Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null); // null if creating, lesson obj if editing
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    externalUrl: '',
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);

  // Publish Modal / Checklist State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishValidation, setPublishValidation] = useState({ canPublish: false, checks: [] });
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  // Course Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      const courseData = response.data || response;
      setCourse(courseData);
      setModules(courseData.modules || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load course data.');
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

  const tabs = ['Overview', 'Curriculum', 'Resources', 'Assessments', 'Trainees', 'Feedback'];

  // --- EDIT COURSE DETAILS ---
  const openEditDetailsModal = () => {
    if (!course) return;
    setEditFormData({
      title: course.title || '',
      category: course.category || '',
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      difficulty: course.difficulty || 'Beginner',
      estimatedDuration: course.estimatedDuration || course.duration || '',
      learningObjectives: course.learningObjectives?.length ? [...course.learningObjectives] : [''],
      skills: course.skills ? [...course.skills] : []
    });
    setShowEditDetailsModal(true);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      const payload = {
        title: editFormData.title,
        category: editFormData.category,
        shortDescription: editFormData.shortDescription,
        description: editFormData.description,
        difficulty: editFormData.difficulty,
        estimatedDuration: editFormData.estimatedDuration,
        learningObjectives: editFormData.learningObjectives.filter(o => o.trim() !== ''),
        skills: editFormData.skills
      };
      const response = await api.patch(`/courses/${id}`, payload);
      setCourse(response.data);
      setShowEditDetailsModal(false);
    } catch (err) {
      alert(err.message || 'Failed to update course details');
    } finally {
      setSavingDetails(false);
    }
  };

  // --- PUBLISH VALIDATION & ACTION ---
  const checkPublishRequirements = () => {
    if (!course) return;
    const checks = [
      { name: 'Course Title', pass: !!(course.title && course.title.trim()) },
      { name: 'Category', pass: !!(course.category && course.category.trim()) },
      { name: 'Short Description', pass: !!(course.shortDescription && course.shortDescription.trim()) },
      { name: 'Detailed Description', pass: !!(course.description && course.description.trim()) },
      { name: 'At least 1 Learning Objective', pass: !!(course.learningObjectives?.some(o => o.trim())) },
      { name: 'At least 1 Skill / Competency', pass: !!(course.skills?.length > 0) },
      { name: 'At least 1 Module', pass: !!(modules && modules.length > 0) },
      { 
        name: 'At least 1 Learning Material overall', 
        pass: modules ? modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) > 0 : false 
      }
    ];

    const canPublish = checks.every(c => c.pass);
    setPublishValidation({ canPublish, checks });
    setPublishError(null);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      const response = await api.patch(`/courses/${id}/publish`);
      setCourse(response.data);
      setShowPublishModal(false);
      alert('Congratulations! Course is now published and visible to trainees in your organization.');
    } catch (err) {
      setPublishError(err.message || 'Failed to publish course.');
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Are you sure you want to archive this course?')) return;
    try {
      const response = await api.patch(`/courses/${id}/archive`);
      setCourse(response.data);
    } catch (err) {
      alert(err.message || 'Failed to archive course');
    }
  };

  // --- MODULE ACTIONS ---
  const addModule = async () => {
    try {
      const response = await api.post(`/courses/${id}/modules`, { title: `Module ${modules.length + 1}: New Module` });
      const newMod = response.data || response;
      setModules([...modules, newMod]);
    } catch (err) {
      alert(err.message || 'Error adding module');
    }
  };

  const saveModuleTitle = async (modId) => {
    try {
      const response = await api.patch(`/courses/${id}/modules/${modId}`, { title: editingModuleTitle });
      const updated = response.data || response;
      setModules(modules.map(m => (m._id || m.id) === modId ? { ...m, title: updated.title || editingModuleTitle } : m));
      setEditingModuleId(null);
    } catch (err) {
      alert(err.message || 'Failed to save module title');
    }
  };

  const removeModule = async (modId, lessonCount) => {
    if (lessonCount > 0) {
      if (!window.confirm('This module contains learning materials. Are you sure you want to delete it?')) return;
    } else {
      if (!window.confirm('Delete this module?')) return;
    }

    try {
      await api.delete(`/courses/${id}/modules/${modId}`);
      setModules(modules.filter(m => (m._id || m.id) !== modId));
    } catch (err) {
      alert(err.message || 'Error removing module');
    }
  };

  const moveModule = async (index, direction) => {
    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    
    // Update local state immediately
    setModules(newModules);

    // Persist reorder to backend
    try {
      const moduleOrders = newModules.map((m, idx) => ({ moduleId: m._id || m.id, order: idx + 1 }));
      await api.patch(`/courses/${id}/modules/reorder`, { moduleOrders });
    } catch (err) {
      console.error('Failed to persist module reorder', err);
    }
  };

  // --- LESSON / MATERIAL ACTIONS ---
  const openUploadModal = (modId, lesson = null) => {
    setCurrentModuleId(modId);
    setEditingLesson(lesson);
    if (lesson) {
      setUploadData({
        title: lesson.title || '',
        description: lesson.description || '',
        type: lesson.type || 'video',
        duration: lesson.duration || '',
        externalUrl: lesson.externalUrl || '',
        file: null
      });
    } else {
      setUploadData({ title: '', description: '', type: 'video', duration: '', externalUrl: '', file: null });
    }
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let response;
      const modId = currentModuleId;

      if (editingLesson) {
        // Edit existing lesson
        const lessonId = editingLesson._id || editingLesson.id;
        if (uploadData.file) {
          const fd = new FormData();
          fd.append('title', uploadData.title);
          fd.append('description', uploadData.description || '');
          fd.append('type', uploadData.type);
          fd.append('duration', uploadData.duration || '');
          fd.append('externalUrl', uploadData.externalUrl || '');
          fd.append('file', uploadData.file);
          response = await api.patchFormData(`/courses/${id}/modules/${modId}/lessons/${lessonId}`, fd);
        } else {
          response = await api.patch(`/courses/${id}/modules/${modId}/lessons/${lessonId}`, uploadData);
        }
        const updatedLesson = response.data || response;
        setModules(modules.map(mod => {
          if ((mod._id || mod.id) === modId) {
            return {
              ...mod,
              lessons: mod.lessons.map(l => (l._id || l.id) === lessonId ? updatedLesson : l)
            };
          }
          return mod;
        }));
      } else {
        // Add new lesson
        if (uploadData.type !== 'link' && uploadData.file) {
          const fd = new FormData();
          fd.append('title', uploadData.title);
          fd.append('description', uploadData.description || '');
          fd.append('type', uploadData.type);
          fd.append('duration', uploadData.duration || '');
          fd.append('externalUrl', uploadData.externalUrl || '');
          fd.append('file', uploadData.file);
          response = await api.postFormData(`/courses/${id}/modules/${modId}/lessons`, fd);
        } else {
          response = await api.post(`/courses/${id}/modules/${modId}/lessons`, uploadData);
        }
        const newLesson = response.data || response;
        setModules(modules.map(mod => {
          if ((mod._id || mod.id) === modId) {
            return { ...mod, lessons: [...(mod.lessons || []), newLesson] };
          }
          return mod;
        }));
      }

      setShowUploadModal(false);
    } catch (err) {
      alert(err.message || 'Error saving learning material');
    } finally {
      setIsUploading(false);
    }
  };

  const removeLesson = async (modId, lessonId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await api.delete(`/courses/${id}/modules/${modId}/lessons/${lessonId}`);
      setModules(modules.map(mod => {
        if ((mod._id || mod.id) === modId) {
          return { ...mod, lessons: mod.lessons.filter(l => (l._id || l.id) !== lessonId) };
        }
        return mod;
      }));
    } catch (err) {
      alert(err.message || 'Error removing lesson');
    }
  };

  // Derive all resources across modules for the Resources Tab
  const allResources = modules.flatMap(mod => 
    (mod.lessons || []).map(lesson => ({
      ...lesson,
      moduleTitle: mod.title,
      moduleId: mod._id || mod.id
    }))
  );

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading course management dashboard...</div>;
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Unable to load course</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error || 'Course not found.'}</p>
          <Link to="/trainer/courses" className="btn btn-primary">Back to My Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '1.5rem 1rem', maxWidth: '1100px' }}>
      
      {/* Breadcrumb & Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/trainer/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem', width: 'fit-content' }}>
          <ArrowLeft size={16} /> Back to My Courses
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{course.title}</h1>
              <span className={`badge ${course.status === 'published' ? 'badge-success' : course.status === 'draft' ? 'badge-warning' : 'badge-neutral'}`} style={{ textTransform: 'capitalize' }}>
                {course.status}
              </span>
            </div>
            <p className="text-light" style={{ maxWidth: '700px' }}>{course.shortDescription || course.description}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowPreviewModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={16} /> Preview
            </button>
            <button onClick={openEditDetailsModal} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit2 size={16} /> Edit Details
            </button>
            {course.status === 'draft' ? (
              <button onClick={checkPublishRequirements} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Publish Course
              </button>
            ) : course.status === 'published' ? (
              <button onClick={handleArchive} className="btn btn-outline" style={{ color: 'var(--text-muted)' }}>
                Archive Course
              </button>
            ) : null}
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
            {tab} {tab === 'Resources' && `(${allResources.length})`}
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
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', fontWeight: 600 }}>About Course</h3>
                <p style={{ color: 'var(--text-dark)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {course.description || course.shortDescription || 'No detailed description provided yet.'}
                </p>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', fontWeight: 600 }}>Learning Objectives</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-dark)' }}>
                  {course.learningObjectives?.length > 0 ? (
                    course.learningObjectives.map((obj, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem' }}>{obj}</li>
                    ))
                  ) : (
                    <li style={{ color: 'var(--text-muted)' }}>No objectives defined yet.</li>
                  )}
                </ul>
              </div>
            </div>
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', fontWeight: 600 }}>Course Info</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Category:</span>
                    <span style={{ fontWeight: 600 }}>{course.category}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Difficulty:</span>
                    <span style={{ fontWeight: 600 }}>{course.difficulty}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Duration:</span>
                    <span style={{ fontWeight: 600 }}>{course.estimatedDuration || course.duration || 'Not specified'}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Modules:</span>
                    <span style={{ fontWeight: 600 }}>{modules.length}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-light">Total Materials:</span>
                    <span style={{ fontWeight: 600 }}>{allResources.length}</span>
                  </li>
                </ul>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', fontWeight: 600 }}>Skills Covered</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {course.skills?.length > 0 ? (
                    course.skills.map(skill => (
                      <span key={skill} className="badge badge-neutral">{skill}</span>
                    ))
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>No skills defined.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CURRICULUM TAB (MODULE & LESSON BUILDER) */}
        {activeTab === 'Curriculum' && (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Course Curriculum</h2>
                <p className="text-light" style={{ fontSize: '0.85rem' }}>Add modules, organize topics, and upload learning materials.</p>
              </div>
              <button onClick={addModule} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} /> Add Module
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {modules.map((mod, index) => {
                const modId = mod._id || mod.id;
                const isEditingThisModule = editingModuleId === modId;

                return (
                  <div key={modId} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    
                    {/* Module Header */}
                    <div style={{ 
                      padding: '1rem 1.25rem', 
                      backgroundColor: 'var(--bg-color-alt)', 
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <button 
                            onClick={() => moveModule(index, 'up')} 
                            disabled={index === 0} 
                            style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? 'var(--text-muted)' : 'var(--primary)', padding: 0 }}
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button 
                            onClick={() => moveModule(index, 'down')} 
                            disabled={index === modules.length - 1} 
                            style={{ border: 'none', background: 'none', cursor: index === modules.length - 1 ? 'not-allowed' : 'pointer', color: index === modules.length - 1 ? 'var(--text-muted)' : 'var(--primary)', padding: 0 }}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>

                        {isEditingThisModule ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                            <input 
                              type="text" 
                              value={editingModuleTitle} 
                              onChange={(e) => setEditingModuleTitle(e.target.value)}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid var(--primary)', flex: 1 }}
                              autoFocus
                            />
                            <button onClick={() => saveModuleTitle(modId)} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                              Save
                            </button>
                            <button onClick={() => setEditingModuleId(null)} className="btn btn-ghost" style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>{mod.title}</span>
                            <button 
                              onClick={() => { setEditingModuleId(modId); setEditingModuleTitle(mod.title); }} 
                              className="btn btn-ghost" 
                              style={{ padding: '0.2rem 0.4rem', color: 'var(--text-muted)' }}
                              title="Rename Module"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginRight: '0.5rem' }}>
                          {mod.lessons?.length || 0} materials
                        </span>
                        <button 
                          onClick={() => removeModule(modId, mod.lessons?.length || 0)} 
                          className="btn btn-ghost" 
                          style={{ padding: '0.4rem', color: 'var(--danger)' }}
                          title="Delete Module"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Lessons list inside Module */}
                    <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {mod.lessons && mod.lessons.length > 0 ? (
                        mod.lessons.map(lesson => {
                          const lessonId = lesson._id || lesson.id;
                          return (
                            <div key={lessonId} style={{ 
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                              padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px',
                              backgroundColor: 'var(--white)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: lesson.type === 'video' ? '#3b82f6' : lesson.type === 'link' ? '#8b5cf6' : '#ef4444' }}>
                                  {lesson.type === 'video' ? <PlayCircle size={22} /> : lesson.type === 'link' ? <LinkIcon size={22} /> : <FileText size={22} />}
                                </div>
                                <div>
                                  <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: 'var(--text-dark)' }}>{lesson.title}</p>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize' }}>
                                    {lesson.type} {lesson.duration && `• ${lesson.duration}`} {lesson.fileSize > 0 && `• ${(lesson.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                                  </p>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                {lesson.fileUrl && (
                                  <a href={getMediaUrl(lesson.fileUrl)} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary)' }} title="View Material">
                                    <Eye size={16} />
                                  </a>
                                )}
                                {lesson.externalUrl && (
                                  <a href={lesson.externalUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary)' }} title="Open External Link">
                                    <LinkIcon size={16} />
                                  </a>
                                )}
                                <button onClick={() => openUploadModal(modId, lesson)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--text-muted)' }} title="Edit Material">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => removeLesson(modId, lessonId)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }} title="Delete Material">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-light" style={{ fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                          No learning materials added to this module yet.
                        </p>
                      )}
                      
                      <button 
                        onClick={() => openUploadModal(modId, null)}
                        className="btn btn-outline" 
                        style={{ marginTop: '0.5rem', alignSelf: 'flex-start', fontSize: '0.85rem', padding: '0.4rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Plus size={15} /> Add Learning Material
                      </button>
                    </div>

                  </div>
                );
              })}

              {modules.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-color-alt)', borderRadius: '8px', border: '2px dashed var(--border-color)' }}>
                  <BookOpen size={40} className="text-light" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Modules Created Yet</h3>
                  <p className="text-light" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Start building your course curriculum by adding the first module.</p>
                  <button onClick={addModule} className="btn btn-primary"><Plus size={16} /> Add First Module</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'Resources' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>All Course Resources</h2>
                <p className="text-light" style={{ fontSize: '0.85rem' }}>Derived from all modules across the curriculum.</p>
              </div>
            </div>

            {allResources.length > 0 ? (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Resource Title</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Module</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Size / Duration</th>
                      <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResources.map((resItem, idx) => {
                      const resId = resItem._id || resItem.id;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{resItem.title}</div>
                            {resItem.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{resItem.description}</div>}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                              {resItem.type}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {resItem.moduleTitle}
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                            {resItem.duration || (resItem.fileSize > 0 ? `${(resItem.fileSize / (1024 * 1024)).toFixed(1)} MB` : '-')}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              {resItem.fileUrl && (
                                <a href={getMediaUrl(resItem.fileUrl)} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>
                                  View / Download
                                </a>
                              )}
                              {resItem.externalUrl && (
                                <a href={resItem.externalUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>
                                  Open Link
                                </a>
                              )}
                              <button onClick={() => openUploadModal(resItem.moduleId, resItem)} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => removeLesson(resItem.moduleId, resId)} className="btn btn-ghost" style={{ padding: '0.35rem', color: 'var(--danger)' }}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FileText size={48} className="text-light" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Resources Available</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Add learning materials (PDFs, Videos, Presentations, Documents) to your modules in the Curriculum tab to see them listed here.
                </p>
                <button onClick={() => setActiveTab('Curriculum')} className="btn btn-primary">Go to Curriculum</button>
              </div>
            )}
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'Assessments' && (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PenTool size={48} className="text-light" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Assessments & Quizzes</h3>
            <p className="text-muted" style={{ maxWidth: '500px', fontSize: '0.9rem' }}>
              Assessment management for this course can be configured in the Assessments module.
            </p>
          </div>
        )}

        {/* TRAINEES TAB */}
        {activeTab === 'Trainees' && (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Users size={48} className="text-light" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Trainee Enrollments</h3>
            <p className="text-muted" style={{ maxWidth: '500px', fontSize: '0.9rem' }}>
              {course.status === 'published' 
                ? 'Trainees in your organization can now explore and enroll in this course.'
                : 'Publish this course to make it available for trainee enrollment.'}
            </p>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'Feedback' && (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BookOpen size={48} className="text-light" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Feedback</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Trainee reviews and feedback will appear here once submitted.</p>
          </div>
        )}

      </div>

      {/* --- EDIT COURSE DETAILS MODAL --- */}
      {showEditDetailsModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 110,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Course Details</h2>
              <button onClick={() => setShowEditDetailsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} className="text-light" /></button>
            </div>

            <form onSubmit={handleSaveDetails}>
              <div className="input-group">
                <label>Course Title *</label>
                <input 
                  type="text" 
                  required 
                  value={editFormData.title} 
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Category *</label>
                  <select 
                    value={editFormData.category} 
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Earth Sciences">Earth Sciences</option>
                    <option value="Meteorology">Meteorology</option>
                    <option value="Oceanography">Oceanography</option>
                    <option value="Seismology">Seismology</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="GIS & Remote Sensing">GIS & Remote Sensing</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Difficulty</label>
                  <select 
                    value={editFormData.difficulty} 
                    onChange={(e) => setEditFormData({ ...editFormData, difficulty: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Estimated Duration</label>
                <input 
                  type="text" 
                  value={editFormData.estimatedDuration} 
                  onChange={(e) => setEditFormData({ ...editFormData, estimatedDuration: e.target.value })} 
                  placeholder="e.g. 4 Weeks or 12 Hours"
                />
              </div>

              <div className="input-group">
                <label>Short Description</label>
                <textarea 
                  value={editFormData.shortDescription} 
                  onChange={(e) => setEditFormData({ ...editFormData, shortDescription: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="input-group">
                <label>Detailed Description</label>
                <textarea 
                  value={editFormData.description} 
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="input-group">
                <label>Learning Objectives</label>
                {editFormData.learningObjectives.map((obj, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={obj} 
                      onChange={(e) => {
                        const newObjs = [...editFormData.learningObjectives];
                        newObjs[index] = e.target.value;
                        setEditFormData({ ...editFormData, learningObjectives: newObjs });
                      }}
                      placeholder={`Objective ${index + 1}`} 
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const newObjs = editFormData.learningObjectives.filter((_, i) => i !== index);
                        setEditFormData({ ...editFormData, learningObjectives: newObjs.length ? newObjs : [''] });
                      }}
                      className="btn btn-ghost" 
                      style={{ color: 'var(--danger)', padding: '0.4rem 0.6rem' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => setEditFormData({ ...editFormData, learningObjectives: [...editFormData.learningObjectives, ''] })}
                  className="btn btn-outline" 
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
                >
                  + Add Objective
                </button>
              </div>

              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label>Skills & Competencies</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  {editFormData.skills.map(skill => (
                    <span key={skill} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => setEditFormData({ ...editFormData, skills: editFormData.skills.filter(s => s !== skill) })}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={editSkillInput} 
                  onChange={(e) => setEditSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editSkillInput.trim()) {
                      e.preventDefault();
                      if (!editFormData.skills.includes(editSkillInput.trim())) {
                        setEditFormData({ ...editFormData, skills: [...editFormData.skills, editSkillInput.trim()] });
                      }
                      setEditSkillInput('');
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowEditDetailsModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingDetails}>
                  {savingDetails ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UPLOAD MATERIAL MODAL --- */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 110,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {editingLesson ? 'Edit Learning Material' : 'Add Learning Material'}
              </h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} className="text-light" /></button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div className="input-group">
                <label>Resource Title *</label>
                <input type="text" required value={uploadData.title} onChange={(e) => setUploadData({...uploadData, title: e.target.value})} placeholder="e.g. Introduction Lecture Video" />
              </div>

              <div className="input-group">
                <label>Description</label>
                <input type="text" value={uploadData.description} onChange={(e) => setUploadData({...uploadData, description: e.target.value})} placeholder="Brief overview of material" />
              </div>
              
              <div className="input-group">
                <label>Resource Type</label>
                <select value={uploadData.type} onChange={(e) => setUploadData({...uploadData, type: e.target.value})}>
                  <option value="video">Recorded Video (.mp4)</option>
                  <option value="pdf">Document (.pdf)</option>
                  <option value="presentation">Presentation (.pptx, .ppt)</option>
                  <option value="document">Study Notes (.docx, .doc)</option>
                  <option value="link">External Link (URL)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Duration (Optional)</label>
                <input type="text" value={uploadData.duration} onChange={(e) => setUploadData({...uploadData, duration: e.target.value})} placeholder="e.g. 15 mins" />
              </div>

              {uploadData.type === 'link' ? (
                <div className="input-group">
                  <label>External URL *</label>
                  <input type="url" required value={uploadData.externalUrl} onChange={(e) => setUploadData({...uploadData, externalUrl: e.target.value})} placeholder="https://example.com/resource" />
                </div>
              ) : (
                <div className="input-group" style={{ marginTop: '1.25rem' }}>
                  <label>{editingLesson ? 'Replace File (Optional)' : 'Upload File *'}</label>
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
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--text-dark)' }}>{uploadData.file.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                            {(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB
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
                      padding: '1.75rem 1rem', 
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-color-alt)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="file" 
                        required={!editingLesson}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadData({...uploadData, file: e.target.files[0]});
                          }
                        }} 
                      />
                      <Upload size={30} className="text-light" style={{ margin: '0 auto 0.75rem' }} />
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--primary)', fontSize: '0.95rem' }}>
                        Click to browse file
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        Supported: PDF, DOC, PPT, MP4 (Max 100MB)
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : editingLesson ? 'Update Resource' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PUBLISH CHECKLIST MODAL --- */}
      {showPublishModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Course Readiness Checklist</h2>
              <button onClick={() => setShowPublishModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} className="text-light" /></button>
            </div>

            {publishError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {publishError}
              </div>
            )}

            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Review the requirements below before publishing your course to trainees in your organization.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {publishValidation.checks.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', backgroundColor: item.pass ? '#f0fdf4' : '#fef2f2', borderRadius: '6px', border: `1px solid ${item.pass ? '#bbf7d0' : '#fecaca'}` }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: item.pass ? '#166534' : '#991b1b' }}>
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: item.pass ? '#16a34a' : '#dc2626' }}>
                    {item.pass ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>

            {!publishValidation.canPublish && (
              <div style={{ backgroundColor: '#fffbe8', border: '1px solid #ffe58f', padding: '0.75rem 1rem', borderRadius: '6px', color: '#855900', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Please fulfill all missing requirements before publishing this course.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setShowPublishModal(false)} className="btn btn-outline">Close</button>
              <button 
                onClick={handleConfirmPublish} 
                className="btn btn-primary" 
                disabled={!publishValidation.canPublish || publishing}
                style={{ padding: '0.6rem 1.5rem' }}
              >
                {publishing ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- COURSE PREVIEW MODAL --- */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-warning">Trainee Preview Mode</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{course.title}</h2>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Close Preview
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>{course.category}</span>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>{course.title}</h1>
                <p style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{course.description || course.shortDescription}</p>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Learning Objectives</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
                  {course.learningObjectives?.map((obj, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{obj}</li>)}
                </ul>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Curriculum ({modules.length} Modules)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {modules.map((m, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-color-alt)' }}>
                      <h4 style={{ fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.5rem' }}>{m.title}</h4>
                      {m.lessons?.map((l, lIdx) => (
                        <div key={lIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                          <PlayCircle size={14} /> {l.title} ({l.type})
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="card" style={{ padding: '1.25rem' }}>
                  {course.thumbnail?.url && (
                    <img src={getMediaUrl(course.thumbnail.url)} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }} />
                  )}
                  <button disabled className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', opacity: 0.8 }}>
                    Enroll in Course (Preview)
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                    Instructor: {course.trainer?.name || user?.name || 'Trainer'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseManagement;
