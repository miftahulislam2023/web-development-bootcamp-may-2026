import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL === 'http://server:4000'
  ? 'http://localhost:4000/api'
  : import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('chatToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
