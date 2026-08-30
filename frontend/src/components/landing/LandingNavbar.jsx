import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Building2, UserCheck, GraduationCap } from 'lucide-react';

const LandingNavbar = ({ scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility: Escape key closes dropdown & mobile menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <header className={`lp-navbar ${isScrolled ? 'lp-navbar-scrolled' : ''}`}>
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
              onClick={() => handleNavClick('roles')} 
              className="lp-nav-btn"
            >
              Portals
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
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" className="lp-btn lp-btn-secondary">
              Sign In
            </Link>

            <div className="lp-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className="lp-btn lp-btn-primary"
                onClick={() => setDropdownOpen(!dropdownOpen)}
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

          {/* MOBILE TOGGLE BUTTON */}
          <button
            type="button"
            className="mobile-only lp-btn lp-btn-secondary"
            style={{ padding: '0.5rem', minHeight: '44px', width: '44px', justifyContent: 'center' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="lp-mobile-drawer mobile-only" role="dialog" aria-modal="true">
          <button type="button" onClick={() => handleNavClick('overview')} className="lp-mobile-nav-btn">Overview</button>
          <button type="button" onClick={() => handleNavClick('roles')} className="lp-mobile-nav-btn">Portals</button>
          <button type="button" onClick={() => handleNavClick('how-it-works')} className="lp-mobile-nav-btn">How It Works</button>
          <button type="button" onClick={() => handleNavClick('capabilities')} className="lp-mobile-nav-btn">Capabilities</button>
          <button type="button" onClick={() => handleNavClick('organizations')} className="lp-mobile-nav-btn">For Organizations</button>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-secondary" style={{ width: '100%' }}>
              Sign In
            </Link>
            <Link to="/admin/register" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-primary" style={{ width: '100%' }}>
              Register Organization / Admin
            </Link>
            <Link to="/register" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-outline" style={{ width: '100%' }}>
              Register as Trainee
            </Link>
            <Link to="/trainer/apply" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-secondary" style={{ width: '100%', borderColor: 'var(--lp-violet)', color: 'var(--lp-violet)' }}>
              Apply as Trainer
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default LandingNavbar;
