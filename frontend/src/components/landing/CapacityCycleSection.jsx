import { useState, useRef } from 'react';
import { CAPACITY_CYCLE_STEPS } from './landingData';
import { ArrowRight, RotateCcw } from 'lucide-react';

const CapacityCycleSection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const tabRefs = useRef([]);

  const currentStep = CAPACITY_CYCLE_STEPS[activeStage];
  const StepIcon = currentStep.icon;

  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % CAPACITY_CYCLE_STEPS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + CAPACITY_CYCLE_STEPS.length) % CAPACITY_CYCLE_STEPS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = CAPACITY_CYCLE_STEPS.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      setActiveStage(nextIndex);
      if (tabRefs.current[nextIndex]) {
        tabRefs.current[nextIndex].focus();
      }
    }
  };

  const isLastStage = activeStage === CAPACITY_CYCLE_STEPS.length - 1;

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

        {/* COMPACT 4x2 STAGE GRID (DISPLAYING ALL 8 STAGES AT ONCE - NO SCROLLBAR) */}
        <div 
          role="tablist"
          aria-label="Capacity building lifecycle stages"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          {CAPACITY_CYCLE_STEPS.map((step, idx) => {
            const isActive = activeStage === idx;

            return (
              <button
                key={step.number}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                id={`stage-tab-${idx}`}
                aria-controls={`stage-panel-${idx}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveStage(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--lp-radius-md)',
                  background: isActive ? 'var(--lp-cyan-glow)' : 'var(--lp-bg-surface)',
                  border: isActive ? '1px solid var(--lp-cyan)' : '1px solid var(--lp-border)',
                  color: isActive ? 'var(--lp-cyan)' : 'var(--lp-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? 'var(--lp-shadow-glow)' : 'none'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--lp-cyan)' : 'var(--lp-bg-elevated)',
                  color: isActive ? '#06101D' : 'var(--lp-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  0{step.number}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--lp-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE STAGE DETAIL PANEL (SINGLE PANEL - NO DUPLICATE CARDS BELOW) */}
        <div 
          role="tabpanel"
          id={`stage-panel-${activeStage}`}
          aria-labelledby={`stage-tab-${activeStage}`}
          style={{
            background: 'var(--lp-bg-glass-card)',
            border: '1px solid var(--lp-border-hover)',
            borderRadius: 'var(--lp-radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--lp-shadow-md)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--lp-cyan-glow)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StepIcon size={24} />
              </div>
              <div>
                <span className="lp-badge lp-badge-cyan" style={{ marginBottom: '0.25rem' }}>STAGE {currentStep.number} OF 8</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--lp-text)' }}>{currentStep.title}</h3>
              </div>
            </div>

            {/* PREVIOUS & NEXT / RESTART STAGE CONTROLS */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="lp-btn lp-btn-secondary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
                disabled={activeStage === 0}
                onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
              >
                ← Previous Stage
              </button>

              <button
                type="button"
                className="lp-btn lp-btn-primary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
                onClick={() => {
                  if (isLastStage) {
                    setActiveStage(0);
                  } else {
                    setActiveStage((prev) => prev + 1);
                  }
                }}
              >
                {isLastStage ? (
                  <>Restart Cycle <RotateCcw size={14} /></>
                ) : (
                  <>Next Stage <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--lp-text)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {currentStep.desc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--lp-border)' }}>
            <div style={{ background: 'var(--lp-bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--lp-radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Input</span>
              <div style={{ fontWeight: 600, color: 'var(--lp-text)', marginTop: '0.35rem' }}>{currentStep.subtitle} Criteria</div>
            </div>
            <div style={{ background: 'var(--lp-bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--lp-radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Process</span>
              <div style={{ fontWeight: 600, color: 'var(--lp-text)', marginTop: '0.35rem' }}>Capacity Connect Engine</div>
            </div>
            <div style={{ background: 'var(--lp-bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--lp-radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verifiable Outcome</span>
              <div style={{ fontWeight: 600, color: 'var(--lp-text)', marginTop: '0.35rem' }}>{currentStep.badge} Audit Record</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CapacityCycleSection;
