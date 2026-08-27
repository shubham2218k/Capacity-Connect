import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockCertificates } from '../data/mockData';
import { Award, Download, Eye, CheckCircle, FileText, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificates = () => {
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  const traineeName = user?.name || 'Trainee Participant';
  const orgName = user?.organizationName || user?.organization || 'Organization Workspace';

  const generateCanvas = async (cert) => {
    // If preview modal isn't currently rendering this cert, temporarily render it
    let element = certRef.current;
    let tempDiv = null;

    if (!element) {
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '1000px';
      tempDiv.style.backgroundColor = '#fffdf5';
      
      tempDiv.innerHTML = `
        <div style="padding: 3.5rem; text-align: center; border: 10px solid #0f172a; margin: 1rem; border-radius: 4px; background-color: #fffdf5; font-family: Inter, sans-serif;">
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: #0ea5e9; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 0.5rem 0;">Capacity Connect</h4>
            <h1 style="color: #0f172a; font-size: 2.25rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Certificate of Completion</h1>
          </div>
          <p style="font-size: 1.1rem; color: #475569; margin: 0 0 0.75rem 0;">This is to certify that</p>
          <h2 style="font-size: 2.75rem; font-family: Georgia, serif; color: #0f172a; margin: 0 0 0.75rem 0; border-bottom: 2px solid #0ea5e9; display: inline-block; padding-bottom: 0.5rem;">
            ${traineeName}
          </h2>
          <p style="font-size: 1.1rem; color: #475569; margin: 0.75rem 0;">has successfully completed the course</p>
          <h3 style="font-size: 1.75rem; color: #0f172a; margin: 0 0 2.5rem 0; font-weight: 700;">
            ${cert.courseName}
          </h3>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 3rem;">
            <div style="border-top: 1px solid #0f172a; padding-top: 0.5rem; width: 180px; text-align: center;">
              <p style="font-weight: 600; margin: 0; font-size: 0.95rem;">${cert.date}</p>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0.2rem 0 0 0;">Date of Issue</p>
            </div>
            <div style="text-align: center; color: #065f46; font-weight: 600; font-size: 0.95rem;">
              Verified by ${orgName}
            </div>
            <div style="border-top: 1px solid #0f172a; padding-top: 0.5rem; width: 180px; text-align: center;">
              <p style="font-weight: 600; margin: 0; font-size: 0.95rem;">${cert.trainer || 'Lead Instructor'}</p>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0.2rem 0 0 0;">Instructor</p>
            </div>
          </div>
          <div style="margin-top: 2rem; font-size: 0.75rem; color: #94a3b8; text-align: center;">
            Certificate ID: ${cert.id} • Capacity Connect Digital Learning Platform
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);
      element = tempDiv;
    }

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fffdf5' });

    if (tempDiv && tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }

    return canvas;
  };

  const handleDownloadPDF = async (cert) => {
    setDownloading(true);
    try {
      const canvas = await generateCanvas(cert);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const safeCourseName = cert.courseName.replace(/[^a-zA-Z0-9]/g, '-');
      pdf.save(`Capacity-Connect-Certificate-${safeCourseName}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPNG = async (cert) => {
    setDownloading(true);
    try {
      const canvas = await generateCanvas(cert);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeCourseName = cert.courseName.replace(/[^a-zA-Z0-9]/g, '-');
      link.download = `Capacity-Connect-Certificate-${safeCourseName}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('PNG download error:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Certificates</h1>
        <p style={{ color: 'var(--text-light)' }}>View and download your official capacity-building certificates.</p>
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
                  <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{cert.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Recipient</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{traineeName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-light)' }}>Organization</span>
                  <span style={{ fontWeight: 500 }}>{orgName}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                <button 
                  onClick={() => setShowPreview(cert)}
                  className="btn btn-outline" style={{ flex: 1, padding: '0.6rem' }}
                >
                  <Eye size={16} /> View
                </button>
                <button 
                  onClick={() => handleDownloadPDF(cert)} 
                  disabled={downloading}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.6rem', gap: '0.4rem' }}
                >
                  <Download size={16} /> {downloading ? 'Exporting...' : 'Download PDF'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <Award size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No certificates earned yet</h3>
            <p style={{ color: 'var(--text-light)' }}>Complete organization courses to earn verified certificates.</p>
          </div>
        )}
      </div>

      {/* CERTIFICATE PREVIEW MODAL */}
      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '840px', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--bg-color-alt)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                <Award size={20} style={{ color: 'var(--secondary)' }} />
                Certificate Preview
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => handleDownloadPDF(showPreview)} 
                  disabled={downloading}
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  <FileText size={14} /> PDF
                </button>
                <button 
                  onClick={() => handleDownloadPNG(showPreview)} 
                  disabled={downloading}
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  <ImageIcon size={14} /> PNG
                </button>
                <button 
                  onClick={() => setShowPreview(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '0.5rem' }}
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Certificate Print Element */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f1f5f9' }}>
              <div 
                ref={certRef}
                style={{ 
                  padding: '3rem 2.5rem', 
                  textAlign: 'center', 
                  border: '10px solid var(--primary)', 
                  borderRadius: '4px', 
                  backgroundColor: '#fffdf5',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--secondary-hover)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.25rem' }}>
                    Capacity Connect
                  </h4>
                  <h1 style={{ color: 'var(--primary)', fontSize: '2.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.2 }}>
                    Certificate of Completion
                  </h1>
                </div>
                
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>This is to certify that</p>
                
                <h2 style={{ 
                  fontSize: '2.75rem', 
                  fontFamily: 'serif', 
                  color: 'var(--text-dark)', 
                  marginBottom: '0.75rem', 
                  borderBottom: '2px solid var(--secondary)', 
                  display: 'inline-block', 
                  paddingBottom: '0.5rem',
                  fontWeight: 700
                }}>
                  {traineeName}
                </h2>
                
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>has successfully completed the course</p>
                
                <h3 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '2.5rem', fontWeight: 700 }}>
                  {showPreview.courseName}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '3rem' }}>
                  <div style={{ borderTop: '1px solid var(--text-dark)', paddingTop: '0.5rem', width: '180px', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{showPreview.date}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Date of Issue</p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600, fontSize: '0.95rem' }}>
                    <CheckCircle size={20} /> Verified by {orgName}
                  </div>

                  <div style={{ borderTop: '1px solid var(--text-dark)', paddingTop: '0.5rem', width: '180px', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{showPreview.trainer || 'Lead Instructor'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Instructor</p>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Certificate ID: {showPreview.id} • Capacity Connect Digital Learning Platform
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
