import axios from 'axios';

// Create a separate axios instance WITHOUT withCredentials to avoid CORS error
// Backend has wildcard CORS which conflicts with credentials mode
export const chatAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add token manually in Authorization header
chatAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
