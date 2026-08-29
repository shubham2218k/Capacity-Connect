import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Upload, File, Video, FileText, Presentation, Search, Trash2, Edit, 
  Eye, Download, Link as LinkIcon, AlertCircle, Plus, RefreshCw, X 
} from 'lucide-react';
import ResourceViewer from '../../components/ResourceViewer';
import { formatFileSize, getResourceTypeLabel } from '../../utils/formatters';

const TrainerResources = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [trainerCourses, setTrainerCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Resource Viewer State
  const [selectedResource, setSelectedResource] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Upload Resource Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedCourseObj, setSelectedCourseObj] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    duration: '',
    externalUrl: '',
    file: null
  });
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Edit Lesson State
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const [resResponse, coursesResponse] = await Promise.all([
        api.get('/resources'),
        api.get('/courses/my')
      ]);
      
      setResources(resResponse.data || []);
      setTrainerCourses(coursesResponse.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load trainer resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId('');
    if (!courseId) {
      setSelectedCourseObj(null);
      setAvailableModules([]);
      return;
    }
    const found = trainerCourses.find(c => (c._id || c.id) === courseId);
    setSelectedCourseObj(found || null);
    setAvailableModules(found?.modules || []);
  };

  const openUploadModal = (resItem = null) => {
    setEditingResource(resItem);
    setUploadError(null);

    if (resItem) {
      setSelectedCourseId(resItem.courseId);
      handleCourseSelection(resItem.courseId);
      setSelectedModuleId(resItem.moduleId);
      setUploadData({
        title: resItem.title || '',
        description: resItem.description || '',
        type: resItem.type || 'pdf',
        duration: resItem.duration || '',
        externalUrl: resItem.externalUrl || '',
        file: null
      });
    } else {
      setSelectedCourseId('');
      setSelectedModuleId('');
      setSelectedCourseObj(null);
      setAvailableModules([]);
      setUploadData({
        title: '',
        description: '',
        type: 'pdf',
        duration: '',
        externalUrl: '',
        file: null
      });
    }
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);

    if (!selectedCourseId) {
      setUploadError('Please select a course.');
      return;
    }
    if (!selectedModuleId) {
      setUploadError('Please select a module before uploading.');
      return;
    }

    if (uploadData.type === 'link') {
      if (!uploadData.externalUrl || !uploadData.externalUrl.trim()) {
        setUploadError('External URL is required for link resources.');
        return;
      }
    } else if (!editingResource && !uploadData.file) {
      setUploadError(`Please select a file to upload for ${uploadData.type} resources.`);
      return;
    }

    setIsSubmittingUpload(true);

    try {
      if (editingResource) {
        // Edit existing lesson
        const courseId = selectedCourseId;
        const moduleId = selectedModuleId;
        const lessonId = editingResource.id;

        if (uploadData.file) {
          const fd = new FormData();
          fd.append('title', uploadData.title);
          fd.append('description', uploadData.description || '');
          fd.append('type', uploadData.type);
          fd.append('duration', uploadData.duration || '');
          fd.append('externalUrl', uploadData.externalUrl || '');
          fd.append('file', uploadData.file);
          await api.patchFormData(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, fd);
        } else {
          await api.patch(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
            title: uploadData.title,
            description: uploadData.description,
            type: uploadData.type,
            duration: uploadData.duration,
            externalUrl: uploadData.externalUrl
          });
        }
      } else {
        // Create new lesson in selected course module
        const courseId = selectedCourseId;
        const moduleId = selectedModuleId;

        if (uploadData.type !== 'link' && uploadData.file) {
          const fd = new FormData();
          fd.append('title', uploadData.title);
          fd.append('description', uploadData.description || '');
          fd.append('type', uploadData.type);
          fd.append('duration', uploadData.duration || '');
          fd.append('externalUrl', uploadData.externalUrl || '');
          fd.append('file', uploadData.file);
          await api.postFormData(`/courses/${courseId}/modules/${moduleId}/lessons`, fd);
        } else {
          await api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, {
            title: uploadData.title,
            description: uploadData.description,
            type: uploadData.type,
            duration: uploadData.duration,
            externalUrl: uploadData.externalUrl
          });
        }
      }

      setShowUploadModal(false);
      fetchTrainerData();
    } catch (err) {
      setUploadError(err.message || 'Failed to save resource.');
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  const handleDeleteResource = async (resItem) => {
    if (!window.confirm(`Are you sure you want to delete "${resItem.title}"?`)) return;
    try {
      await api.delete(`/courses/${resItem.courseId}/modules/${resItem.moduleId}/lessons/${resItem.id}`);
      fetchTrainerData();
    } catch (err) {
      alert(err.message || 'Failed to delete resource.');
    }
  };

  const handleDownload = (resource) => {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    const downloadUrl = `${baseUrl}/api/resources/${resource.courseId}/${resource.moduleId}/${resource.id}/download`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resource.originalFilename || resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIconForType = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'video': return <Video size={20} style={{ color: '#ef4444' }} />;
      case 'pdf': return <FileText size={20} style={{ color: '#ef4444' }} />;
      case 'document': return <FileText size={20} style={{ color: '#3b82f6' }} />;
      case 'presentation': return <Presentation size={20} style={{ color: '#b45309' }} />;
      case 'link': return <LinkIcon size={20} style={{ color: '#8b5cf6' }} />;
      default: return <File size={20} />;
    }
  };

  const filteredResources = resources.filter(res => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (res.title || '').toLowerCase().includes(query) ||
                          (res.courseTitle || '').toLowerCase().includes(query) ||
                          (res.moduleTitle || '').toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'All' || (res.type || '').toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Learning Content Management</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage all learning files, videos, and materials uploaded to your courses.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchTrainerData} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={() => openUploadModal(null)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} /> Upload Resource
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['All', 'Video', 'PDF', 'Presentation', 'Document', 'Link'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                border: `1px solid ${activeFilter === filter ? 'var(--primary)' : 'var(--border-color)'}`,
                backgroundColor: activeFilter === filter ? 'var(--primary)' : 'var(--white)',
                color: activeFilter === filter ? 'white' : 'var(--text-dark)',
                fontWeight: activeFilter === filter ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search your resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Resource Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading your course learning materials...
          </div>
        ) : error ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--danger)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
            <p>{error}</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Resource Title</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Course & Module</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Size / Duration</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Uploaded</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((res, idx) => (
                  <tr key={res.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '8px', flexShrink: 0 }}>
                          {getIconForType(res.type)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>{res.title}</div>
                          {res.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{res.description}</div>}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                        {getResourceTypeLabel(res.type)}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--primary)' }}>{res.courseTitle}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{res.moduleTitle}</div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {res.type === 'link' ? '-' : res.fileSize > 0 ? formatFileSize(res.fileSize) : res.duration || '-'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : '-'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button onClick={() => { setSelectedResource(res); setIsViewerOpen(true); }} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary)' }} title="View Resource">
                          <Eye size={16} />
                        </button>
                        {res.type !== 'link' && (
                          <button onClick={() => handleDownload(res)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary)' }} title="Download File">
                            <Download size={16} />
                          </button>
                        )}
                        <button onClick={() => openUploadModal(res)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--text-muted)' }} title="Edit Resource">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteResource(res)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }} title="Delete Resource">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No learning materials found. Click "Upload Resource" to add content to your courses.
          </div>
        )}
      </div>

      {/* --- UPLOAD / EDIT RESOURCE MODAL --- */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {editingResource ? 'Edit Learning Resource' : 'Upload New Resource'}
              </h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} className="text-light" /></button>
            </div>

            {uploadError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit}>
              {/* Course Selection */}
              <div className="input-group">
                <label>Select Course *</label>
                <select 
                  value={selectedCourseId} 
                  onChange={(e) => handleCourseSelection(e.target.value)}
                  disabled={!!editingResource}
                  required
                >
                  <option value="">-- Choose a Course --</option>
                  {trainerCourses.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Module Selection / Warning */}
              {selectedCourseId && (
                <div className="input-group">
                  <label>Select Module *</label>
                  {availableModules.length > 0 ? (
                    <select 
                      value={selectedModuleId} 
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      disabled={!!editingResource}
                      required
                    >
                      <option value="">-- Choose a Module --</option>
                      {availableModules.map(m => (
                        <option key={m._id || m.id} value={m._id || m.id}>{m.title}</option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ backgroundColor: '#fffbe8', border: '1px solid #ffe58f', padding: '0.85rem 1rem', borderRadius: '6px', color: '#855900', fontSize: '0.88rem' }}>
                      This course has no modules yet. Add a module before uploading resources.
                      <div style={{ marginTop: '0.5rem' }}>
                        <button 
                          type="button"
                          onClick={() => { setShowUploadModal(false); navigate(`/trainer/courses/${selectedCourseId}`); }} 
                          className="btn btn-outline" 
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'white' }}
                        >
                          Manage Course Modules →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resource Fields */}
              <div className="input-group">
                <label>Resource Title *</label>
                <input 
                  type="text" 
                  value={uploadData.title} 
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})} 
                  required 
                  placeholder="e.g. Week 1 Lecture Slides"
                />
              </div>

              <div className="input-group">
                <label>Description (Optional)</label>
                <input 
                  type="text" 
                  value={uploadData.description} 
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})} 
                  placeholder="Brief summary of file content"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Resource Type *</label>
                  <select 
                    value={uploadData.type} 
                    onChange={(e) => setUploadData({...uploadData, type: e.target.value})}
                  >
                    <option value="pdf">Document (.pdf)</option>
                    <option value="video">Recorded Video (.mp4)</option>
                    <option value="presentation">Presentation (.pptx, .ppt)</option>
                    <option value="document">Study Notes (.docx, .doc)</option>
                    <option value="link">External Link (URL)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Duration (Optional)</label>
                  <input 
                    type="text" 
                    value={uploadData.duration} 
                    onChange={(e) => setUploadData({...uploadData, duration: e.target.value})} 
                    placeholder="e.g. 15 mins"
                  />
                </div>
              </div>

              {uploadData.type === 'link' ? (
                <div className="input-group">
                  <label>External URL *</label>
                  <input 
                    type="url" 
                    required 
                    value={uploadData.externalUrl} 
                    onChange={(e) => setUploadData({...uploadData, externalUrl: e.target.value})} 
                    placeholder="https://example.com/resource" 
                  />
                </div>
              ) : (
                <div className="input-group" style={{ marginTop: '0.5rem' }}>
                  <label>{editingResource ? 'Replace File (Optional)' : 'File Upload *'}</label>
                  <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc', position: 'relative', cursor: 'pointer' }}>
                    <input 
                      type="file" 
                      required={!editingResource}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,video/mp4"
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadData({...uploadData, file: e.target.files[0]});
                        }
                      }}
                    />
                    <Upload size={26} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', color: 'var(--primary)' }}>
                      {uploadData.file ? uploadData.file.name : 'Click to select file'}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                      Supported: PDF, DOC, PPT, MP4 (Max 100MB)
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingUpload || (selectedCourseId && availableModules.length === 0)}>
                  {isSubmittingUpload ? 'Uploading...' : editingResource ? 'Update Resource' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Resource Viewer */}
      <ResourceViewer 
        resource={selectedResource} 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
      />

    </div>
  );
};

export default TrainerResources;
