import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  PenTool, 
  Users, 
  BarChart, 
  MessageSquare,
  User,
  LogOut,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TrainerSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/trainer/courses', icon: BookOpen },
    { name: 'Learning Content', path: '/trainer/resources', icon: FileText },
    { name: 'Assessments', path: '/trainer/assessments', icon: PenTool },
    { name: 'Trainees', path: '/trainer/trainees', icon: Users },
    { name: 'Performance', path: '/trainer/performance', icon: BarChart },
    { name: 'Feedback', path: '/trainer/feedback', icon: MessageSquare },
    { name: 'My Profile', path: '/trainer/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: 'var(--white)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', // Will be overridden by CSS on desktop
        }}
      >
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>Capacity Connect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>
                Trainer Portal
              </span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {user?.organizationName}
              </p>
            </div>
          </div>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: 'var(--text-muted)' }} 
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            // More robust active check for nested routes
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/trainer/dashboard');
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? 'var(--secondary-hover)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--secondary-bg)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if(!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)';
                }}
                onMouseOut={(e) => {
                  if(!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link
            to="/trainer/support"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <HelpCircle size={20} />
            Support
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--danger)',
              backgroundColor: 'transparent',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default TrainerSidebar;
