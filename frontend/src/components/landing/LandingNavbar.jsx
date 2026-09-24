import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Building2, UserCheck, GraduationCap, Sun, Moon, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = ({ scrollToSection, theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const demoDropdownRef = useRef(null);

  // Sticky header background blur effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (demoDropdownRef.current && !demoDropdownRef.current.contains(event.target)) {
        setDemoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility: Escape key closes dropdown & mobile menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setDemoDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background document scrolling while mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('lp-scroll-locked');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('lp-scroll-locked');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('lp-scroll-locked');
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile drawer automatically if window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1180 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  const handleNavClick = (sectionId) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setDemoDropdownOpen(false);
    scrollToSection(sectionId);
  };

  const handleDemoAccess = async (role) => {
    setDropdownOpen(false);
    setDemoDropdownOpen(false);
    setMobileOpen(false);
    try {
      const res = await demoLogin(role);
      if (res.success) {
        if (res.role === 'Admin') navigate('/admin/dashboard');
        else if (res.role === 'Trainer') navigate('/trainer/dashboard');
        else navigate('/trainee/dashboard');
      }
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <header className={`lp-navbar ${isScrolled ? 'lp-navbar-scrolled' : ''}`}>
      {/* Scroll Progress Bar Indicator */}
      <div id="lp-scroll-progress-bar" className="lp-scroll-progress" />

      <div className="lp-container">
        <div className="lp-nav-inner">
          
          {/* BRAND LOGO */}
          <Link to="/" className="lp-logo-box" aria-label="Capacity Connect Home">
            <div className="lp-logo-icon">CC</div>
            <div>
              <span className="lp-logo-title">Capacity Connect</span>
              <span className="lp-logo-sub">Digital Capacity Building Ecosystem</span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="lp-nav-links desktop-only" aria-label="Main Navigation">
            <button 
              type="button"
              onClick={() => handleNavClick('overview')} 
              className="lp-nav-btn"
            >
              Overview
            </button>
            <button 
              type="button"
              onClick={() => handleNavClick('how-it-works')} 
              className="lp-nav-btn"
            >
              How It Works
            </button>
            <button 
              type="button"
              onClick={() => handleNavClick('roles')} 
              className="lp-nav-btn"
            >
              Portals
            </button>
            <button 
              type="button"
              onClick={() => handleNavClick('capabilities')} 
              className="lp-nav-btn"
            >
              Capabilities
            </button>
            <button 
              type="button"
              onClick={() => handleNavClick('organizations')} 
              className="lp-nav-btn"
            >
              For Organizations
            </button>
          </nav>

          {/* DESKTOP ACTIONS & DROPDOWN */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* THEME TOGGLE BUTTON */}
            <button
              type="button"
              onClick={toggleTheme}
              className="lp-theme-btn"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={theme === 'light'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* TRY DEMO DROPDOWN */}
            <div className="lp-dropdown-container" ref={demoDropdownRef}>
              <button
                type="button"
                className="lp-btn lp-btn-secondary"
                onClick={() => {
                  setDemoDropdownOpen(!demoDropdownOpen);
                  setDropdownOpen(false);
                }}
                style={{ borderColor: 'var(--lp-cyan)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Sparkles size={16} /> Try Demo <ChevronDown size={14} style={{ transform: demoDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {demoDropdownOpen && (
                <div className="lp-dropdown-menu" role="menu" style={{ width: '220px' }}>
                  <button 
                    type="button"
                    className="lp-dropdown-item"
                    onClick={() => handleDemoAccess('Trainee')}
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GraduationCap size={16} style={{ color: 'var(--lp-emerald)' }} />
                      <span className="lp-dropdown-item-title">Trainee Demo</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="lp-dropdown-item"
                    onClick={() => handleDemoAccess('Trainer')}
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} style={{ color: 'var(--lp-violet)' }} />
                      <span className="lp-dropdown-item-title">Trainer Demo</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="lp-dropdown-item"
                    onClick={() => handleDemoAccess('Admin')}
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={16} style={{ color: 'var(--lp-cyan)' }} />
                      <span className="lp-dropdown-item-title">Admin Demo</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <Link to="/login" className="lp-btn lp-btn-secondary">
              Sign In
            </Link>

            <div className="lp-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className="lp-btn lp-btn-primary"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setDemoDropdownOpen(false);
                }}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-controls="get-started-menu"
              >
                Get Started <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {dropdownOpen && (
                <div id="get-started-menu" className="lp-dropdown-menu" role="menu">
                  <Link 
                    to="/admin/register" 
                    className="lp-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} style={{ color: 'var(--lp-cyan)' }} />
                      <span className="lp-dropdown-item-title">Register Organization</span>
                    </div>
                    <span className="lp-dropdown-item-sub">Create workspace & access keys</span>
                  </Link>

                  <Link 
                    to="/register" 
                    className="lp-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} style={{ color: 'var(--lp-emerald)' }} />
                      <span className="lp-dropdown-item-title">Register as Trainee</span>
                    </div>
                    <span className="lp-dropdown-item-sub">Join with Trainee Access Key</span>
                  </Link>

                  <Link 
                    to="/trainer/apply" 
                    className="lp-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GraduationCap size={16} style={{ color: 'var(--lp-violet)' }} />
                      <span className="lp-dropdown-item-title">Apply as Trainer</span>
                    </div>
                    <span className="lp-dropdown-item-sub">Submit profile for admin approval</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="lp-theme-btn"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={theme === 'light'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              type="button"
              className="lp-btn lp-btn-secondary"
              style={{ padding: '0.5rem', minHeight: '44px', minWidth: '44px', width: '44px', justifyContent: 'center' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="lp-mobile-drawer-panel"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE BACKDROP & DRAWER OVERLAY */}
      {mobileOpen && (
        <>
          <div 
            className="lp-mobile-backdrop mobile-only" 
            onClick={() => setMobileOpen(false)} 
            aria-hidden="true" 
          />

          <div 
            id="lp-mobile-drawer-panel"
            className="lp-mobile-drawer mobile-only" 
            role="dialog" 
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <button type="button" onClick={() => handleNavClick('overview')} className="lp-mobile-nav-btn">Overview</button>
            <button type="button" onClick={() => handleNavClick('how-it-works')} className="lp-mobile-nav-btn">How It Works</button>
            <button type="button" onClick={() => handleNavClick('roles')} className="lp-mobile-nav-btn">Portals</button>
            <button type="button" onClick={() => handleNavClick('capabilities')} className="lp-mobile-nav-btn">Capabilities</button>
            <button type="button" onClick={() => handleNavClick('organizations')} className="lp-mobile-nav-btn">For Organizations</button>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Instant Demo Access
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                <button type="button" onClick={() => handleDemoAccess('Trainee')} className="lp-btn lp-btn-secondary" style={{ padding: '0.4rem 0.2rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  Trainee
                </button>
                <button type="button" onClick={() => handleDemoAccess('Trainer')} className="lp-btn lp-btn-secondary" style={{ padding: '0.4rem 0.2rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  Trainer
                </button>
                <button type="button" onClick={() => handleDemoAccess('Admin')} className="lp-btn lp-btn-secondary" style={{ padding: '0.4rem 0.2rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  Admin
                </button>
              </div>

              <Link to="/login" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-secondary" style={{ width: '100%', minHeight: '44px' }}>
                Sign In
              </Link>
              <Link to="/admin/register" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-primary" style={{ width: '100%', minHeight: '44px' }}>
                Register Organization / Admin
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-outline" style={{ width: '100%', minHeight: '44px' }}>
                Register as Trainee
              </Link>
              <Link to="/trainer/apply" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-secondary" style={{ width: '100%', minHeight: '44px', borderColor: 'var(--lp-violet)', color: 'var(--lp-violet)' }}>
                Apply as Trainer
              </Link>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 1180px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 1179px) {
          .desktop-only { display: none !important; }
        }
        @media (max-width: 360px) {
          .lp-logo-sub { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default LandingNavbar;
