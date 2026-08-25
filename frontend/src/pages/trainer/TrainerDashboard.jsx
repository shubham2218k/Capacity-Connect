import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, PenTool, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { mockCourses, mockTrainerTrainees } from '../../data/mockData';
import { Link } from 'react-router-dom';

const TrainerDashboard = () => {
  const { user } = useAuth();
  
  // Filter courses by this trainer
  const trainerCourses = mockCourses.filter(c => c.trainer === user.name);
  const activeCourses = trainerCourses.length;
  
  // Stats calculation
  const totalTrainees = mockTrainerTrainees.length;
  const completedTrainees = mockTrainerTrainees.filter(t => t.status === 'Completed').length;
  
  const avgCompletion = totalTrainees > 0 
    ? Math.round(mockTrainerTrainees.reduce((acc, t) => acc + t.progress, 0) / totalTrainees) 
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Welcome back, {user.name}
        </h1>
        <p style={{ color: 'var(--text-light)' }}>Here is what's happening with your training programs today.</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{activeCourses}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Active Courses</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalTrainees}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Trainees</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <PenTool size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>3</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Assessments Created</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '50%' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{avgCompletion}%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Avg Completion Rate</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Active Courses */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Your Active Courses</h2>
            <Link to="/trainer/courses" style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>View All</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trainerCourses.map(course => (
              <div key={course.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{course.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    <span>{course.modulesCount} Modules</span>
                    <span>{mockTrainerTrainees.filter(t => t.enrolledCourse === course.id).length} Trainees</span>
                  </div>
                </div>
                <Link to={`/trainer/courses/${course.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Manage
                </Link>
              </div>
            ))}
            {trainerCourses.length === 0 && (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>No active courses found. Create one!</p>
            )}
          </div>
        </div>

        {/* Recent Trainee Activity */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Trainee Activity</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--secondary)', marginTop: '2px' }}><CheckCircle size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Priya Singh</strong> completed <em>Fundamentals of Remote Sensing</em></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>2 hours ago</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--primary)', marginTop: '2px' }}><PenTool size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Aarav Sharma</strong> submitted <em>Data Analysis Assessment</em></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>5 hours ago</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: '#b45309', marginTop: '2px' }}><Clock size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Rahul Kumar</strong> enrolled in <em>Fundamentals of Remote Sensing</em></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>1 day ago</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--secondary)', marginTop: '2px' }}><CheckCircle size={18} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>4 trainees</strong> completed <em>Remote Sensing Fundamentals - Module 1</em></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>2 days ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerDashboard;
