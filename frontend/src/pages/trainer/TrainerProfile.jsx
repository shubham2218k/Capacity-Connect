import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, Building, Briefcase, 
  Award, GraduationCap, CheckCircle2, Shield
} from 'lucide-react';
import { api } from '../../services/api';

const TrainerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auth/me');
        if (response?.data) setProfile(response.data);
        else setProfile(user);
      } catch (err) {
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const p = profile || user || {};

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '950px' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>Trainer Profile</h1>
        <p className="text-light">Your verified organization trainer profile and credentials.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-light)' }}>
          Loading profile...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Card */}
          <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--secondary)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 'bold'
            }}>
              {(p.name || 'T').charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{p.name}</h2>
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={14} /> Verified Trainer
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                {p.designation || 'Trainer'} {p.department ? `• ${p.department}` : ''}
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
                {p.organizationName || 'Organization'}
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <User size={18} /> Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem', fontSize: '0.92rem' }}>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Full Name</span>
                <strong>{p.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Email Address</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} /> {p.email}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Phone Number</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> {p.phone || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Role</span>
                <span className="badge badge-primary">{p.role || 'Trainer'}</span>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Building size={18} /> Professional Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem', fontSize: '0.92rem' }}>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Organization</span>
                <strong>{p.organizationName || '-'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Department</span>
                <span>{p.department || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Designation</span>
                <span>{p.designation || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Employee ID</span>
                <span>{p.employeeId || '-'}</span>
              </div>
            </div>
          </div>

          {/* Qualifications & Experience */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <GraduationCap size={18} /> Qualifications & Experience
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Highest Qualification</span>
                <strong>{p.qualification || '-'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Institution</span>
                <span>{p.institution || '-'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem' }}>Training Experience</span>
                <span>{p.experience ? `${p.experience} Years` : '-'}</span>
              </div>
            </div>

            {p.professionalBio && (
              <div>
                <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Professional Bio</span>
                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-dark)', backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                  {p.professionalBio}
                </p>
              </div>
            )}
          </div>

          {/* Verified Expertise */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Award size={18} /> Verified Competency & Expertise
            </h3>

            {p.verifiedExpertise && p.verifiedExpertise.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {p.verifiedExpertise.map((skill) => (
                  <span key={skill} className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> Verified: {skill}
                  </span>
                ))}
              </div>
            ) : p.expertise && p.expertise.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {p.expertise.map((skill) => (
                  <span key={skill} className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>No expertise skills listed.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
