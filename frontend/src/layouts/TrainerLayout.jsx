import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TrainerSidebar from '../components/TrainerSidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const TrainerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Trainer Portal...</p>
        </div>
      </div>
    );
  }

  // Protect the routes: only allow Trainers
  if (!user || user.role !== 'Trainer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <TrainerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: sidebarOpen ? '250px' : '0', // Mobile handles this differently, but we'll use media queries in a real app
        width: '100%' 
      }} className="main-content">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;
