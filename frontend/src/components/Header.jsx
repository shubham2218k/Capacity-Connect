import { Bell, Menu, UserCircle, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  fetchAnnouncements, 
  markAllAnnouncementsAsRead, 
  markAnnouncementAsRead 
} from '../services/announcementService';

const idOf = (item) => item?._id || item?.id;

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const data = await fetchAnnouncements(user);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
    }
  };

  // Real-time sync listening to custom event and browser storage event
  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('announcement_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('announcement_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    markAllAnnouncementsAsRead(user, notifications);
    await loadNotifications();
  };

  const handleNotificationClick = async (n) => {
    const id = idOf(n);
    if (!n.read && user && id) {
      markAnnouncementAsRead(user, id);
      await loadNotifications();
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
            display: 'none',
            cursor: 'pointer'
          }}
        >
          <Menu size={24} />
        </button>
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
            title="Notifications"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--secondary)', cursor: 'pointer', fontWeight: 500 }}>
                    Mark all as read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {notifications.length > 0 ? notifications.map(n => (
                  <div 
                    key={idOf(n)} 
                    onClick={() => handleNotificationClick(n)}
                    style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: n.read ? 'var(--white)' : '#f0f9ff',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: n.read ? 'transparent' : 'var(--secondary)', 
                      marginTop: '0.45rem',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>{n.title}</h4>
                        {n.priority === 'Important' && (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Important</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0', lineHeight: 1.4 }}>
                        {n.message || n.content}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        <span>Announcement • {n.date || 'Just now'}</span>
                        {n.read && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle2 size={12} /> Read</span>}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    No notifications for your workspace
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
                to={user?.role === 'Trainer' ? "/trainer/profile" : user?.role === 'Admin' ? "/admin/profile" : "/trainee/profile"} 
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
