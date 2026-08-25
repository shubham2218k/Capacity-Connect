import { useState, useEffect } from 'react';
import { mockCourses } from '../data/mockData';
import CourseCard from '../components/CourseCard';

const MyLearning = () => {
  const [activeTab, setActiveTab] = useState('InProgress');
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call.
    // For the demo, we merge mock enrollments with hardcoded progress.
    const savedEnrollments = JSON.parse(localStorage.getItem('mockEnrollments') || '[]');
    
    let courses = [];
    
    // Add default in-progress course for demo presentation
    const course1 = mockCourses.find(c => c.id === 'c1');
    if (course1) courses.push({ ...course1, progress: 60, status: 'InProgress' });

    // Add default completed course for demo presentation
    const course3 = mockCourses.find(c => c.id === 'c3');
    if (course3) courses.push({ ...course3, progress: 100, status: 'Completed' });

    // Add any newly enrolled courses from localStorage
    savedEnrollments.forEach(id => {
      if (id !== 'c1' && id !== 'c3') {
        const c = mockCourses.find(course => course.id === id);
        if (c) {
          // Check if there is specific progress saved
          const progressData = JSON.parse(localStorage.getItem(`courseProgress_${id}`) || '[]');
          const progressPercent = c.modules.length > 0 ? Math.round((progressData.length / c.modules.length) * 100) : 0;
          
          courses.push({ 
            ...c, 
            progress: progressPercent, 
            status: progressPercent === 100 ? 'Completed' : 'InProgress' 
          });
        }
      }
    });

    setMyCourses(courses);
  }, []);

  const filteredCourses = activeTab === 'All' 
    ? myCourses 
    : myCourses.filter(c => c.status === activeTab);

  return (
    <div className="container" style={{ padding: '1rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>My Learning</h1>
        <p style={{ color: 'var(--text-light)' }}>Track your progress and continue where you left off.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('InProgress')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: activeTab === 'InProgress' ? 600 : 500,
            color: activeTab === 'InProgress' ? 'var(--primary)' : 'var(--text-light)',
            borderBottom: activeTab === 'InProgress' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          In Progress
        </button>
        <button 
          onClick={() => setActiveTab('Completed')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: activeTab === 'Completed' ? 600 : 500,
            color: activeTab === 'Completed' ? 'var(--primary)' : 'var(--text-light)',
            borderBottom: activeTab === 'Completed' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Completed
        </button>
        <button 
          onClick={() => setActiveTab('All')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: activeTab === 'All' ? 600 : 500,
            color: activeTab === 'All' ? 'var(--primary)' : 'var(--text-light)',
            borderBottom: activeTab === 'All' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          All
        </button>
      </div>

      {filteredCourses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} enrolled={true} progress={course.progress} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No courses found</h3>
          <p style={{ color: 'var(--text-light)' }}>
            {activeTab === 'InProgress' ? "You aren't currently taking any courses." : "You haven't completed any courses yet."}
          </p>
        </div>
      )}

    </div>
  );
};

export default MyLearning;
