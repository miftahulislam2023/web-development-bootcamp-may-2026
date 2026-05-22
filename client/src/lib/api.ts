import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});


// Attach token from localStorage as fallback
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('chat_token');
    
    // Fallback: Try to get token from zustand persist storage
    if (!token) {
      const authStorage = localStorage.getItem('chat-auth');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed.state?.token;
        } catch (e) {
          console.error('Failed to parse chat-auth storage', e);
        }
      }
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// handle 401 error globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('chat_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
