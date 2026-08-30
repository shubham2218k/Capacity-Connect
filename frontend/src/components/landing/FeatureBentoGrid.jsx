import { BENTO_FEATURES } from './landingData';

const FeatureBentoGrid = () => {
  return (
    <section id="capabilities" className="lp-section lp-section-alt" data-section="bento-capabilities">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">Complete Feature Suite</span>
          <h2 className="lp-h2">
            Built for Modern Capacity Management
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            Comprehensive platform tools covering administration, subject authoring, automated testing, and multi-tenant security.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="lp-bento-grid">
          {BENTO_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            const isWide = item.size === 'wide';

            return (
              <div 
                key={item.id}
                className={`lp-card ${isWide ? 'lp-bento-wide' : ''}`}
                data-bento-card={idx}
                style={{
                  borderTop: `3px solid ${item.accent}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '10px', 
                    backgroundColor: `${item.accent}1A`, 
                    color: item.accent, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0 
                  }}>
                    <Icon size={22} />
                  </div>
                  {isWide && <span className="lp-badge lp-badge-cyan">Featured Capability</span>}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--lp-text)', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--lp-text-muted)', lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeatureBentoGrid;
