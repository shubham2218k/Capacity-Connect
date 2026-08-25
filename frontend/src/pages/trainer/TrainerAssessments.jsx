import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockAssessments } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { Plus, Clock, Users, CheckCircle, BarChart2 } from 'lucide-react';

const TrainerAssessments = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    // Combine mock data with any locally created assessments
    const localAssessments = JSON.parse(localStorage.getItem('trainer_mock_assessments') || '[]');
    const combined = [...mockAssessments.filter(a => a.trainer === user.name), ...localAssessments];
    setAssessments(combined);
  }, [user.name]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Assessments</h1>
          <p style={{ color: 'var(--text-light)' }}>Create and manage MCQ tests for your courses.</p>
        </div>
        <Link to="/trainer/assessments/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create Assessment
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <PenToolIcon />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{assessments.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Assessments</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '50%' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>45</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Submissions</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>76%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Average Score</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {assessments.map(assessment => (
          <div key={assessment.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className={`badge ${assessment.status === 'Draft' ? 'badge-warning' : 'badge-primary'}`}>
                {assessment.status || 'Active'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} /> Due: {assessment.deadline || 'No deadline'}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{assessment.title}</h3>
            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>Course ID: {assessment.courseId || assessment.subject}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Questions</div>
                <div style={{ fontWeight: 600 }}>{assessment.questionCount || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Duration</div>
                <div style={{ fontWeight: 600 }}>{assessment.estimatedDuration || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Submissions</div>
                <div style={{ fontWeight: 600 }}>{assessment.submissions || Math.floor(Math.random() * 20)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Avg Score</div>
                <div style={{ fontWeight: 600, color: 'var(--success)' }}>{assessment.avgScore || 'N/A'}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <Link to={`/trainer/assessments/${assessment.id}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                View Results
              </Link>
              {assessment.status === 'Draft' && (
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}

        {assessments.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>No assessments created yet.</p>
            <Link to="/trainer/assessments/create" className="btn btn-primary">Create Your First Assessment</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for Pen icon
const PenToolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="M2 2l7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

export default TrainerAssessments;
