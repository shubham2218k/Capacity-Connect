import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for mock auth state
    const storedUser = localStorage.getItem('capacityConnect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('capacityConnect_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic for Trainee
    if ((email === 'aarav@moes.gov.in' || email === 'trainee@capacityconnect.demo') && password === 'password123') {
      const mockTrainee = {
        id: 'u1',
        name: 'Aarav Sharma',
        email: 'trainee@capacityconnect.demo',
        role: 'Trainee',
        designation: 'Scientific Assistant',
        department: 'Environmental Data Services',
        organization: 'Ministry of Earth Sciences (MoES)'
      };
      setUser(mockTrainee);
      localStorage.setItem('capacityConnect_user', JSON.stringify(mockTrainee));
      return { success: true, role: 'Trainee' };
    }
    
    // Mock login logic for Trainer
    if (email === 'trainer@capacityconnect.demo' && password === 'password123') {
      const mockTrainer = {
        id: 't1',
        name: 'Dr. Meera Nair',
        email: 'trainer@capacityconnect.demo',
        role: 'Trainer',
        designation: 'Senior Scientist',
        department: 'Climate Research & Training',
        organization: 'Ministry of Earth Sciences'
      };
      setUser(mockTrainer);
      localStorage.setItem('capacityConnect_user', JSON.stringify(mockTrainer));
      return { success: true, role: 'Trainer' };
    }

    // Mock login logic for Admin
    if (email === 'admin@capacityconnect.in' && password === 'admin123') {
      const mockAdmin = {
        id: 'a1',
        name: 'System Administrator',
        email: 'admin@capacityconnect.in',
        role: 'Admin',
        department: 'System Administration',
        organization: 'Ministry of Earth Sciences'
      };
      setUser(mockAdmin);
      localStorage.setItem('capacityConnect_user', JSON.stringify(mockAdmin));
      return { success: true, role: 'Admin' };
    }

    return { success: false, message: 'Invalid credentials. Use valid demo credentials (trainee@..., trainer@..., admin@...)' };
  };

  const register = (userData) => {
    // Registration remains ONLY for Trainees
    const newUser = {
      id: 'u' + Date.now(),
      ...userData,
      role: 'Trainee'
    };
    setUser(newUser);
    localStorage.setItem('capacityConnect_user', JSON.stringify(newUser));
    return { success: true, role: 'Trainee' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('capacityConnect_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

