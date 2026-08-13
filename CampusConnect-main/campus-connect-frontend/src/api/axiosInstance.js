import axios from 'axios';

const api = axios.create({
  // Locally requests use the React proxy; Render uses REACT_APP_API_URL.
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cc_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
