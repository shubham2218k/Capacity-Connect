import { useState } from 'react';
import { Map, Plus, Edit2, Trash2 } from 'lucide-react';

const CompetencyMapping = () => {
  const [roles] = useState([
    { id: 'r1', title: 'Scientific Assistant', department: 'Data Services', requiredSkills: ['Data Analysis', 'Python', 'GIS Basic'], activeTrainees: 45 },
    { id: 'r2', title: 'Research Fellow', department: 'Climate Research', requiredSkills: ['Climate Modeling', 'R', 'Advanced Statistics', 'Machine Learning'], activeTrainees: 12 },
    { id: 'r3', title: 'Meteorologist', department: 'Weather Forecasting', requiredSkills: ['Meteorology', 'Radar Systems', 'Communication'], activeTrainees: 28 },
    { id: 'r4', title: 'Oceanographer', department: 'Ocean Observation', requiredSkills: ['Oceanography', 'GIS Advanced', 'Field Safety'], activeTrainees: 15 }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Competency Mapping</h1>
          <p style={{ color: 'var(--text-light)' }}>Define organizational roles and their required competencies.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Role Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {roles.map(role => (
          <div key={role.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '8px' }}>
                  <Map size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{role.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{role.department}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.25rem' }} title="Edit"><Edit2 size={16} /></button>
                <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }} title="Delete"><Trash2 size={16} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', flex: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Required Competencies:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {role.requiredSkills.map((skill, index) => (
                  <span key={index} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Mapped Employees:</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{role.activeTrainees} Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetencyMapping;
