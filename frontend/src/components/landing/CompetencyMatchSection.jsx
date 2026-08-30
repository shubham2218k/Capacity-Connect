import { MATCHING_FACTORS, DEMO_TRAINERS } from './landingData';
import { Target, CheckCircle2 } from 'lucide-react';

const CompetencyMatchSection = () => {
  return (
    <section className="lp-section" data-section="competency-matching">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">SIH26075 Core Differentiator</span>
          <h2 className="lp-h2">
            Algorithmic Competency & Trainer Matching
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            Pair specialized course competencies with verified domain experts using a transparent, weighted 4-factor scoring model.
          </p>
        </div>

        {/* 4-FACTOR SCORING WEIGHTS */}
        <div className="lp-factor-grid">
          {MATCHING_FACTORS.map((f, idx) => (
            <div key={f.label} className="lp-factor-card" data-factor-bar={idx}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lp-cyan)', marginBottom: '0.2rem' }}>
                {f.weight}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--lp-text)' }}>
                {f.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* VISUAL MATCH DEMO CARD */}
        <div className="lp-match-container" data-competency-card>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--lp-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--lp-cyan-glow)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>COURSE COMPETENCY DEMO</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--lp-text)' }}>Cloud Computing & GIS Analysis</div>
              </div>
            </div>
            <span className="lp-badge lp-badge-cyan">SIH26075 Standard Algorithmic Match</span>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            EVALUATED TRAINER RECOMMENDATIONS
          </div>

          {/* TRAINER MATCH CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {DEMO_TRAINERS.map((t, idx) => (
              <div 
                key={t.name}
                style={{
                  backgroundColor: t.score >= 90 ? 'rgba(34, 211, 238, 0.08)' : 'var(--lp-bg-surface)',
                  border: `1px solid ${t.score >= 90 ? 'var(--lp-cyan)' : 'var(--lp-border)'}`,
                  borderRadius: 'var(--lp-radius-md)',
                  padding: '1.25rem',
                  transition: 'border-color 0.2s ease'
                }}
                data-trainer-item={idx}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--lp-text)' }}>{t.name}</span>
                      <span className="lp-badge lp-badge-cyan" style={{ fontSize: '0.7rem' }}>{t.qual}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                      Experience: {t.exp} • Skills: <span style={{ color: 'var(--lp-text)' }}>{t.domain}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: t.score >= 90 ? 'var(--lp-cyan)' : t.score >= 60 ? 'var(--lp-amber)' : 'var(--lp-text-dim)' }}>
                        {t.score}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--lp-text-muted)' }}>Match Score</div>
                    </div>
                    <span className={`lp-badge ${t.score >= 90 ? 'lp-badge-emerald' : t.score >= 60 ? 'lp-badge-amber' : 'lp-badge-cyan'}`}>
                      {t.matchType}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--lp-border)', fontSize: '0.8rem', color: 'var(--lp-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} style={{ color: t.score >= 90 ? 'var(--lp-emerald)' : 'var(--lp-text-dim)' }} />
                  <span><strong>Rationale:</strong> {t.rationale}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default CompetencyMatchSection;
