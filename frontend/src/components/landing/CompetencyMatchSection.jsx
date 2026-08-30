import { useState, useId } from 'react';
import { Target, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

const CANDIDATE_VECTORS = [
  {
    name: 'Dr. Vikram R. Sharma',
    qual: 'Ph.D. Computer Science',
    exp: '14 Years Domain Exp',
    domain: 'Cloud Architecture, GIS, Distributed Systems',
    scores: { skill: 100, domain: 95, exp: 95, qual: 100 },
    rationale: 'Perfect overlap across primary competency tags & doctorate qualification.'
  },
  {
    name: 'Ananya Deshmukh',
    qual: 'M.Tech Software Systems',
    exp: '6 Years Domain Exp',
    domain: 'Cloud Infrastructure, DevOps',
    scores: { skill: 75, domain: 70, exp: 80, qual: 70 },
    rationale: 'Strong skill alignment with partial GIS domain specialization.'
  },
  {
    name: 'Rajesh K. Patel',
    qual: 'B.Tech IT',
    exp: '3 Years Domain Exp',
    domain: 'General IT, Networking',
    scores: { skill: 45, domain: 40, exp: 50, qual: 40 },
    rationale: 'Baseline eligibility met; low direct topic specialization match.'
  }
];

const CompetencyMatchSection = () => {
  const [wSkill, setWSkill] = useState(40);
  const [wDomain, setWDomain] = useState(30);
  const [wExp, setWExp] = useState(15);
  const [wQual, setWQual] = useState(15);

  const skillInputId = useId();
  const domainInputId = useId();
  const expInputId = useId();
  const qualInputId = useId();

  const totalWeight = wSkill + wDomain + wExp + wQual;

  const resetWeights = () => {
    setWSkill(40);
    setWDomain(30);
    setWExp(15);
    setWQual(15);
  };

  const calculateScore = (v) => {
    if (totalWeight <= 0) return 0;
    const weightedSum = (v.skill * wSkill) + (v.domain * wDomain) + (v.exp * wExp) + (v.qual * wQual);
    return Math.min(100, Math.round(weightedSum / totalWeight));
  };

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

        {/* INTERACTIVE WEIGHT ADJUSTMENT CONTROLS */}
        <div 
          style={{
            background: 'var(--lp-bg-glass-card)',
            border: '1px solid var(--lp-border)',
            borderRadius: 'var(--lp-radius-xl)',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} style={{ color: 'var(--lp-cyan)' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--lp-text)' }}>
                SIH26075 Interactive Weighting Simulator
              </span>
            </div>

            <button
              type="button"
              onClick={resetWeights}
              className="lp-btn lp-btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} /> Reset Default Weights (40/30/15/15)
            </button>
          </div>

          <div className="lp-factor-grid" style={{ marginBottom: '0' }}>
            
            {/* FACTOR 1 */}
            <div className="lp-factor-card" data-factor-bar={0}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={skillInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Skill Match</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-cyan)' }}>{wSkill}%</span>
              </div>
              <input
                id={skillInputId}
                type="range"
                min="0"
                max="100"
                value={wSkill}
                onChange={(e) => setWSkill(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-cyan)' }}
                aria-label="Skill match weight percentage"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Topic keyword & practical competency alignment
              </div>
            </div>

            {/* FACTOR 2 */}
            <div className="lp-factor-card" data-factor-bar={1}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={domainInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Primary Domain</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-blue)' }}>{wDomain}%</span>
              </div>
              <input
                id={domainInputId}
                type="range"
                min="0"
                max="100"
                value={wDomain}
                onChange={(e) => setWDomain(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-blue)' }}
                aria-label="Primary domain weight percentage"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Departmental specialization & focus field
              </div>
            </div>

            {/* FACTOR 3 */}
            <div className="lp-factor-card" data-factor-bar={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={expInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Experience</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-violet)' }}>{wExp}%</span>
              </div>
              <input
                id={expInputId}
                type="range"
                min="0"
                max="100"
                value={wExp}
                onChange={(e) => setWExp(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-violet)' }}
                aria-label="Experience weight percentage"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Verified industry & academic instruction years
              </div>
            </div>

            {/* FACTOR 4 */}
            <div className="lp-factor-card" data-factor-bar={3}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={qualInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Qualification</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-emerald)' }}>{wQual}%</span>
              </div>
              <input
                id={qualInputId}
                type="range"
                min="0"
                max="100"
                value={wQual}
                onChange={(e) => setWQual(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-emerald)' }}
                aria-label="Qualification weight percentage"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Highest degree, certifications & credentials
              </div>
            </div>

          </div>
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
            <span className="lp-badge lp-badge-cyan">Live Weight-Calculated Recommendations</span>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            RECOMMENDED CANDIDATE RANKING
          </div>

          {/* TRAINER MATCH CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CANDIDATE_VECTORS.map((t, idx) => {
              const liveScore = calculateScore(t.scores);
              const isTop = liveScore >= 85;
              const isMid = liveScore >= 60 && liveScore < 85;

              return (
                <div 
                  key={t.name}
                  style={{
                    backgroundColor: isTop ? 'rgba(34, 211, 238, 0.08)' : 'var(--lp-bg-surface)',
                    border: `1px solid ${isTop ? 'var(--lp-cyan)' : 'var(--lp-border)'}`,
                    borderRadius: 'var(--lp-radius-md)',
                    padding: '1.25rem',
                    transition: 'all 0.25s ease'
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
                        {t.exp} • Focus: <span style={{ color: 'var(--lp-text)' }}>{t.domain}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isTop ? 'var(--lp-cyan)' : isMid ? 'var(--lp-amber)' : 'var(--lp-text-muted)' }}>
                          {liveScore}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--lp-text-muted)' }}>Calculated Match</div>
                      </div>
                      <span className={`lp-badge ${isTop ? 'lp-badge-emerald' : isMid ? 'lp-badge-amber' : 'lp-badge-cyan'}`}>
                        {isTop ? 'Optimal Match' : isMid ? 'Partial Match' : 'Secondary Match'}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--lp-border)', fontSize: '0.8rem', color: 'var(--lp-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: isTop ? 'var(--lp-emerald)' : 'var(--lp-text-dim)' }} />
                    <span><strong>Rationale:</strong> {t.rationale}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--lp-text-muted)', textAlign: 'center' }}>
            * Note: This interactive calculation is an illustrative landing-page simulator of the SIH26075 weighted matching engine.
          </div>

        </div>

      </div>
    </section>
  );
};

export default CompetencyMatchSection;
