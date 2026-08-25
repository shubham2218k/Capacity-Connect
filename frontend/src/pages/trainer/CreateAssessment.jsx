import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Copy, Trash2, CheckCircle, HelpCircle } from 'lucide-react';
import { mockTrainerCourses } from '../../data/mockData';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find course if launched from course management
  const localCourses = JSON.parse(localStorage.getItem('trainer_mock_courses')) || mockTrainerCourses;
  const preselectedCourse = localCourses.find(c => c.id === courseId);

  const [assessmentData, setAssessmentData] = useState({
    title: '',
    subject: preselectedCourse ? preselectedCourse.title : '',
    courseId: preselectedCourse ? preselectedCourse.id : '',
    description: '',
    duration: '30 min',
    deadline: '',
    passingScore: '70'
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ],
      correctOption: 'a',
      explanation: ''
    }
  ]);

  const handleAssessmentChange = (e) => {
    setAssessmentData({ ...assessmentData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        options: [
          { id: 'a', text: '' },
          { id: 'b', text: '' },
          { id: 'c', text: '' },
          { id: 'd', text: '' }
        ],
        correctOption: 'a',
        explanation: ''
      }
    ]);
  };

  const duplicateQuestion = (qIndex) => {
    const questionToCopy = questions[qIndex];
    setQuestions([
      ...questions,
      {
        ...questionToCopy,
        id: Date.now()
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    
    const newAssessment = {
      id: `a_${Date.now()}`,
      courseId: assessmentData.courseId,
      title: assessmentData.title,
      subject: assessmentData.subject,
      questions: questions.length,
      duration: assessmentData.duration,
      deadline: assessmentData.deadline || 'No deadline',
      passingScore: assessmentData.passingScore,
      status: 'Published',
      submissions: 0
    };

    setTimeout(() => {
      // Save locally
      const localAssessments = JSON.parse(localStorage.getItem('trainer_mock_assessments')) || [];
      localAssessments.unshift(newAssessment);
      localStorage.setItem('trainer_mock_assessments', JSON.stringify(localAssessments));

      // Notification
      const localNotifs = JSON.parse(localStorage.getItem('cc_mock_notifications') || '[]');
      localNotifs.unshift({
        id: `n_${Date.now()}`,
        type: 'assessment_published',
        title: 'New Assessment Available',
        message: `${assessmentData.title} is now available to take.`,
        date: 'Just now',
        read: false
      });
      localStorage.setItem('cc_mock_notifications', JSON.stringify(localNotifs));
      window.dispatchEvent(new Event('new_notification'));

      // Redirect
      if (assessmentData.courseId) {
        navigate(`/trainer/courses/${assessmentData.courseId}`);
      } else {
        navigate('/trainer/assessments');
      }
    }, 800);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>Create MCQ Assessment</h1>
          <p className="text-light">Build a multiple choice quiz to evaluate trainees.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Assessment Details
        </h2>
        
        <div className="input-group">
          <label>Assessment Title *</label>
          <input type="text" name="title" value={assessmentData.title} onChange={handleAssessmentChange} placeholder="e.g. End of Course Exam" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label>Course / Subject *</label>
            <select name="courseId" value={assessmentData.courseId} onChange={(e) => {
              const cId = e.target.value;
              const course = localCourses.find(c => c.id === cId);
              setAssessmentData({ ...assessmentData, courseId: cId, subject: course ? course.title : '' });
            }}>
              <option value="">Select Course</option>
              {localCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Duration</label>
            <input type="text" name="duration" value={assessmentData.duration} onChange={handleAssessmentChange} placeholder="e.g. 30 min" />
          </div>
          <div className="input-group">
            <label>Deadline (Optional)</label>
            <input type="date" name="deadline" value={assessmentData.deadline} onChange={handleAssessmentChange} />
          </div>
          <div className="input-group">
            <label>Passing Score (%)</label>
            <input type="number" min="0" max="100" name="passingScore" value={assessmentData.passingScore} onChange={handleAssessmentChange} />
          </div>
        </div>
        
        <div className="input-group">
          <label>Description / Instructions</label>
          <textarea name="description" value={assessmentData.description} onChange={handleAssessmentChange} placeholder="Add instructions for trainees..." style={{ minHeight: '80px' }} />
        </div>
      </div>

      {/* Questions Builder */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Questions</h2>
      
      {questions.map((q, qIndex) => (
        <div key={q.id} className="card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Question {qIndex + 1}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => duplicateQuestion(qIndex)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--text-light)' }} title="Duplicate">
                <Copy size={16} />
              </button>
              <button type="button" onClick={() => removeQuestion(qIndex)} disabled={questions.length === 1} className="btn btn-ghost" style={{ padding: '0.4rem', color: questions.length === 1 ? 'var(--text-light)' : 'var(--danger)' }} title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="input-group">
            <input 
              type="text" 
              value={q.text} 
              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} 
              placeholder="Enter your question here..." 
              style={{ fontSize: '1.1rem', padding: '1rem', backgroundColor: 'var(--bg-color-alt)' }}
            />
          </div>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Select the correct option</p>
            {q.options.map((opt, oIndex) => (
              <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="radio" 
                  name={`correct_${q.id}`} 
                  checked={q.correctOption === opt.id}
                  onChange={() => handleQuestionChange(qIndex, 'correctOption', opt.id)}
                  style={{ width: '1.5rem', height: '1.5rem' }}
                />
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-light)' }}>
                    {opt.id.toUpperCase()}.
                  </span>
                  <input 
                    type="text" 
                    value={opt.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${opt.id.toUpperCase()}`}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem 0.75rem 2.5rem', 
                      border: q.correctOption === opt.id ? '1px solid var(--success)' : '1px solid var(--border-color)',
                      backgroundColor: q.correctOption === opt.id ? 'var(--success-bg)' : 'var(--white)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={16} className="text-light" /> Explanation (Optional)
            </label>
            <textarea 
              value={q.explanation}
              onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
              placeholder="Explain why the answer is correct..."
              style={{ minHeight: '60px', padding: '0.75rem', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      ))}

      <button onClick={addQuestion} className="btn btn-outline" style={{ width: '100%', padding: '1rem', borderStyle: 'dashed', borderWidth: '2px', backgroundColor: 'transparent', marginBottom: '3rem' }}>
        <Plus size={18} /> Add New Question
      </button>

      {/* Action Bar */}
      <div style={{ 
        position: 'sticky', bottom: '2rem', backgroundColor: 'var(--white)', 
        padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', 
        border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Total Questions: <strong>{questions.length}</strong>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" className="btn btn-secondary">Save as Draft</button>
          <button type="button" onClick={handlePublish} className="btn btn-primary" disabled={isSubmitting || !assessmentData.title}>
            {isSubmitting ? 'Publishing...' : 'Publish Assessment'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreateAssessment;
