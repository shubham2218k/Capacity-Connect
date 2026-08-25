import { BarChart2, PieChart, TrendingUp, Download } from 'lucide-react';

const AdminReports = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--text-light)' }}>Platform-wide insights and data exports.</p>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Export Full Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)' }}>
          <TrendingUp size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Platform Adoption Trend</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>Chart visualization will render here.</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)' }}>
          <BarChart2 size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Course Enrollments by Department</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>Chart visualization will render here.</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)' }}>
          <PieChart size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Assessment Pass/Fail Ratio</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>Chart visualization will render here.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Available Data Exports</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div>
              <h3 style={{ fontWeight: 600 }}>Trainee Competency Matrix (CSV)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Complete mapping of all trainees against required role competencies.</p>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Generate</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div>
              <h3 style={{ fontWeight: 600 }}>Course Completion Logs (Excel)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Historical records of all completed courses and issued certificates.</p>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Generate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
