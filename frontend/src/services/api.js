const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  const user = localStorage.getItem('capacityConnect_user');
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.token;
  }
  return null;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // Auto logout if 401 response returned from api
    localStorage.removeItem('capacityConnect_user');
    window.location.href = '/login';
    return Promise.reject('Unauthorized');
  }

  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

export const api = {
  get: async (endpoint) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, { method: 'GET', headers });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  patch: async (endpoint, body) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE', headers });
    return handleResponse(response);
  },

  // For file uploads
  postFormData: async (endpoint, formData) => {
    const token = getAuthToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData // Note: no Content-Type header, browser sets it for FormData
    });
    return handleResponse(response);
  }
};
