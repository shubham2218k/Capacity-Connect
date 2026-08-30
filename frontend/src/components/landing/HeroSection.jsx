import { lazy, Suspense, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  UserCheck, 
  Target,
  ShieldCheck,
  Key,
  Globe2
} from 'lucide-react';

import HeroSceneFallback from './HeroSceneFallback';
import HeroSceneBoundary from './HeroSceneBoundary';
import { useHeroSceneEligibility } from '../../hooks/useHeroSceneEligibility';
import { useHeroPointerDepth } from '../../hooks/useHeroPointerDepth';

// Lazy-load WebGL Canvas Chunk
const HeroScene = lazy(() => import('./HeroScene'));

const HeroSection = ({ scrollToSection, theme, prefersReducedMotion }) => {
  const containerRef = useRef(null);
  const isEligible = useHeroSceneEligibility(prefersReducedMotion);
  const pointerRef = useHeroPointerDepth(containerRef, prefersReducedMotion);

  // Viewport visibility & Tab active state for frameloop optimization
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [hasContextError, setHasContextError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const node = containerRef.current;

    // 1. Intersection Observer for viewport visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
        if (!entry.isIntersecting && pointerRef.current) {
          // Reset pointer target when leaving viewport
          pointerRef.current = { x: 0, y: 0 };
        }
      },
      { threshold: 0.05 }
    );

    if (node) {
      observer.observe(node);
    }

    // 2. Tab visibility listener
    const handleVisibilityChange = () => {
      const active = document.visibilityState === 'visible';
      setIsTabActive(active);
      if (!active && pointerRef.current) {
        pointerRef.current = { x: 0, y: 0 };
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pointerRef]);

  const showWebGL = isEligible && !hasContextError;
  const isFrameloopActive = isHeroInView && isTabActive;

  return (
    <section 
      ref={containerRef}
      className="lp-hero" 
      data-hero-container
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* ALWAYS RENDER STATIC FALLBACK UNDERNEATH */}
      <HeroSceneFallback theme={theme} />

      {/* WEBGL CANVAS (RENDERED ONLY WHEN ELIGIBLE AND NO CONTEXT ERROR) */}
      {showWebGL && (
        <HeroSceneBoundary theme={theme}>
          <Suspense fallback={null}>
            <HeroScene 
              theme={theme} 
              pointerRef={pointerRef} 
              isFrameloopActive={isFrameloopActive}
              onContextLost={() => setHasContextError(true)}
            />
          </Suspense>
        </HeroSceneBoundary>
      )}

      {/* HERO DOM CONTENT (Z-INDEX 10, FULLY CLICKABLE) */}
      <div className="lp-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="lp-hero-grid">
          
          {/* HERO TEXT COLUMN */}
          <div style={{ position: 'relative' }}>
            <div className="lp-eyebrow" data-hero-heading-line="0">
              <Sparkles size={16} />
              Digital Capacity Building & Competency Management
            </div>

            {/* SIMPLIFIED 3-LINE HEADLINE WITH SOLID BRAND ACCENT (NO RAINBOW GRADIENT) */}
            <h1 className="lp-h1" data-hero-heading-line="1">
              Build Skills.<br />
              <span className="lp-hero-accent-text">Map Competencies.</span><br />
              Measure Impact.
            </h1>

            <p className="lp-subtitle" style={{ marginBottom: '2.25rem', maxWidth: '560px' }} data-hero-heading-line="2">
              A secure, multi-organization capacity-building ecosystem connecting administrators, trainers and trainees—from identified needs to measurable outcomes.
            </p>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }} data-hero-heading-line="3">
              <button 
                type="button"
                onClick={() => scrollToSection('capabilities')} 
                className="lp-btn lp-btn-primary"
                style={{ padding: '0.85rem 1.85rem' }}
              >
                Explore Platform <ArrowRight size={18} />
              </button>

              <Link to="/login" className="lp-btn lp-btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
                Sign In
              </Link>

              <Link 
                to="/admin/register" 
                style={{ 
                  fontSize: '0.925rem', 
                  fontWeight: 600, 
                  color: 'var(--lp-cyan)', 
                  textDecoration: 'none', 
                  padding: '0.5rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                Register Organization →
              </Link>
            </div>

            {/* HIGHLIGHT BADGES */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '2.75rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--lp-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--lp-text)', fontWeight: 500 }}>
                <ShieldCheck size={18} style={{ color: 'var(--lp-cyan)' }} /> Role-Based Governance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--lp-text)', fontWeight: 500 }}>
                <Key size={18} style={{ color: 'var(--lp-emerald)' }} /> Key-Verified Access
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--lp-text)', fontWeight: 500 }}>
                <Globe2 size={18} style={{ color: 'var(--lp-violet)' }} /> Multi-Organization Support
              </div>
            </div>
          </div>

          {/* WORKSPACE DASHBOARD PREVIEW COLUMN */}
          <div data-hero-layer="container" style={{ perspective: '1200px' }}>
            <div 
              className="lp-dashboard-preview" 
              data-hero-layer="card"
              style={{ transformStyle: 'preserve-3d' }}
            >
              
              {/* Header bar */}
              <div className="lp-preview-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="lp-preview-dots">
                    <div className="lp-dot" style={{ backgroundColor: '#EF4444' }} />
                    <div className="lp-dot" style={{ backgroundColor: '#F59E0B' }} />
                    <div className="lp-dot" style={{ backgroundColor: '#10B981' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--lp-text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>
                    Organization Control Panel Demo
                  </span>
                </div>
                <span className="lp-badge lp-badge-cyan">Live Workspace View</span>
              </div>

              {/* Capability Modules Overview */}
              <div className="lp-preview-modules">
                
                {/* Module 1 */}
                <div className="lp-preview-item" data-hero-layer="item-1">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--lp-cyan-glow)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--lp-text)' }}>Learning Management</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--lp-text-muted)' }}>Structured Courses, Video Modules & PDF Library</div>
                    </div>
                  </div>
                  <span className="lp-badge lp-badge-cyan">Course Catalog</span>
                </div>

                {/* Module 2 */}
                <div className="lp-preview-item" data-hero-layer="item-2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--lp-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--lp-text)' }}>Assessment & Evaluation</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--lp-text-muted)' }}>Timed MCQ Exams, Automated Grading & PDF Certificates</div>
                    </div>
                  </div>
                  <span className="lp-badge lp-badge-amber">MCQ Engine</span>
                </div>

                {/* Module 3 */}
                <div className="lp-preview-item" data-hero-layer="item-3">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--lp-emerald-glow)', color: 'var(--lp-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--lp-text)' }}>Trainer Verification Gate</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--lp-text-muted)' }}>Admin Approval Workflow & Expertise Profiling</div>
                    </div>
                  </div>
                  <span className="lp-badge lp-badge-emerald">Governance Gate</span>
                </div>

                {/* Module 4 */}
                <div className="lp-preview-item" data-hero-layer="item-4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--lp-violet-glow)', color: 'var(--lp-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--lp-text)' }}>SIH26075 Competency Engine</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--lp-text-muted)' }}>Weighted 4-Factor Subject & Instructor Matching</div>
                    </div>
                  </div>
                  <span className="lp-badge lp-badge-violet">Algorithmic Match</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
