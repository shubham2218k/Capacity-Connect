import { AUDIENCE_CATEGORIES } from './landingData';

const AudienceStrip = () => {
  return (
    <section id="overview" className="lp-audience-strip" data-section="audience-strip">
      <div className="lp-container">
        
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Built for Enterprise & Institutional Capacity Development
          </span>
        </div>

        <div className="lp-audience-grid">
          {AUDIENCE_CATEGORIES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="lp-audience-pill" data-audience-pill>
                <Icon size={18} style={{ color: 'var(--lp-cyan)' }} />
                <span>{item.label}</span>
                <span className="lp-badge lp-badge-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AudienceStrip;
