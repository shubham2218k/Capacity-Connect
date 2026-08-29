import { useState, useEffect } from 'react';
import { Search, FileText, Video, PlayCircle, File, Download, Eye, Link as LinkIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import ResourceViewer from '../components/ResourceViewer';
import { formatFileSize, getResourceTypeLabel } from '../utils/formatters';

const Library = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Resource Viewer State
  const [selectedResource, setSelectedResource] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const filters = ['All', 'Video', 'PDF', 'Presentation', 'Document', 'Link'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resources');
      setResources(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load learning resources.');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const openViewer = (resource) => {
    setSelectedResource(resource);
    setIsViewerOpen(true);
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

  const getIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'video': return <Video size={20} style={{ color: '#ef4444' }} />;
      case 'pdf': return <File size={20} style={{ color: '#ef4444' }} />;
      case 'presentation': return <PlayCircle size={20} style={{ color: '#f59e0b' }} />;
      case 'document': return <FileText size={20} style={{ color: '#3b82f6' }} />;
      case 'link': return <LinkIcon size={20} style={{ color: '#8b5cf6' }} />;
      default: return <File size={20} />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const query = searchTerm.toLowerCase();
    const titleMatch = (resource.title || '').toLowerCase().includes(query);
    const courseMatch = (resource.courseTitle || '').toLowerCase().includes(query);
    const moduleMatch = (resource.moduleTitle || '').toLowerCase().includes(query);
    const trainerMatch = (resource.trainerName || '').toLowerCase().includes(query);
    
    const matchesSearch = titleMatch || courseMatch || moduleMatch || trainerMatch;

    const resType = (resource.type || '').toLowerCase();
    const targetFilter = activeFilter.toLowerCase();
    const matchesFilter = activeFilter === 'All' || resType === targetFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Learning Library</h1>
          <p style={{ color: 'var(--text-light)' }}>Access and search through training materials published across your organization.</p>
        </div>
        <button onClick={fetchResources} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search resources by title, course, module, or trainer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 3rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: `1px solid ${activeFilter === filter ? 'var(--primary)' : 'var(--border-color)'}`,
                backgroundColor: activeFilter === filter ? 'var(--primary)' : 'transparent',
                color: activeFilter === filter ? 'white' : 'var(--text-dark)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading organization learning resources...
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
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Course & Module</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Trainer</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Type / Size</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Date Added</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((res, index) => (
                  <tr key={res.id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '8px', flexShrink: 0 }}>
                          {getIcon(res.type)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>{res.title}</div>
                          {res.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{res.description}</div>}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--primary)' }}>{res.courseTitle}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{res.moduleTitle}</div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                      {res.trainerName}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize', fontSize: '0.75rem', marginRight: '0.5rem' }}>
                        {getResourceTypeLabel(res.type)}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        {res.type === 'link' ? '' : res.fileSize > 0 ? formatFileSize(res.fileSize) : res.duration || '-'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : '-'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => openViewer(res)} 
                          className="btn btn-outline" 
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} 
                          title="View Resource"
                        >
                          <Eye size={15} /> View
                        </button>

                        {res.type !== 'link' && (
                          <button 
                            onClick={() => handleDownload(res)} 
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} 
                            title="Download File"
                          >
                            <Download size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No published learning resources found matching your search criteria.
          </div>
        )}
      </div>

      {/* Shared Resource Viewer */}
      <ResourceViewer 
        resource={selectedResource} 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
      />

    </div>
  );
};

export default Library;
