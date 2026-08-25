import { Link } from 'react-router-dom';
import { PlayCircle, Clock, User, BookOpen } from 'lucide-react';

const CourseCard = ({ course, enrolled = false, progress = 0 }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
      
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '160px', backgroundColor: 'var(--bg-color-alt)' }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)' }}>
            <BookOpen size={48} opacity={0.3} />
          </div>
        )}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className="badge badge-primary" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(224, 242, 254, 0.9)' }}>
            {course.subject || course.category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4, color: 'var(--text-dark)' }}>
          {course.title}
        </h3>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>
          {course.description}
        </p>
        
        {/* Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={14} /> {course.trainer}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} /> {course.duration}
          </span>
        </div>

        {/* Footer Actions */}
        {enrolled ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span className="text-muted">Progress</span>
              <span style={{ color: 'var(--secondary)' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', marginBottom: '1.25rem', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, backgroundColor: 'var(--secondary)', height: '100%', borderRadius: '4px' }}></div>
            </div>
            <Link to={`/trainee/learning/${course.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
              Continue Learning <PlayCircle size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{course.level || course.difficulty}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.modulesCount || course.modules} Modules</span>
            </div>
            <Link to={`/trainee/courses/${course.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
