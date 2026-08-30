import { Link } from 'react-router-dom';

const LandingFooter = ({ scrollToSection }) => {
  return (
    <footer className="lp-footer" data-section="landing-footer">
      <div className="lp-container">
        
        <div className="lp-footer-grid">
          
          {/* BRAND COLUMN */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="lp-logo-icon" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                CC
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lp-text)' }}>Capacity Connect</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px', color: 'var(--lp-text-muted)' }}>
              Next-Generation Digital Capacity Building & Competency Management Ecosystem powering Organizations, Trainers, and Trainees.
            </p>
          </div>

          {/* PLATFORM NAVIGATION */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--lp-text)', marginBottom: '1.25rem' }}>Platform</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
              <li>
                <button type="button" onClick={() => scrollToSection('overview')} className="lp-footer-link">Overview</button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('roles')} className="lp-footer-link">Portals</button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('how-it-works')} className="lp-footer-link">How It Works</button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('capabilities')} className="lp-footer-link">Capabilities</button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('organizations')} className="lp-footer-link">For Organizations</button>
              </li>
            </ul>
          </div>

          {/* PORTALS & SIGNUP */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--lp-text)', marginBottom: '1.25rem' }}>Get Started</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
              <li><Link to="/login" className="lp-footer-link">Sign In to Portal</Link></li>
              <li><Link to="/register" className="lp-footer-link">Register Trainee Account</Link></li>
              <li><Link to="/trainer/apply" className="lp-footer-link">Apply as Trainer</Link></li>
              <li><Link to="/admin/register" className="lp-footer-link">Register Organization</Link></li>
            </ul>
          </div>

          {/* GOVERNANCE SUMMARY */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--lp-text)', marginBottom: '1.25rem' }}>Governance</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', color: 'var(--lp-text-muted)', fontSize: '0.875rem' }}>
              <li>SIH26075 Standard</li>
              <li>Dual Access Key Control</li>
              <li>Admin Approval Gate</li>
              <li>Verifiable Certificates</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL NOTICE */}
        <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            © 2026 Capacity Connect. Digital Capacity Building Ecosystem. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--lp-text-dim)' }}>
            <span>Privacy Policy (Standard Platform Security)</span>
            <span>Terms of Service</span>
            <span>SIH26075 Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
