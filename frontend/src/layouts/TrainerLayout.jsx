import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TrainerSidebar from '../components/TrainerSidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const TrainerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

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
