import { CAPACITY_CYCLE_STEPS } from './landingData';

const CapacityCycleSection = () => {
  return (
    <section id="how-it-works" className="lp-section" data-section="capacity-cycle">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">Complete Capacity Lifecycle</span>
          <h2 className="lp-h2">
            The 8-Stage Capacity-Building Engine
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            From initial organizational skill gap assessment to verifiable workforce certification and continuous feedback loops.
          </p>
        </div>

        {/* 8-STEP CYCLE GRID */}
        <div className="lp-cycle-grid">
          {CAPACITY_CYCLE_STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div 
                key={step.number} 
                className="lp-cycle-card"
                data-cycle-step={idx}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="lp-cycle-number">STEP {step.number}</div>
                  <span className="lp-badge lp-badge-cyan">{step.badge}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--lp-cyan-glow)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <StepIcon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--lp-text)' }}>{step.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', fontWeight: 600 }}>{step.subtitle}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', lineHeight: 1.55, marginTop: '0.5rem' }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CapacityCycleSection;
