import { useState } from 'react';
import { mockCertificates } from '../data/mockData';
import { Award, Download, Eye, CheckCircle } from 'lucide-react';

const Certificates = () => {
  const [showPreview, setShowPreview] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Certificates</h1>
        <p style={{ color: 'var(--text-light)' }}>View and download your earned certificates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {mockCertificates.length > 0 ? (
          mockCertificates.map(cert => (
            <div key={cert.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', color: 'var(--secondary)', borderRadius: '12px' }}>
                  <Award size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.3 }}>{cert.courseName}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Issued: {cert.date}</p>
                </div>
              </div>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Certificate ID</span>
                  <span style={{ fontWeight: 500 }}>{cert.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-light)' }}>Issued by</span>
                  <span style={{ fontWeight: 500 }}>{cert.organization}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <button 
                  onClick={() => setShowPreview(cert)}
                  className="btn btn-outline" style={{ flex: 1, padding: '0.6rem' }}
                >
                  <Eye size={16} /> View
                </button>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }}>
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <Award size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No certificates yet</h3>
            <p style={{ color: 'var(--text-light)' }}>Complete courses to earn certificates.</p>
          </div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '800px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <button 
              onClick={() => setShowPreview(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
            >
              ×
            </button>
            
            {/* Mock Certificate Design */}
            <div style={{ padding: '4rem', textAlign: 'center', border: '10px solid var(--primary)', margin: '1rem', borderRadius: '4px', backgroundColor: '#fffdf5' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Certificate of Completion</h1>
              </div>
              
              <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem' }}>This is to certify that</p>
              
              <h2 style={{ fontSize: '3rem', fontFamily: 'serif', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--secondary)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                Aarav Sharma
              </h2>
              
              <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem', marginTop: '1rem' }}>has successfully completed the course</p>
              
              <h3 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '3rem' }}>
                {showPreview.courseName}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4rem' }}>
                <div style={{ borderTop: '1px solid var(--text-dark)', paddingTop: '0.5rem', width: '200px' }}>
                  <p style={{ fontWeight: 600 }}>{showPreview.date}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Date of Issue</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={24} /> Verified by MoES
                </div>

                <div style={{ borderTop: '1px solid var(--text-dark)', paddingTop: '0.5rem', width: '200px' }}>
                  <p style={{ fontWeight: 600 }}>{showPreview.trainer}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Certificates;
