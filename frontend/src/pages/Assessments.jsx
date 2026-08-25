import { useState, useEffect } from 'react';
import { mockAssessments } from '../data/mockData';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, FileText } from 'lucide-react';

const Assessments = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    // Load any completed mock assessments from localStorage
    const completedMock = JSON.parse(localStorage.getItem('mockCompletedAssessments') || '{}');
    
    const loaded = mockAssessments.map(a => {
      if (completedMock[a.id]) {
        return { ...a, status: 'Completed', score: completedMock[a.id].score };
      }
      return a;
    });
    
    setAssessments(loaded);
  }, []);

  const pendingAssessments = assessments.filter(a => a.status === 'Pending');
  const completedAssessments = assessments.filter(a => a.status === 'Completed');

  const filteredAssessments = activeTab === 'Pending' ? pendingAssessments : completedAssessments;

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Assessments</h1>
        <p style={{ color: 'var(--text-light)' }}>Test your knowledge and complete required evaluations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '50%' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{pendingAssessments.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Pending Assessments</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '50%' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{completedAssessments.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Completed Assessments</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {completedAssessments.length > 0 
                ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length) 
                : 0}%
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Average Score</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('Pending')}
          style={{ 
            background: 'none', border: 'none', padding: '0.75rem 1rem', fontSize: '1rem',
            fontWeight: activeTab === 'Pending' ? 600 : 500,
            color: activeTab === 'Pending' ? 'var(--primary)' : 'var(--text-light)',
            borderBottom: activeTab === 'Pending' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Available & Pending
        </button>
        <button 
          onClick={() => setActiveTab('Completed')}
          style={{ 
            background: 'none', border: 'none', padding: '0.75rem 1rem', fontSize: '1rem',
            fontWeight: activeTab === 'Completed' ? 600 : 500,
            color: activeTab === 'Completed' ? 'var(--primary)' : 'var(--text-light)',
            borderBottom: activeTab === 'Completed' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Completed
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map(assessment => (
            <div key={assessment.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`badge ${assessment.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                  {assessment.status}
                </span>
                {assessment.status === 'Completed' && (
                  <span style={{ fontWeight: 700, color: assessment.score >= 70 ? 'var(--success)' : 'var(--danger)' }}>
                    Score: {assessment.score}%
                  </span>
                )}
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{assessment.title}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Subject: {assessment.subject}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}><FileText size={16} /> Questions</span>
                  <span style={{ fontWeight: 500 }}>{assessment.questionCount} MCQs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}><Clock size={16} /> Duration</span>
                  <span style={{ fontWeight: 500 }}>{assessment.estimatedDuration}</span>
                </div>
                {assessment.status === 'Pending' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}><Calendar size={16} /> Deadline</span>
                    <span style={{ fontWeight: 500, color: 'var(--danger)' }}>{new Date(assessment.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {assessment.status === 'Pending' ? (
                <Link to={`/trainee/assessments/${assessment.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Start Assessment
                </Link>
              ) : (
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Review Results
                </button>
              )}
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-light)' }}>
              {activeTab === 'Pending' ? 'You have no pending assessments.' : 'You have not completed any assessments yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
