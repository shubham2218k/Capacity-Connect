import { useState } from 'react';
import { FileText, Search, Plus, Filter, Video, File } from 'lucide-react';

const LearningContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [contentFiles] = useState([
    { id: 'f1', name: 'Intro_to_Oceanography.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Dr. Meera Nair', date: '2026-08-20' },
    { id: 'f2', name: 'GIS_Mapping_Tutorial.mp4', type: 'Video', size: '145 MB', uploadedBy: 'Vikram Singh', date: '2026-08-21' },
    { id: 'f3', name: 'Climate_Data_Set_2025.csv', type: 'Data', size: '8.1 MB', uploadedBy: 'System Admin', date: '2026-08-22' }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Learning Content Library</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage all global files and resources available across courses.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Upload File
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>File Name</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Size</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Uploaded By</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {contentFiles.map(file => (
                <tr key={file.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {file.type === 'Video' ? <Video size={18} style={{ color: 'var(--secondary)' }} /> : <FileText size={18} style={{ color: 'var(--primary)' }} />}
                      {file.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}><span className="badge badge-neutral">{file.type}</span></td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{file.size}</td>
                  <td style={{ padding: '1rem' }}>{file.uploadedBy}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{file.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LearningContent;
