import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap, 
  PenTool, Award, Map, FileText, Bell, BarChart2, User,
  Settings, LogOut, HelpCircle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || (location.pathname.startsWith(path) && path !== '/admin/dashboard');
  };

  const NavGroup = ({ title, children }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', padding: '0 1rem' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {children}
      </div>
    </div>
  );

  const NavItem = ({ name, path, icon: Icon }) => {
    const active = isActive(path);
    return (
      <Link
        to={path}
        onClick={() => setIsOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          color: active ? 'var(--secondary-hover)' : 'var(--text-muted)',
          backgroundColor: active ? 'var(--secondary-bg)' : 'transparent',
          fontWeight: active ? 600 : 500,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          fontSize: '0.95rem'
        }}
        onMouseOver={(e) => { if(!active) e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'; }}
        onMouseOut={(e) => { if(!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Icon size={18} />
        {name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px', backgroundColor: 'var(--white)', borderRight: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 50,
          transition: 'transform 0.3s ease', transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>Capacity Connect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
              <span className="badge badge-neutral" style={{ alignSelf: 'flex-start' }}>Admin Portal</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {user?.organizationName}
              </p>
            </div>
          </div>
          <button 
            className="mobile-close-btn" onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: 'var(--text-muted)' }} 
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <NavGroup title="Management">
            <NavItem name="Dashboard" path="/admin/dashboard" icon={LayoutDashboard} />
            <NavItem name="Users" path="/admin/users" icon={Users} />
            <NavItem name="Trainer Approvals" path="/admin/trainer-approvals" icon={UserCheck} />
          </NavGroup>

          <NavGroup title="Learning">
            <NavItem name="Courses" path="/admin/courses" icon={BookOpen} />
            <NavItem name="Enrollments" path="/admin/enrollments" icon={GraduationCap} />
            <NavItem name="Assessments" path="/admin/assessments" icon={PenTool} />
            <NavItem name="Certifications" path="/admin/certifications" icon={Award} />
            <NavItem name="Learning Content" path="/admin/content" icon={FileText} />
          </NavGroup>

          <NavGroup title="Organization">
            <NavItem name="Competency Mapping" path="/admin/competencies" icon={Map} />
            <NavItem name="Announcements" path="/admin/announcements" icon={Bell} />
            <NavItem name="Reports & Analytics" path="/admin/reports" icon={BarChart2} />
            <NavItem name="My Profile" path="/admin/profile" icon={User} />
          </NavGroup>

        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link
            to="/admin/settings"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings size={18} /> Organization Settings
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--danger)', backgroundColor: 'transparent', border: 'none', fontWeight: 500, cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: '0.95rem' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

    </>
  );
};

export default AdminSidebar;
