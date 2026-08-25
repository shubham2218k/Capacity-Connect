import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssessments, mockMCQData } from '../data/mockData';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MCQExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const foundAssessment = mockAssessments.find(a => a.id === id);
    if (!foundAssessment || foundAssessment.status === 'Completed' && !JSON.parse(localStorage.getItem('mockCompletedAssessments') || '{}')[id]) {
      // Basic safeguard. If it's real completed, allow review? For prototype, if not in mockMCQData, return.
      if (!mockMCQData[id]) {
        navigate('/trainee/assessments');
        return;
      }
    }
    setAssessment(foundAssessment);
    setQuestions(mockMCQData[id] || []);
  }, [id, navigate]);

  if (!assessment || questions.length === 0) return <div style={{ padding: '2rem' }}>Loading assessment...</div>;

  const currentQuestion = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex
    });
  };

  const calculateResult = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70; // 70% passing mark

    const resultData = { score, correct, total: questions.length, passed };
    setResult(resultData);
    setIsSubmitted(true);
    setShowConfirm(false);

    // Persist mock completion
    const completedMock = JSON.parse(localStorage.getItem('mockCompletedAssessments') || '{}');
    completedMock[id] = resultData;
    localStorage.setItem('mockCompletedAssessments', JSON.stringify(completedMock));
  };

  if (isSubmitted && result) {
    return (
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          {result.passed ? (
            <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
          ) : (
            <XCircle size={64} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          )}
          
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>{assessment.title}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: result.passed ? 'var(--success)' : 'var(--danger)' }}>
                {result.score}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Final Score</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                {result.correct} / {result.total}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Correct Answers</div>
            </div>
          </div>

          <button onClick={() => navigate('/trainee/assessments')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Return to Assessments
          </button>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1.5rem' }}>Review Answers</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, index) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={q.id} className="card" style={{ borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}` }}>
                <h4 style={{ fontWeight: 500, marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>{index + 1}.</span> {q.question}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {q.options.map((opt, i) => {
                    let bgColor = 'var(--bg-color)';
                    let borderColor = 'var(--border-color)';
                    
                    if (i === q.correctAnswer) {
                      bgColor = '#d1fae5';
                      borderColor = 'var(--success)';
                    } else if (i === userAnswer && !isCorrect) {
                      bgColor = '#fee2e2';
                      borderColor = 'var(--danger)';
                    }
                    
                    return (
                      <div key={i} style={{ 
                        padding: '0.75rem 1rem', 
                        backgroundColor: bgColor, 
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        {opt}
                        {i === q.correctAnswer && <CheckCircle size={16} style={{ color: 'var(--success)' }} />}
                        {i === userAnswer && !isCorrect && <XCircle size={16} style={{ color: 'var(--danger)' }} />}
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-dark)', display: 'flex', gap: '0.5rem' }}>
                  <AlertCircle size={16} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Explanation:</strong> {q.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Assessment Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>{assessment.title}</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{assessment.subject}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--white)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
          <Clock size={18} style={{ color: 'var(--secondary)' }} />
          Time left: {assessment.estimatedDuration}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          <span>Question {currentQIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentQIndex) / questions.length) * 100)}% Completed</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}>
          <div style={{ 
            width: `${((currentQIndex + 1) / questions.length) * 100}%`, 
            height: '100%', 
            backgroundColor: 'var(--primary)', 
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {currentQuestion.question}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                style={{
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  backgroundColor: isSelected ? '#e0f2fe' : 'var(--white)',
                  border: `2px solid ${isSelected ? 'var(--secondary)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  border: `2px solid ${isSelected ? 'var(--secondary)' : 'var(--border-color)'}`,
                  backgroundColor: isSelected ? 'var(--secondary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
                </div>
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => setCurrentQIndex(prev => prev - 1)}
          disabled={currentQIndex === 0}
          className="btn btn-outline"
          style={{ padding: '0.75rem 1.5rem', opacity: currentQIndex === 0 ? 0.5 : 1 }}
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button 
            onClick={() => setShowConfirm(true)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            Submit Assessment
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQIndex(prev => prev + 1)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            Next Question
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Submit Assessment?</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              Are you sure you want to submit? You will not be able to change your answers after submission.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={calculateResult}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MCQExperience;
