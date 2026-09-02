import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useLandingTheme } from '../../hooks/useLandingTheme';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { CapabilityThread } from './CapabilityThread';
import { AuthIllustration } from './AuthIllustration';
import '../../styles/auth-forms.css';

/**
 * AuthPageShell: Integrated shell for "Inked Capability Studio".
 * Features GSAP entrance timeline, CapabilityThread background path, and theme persistence.
 */
export const AuthPageShell = ({
  illustrationType = 'admin-register',
  activeRole = 'Trainee',
  currentStep = 1,
  title,
  subtitle,
  children,
  wide = false,
  reverseLayout = false
}) => {
  const [theme, toggleTheme] = useLandingTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  // GSAP Initial Page Entrance Sequence
  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        sidebarRef.current,
        { opacity: 0, x: reverseLayout ? 16 : -16 },
        { opacity: 1, x: 0, duration: 0.45 }
      ).fromTo(
        mainRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45 },
        '-=0.25'
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, reverseLayout]);

  return (
    <div className="cc-auth-page" data-theme={theme}>
      <div className="cc-auth-shell" style={{ flexDirection: reverseLayout ? 'row-reverse' : 'row' }}>
        
        {/* Story / Vector Illustration Panel */}
        <aside
          ref={sidebarRef}
          className="cc-auth-sidebar"
          aria-label="Brand & Illustration Context"
          style={{
            borderRight: reverseLayout ? 'none' : '1px solid var(--cc-border)',
            borderLeft: reverseLayout ? '1px solid var(--cc-border)' : 'none'
          }}
        >
          {/* Capability Thread Background Path & Numeral */}
          <CapabilityThread currentStep={currentStep} theme={theme} />

          <div style={{ display: 'flex', items: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 3 }}>
            <Link to="/" className="cc-auth-brand-logo">
              <div className="cc-auth-brand-icon">CC</div>
              <div className="cc-auth-brand-text">
                <h1>Capacity Connect</h1>
                <p>Ecosystem Studio</p>
              </div>
            </Link>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              className="cc-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="cc-auth-illustration-container">
            <AuthIllustration type={illustrationType} role={activeRole} theme={theme} />
          </div>

          <footer className="cc-auth-sidebar-footer">
            <span>&copy; {new Date().getFullYear()} Capacity Connect</span>
            <span>Enterprise LMS</span>
          </footer>
        </aside>

        {/* Form Workspace Panel */}
        <main ref={mainRef} className="cc-auth-main">
          <div className={`cc-auth-workspace ${wide ? 'cc-auth-workspace-wide' : ''}`}>
            {(title || subtitle) && (
              <header className="cc-auth-header-block">
                {title && <h2 className="cc-auth-title">{title}</h2>}
                {subtitle && <p className="cc-auth-subtitle">{subtitle}</p>}
              </header>
            )}
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
