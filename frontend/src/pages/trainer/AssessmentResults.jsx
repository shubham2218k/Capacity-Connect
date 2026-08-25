import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { mockTrainerTrainees, mockAssessments } from '../../data/mockData';

const AssessmentResults = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    // Find assessment details
    const localAssessments = JSON.parse(localStorage.getItem('trainer_mock_assessments') || '[]');
    const found = mockAssessments.find(a => a.id === id) || localAssessments.find(a => a.id === id);
    
    if (found) {
      setAssessment(found);
    } else {
      // Mock fallback if looking for something not pre-populated
      setAssessment({
        id,
        title: 'Data Analysis Fundamentals',
        courseId: 'c2',
        questionCount: 5,
        deadline: '2026-08-28',
        status: 'Active'
      });
    }
  }, [id]);

  // Generate mock results for this assessment
  // In a real app, this comes from the backend
  const results = mockTrainerTrainees.map(t => {
    // Randomize score a bit for demo purposes
    const score = t.progress > 0 ? (t.assessmentAverage ? t.assessmentAverage : Math.floor(Math.random() * 40) + 60) : 0;
    const passed = score >= 70;
    const total = assessment?.questionCount || 10;
    const correct = Math.round((score / 100) * total);
    
    return {
      ...t,
      score,
      correct,
      total,
      passed,
      submittedAt: t.progress > 0 ? '2026-08-24' : null
    };
  }).filter(r => r.submittedAt !== null);

  if (!assessment) return <div style={{ padding: '2rem' }}>Loading results...</div>;

  const avgScore = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0;
  const passRate = results.length > 0 ? Math.round((results.filter(r => r.passed).length / results.length) * 100) : 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/trainer/assessments" style={{ color: 'var(--text-light)' }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>Assessment Results</h1>
          <p style={{ color: 'var(--text-light)' }}>{assessment.title}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{results.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Submissions</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: avgScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>{avgScore}%</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Average Score</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{passRate}%</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Pass Rate</div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Trainee Submissions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="search-bar" style={{ width: '250px' }}>
              <Search size={18} />
              <input type="text" placeholder="Search trainees..." />
            </div>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Trainee</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Score</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Percentage</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)' }}>Submitted</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-light)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{result.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{result.department}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                    {result.correct} / {result.total}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: result.passed ? 'var(--success)' : 'var(--danger)' }}>
                    {result.score}%
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${result.passed ? 'badge-success' : 'badge-warning'}`}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    {result.submittedAt}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
