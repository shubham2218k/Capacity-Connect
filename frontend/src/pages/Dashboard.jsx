import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { BookOpen, Award, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../services/announcementService';
import { api } from '../services/api';

const idOf = (item) => item?._id || item?.id;

const Dashboard = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setAnnouncements([]);
        setCourses([]);
        return;
      }
      try {
        const [annRes, courseRes] = await Promise.all([
          fetchAnnouncements(user).catch(() => []),
          api.get('/courses').catch(() => ({ data: [] }))
        ]);
        setAnnouncements(Array.isArray(annRes) ? annRes : []);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadData();

    window.addEventListener('announcement_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('announcement_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [user]);

  const publishedCourses = courses.filter(c => c.status === 'published');

  return (
    <div className="container" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            Welcome, {user?.name} 👋
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            Capacity Connect portal for <strong>{user?.organizationName || 'your organization'}</strong>.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary-bg)', color: 'var(--secondary-hover)', borderRadius: '12px' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{loadingCourses ? '-' : publishedCourses.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Published Courses</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: '12px' }}>
            <Clock size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>0</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Assessments</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '12px' }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>0</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certificates Earned</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 2 }}>
          
          {/* Available Courses */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Organization Courses</h2>
              <Link to={user?.role === 'Trainer' ? "/trainer/courses" : "/trainee/library"} style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View Course Library <ArrowRight size={16} />
              </Link>
            </div>

            {loadingCourses ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                Loading courses...
              </div>
            ) : publishedCourses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {publishedCourses.slice(0, 4).map(course => (
                  <CourseCard key={idOf(course)} course={course} />
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
                No published courses available for your organization yet.
              </div>
            )}
          </section>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1 }}>
          
          {/* Announcements */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Organization Announcements</h2>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {announcements.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No active announcements for your workspace.</p>
              ) : (
                announcements.slice(0, 3).map((notice, i) => (
                  <div key={idOf(notice) || i} style={{ borderLeft: notice.priority === 'Important' ? '3px solid var(--danger)' : '3px solid var(--secondary)', paddingLeft: '1rem' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{notice.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>{notice.message || notice.content}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '0.25rem' }}>{notice.date || (notice.createdAt ? notice.createdAt.split('T')[0] : 'Recent')}</span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
