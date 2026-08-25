import { Search, Bell, Menu, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockNotifications } from '../data/mockData';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Listen for custom notification events (mock real-time)
  useEffect(() => {
    const handleNewNotification = () => {
      const localNotifs = JSON.parse(localStorage.getItem('cc_mock_notifications') || '[]');
      if (localNotifs.length > 0) {
        setNotifications([...localNotifs, ...mockNotifications]);
      }
    };
    
    handleNewNotification(); // Initial load
    window.addEventListener('new_notification', handleNewNotification);
    return () => window.removeEventListener('new_notification', handleNewNotification);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    // Also update local storage if they are there
    const localNotifs = JSON.parse(localStorage.getItem('cc_mock_notifications') || '[]');
    if (localNotifs.length > 0) {
      localStorage.setItem('cc_mock_notifications', JSON.stringify(localNotifs.map(n => ({ ...n, read: true }))));
    }
  };

  return (
    <header style={{ 
      backgroundColor: 'var(--white)', 
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={toggleSidebar}
          className="mobile-menu-btn"
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-dark)',
            display: 'none', // Shown via CSS media query
            cursor: 'pointer'
          }}
        >
          <Menu size={24} />
        </button>
        
        {/* Search */}
        {user?.role !== 'Trainer' && (
          <div style={{ position: 'relative', width: '320px' }} className="header-search search-bar">
            <Search size={18} style={{ color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
            />
          </div>
        )}
      </div>

      {/* Right Side Icons & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            style={{ 
              background: 'var(--bg-color-alt)', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--danger)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--white)'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.75rem',
              width: '360px',
              backgroundColor: 'var(--white)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              zIndex: 40,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
                <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--secondary)', cursor: 'pointer', fontWeight: 500 }}>
                  Mark all as read
                </button>
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: n.read ? 'var(--white)' : 'var(--secondary-bg)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.read ? 'transparent' : 'var(--secondary)', marginTop: '0.4rem' }}></div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>{n.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0', lineHeight: 1.4 }}>{n.message}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{n.date || 'Just now'}</span>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    No notifications yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              padding: '0.25rem 0.5rem 0.25rem 0.25rem',
              borderRadius: '24px',
              border: '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.2 }}>{user?.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</span>
            </div>
          </div>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.75rem',
              width: '220px',
              backgroundColor: 'var(--white)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              zIndex: 40,
              padding: '0.5rem'
            }}>
              <Link 
                to={user?.role === 'Trainer' ? "/trainer/profile" : "/trainee/profile"} 
                onClick={() => setDropdownOpen(false)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                  borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color-alt)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <UserCircle size={18} style={{ color: 'var(--text-muted)' }} /> My Profile
              </Link>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }} />
              <button 
                onClick={handleLogout}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                  borderRadius: '8px', fontSize: '0.9rem', width: '100%', border: 'none', 
                  background: 'none', color: 'var(--danger)', textAlign: 'left', fontWeight: 500, cursor: 'pointer' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;
