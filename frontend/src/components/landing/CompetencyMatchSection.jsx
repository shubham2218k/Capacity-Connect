import { useState, useId } from 'react';
import { Target, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

const SAMPLE_TRAINER_PROFILES = [
  {
    name: 'Trainer Profile A',
    qual: 'Doctoral / Advanced Domain Degree',
    exp: '14 Years Domain Experience',
    domain: 'Cloud Infrastructure, GIS, Distributed Systems',
    scores: { skill: 100, domain: 95, exp: 95, qual: 100 },
    rationale: 'High alignment across primary competency tags & domain experience.'
  },
  {
    name: 'Trainer Profile B',
    qual: 'Master Degree Specialization',
    exp: '6 Years Domain Experience',
    domain: 'Cloud Architecture & DevOps',
    scores: { skill: 75, domain: 70, exp: 80, qual: 70 },
    rationale: 'Strong skill alignment with partial GIS domain specialization.'
  },
  {
    name: 'Trainer Profile C',
    qual: 'Bachelor Degree Foundation',
    exp: '3 Years Domain Experience',
    domain: 'General IT Infrastructure',
    scores: { skill: 45, domain: 40, exp: 50, qual: 40 },
    rationale: 'Baseline eligibility met; lower direct topic specialization match.'
  }
];

const DEFAULT_WEIGHTS = { skill: 40, domain: 30, exp: 15, qual: 15 };

const CompetencyMatchSection = () => {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  const skillInputId = useId();
  const domainInputId = useId();
  const expInputId = useId();
  const qualInputId = useId();

  // Controlled Redistribution Logic: Ensures total weight ALWAYS equals 100%
  const handleWeightChange = (changedKey, rawValue) => {
    const clampedVal = Math.min(100, Math.max(0, Math.round(Number(rawValue))));
    const remaining = 100 - clampedVal;

    const otherKeys = ['skill', 'domain', 'exp', 'qual'].filter((k) => k !== changedKey);
    const otherSum = otherKeys.reduce((sum, k) => sum + weights[k], 0);

    const nextWeights = { ...weights, [changedKey]: clampedVal };

    if (otherSum > 0) {
      let distributed = 0;
      otherKeys.forEach((k, idx) => {
        if (idx === otherKeys.length - 1) {
          nextWeights[k] = remaining - distributed; // Exact integer closure
        } else {
          const val = Math.round((weights[k] / otherSum) * remaining);
          nextWeights[k] = val;
          distributed += val;
        }
      });
    } else {
      const each = Math.floor(remaining / 3);
      const rem = remaining - (each * 3);
      otherKeys.forEach((k, idx) => {
        nextWeights[k] = each + (idx === 0 ? rem : 0);
      });
    }

    setWeights(nextWeights);
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const totalWeight = weights.skill + weights.domain + weights.exp + weights.qual;

  // Formula: Total Match = Σ(Factor Score × Factor Weight) / 100
  const calculateScore = (scores) => {
    const weightedSum = 
      (scores.skill * weights.skill) +
      (scores.domain * weights.domain) +
      (scores.exp * weights.exp) +
      (scores.qual * weights.qual);
    
    return Math.min(100, Math.max(0, Math.round(weightedSum / 100)));
  };

  return (
    <section className="lp-section" data-section="competency-matching">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">Problem Statement 26075 Core Feature</span>
          <h2 className="lp-h2">
            Algorithmic Competency & Trainer Matching
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            Pair course competencies with verified domain experts using a transparent, weighted 4-factor scoring model.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Sliders size={18} style={{ color: 'var(--lp-cyan)' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--lp-text)' }}>
                Factor Weight Simulator
              </span>
              <span className="lp-badge lp-badge-cyan" style={{ fontSize: '0.75rem' }}>
                Total Weight: {totalWeight}%
              </span>
            </div>

            <button
              type="button"
              onClick={resetWeights}
              className="lp-btn lp-btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} /> Reset Default Weights (40 / 30 / 15 / 15)
            </button>
          </div>

          {/* 4-FACTOR SLIDER GRID */}
          <div className="lp-factor-grid" style={{ marginBottom: '1.25rem' }}>
            
            {/* FACTOR 1: SKILL MATCH */}
            <div className="lp-factor-card" data-factor-bar={0}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={skillInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Skill Match</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-cyan)' }}>{weights.skill}%</span>
              </div>
              <input
                id={skillInputId}
                type="range"
                min="0"
                max="100"
                value={weights.skill}
                onChange={(e) => handleWeightChange('skill', e.target.value)}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-cyan)' }}
                aria-label="Skill match weight percentage"
                aria-valuetext={`${weights.skill} percent`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Topic keyword & competency alignment
              </div>
            </div>

            {/* FACTOR 2: PRIMARY DOMAIN */}
            <div className="lp-factor-card" data-factor-bar={1}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={domainInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Primary Domain</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-blue)' }}>{weights.domain}%</span>
              </div>
              <input
                id={domainInputId}
                type="range"
                min="0"
                max="100"
                value={weights.domain}
                onChange={(e) => handleWeightChange('domain', e.target.value)}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-blue)' }}
                aria-label="Primary domain weight percentage"
                aria-valuetext={`${weights.domain} percent`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Departmental specialization field
              </div>
            </div>

            {/* FACTOR 3: EXPERIENCE */}
            <div className="lp-factor-card" data-factor-bar={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={expInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Experience</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-violet)' }}>{weights.exp}%</span>
              </div>
              <input
                id={expInputId}
                type="range"
                min="0"
                max="100"
                value={weights.exp}
                onChange={(e) => handleWeightChange('exp', e.target.value)}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-violet)' }}
                aria-label="Experience weight percentage"
                aria-valuetext={`${weights.exp} percent`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Verified industry & instruction years
              </div>
            </div>

            {/* FACTOR 4: QUALIFICATION */}
            <div className="lp-factor-card" data-factor-bar={3}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor={qualInputId} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--lp-text)' }}>Qualification</label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--lp-emerald)' }}>{weights.qual}%</span>
              </div>
              <input
                id={qualInputId}
                type="range"
                min="0"
                max="100"
                value={weights.qual}
                onChange={(e) => handleWeightChange('qual', e.target.value)}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--lp-emerald)' }}
                aria-label="Qualification weight percentage"
                aria-valuetext={`${weights.qual} percent`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', marginTop: '0.25rem' }}>
                Highest degree & credentials
              </div>
            </div>

          </div>

          <div style={{ fontSize: '0.775rem', color: 'var(--lp-text-muted)', fontStyle: 'italic', paddingTop: '0.75rem', borderTop: '1px dashed var(--lp-border)' }}>
            Formula: Total Match Score = Σ(Normalized Factor Score × Factor Weight) / 100. Adjusting any slider proportionally redistributes remaining weights so the total always equals 100%.
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
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--lp-text)' }}>Cloud Infrastructure & GIS Analysis</div>
              </div>
            </div>
            <span className="lp-badge lp-badge-cyan">Instant Illustrative Recalculation</span>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            ILLUSTRATIVE TRAINER PROFILES · CLIENT-SIDE CALCULATION
          </div>

          {/* SAMPLE PROFILES CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SAMPLE_TRAINER_PROFILES.map((t, idx) => {
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
                        {t.exp} • Specialization: <span style={{ color: 'var(--lp-text)' }}>{t.domain}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isTop ? 'var(--lp-cyan)' : isMid ? 'var(--lp-amber)' : 'var(--lp-text-muted)' }}>
                          {liveScore}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--lp-text-muted)' }}>Calculated Score</div>
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
            * Note: Illustrative trainer profiles and client-side scoring demonstration for Problem Statement 26075.
          </div>

        </div>

      </div>
    </section>
  );
};

export default CompetencyMatchSection;
