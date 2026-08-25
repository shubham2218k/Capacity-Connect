import { useAuth } from '../../context/AuthContext';
import { mockTrainerTrainees, mockCourses, mockAssessments } from '../../data/mockData';
import { TrendingUp, Users, CheckCircle, BarChart2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrainerPerformance = () => {
  const { user } = useAuth();
  
  const trainerCourses = mockCourses.filter(c => c.trainer === user.name);
  const totalTrainees = mockTrainerTrainees.length;
  const completedTrainees = mockTrainerTrainees.filter(t => t.status === 'Completed').length;
  
  const courseCompletionRate = totalTrainees > 0 ? Math.round((completedTrainees / totalTrainees) * 100) : 0;
  const avgAssessmentScore = totalTrainees > 0 
    ? Math.round(mockTrainerTrainees.reduce((acc, t) => acc + (t.assessmentAverage || 0), 0) / mockTrainerTrainees.filter(t => t.assessmentAverage).length) 
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Training Performance</h1>
        <p style={{ color: 'var(--text-light)' }}>Analyze the effectiveness and outcomes of your training programs.</p>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalTrainees}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Trainees</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '50%' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{courseCompletionRate}%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Course Completion Rate</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{avgAssessmentScore}%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Avg Assessment Score</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '50%' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>85%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Assessment Pass Rate</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Course-wise Comparison */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Course Performance Comparison</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {trainerCourses.map(course => {
              const enrolled = mockTrainerTrainees.filter(t => t.enrolledCourse === course.id);
              const completed = enrolled.filter(t => t.status === 'Completed').length;
              const cRate = enrolled.length > 0 ? Math.round((completed / enrolled.length) * 100) : 0;
              const aAvg = enrolled.length > 0 ? Math.round(enrolled.reduce((a, t) => a + (t.assessmentAverage || 0), 0) / enrolled.filter(t => t.assessmentAverage).length) : 0;
              
              return (
                <div key={course.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{course.title}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Completion Rate</span>
                        <span style={{ fontWeight: 600 }}>{cRate}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}>
                        <div style={{ width: `${cRate}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Assessment Average</span>
                        <span style={{ fontWeight: 600 }}>{aAvg ? `${aAvg}%` : 'N/A'}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}>
                        <div style={{ width: `${aAvg || 0}%`, height: '100%', backgroundColor: 'var(--secondary)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {trainerCourses.length === 0 && (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>No active courses available for comparison.</p>
            )}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
            <AlertTriangle size={20} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)' }}>Needs Attention</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockTrainerTrainees.filter(t => t.status === 'Needs Attention' || t.progress < 40).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{t.progress}% Progress</div>
                </div>
                <Link to={`/trainer/trainees/${t.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                  Review
                </Link>
              </div>
            ))}
            {mockTrainerTrainees.filter(t => t.status === 'Needs Attention' || t.progress < 40).length === 0 && (
              <p style={{ color: 'var(--success)', textAlign: 'center', padding: '1rem' }}>All trainees are on track!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerPerformance;
