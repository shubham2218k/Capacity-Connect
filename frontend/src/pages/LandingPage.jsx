import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  ChevronDown, 
  Menu, 
  X, 
  FileText, 
  BarChart3, 
  Key, 
  Check, 
  Compass, 
  Lock, 
  GraduationCap, 
  UserCheck, 
  Globe2, 
  Target,
  Sparkles,
  BellRing
} from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [getStartedDropdown, setGetStartedDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh', color: 'var(--text-dark)' }}>
      
      {/* NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'var(--white)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          
          {/* BRAND LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.15rem'
            }}>
              CC
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1, display: 'block' }}>
                Capacity Connect
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 600, letterSpacing: '0.02em' }}>
                Digital Capacity Building
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            <button 
              onClick={() => scrollToSection('overview')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Overview
            </button>
            <button 
              onClick={() => scrollToSection('roles')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Portals
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('capabilities')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Capabilities
            </button>
            <button 
              onClick={() => scrollToSection('organizations')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              For Organizations
            </button>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.15rem' }}>
              Sign In
            </Link>

            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setGetStartedDropdown(!getStartedDropdown)}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.25rem', gap: '0.35rem' }}
              >
                Get Started <ChevronDown size={16} />
              </button>

              {getStartedDropdown && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '260px',
                    backgroundColor: 'var(--white)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem',
                    zIndex: 110
                  }}
                  onMouseLeave={() => setGetStartedDropdown(false)}
                >
                  <Link 
                    to="/admin/register"
                    onClick={() => setGetStartedDropdown(false)}
                    style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Register Organization / Admin</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Create workspace & access keys</span>
                  </Link>

                  <Link 
                    to="/register"
                    onClick={() => setGetStartedDropdown(false)}
                    style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Register as Trainee</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Join with organization key</span>
                  </Link>

                  <Link 
                    to="/trainer/apply"
                    onClick={() => setGetStartedDropdown(false)}
                    style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Apply as Trainer</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Submit profile for admin approval</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <button onClick={() => scrollToSection('overview')} style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>Overview</button>
            <button onClick={() => scrollToSection('roles')} style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>Portals</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>How It Works</button>
            <button onClick={() => scrollToSection('capabilities')} style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>Capabilities</button>
            <button onClick={() => scrollToSection('organizations')} style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>For Organizations</button>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Sign In</Link>
              <Link to="/admin/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Register Organization / Admin</Link>
              <Link to="/register" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Register as Trainee</Link>
              <Link to="/trainer/apply" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Apply as Trainer</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section style={{
        padding: '4.5rem 0 4rem',
        backgroundColor: 'var(--bg-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '3.5rem', alignItems: 'center' }} className="hero-grid">
            
            {/* HERO TEXT */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'var(--secondary-bg)',
                color: '#0369a1',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                border: '1px solid #bae6fd'
              }}>
                <Sparkles size={15} />
                Digital Capacity Building & Learning Management
              </div>

              <h1 style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                color: 'var(--primary)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em'
              }}>
                Build stronger organizations through better learning.
              </h1>

              <p style={{
                fontSize: '1.075rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                Capacity Connect brings organizational training, Trainers, Trainees, assessments, learning resources and competency development into one centralized platform.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <button onClick={() => scrollToSection('capabilities')} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', gap: '0.5rem' }}>
                  Explore Platform <ArrowRight size={18} />
                </button>
                
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}>
                  Sign In
                </Link>
                
                <Link to="/admin/register" style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--secondary-hover)', padding: '0.5rem' }}>
                  Register Organization →
                </Link>
              </div>

              {/* HIGHLIGHT BADGES */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginTop: '2.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Role-Based Governance
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Key-Verified Access
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Multi-Organization Support
                </div>
              </div>
            </div>

            {/* HERO PRODUCT PREVIEW (CAPABILITIES DEMO, NO FAKE STATS) */}
            <div>
              <div style={{
                backgroundColor: 'var(--primary)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-lg)',
                color: 'var(--white)'
              }}>
                {/* Header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--primary-hover)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                      Workspace Dashboard Preview
                    </span>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Platform Demo</span>
                </div>

                {/* Capability Modules Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  
                  {/* Module 1 */}
                  <div style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '10px',
                    padding: '1rem',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--secondary-bg)', color: 'var(--secondary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Learning Management</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Structured Courses, Video Modules & PDF Library</div>
                      </div>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Course Catalog</span>
                  </div>

                  {/* Module 2 */}
                  <div style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '10px',
                    padding: '1rem',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Assessment & Evaluation</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>MCQ Exams, Automated Grading & Score Logs</div>
                      </div>
                    </div>
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>MCQ Engine</span>
                  </div>

                  {/* Module 3 */}
                  <div style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '10px',
                    padding: '1rem',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--success-bg)', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Trainer Verification</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Admin Approval Gate & Expertise Profiling</div>
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Governance</span>
                  </div>

                  {/* Module 4 */}
                  <div style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '10px',
                    padding: '1rem',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Competency Mapping</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Align Training Needs with Verified Expertise</div>
                      </div>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Skill Alignment</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION SECTION */}
      <section id="overview" style={{ padding: '4.5rem 0', backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Centralized Ecosystem
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              One platform for organizational learning
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Organizations often manage training programs, subject-matter Trainers, learning resources, MCQ assessments, employee skills, and certifications across fragmented tools. Capacity Connect centralizes the entire capacity-building lifecycle into one unified system.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--secondary-bg)', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Centralized Workspaces
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Consolidate courses, learning content, assessments, and user records in a single dedicated organizational environment.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-bg)', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <UserCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Verified Trainer Approval
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Organization Admins review and approve Trainer profiles, qualifications, and domain expertise before training begins.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-bg)', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Standardized Assessments
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Trainers create structured MCQ exams with automated grading, passing criteria, and performance tracking for learners.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Competency & Certification
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Track skill proficiency, issue official certificates upon completion, and maintain verifiable employee competency logs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* THREE ROLES SECTION */}
      <section id="roles" style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Role-Based Governance
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Purpose-built portals for every stakeholder
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Capacity Connect provides dedicated workflows tailored to the distinct responsibilities of Admins, Trainers, and Trainees.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* ADMIN CARD */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>Organization Admin</h3>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-light)', fontWeight: 600 }}>Organization Control Center</span>
                </div>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Manage organization settings and workspace access keys</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Review and approve pending Trainer applications</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Monitor active users, course progress, and enrollments</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Oversee competency mapping and publish announcements</span>
                </li>
              </ul>

              <Link to="/admin/register" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>
                Register Organization Admin →
              </Link>
            </div>

            {/* TRAINER CARD */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>Trainer</h3>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-light)', fontWeight: 600 }}>Learning & Assessment Management</span>
                </div>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Create structured courses and curriculum modules</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Upload learning materials (videos, PDFs, slides)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Design MCQ assessments with custom scoring criteria</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Track learner results and maintain domain expertise profile</span>
                </li>
              </ul>

              <Link to="/trainer/apply" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>
                Apply as Trainer →
              </Link>
            </div>

            {/* TRAINEE CARD */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>Trainee</h3>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-light)', fontWeight: 600 }}>Professional Learning Workspace</span>
                </div>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Browse and enroll in organization-mandated courses</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Study via interactive player and resource library</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Attempt MCQ assessments with real-time feedback</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                  <Check size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Build skill profile and earn official certificates</span>
                </li>
              </ul>

              <Link to="/register" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>
                Register as Trainee →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '4.5rem 0', backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Structured Process
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              How Capacity Connect works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              A transparent lifecycle connecting organization onboarding to verified skill improvement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>STEP 01</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Organization Onboarding</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Admin registers the organization and initializes a secure, dedicated digital workspace.
              </p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>STEP 02</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Access Keys Issued</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                The system generates unique Trainee and Trainer access keys to control workspace registration.
              </p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>STEP 03</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainees Join Workspace</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Employees register using authorized trainee access keys and create their professional profiles.
              </p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>STEP 04</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainer Verification</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Trainers apply with credentials; Admin reviews and approves them to grant teaching privileges.
              </p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>STEP 05</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Courses & MCQ Delivered</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Trainers publish video lectures, study materials, and MCQ assessments for active learning.
              </p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>STEP 06</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Progress & Competency Tracked</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Admin monitors organizational skill growth, assessment results, and verified certificates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section id="capabilities" style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Features
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Core platform capabilities
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Comprehensive tools covering administration, content delivery, testing, and skill mapping.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            
            {[
              { icon: ShieldCheck, title: 'Role-Based Portals', desc: 'Customized interfaces and permissions for Admin, Trainer, and Trainee roles.' },
              { icon: BookOpen, title: 'Course Management', desc: 'Create, structure, and organize courses into clear learning modules.' },
              { icon: FileText, title: 'Learning Resource Library', desc: 'Upload and access study materials including PDFs, presentations, and videos.' },
              { icon: CheckCircle, title: 'Automated MCQ Assessments', desc: 'Create timed multiple-choice exams with automated scoring and instant feedback.' },
              { icon: Users, title: 'Professional Skill Profiles', desc: 'Maintain detailed employee profiles with educational qualifications and skill tags.' },
              { icon: Award, title: 'Verifiable Certificates', desc: 'Generate downloadable certificates of completion linked to user records.' },
              { icon: UserCheck, title: 'Trainer Onboarding & Approval', desc: 'Review trainer credentials, background, and expertise before approval.' },
              { icon: BarChart3, title: 'Organizational Analytics', desc: 'Track overall enrollment numbers, completion rates, and assessment metrics.' },
              { icon: BellRing, title: 'Announcements & Broadcasts', desc: 'Publish organization-wide notices and training updates directly to dashboards.' },
              { icon: Target, title: 'Competency Mapping', desc: 'Map course objectives against required organizational skill profiles.' },
              { icon: Compass, title: 'Expertise Matching', desc: 'Match training requirements with verified Trainer subject expertise.' },
              { icon: Building2, title: 'Multi-Organization Isolation', desc: 'Support multiple independent organization workspaces securely on one platform.' }
            ].map(cap => {
              const CapIcon = cap.icon;
              return (
                <div key={cap.title} className="card" style={{ padding: '1.5rem' }}>
                  <CapIcon size={24} style={{ color: 'var(--secondary)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>{cap.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{cap.desc}</p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* CAPACITY BUILDING & COMPETENCY MAPPING */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Impact-Driven Learning
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem', color: 'white' }}>
              Connect training needs with the right expertise
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Capacity Connect bridges daily training activity with the strategic skills an organization needs to develop.
            </p>
          </div>

          {/* CONCEPTUAL FLOW DIAGRAM */}
          <div style={{
            backgroundColor: 'var(--primary-light)',
            padding: '2rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--primary-hover)',
            marginBottom: '3rem'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem'
            }}>
              {[
                { label: 'Organization', icon: Building2 },
                { label: 'People', icon: Users },
                { label: 'Skills', icon: Target },
                { label: 'Training', icon: BookOpen },
                { label: 'Assessment', icon: FileText },
                { label: 'Capacity Improvement', icon: Award }
              ].map((step, idx, arr) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'var(--primary)',
                      padding: '0.65rem 1.15rem',
                      borderRadius: '10px',
                      border: '1px solid var(--primary-hover)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'white'
                    }}>
                      <StepIcon size={16} style={{ color: 'var(--secondary)' }} />
                      {step.label}
                    </div>
                    {idx < arr.length - 1 && (
                      <ArrowRight size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* EXPERTISE MATCHING VISUAL DEMO */}
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', backgroundColor: 'var(--white)', color: 'var(--text-dark)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
              <Target size={22} style={{ color: 'var(--secondary)' }} />
              Competency & Expertise Matching Concept
            </div>

            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>REQUIRED COMPETENCY</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
                Cloud Computing & GIS Analysis
              </div>
            </div>

            <div style={{ fontSize: '0.825rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
              EVALUATED TRAINER EXPERTISE TAGS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Trainer A</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Expertise: React, JavaScript</div>
                </div>
                <span className="badge badge-neutral">Unmatched</span>
              </div>

              <div style={{ backgroundColor: '#f0f9ff', padding: '0.85rem 1rem', borderRadius: '8px', border: '2px solid var(--secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)' }}>Trainer B</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary-hover)', fontWeight: 600 }}>Expertise: AWS, Azure, Cloud, GIS</div>
                </div>
                <span className="badge badge-success">Optimal Match</span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Trainer C</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Expertise: Communication, Leadership</div>
                </div>
                <span className="badge badge-neutral">Unmatched</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MULTI-ORGANIZATION & CONTROLLED ACCESS */}
      <section id="organizations" style={{ padding: '4.5rem 0', backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Multi-Tenant Architecture
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              One platform. Independent organization workspaces.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Capacity Connect supports multiple independent organizations on a single infrastructure. Each organization operates securely within its own isolated workspace.
            </p>
          </div>

          {/* MULTI-ORG VISUAL */}
          <div style={{
            backgroundColor: 'var(--bg-color)',
            padding: '2rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '3rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.75rem 1.75rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem'
              }}>
                <Globe2 size={20} style={{ color: 'var(--secondary)' }} />
                Capacity Connect Multi-Tenant Environment
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Building2 size={18} style={{ color: 'var(--secondary)' }} /> Organization Workspace A
                </div>
                <ul style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>• Dedicated Organization Admin</li>
                  <li>• Approved Internal Trainers</li>
                  <li>• Verified Employee Trainees</li>
                  <li>• Isolated Course Catalog</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Building2 size={18} style={{ color: 'var(--secondary)' }} /> Organization Workspace B
                </div>
                <ul style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>• Dedicated Organization Admin</li>
                  <li>• Approved Internal Trainers</li>
                  <li>• Verified Employee Trainees</li>
                  <li>• Isolated Course Catalog</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Building2 size={18} style={{ color: 'var(--secondary)' }} /> Organization Workspace C
                </div>
                <ul style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>• Dedicated Organization Admin</li>
                  <li>• Approved Internal Trainers</li>
                  <li>• Verified Employee Trainees</li>
                  <li>• Isolated Course Catalog</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GOVERNANCE PILLARS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--secondary-bg)', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Key size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>Key-Based Registration</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Registration restricted to authorized members using organization access keys.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--success-bg)', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserCheck size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>Admin Approval Gate</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Trainers undergo explicit admin review and approval before publishing.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Lock size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>Strict Role Boundaries</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Clear separation between Admin, Trainer, and Trainee capabilities.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Bring your organization's learning ecosystem together.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Centralize training programs, verify trainer expertise, deliver standardized assessments, and measure competency growth across your workforce.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/admin/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Register Organization
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
              Sign In to Portal
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
              Register as Trainee
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: 'var(--primary)', color: '#94a3b8', padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--primary-hover)' }} className="footer-grid">
            
            {/* BRAND */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  CC
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Capacity Connect</span>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '320px', color: '#94a3b8' }}>
                Digital Capacity Building & Learning Management Platform connecting Organizations, Trainers, and Trainees.
              </p>
            </div>

            {/* NAVIGATION */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Platform</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <li><button onClick={() => scrollToSection('overview')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>Overview</button></li>
                <li><button onClick={() => scrollToSection('roles')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>Portals</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>How It Works</button></li>
                <li><button onClick={() => scrollToSection('capabilities')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>Capabilities</button></li>
              </ul>
            </div>

            {/* AUTHENTICATION LINKS */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Get Started</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <li><Link to="/login" style={{ color: '#cbd5e1' }}>Sign In</Link></li>
                <li><Link to="/register" style={{ color: '#cbd5e1' }}>Register Trainee</Link></li>
                <li><Link to="/trainer/apply" style={{ color: '#cbd5e1' }}>Apply as Trainer</Link></li>
                <li><Link to="/admin/register" style={{ color: '#cbd5e1' }}>Register Organization</Link></li>
              </ul>
            </div>

            {/* GOVERNANCE */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Governance</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <li>Role Isolation</li>
                <li>Access Key Verification</li>
                <li>Admin Approval Flow</li>
                <li>Competency Analytics</li>
              </ul>
            </div>

          </div>

          <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              © 2026 Capacity Connect. Digital Capacity Building Platform. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#cbd5e1' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};

export default LandingPage;
