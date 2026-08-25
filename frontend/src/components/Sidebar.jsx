import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  BookOpen, 
  PenTool, 
  LibrarySquare, 
  Award, 
  User,
  LogOut,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/trainee/dashboard', icon: LayoutDashboard },
    { name: 'Explore Courses', path: '/trainee/courses', icon: Compass },
    { name: 'My Learning', path: '/trainee/learning', icon: BookOpen },
    { name: 'Assessments', path: '/trainee/assessments', icon: PenTool },
    { name: 'Learning Library', path: '/trainee/library', icon: LibrarySquare },
    { name: 'Certificates', path: '/trainee/certificates', icon: Award },
    { name: 'My Profile', path: '/trainee/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || (location.pathname.startsWith(path) && path !== '/trainee/dashboard');
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
            <span className="badge badge-neutral" style={{ marginTop: '0.25rem' }}>
              MoES Trainee Portal
            </span>
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
            const active = isActive(item.path);
            
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
                  color: active ? 'var(--secondary-hover)' : 'var(--text-muted)',
                  backgroundColor: active ? 'var(--secondary-bg)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if(!active) e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)';
                }}
                onMouseOut={(e) => {
                  if(!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              backgroundColor: 'transparent',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <HelpCircle size={20} />
            Help / Support
          </button>
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
            Logout
          </button>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
