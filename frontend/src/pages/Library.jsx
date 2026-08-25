import { useState } from 'react';
import { mockLibrary } from '../data/mockData';
import { Search, FileText, Video, PlayCircle, File, Download, Eye } from 'lucide-react';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Video', 'PDF', 'Presentation', 'Document'];

  const filteredResources = mockLibrary.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || resource.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'Video': return <Video size={24} style={{ color: '#ef4444' }} />;
      case 'PDF': return <File size={24} style={{ color: '#ef4444' }} />;
      case 'Presentation': return <PlayCircle size={24} style={{ color: '#f59e0b' }} />;
      case 'Document': return <FileText size={24} style={{ color: '#3b82f6' }} />;
      default: return <File size={24} />;
    }
  };

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Learning Library</h1>
        <p style={{ color: 'var(--text-light)' }}>Access and search through all training materials uploaded by trainers.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search resources by title or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 3rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1fr 1fr 100px', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-light)' }}>
          <div>Resource Title</div>
          <div>Subject</div>
          <div>Trainer</div>
          <div>Date Added</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {filteredResources.length > 0 ? (
          <div>
            {filteredResources.map((resource, index) => (
              <div key={resource.id} style={{ 
                display: 'grid', 
                gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1fr 1fr 100px', 
                padding: '1.25rem 1.5rem', 
                borderBottom: index < filteredResources.length - 1 ? '1px solid var(--border-color)' : 'none',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getIcon(resource.type)}
                  <div>
                    <div style={{ fontWeight: 500 }}>{resource.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{resource.type}</div>
                  </div>
                </div>
                <div style={{ color: 'var(--text-dark)' }}>{resource.subject}</div>
                <div style={{ color: 'var(--text-light)' }}>{resource.trainer}</div>
                <div style={{ color: 'var(--text-light)' }}>{resource.date}</div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', padding: '0.25rem' }} title="View">
                    <Eye size={18} />
                  </button>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.25rem' }} title="Download">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)' }}>No resources found matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Library;
