import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, BookOpen, Award, CheckCircle, Clock } from 'lucide-react';
import { mockTrainerTrainees, mockCourses } from '../../data/mockData';

const TraineeProfileView = () => {
  const { id } = useParams();
  const [trainee, setTrainee] = useState(null);

  useEffect(() => {
    // In a real app, fetch full profile from API
    const found = mockTrainerTrainees.find(t => t.id === id);
    if (found) {
      setTrainee(found);
    }
  }, [id]);

  if (!trainee) return <div style={{ padding: '2rem' }}>Loading trainee profile...</div>;

  const getCourseName = (courseId) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? course.title : courseId;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/trainer/trainees" style={{ color: 'var(--text-light)' }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>Trainee Profile</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column - Profile Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1.5rem' 
            }}>
              {trainee.name.charAt(0)}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{trainee.name}</h2>
            <p style={{ color: 'var(--secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>{trainee.designation}</p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{trainee.department}</p>
            
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.5rem' }}>
              <Mail size={18} /> Message Trainee
            </button>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Contact Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Email</div>
                <div>{trainee.name.split(' ')[0].toLowerCase()}@moes.gov.in</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Location</div>
                <div>New Delhi, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Learning Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Course Enrollment</h2>
            
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{getCourseName(trainee.enrolledCourse)}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Enrolled on: Aug 10, 2026</p>
                </div>
                <span className={`badge ${trainee.status === 'Completed' ? 'badge-success' : trainee.status === 'Needs Attention' ? 'badge-danger' : 'badge-primary'}`}>
                  {trainee.status}
                </span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  <span>Course Progress</span>
                  <span>{trainee.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}>
                  <div style={{ 
                    width: `${trainee.progress}%`, 
                    height: '100%', 
                    backgroundColor: trainee.progress < 40 ? 'var(--danger)' : trainee.progress === 100 ? 'var(--success)' : 'var(--primary)', 
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{Math.round((trainee.progress / 100) * 5)}/5</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Modules Completed</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{trainee.assessmentAverage || 0}%</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Assessment Avg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '30px', bottom: '-20px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
                <div style={{ backgroundColor: 'var(--success)', color: 'white', borderRadius: '50%', padding: '4px', zIndex: 1 }}>
                  <CheckCircle size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>Completed Module 3</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>2 days ago</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '30px', bottom: '-20px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
                <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '4px', zIndex: 1 }}>
                  <Award size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>Scored 85% on Assessment 1</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>1 week ago</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ backgroundColor: '#b45309', color: 'white', borderRadius: '50%', padding: '4px', zIndex: 1 }}>
                  <Clock size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>Started Course</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Aug 10, 2026</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TraineeProfileView;
