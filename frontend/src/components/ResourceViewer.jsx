import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, Presentation, Video, File, AlertCircle, PlayCircle } from 'lucide-react';
import { formatFileSize, getResourceTypeLabel } from '../utils/formatters';

const ResourceViewer = ({ resource, isOpen, onClose }) => {
  const [loadError, setLoadError] = useState(false);

  if (!isOpen || !resource) return null;

  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const viewUrl = `${baseUrl}/api/resources/${resource.courseId}/${resource.moduleId}/${resource.id}/view`;
  const downloadUrl = `${baseUrl}/api/resources/${resource.courseId}/${resource.moduleId}/${resource.id}/download`;

  const handleDownload = () => {
    if (resource.type === 'link' && resource.externalUrl) {
      window.open(resource.externalUrl, '_blank', 'noreferrer');
      return;
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resource.originalFilename || resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const type = (resource.type || '').toLowerCase();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: type === 'pdf' || type === 'video' ? '900px' : '580px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--bg-color-alt)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                {getResourceTypeLabel(resource.type)}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                {resource.courseTitle} • {resource.moduleTitle}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
              {resource.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
            title="Close Viewer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          
          {loadError ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Resource file is unavailable
              </h4>
              <p className="text-light" style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                The physical file for this learning resource could not be loaded from storage.
              </p>
              <button onClick={onClose} className="btn btn-outline">Close Viewer</button>
            </div>
          ) : type === 'link' ? (
            /* LINK RESOURCE */
            <div style={{ textAlign: 'center', padding: '2rem 1rem', width: '100%' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ExternalLink size={32} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{resource.title}</h4>
              {resource.description && (
                <p className="text-light" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
                  {resource.description}
                </p>
              )}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary)', wordBreak: 'break-all', marginBottom: '1.75rem' }}>
                {resource.externalUrl}
              </div>
              <a 
                href={resource.externalUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ExternalLink size={18} /> Open Link in New Tab
              </a>
            </div>
          ) : type === 'pdf' ? (
            /* PDF RESOURCE */
            <div style={{ width: '100%', height: '100%', minHeight: '550px' }}>
              <iframe 
                src={viewUrl} 
                title={resource.title}
                onError={() => setLoadError(true)}
                style={{ width: '100%', height: '550px', border: 'none', borderRadius: '6px', backgroundColor: '#f8fafc' }}
              />
            </div>
          ) : type === 'video' ? (
            /* VIDEO RESOURCE */
            <div style={{ width: '100%', textAlign: 'center' }}>
              <video 
                controls 
                autoPlay={false}
                onError={() => setLoadError(true)}
                src={viewUrl} 
                style={{ width: '100%', maxHeight: '550px', borderRadius: '8px', backgroundColor: '#000' }}
              >
                Your browser does not support HTML5 video playback.
              </video>
            </div>
          ) : (
            /* DOCUMENT / PRESENTATION INFORMATIVE PANEL */
            <div style={{ textAlign: 'center', padding: '2rem 1.5rem', width: '100%' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                {type === 'presentation' ? <Presentation size={32} /> : <FileText size={32} />}
              </div>
              
              <h4 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--primary)' }}>
                {resource.originalFilename || resource.title}
              </h4>
              
              <p className="text-light" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {getResourceTypeLabel(resource.type)} {resource.fileSize > 0 && `• ${formatFileSize(resource.fileSize)}`}
              </p>

              <div style={{ 
                backgroundColor: '#fffbe8', 
                border: '1px solid #ffe58f', 
                borderRadius: '8px', 
                padding: '1rem 1.25rem', 
                maxWidth: '450px', 
                margin: '0 auto 1.75rem',
                fontSize: '0.875rem',
                color: '#855900',
                textAlign: 'left'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={16} /> Document Preview Information
                </div>
                This file format ({resource.originalFilename ? `.${resource.originalFilename.split('.').pop()}` : resource.type}) requires an office document viewer to render inline. Click Download below to open the file locally.
              </div>

              <button 
                onClick={handleDownload}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={18} /> Download Document
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--bg-color-alt)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            Uploaded by <strong style={{ color: 'var(--text-dark)' }}>{resource.trainerName}</strong>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
              Close
            </button>
            {type !== 'link' && (
              <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={16} /> Download
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceViewer;
