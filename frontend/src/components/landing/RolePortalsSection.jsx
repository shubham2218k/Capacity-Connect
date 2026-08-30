import { Link } from 'react-router-dom';
import { ROLE_PORTALS } from './landingData';
import { Check } from 'lucide-react';

const RolePortalsSection = () => {
  return (
    <section id="roles" className="lp-section lp-section-alt" data-section="role-portals">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">Role-Based Governance</span>
          <h2 className="lp-h2">
            Purpose-Built Portals for Every Stakeholder
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            Capacity Connect unifies Admins, Trainers, and Trainees into one synchronized ecosystem with role-enforced security boundaries.
          </p>
        </div>

        {/* ROLE CARDS GRID */}
        <div className="lp-roles-grid">
          {ROLE_PORTALS.map((role) => {
            const RoleIcon = role.icon;
            return (
              <div 
                key={role.id} 
                className="lp-role-card"
                data-role-card={role.id}
                style={{
                  borderTop: `3px solid ${role.accentColor}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '12px', 
                    backgroundColor: role.accentBg, 
                    color: role.accentColor, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0 
                  }}>
                    <RoleIcon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lp-text)', lineHeight: 1.2 }}>{role.role}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--lp-text-muted)', fontWeight: 600 }}>{role.subtitle}</span>
                  </div>
                </div>

                <ul className="lp-role-list">
                  {role.features.map((feat, idx) => (
                    <li key={idx} className="lp-role-item">
                      <Check size={18} style={{ color: role.accentColor, flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to={role.route} 
                  className="lp-btn lp-btn-secondary" 
                  style={{ width: '100%', borderColor: role.accentColor, color: 'var(--lp-text)', marginTop: 'auto' }}
                >
                  {role.btnText}
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default RolePortalsSection;
