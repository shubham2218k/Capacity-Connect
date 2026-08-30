import { Building2, Key, UserCheck, Lock, Globe2, ShieldCheck } from 'lucide-react';

const SecurityIsolationSection = () => {
  return (
    <section id="organizations" className="lp-section lp-section-alt" data-section="security-isolation">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">Multi-Tenant Architecture</span>
          <h2 className="lp-h2">
            One Platform. Independent Organization Workspaces.
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            Unique organization access keys restrict registration. Organization-scoped records, JWT authentication and role-based authorization protect each workspace's data boundaries.
          </p>
        </div>

        {/* WORKSPACE ISOLATION DIAGRAM */}
        <div style={{
          backgroundColor: 'var(--lp-bg-glass-card)',
          border: '1px solid var(--lp-border-hover)',
          borderRadius: 'var(--lp-radius-xl)',
          padding: '2.25rem',
          marginBottom: '3rem',
          boxShadow: 'var(--lp-shadow-lg)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="lp-eyebrow" style={{ marginBottom: 0 }}>
              <Globe2 size={16} />
              Capacity Connect Multi-Tenant Environment
            </div>
          </div>

          <div className="lp-isolation-grid">
            <div className="lp-isolation-box" data-isolation-box="0">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: 'var(--lp-cyan)', fontWeight: 800 }}>
                <Building2 size={20} /> Organization Workspace A
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--lp-cyan)' }} /> Dedicated Admin Controls
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={14} style={{ color: 'var(--lp-emerald)' }} /> Unique Trainee & Trainer Keys
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={14} style={{ color: 'var(--lp-violet)' }} /> Verified Internal Trainers
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} style={{ color: 'var(--lp-text-dim)' }} /> Isolated Course Catalog
                </li>
              </ul>
            </div>

            <div className="lp-isolation-box" data-isolation-box="1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: 'var(--lp-violet)', fontWeight: 800 }}>
                <Building2 size={20} /> Organization Workspace B
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--lp-violet)' }} /> Dedicated Admin Controls
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={14} style={{ color: 'var(--lp-emerald)' }} /> Unique Trainee & Trainer Keys
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={14} style={{ color: 'var(--lp-cyan)' }} /> Verified Internal Trainers
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} style={{ color: 'var(--lp-text-dim)' }} /> Isolated Course Catalog
                </li>
              </ul>
            </div>

            <div className="lp-isolation-box" data-isolation-box="2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: 'var(--lp-emerald)', fontWeight: 800 }}>
                <Building2 size={20} /> Organization Workspace C
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--lp-emerald)' }} /> Dedicated Admin Controls
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={14} style={{ color: 'var(--lp-cyan)' }} /> Unique Trainee & Trainer Keys
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={14} style={{ color: 'var(--lp-violet)' }} /> Verified Internal Trainers
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} style={{ color: 'var(--lp-text-dim)' }} /> Isolated Course Catalog
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECURITY PILLARS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--lp-cyan-glow)', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Key size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--lp-text)' }}>Dual Access-Key Gate</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                Registration restricted to authorized members using cryptographically generated Trainee and Trainer organization access keys.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--lp-emerald-glow)', color: 'var(--lp-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--lp-text)' }}>Admin Approval Gate</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                Trainers undergo explicit administrative qualification review and approval before obtaining course authoring privileges.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--lp-violet-glow)', color: 'var(--lp-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--lp-text)' }}>JWT & RBAC Boundaries</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                JSON Web Token session security with strict middleware role enforcement protecting API endpoints and user data.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SecurityIsolationSection;
