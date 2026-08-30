import { useState } from 'react';
import { CAPACITY_CYCLE_STEPS } from './landingData';
import { ChevronRight, ArrowRight } from 'lucide-react';

const CapacityCycleSection = () => {
  const [activeStage, setActiveStage] = useState(0);

  const currentStep = CAPACITY_CYCLE_STEPS[activeStage];
  const StepIcon = currentStep.icon;

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

        {/* GUIDED LIFECYCLE PROGRESS PIPELINE */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--lp-border)'
          }}
          role="tablist"
          aria-label="Capacity lifecycle stage selector"
        >
          {CAPACITY_CYCLE_STEPS.map((step, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={step.number}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveStage(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--lp-radius-md)',
                  background: isActive ? 'var(--lp-cyan-glow)' : 'var(--lp-bg-surface)',
                  border: isActive ? '1px solid var(--lp-cyan)' : '1px solid var(--lp-border)',
                  color: isActive ? 'var(--lp-cyan)' : 'var(--lp-text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <span>0{step.number}</span>
                <span>{step.title}</span>
                {idx < CAPACITY_CYCLE_STEPS.length - 1 && (
                  <ChevronRight size={14} style={{ opacity: 0.4 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ACTIVE STAGE GUIDED EXPANDER PANEL */}
        <div 
          style={{
            background: 'var(--lp-bg-glass-card)',
            border: '1px solid var(--lp-border-hover)',
            borderRadius: 'var(--lp-radius-xl)',
            padding: '2rem',
            marginBottom: '3rem',
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

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="lp-btn lp-btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                disabled={activeStage === 0}
                onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
              >
                ← Previous Stage
              </button>
              <button
                type="button"
                className="lp-btn lp-btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                disabled={activeStage === CAPACITY_CYCLE_STEPS.length - 1}
                onClick={() => setActiveStage((prev) => Math.min(CAPACITY_CYCLE_STEPS.length - 1, prev + 1))}
              >
                Next Stage →
              </button>
            </div>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--lp-text)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {currentStep.desc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--lp-border)' }}>
            <div style={{ background: 'var(--lp-bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--lp-radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Input</span>
              <div style={{ fontWeight: 600, color: 'var(--lp-text)', marginTop: '0.35rem' }}>{currentStep.subtitle} Profile & Criteria</div>
            </div>
            <div style={{ background: 'var(--lp-bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--lp-radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Process</span>
              <div style={{ fontWeight: 600, color: 'var(--lp-text)', marginTop: '0.35rem' }}>Capacity Connect Automated Engine</div>
            </div>
            <div style={{ background: 'var(--lp-bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--lp-radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verifiable Outcome</span>
              <div style={{ fontWeight: 600, color: 'var(--lp-text)', marginTop: '0.35rem' }}>{currentStep.badge} Audit Trail Record</div>
            </div>
          </div>
        </div>

        {/* 8-STEP CYCLE GRID FOR SCROLL REVEAL */}
        <div className="lp-cycle-grid">
          {CAPACITY_CYCLE_STEPS.map((step, idx) => {
            const ItemIcon = step.icon;
            const isSelected = activeStage === idx;
            return (
              <div 
                key={step.number} 
                className={`lp-cycle-card ${isSelected ? 'selected' : ''}`}
                data-cycle-step={idx}
                onClick={() => setActiveStage(idx)}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--lp-cyan)' : 'var(--lp-border)',
                  boxShadow: isSelected ? 'var(--lp-shadow-glow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="lp-cycle-number">STEP {step.number}</div>
                  <span className="lp-badge lp-badge-cyan">{step.badge}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--lp-cyan-glow)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ItemIcon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--lp-text)' }}>{step.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', fontWeight: 600 }}>{step.subtitle}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', lineHeight: 1.55, marginTop: '0.5rem' }}>
                  {step.desc}
                </p>

                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: isSelected ? 'var(--lp-cyan)' : 'var(--lp-text-muted)' }}>
                  View Stage Details <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CapacityCycleSection;
