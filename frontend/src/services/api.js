import axios from 'axios';

// Build the API base URL - handle both full URLs and hostnames
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // For production deployment on Render, use the backend URL
  // Check if we're on an onrender.com domain
  if (typeof window !== 'undefined' && window.location.hostname.includes('.onrender.com')) {
    // Use the backend service URL (same pattern: charity-backend-xxx.onrender.com)
    return 'https://charity-backend-src8.onrender.com/api';
  }

  if (!apiUrl) return '/api';

  // If it's already a full URL, use it directly
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    return `${apiUrl}/api`;
  }

  // Otherwise, it's just a hostname - add https://
  return `https://${apiUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
