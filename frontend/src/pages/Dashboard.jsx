import { useAuth } from '../context/AuthContext';
import { mockCourses, mockAssessments } from '../data/mockData';
import CourseCard from '../components/CourseCard';
import { BookOpen, Award, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNotificationsForUser } from '../services/announcementService';

const Dashboard = () => {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick(t => t + 1);
    window.addEventListener('announcement_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('announcement_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Mock enrolled courses (first two from our mock data)
  const enrolledCourses = [
    { ...mockCourses[0], progress: 60 },
    { ...mockCourses[1], progress: 25 }
  ];

  // Recommended courses (the rest)
  const recommendedCourses = [mockCourses[2], mockCourses[3]];

  // Pending assessments
  const pendingAssessments = mockAssessments.filter(a => a.status === 'Pending');

  return (
    <div className="container" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            Good morning, {user?.name.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-light)' }}>Ready to continue your learning journey today?</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>Current Streak</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.25rem' }}>🔥 4 Days</div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary-bg)', color: 'var(--secondary-hover)', borderRadius: '12px' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>2</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled Courses</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '12px' }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>1</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certificates Earned</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: '12px' }}>
            <Clock size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>2</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Assessments</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 2 }}>
          
          {/* Continue Learning */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Continue Learning</h2>
              <Link to="/trainee/learning" style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img 
                src={enrolledCourses[0].thumbnail} 
                alt="Course" 
                style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-dark)' }}>{enrolledCourses[0].title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Next: Module 4 - Image Interpretation</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '60%', backgroundColor: 'var(--secondary)', height: '100%', borderRadius: '3px' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary)' }}>60%</span>
                </div>
              </div>
              <Link to={`/trainee/learning/${enrolledCourses[0].id}`} className="btn btn-primary">
                Resume
              </Link>
            </div>
          </section>

          {/* Recommended Courses */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Recommended for You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {recommendedCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1 }}>
          
          {/* Upcoming Assessments */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Upcoming Assessments</h2>
              <Link to="/trainee/assessments" style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>View All</Link>
            </div>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {pendingAssessments.map((assessment, index) => (
                <div key={assessment.id} style={{ padding: '1.25rem', borderBottom: index < pendingAssessments.length - 1 ? '1px solid var(--border-color)' : 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>{assessment.title}</h4>
                    <span className="badge badge-warning">Due {new Date(assessment.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                    <span>{assessment.subject}</span>
                    <span>•</span>
                    <span>{assessment.questionCount} MCQs</span>
                  </div>
                  <Link to={`/trainee/assessments/${assessment.id}`} className="btn btn-outline" style={{ marginTop: '0.5rem', width: 'fit-content' }}>
                    Start Now
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Announcements */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Announcements</h2>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(() => {
                const userNotices = getNotificationsForUser(user);
                
                if (userNotices.length === 0) {
                  return <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No active announcements for your workspace.</p>;
                }

                return userNotices.slice(0, 3).map((notice, i) => (
                  <div key={notice.id || i} style={{ borderLeft: notice.priority === 'Important' ? '3px solid var(--danger)' : '3px solid var(--secondary)', paddingLeft: '1rem' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{notice.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>{notice.message || notice.content}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '0.25rem' }}>{notice.date || 'Recent'}</span>
                  </div>
                ));
              })()}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
