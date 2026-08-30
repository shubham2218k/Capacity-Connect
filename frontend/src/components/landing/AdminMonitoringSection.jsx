import { TrendingUp, Users, Award, Bell, CheckCircle2, ShieldCheck } from 'lucide-react';

const AdminMonitoringSection = () => {
  return (
    <section className="lp-section" data-section="admin-monitoring">
      <div className="lp-container">
        
        {/* SECTION HEADER */}
        <div className="lp-section-header">
          <span className="lp-section-label">Institutional Oversight</span>
          <h2 className="lp-h2">
            Real-Time Admin Monitoring & Analytics
          </h2>
          <p className="lp-subtitle" style={{ marginTop: '0.75rem' }}>
            Empower organization executives and HR directors with transparent workforce capability metrics and progress tracking.
          </p>
        </div>

        {/* MONITORING MOCKUP */}
        <div className="lp-monitoring-mock" data-monitoring-panel>
          
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--lp-border)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>ORGANIZATION DASHBOARD PREVIEW</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lp-text)', marginTop: '0.2rem' }}>Capacity Building Executive Control Center</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="lp-badge lp-badge-cyan">Multi-Tenant Mode</span>
              <span className="lp-badge lp-badge-emerald">Live Telemetry</span>
            </div>
          </div>

          {/* METRICS CARDS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            
            <div style={{ backgroundColor: 'var(--lp-bg-elevated)', border: '1px solid var(--lp-border)', borderRadius: 'var(--lp-radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--lp-cyan)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)' }}>ENROLLED TRAINEES</span>
                <Users size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lp-text)' }}>1,480</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <TrendingUp size={14} /> Active Workspace Progress
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--lp-bg-elevated)', border: '1px solid var(--lp-border)', borderRadius: 'var(--lp-radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--lp-emerald)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)' }}>COURSE PASS RATE</span>
                <Award size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lp-text)' }}>92.4%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <CheckCircle2 size={14} /> Standardized MCQ Exams
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--lp-bg-elevated)', border: '1px solid var(--lp-border)', borderRadius: 'var(--lp-radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--lp-violet)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)' }}>VERIFIED TRAINERS</span>
                <ShieldCheck size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lp-text)' }}>34</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-violet)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <CheckCircle2 size={14} /> Admin Approved Pool
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--lp-bg-elevated)', border: '1px solid var(--lp-border)', borderRadius: 'var(--lp-radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--lp-amber)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lp-text-muted)' }}>BROADCAST NOTICES</span>
                <Bell size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lp-text)' }}>12</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lp-amber)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <CheckCircle2 size={14} /> Targeted System Notices
              </div>
            </div>

          </div>

          {/* PROGRESS BARS MOCK */}
          <div style={{ backgroundColor: 'var(--lp-bg-elevated)', border: '1px solid var(--lp-border)', borderRadius: 'var(--lp-radius-md)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lp-text)', marginBottom: '1rem' }}>
              Institutional Competency Growth Progress
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--lp-text-muted)', marginBottom: '0.35rem' }}>
                  <span>Radar Physics & Atmospheric Dynamics</span>
                  <span style={{ fontWeight: 700, color: 'var(--lp-cyan)' }}>88% Target Reached</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--lp-bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--lp-cyan)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--lp-text-muted)', marginBottom: '0.35rem' }}>
                  <span>Cloud Computing & GIS Analysis</span>
                  <span style={{ fontWeight: 700, color: 'var(--lp-violet)' }}>94% Target Reached</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--lp-bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '94%', height: '100%', backgroundColor: 'var(--lp-violet)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--lp-text-muted)', marginBottom: '0.35rem' }}>
                  <span>Emergency Disaster Management Protocols</span>
                  <span style={{ fontWeight: 700, color: 'var(--lp-emerald)' }}>76% Target Reached</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--lp-bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '76%', height: '100%', backgroundColor: 'var(--lp-emerald)' }} />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AdminMonitoringSection;
