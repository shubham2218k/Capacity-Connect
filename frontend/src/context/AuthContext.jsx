import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'capacityConnect_user';

const messageOf = (error, fallback) => error?.message || (typeof error === 'string' ? error : fallback);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Restore and validate session on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (!parsedUser || !parsedUser.token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Verify token validity with backend if token exists
    api.get('/auth/me')
      .then((response) => {
        if (!isMounted) return;
        if (response?.success && response.data) {
          const merged = { ...parsedUser, ...response.data, token: parsedUser.token, isDemo: response.data.isDemo || parsedUser.isDemo };
          setUser(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        // Only clear session if backend explicitly rejected auth (401 token invalid/expired)
        if (err?.status === 401) {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
        // On network errors or offline mode, keep storedUser as valid session fallback
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const demoLogin = async (role) => {
    try {
      const response = await api.post('/auth/demo-login', { role });
      if (response.success && response.data) {
        persist(response.data);
        return { success: true, role: response.data.role };
      }
      return { success: false, message: response.message || 'Demo access failed' };
    } catch (error) {
      return { success: false, message: messageOf(error, 'Demo access failed') };
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
    demoLogin,
    register,
    registerAdmin,
    applyAsTrainer,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

