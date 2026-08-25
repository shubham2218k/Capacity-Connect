import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockLibrary, mockCourses } from '../../data/mockData';
import { Upload, File, Video, FileText, FileSpreadsheet, Presentation, Search, Filter, Trash2, Edit } from 'lucide-react';

const TrainerResources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState(mockLibrary.filter(r => r.trainer === user.name || r.trainer === 'Admin'));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    type: 'PDF',
    courseId: '',
    description: ''
  });

  const trainerCourses = mockCourses.filter(c => c.trainer === user.name);

  const getIconForType = (type) => {
    switch(type.toLowerCase()) {
      case 'video': return <Video size={20} style={{ color: 'var(--primary)' }} />;
      case 'pdf': return <FileText size={20} style={{ color: 'var(--danger)' }} />;
      case 'document': return <FileText size={20} style={{ color: 'var(--secondary)' }} />;
      case 'presentation': return <Presentation size={20} style={{ color: '#b45309' }} />;
      default: return <File size={20} />;
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newResource = {
      id: 'l_new_' + Date.now(),
      title: uploadData.title,
      type: uploadData.type,
      subject: trainerCourses.find(c => c.id === uploadData.courseId)?.subject || 'General',
      trainer: user.name,
      date: new Date().toISOString().split('T')[0]
    };
    
    setResources([newResource, ...resources]);
    setShowUploadModal(false);
    setUploadData({ title: '', type: 'PDF', courseId: '', description: '' });
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || res.type.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Learning Content</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage files, videos, and resources for your courses.</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={18} /> Upload Resource
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Video', 'PDF', 'Document', 'Presentation'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: `1px solid ${activeFilter === filter ? 'var(--primary)' : 'var(--border-color)'}`,
                backgroundColor: activeFilter === filter ? 'var(--primary-light)' : 'var(--white)',
                color: activeFilter === filter ? 'var(--primary)' : 'var(--text-light)',
                fontWeight: activeFilter === filter ? 600 : 500,
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="search-bar" style={{ width: '300px' }}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Resource Title</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Type</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Subject/Course</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Uploaded</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-light)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map(res => (
              <tr key={res.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                      {getIconForType(res.type)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{res.title}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', backgroundColor: '#e2e8f0', borderRadius: '4px', color: 'var(--text-dark)' }}>
                    {res.type}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  {res.subject}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  {res.date}
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.5rem' }}><Edit size={16} /></button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredResources.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                  No resources found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Upload New Resource</h2>
            
            <form onSubmit={handleUploadSubmit}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Type *</label>
                  <select 
                    value={uploadData.type} 
                    onChange={(e) => setUploadData({...uploadData, type: e.target.value})}
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Link">External Link</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Course Association</label>
                  <select 
                    value={uploadData.courseId} 
                    onChange={(e) => setUploadData({...uploadData, courseId: e.target.value})}
                  >
                    <option value="">General (No specific course)</option>
                    {trainerCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>File Selection</label>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                  <Upload size={24} style={{ color: 'var(--text-light)', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Click to browse or drag file here</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrainerResources;
