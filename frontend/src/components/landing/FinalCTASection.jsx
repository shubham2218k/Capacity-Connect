import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';

const FinalCTASection = () => {
  return (
    <section className="lp-section" data-section="final-cta">
      <div className="lp-container">
        
        <div className="lp-final-cta-card" data-cta-card>
          
          <div className="lp-eyebrow" style={{ margin: '0 auto 1.5rem' }}>
            <Building2 size={16} />
            Institutional Capacity Ecosystem
          </div>

          <h2 className="lp-h2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.25rem', maxWidth: '780px', margin: '0 auto 1.25rem' }}>
            Bring Your Organization's Learning Ecosystem Together
          </h2>

          <p className="lp-subtitle" style={{ maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            Centralize training programs, verify trainer expertise, deliver standardized assessments, and measure workforce competency growth in one unified platform.
          </p>

          {/* CTA BUTTONS ROW */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/admin/register" className="lp-btn lp-btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Register Organization <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="lp-btn lp-btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
              Sign In to Portal
            </Link>

            <Link to="/register" className="lp-btn lp-btn-outline" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
              Register as Trainee
            </Link>

            <Link to="/trainer/apply" className="lp-btn lp-btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem', borderColor: 'var(--lp-violet)', color: 'var(--lp-violet)' }}>
              Apply as Trainer
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FinalCTASection;
