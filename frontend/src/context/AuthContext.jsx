import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

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

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('capacityConnect_user', JSON.stringify(response.data));
        return { success: true, role: response.data.role };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { success: false, message: typeof error === 'string' ? error : 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Send either to /auth/register or /auth/trainer-apply depending on role chosen in frontend
      // The frontend UI for Trainer Application is separate, but we handle standard Trainee registration here
      const response = await api.post('/auth/register', userData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('capacityConnect_user', JSON.stringify(response.data));
        return { success: true, role: response.data.role };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return { success: false, message: typeof error === 'string' ? error : 'Registration failed' };
    }
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

