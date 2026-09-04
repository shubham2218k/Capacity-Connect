import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'capacityConnect_user';

const messageOf = (error, fallback) => error?.message || (typeof error === 'string' ? error : fallback);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Refresh the stored profile in the background when a backend is reachable.
  // A failure here is never allowed to sign the user out.
  useEffect(() => {
    if (loading || !user?.token) return;

    let cancelled = false;
    api.get('/auth/me')
      .then((response) => {
        if (cancelled || !response?.success || !response.data) return;
        const merged = { ...user, ...response.data, token: user.token };
        setUser(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      })
      .catch(() => { /* keep the existing session as-is */ });

    return () => { cancelled = true; };
    // Runs once per app load, after the stored session has been read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const persist = (data) => {
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const login = async (email, password, role, accessKey) => {
    try {
      const response = await api.post('/auth/login', { email, password, role, accessKey });
      if (response.success && response.data) {
        persist(response.data);
        return { success: true, role: response.data.role };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: messageOf(error, 'Login failed') };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/trainee-register', userData);
      if (response.success && response.data) {
        persist(response.data);
        return { success: true, role: response.data.role };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: messageOf(error, 'Registration failed') };
    }
  };

  const registerAdmin = async (adminData) => {
    try {
      const response = await api.post('/auth/admin-register', adminData);
      if (response.success && response.data) {
        persist(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message || 'Admin Registration failed' };
    } catch (error) {
      return { success: false, message: messageOf(error, 'Admin Registration failed') };
    }
  };

  // Trainers are created with a "pending" status and get no session.
  const applyAsTrainer = async (applicationData) => {
    try {
      const response = (typeof FormData !== 'undefined' && applicationData instanceof FormData)
        ? await api.postFormData('/auth/trainer-apply', applicationData)
        : await api.post('/auth/trainer-apply', applicationData);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Application failed' };
    } catch (error) {
      return { success: false, message: messageOf(error, 'Application failed') };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    login,
    register,
    registerAdmin,
    applyAsTrainer,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
