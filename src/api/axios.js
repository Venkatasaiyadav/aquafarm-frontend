// src/api/axios.js

/*
 📚 LEARN: Axios Instance
 
 Instead of writing the full URL every time:
   axios.get('http://localhost:8080/api/ponds')
 
 We create a pre-configured instance:
   api.get('/ponds')
 
 It automatically:
 ✅ Adds base URL
 ✅ Adds JWT token to every request
 ✅ Handles errors globally
 ✅ Redirects to login if token expired
*/



import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR — runs BEFORE every API call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — runs AFTER every API response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      // Token expired → force logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ========== AUTH APIs ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  health: () => api.get('/auth/health'),
};

// ========== POND APIs ==========
export const pondAPI = {
  create: (farmId, data) =>
    api.post(`/ponds?farmId=${farmId}`, data),
  getAll: (farmId) =>
    api.get(`/ponds?farmId=${farmId}`),
  getById: (id) =>
    api.get(`/ponds/${id}`),
};

// ========== FEED APIs ==========
export const feedAPI = {
  add: (data) =>
    api.post('/feed', data),
  getByPond: (pondId) =>
    api.get(`/feed/pond/${pondId}`),
  getByDate: (pondId, date) =>
    api.get(`/feed/pond/${pondId}/date?date=${date}`),
  getToday: (farmId) =>
    api.get(`/feed/today?farmId=${farmId}`),
};

// ========== GROWTH APIs ==========
export const growthAPI = {
  add: (data) =>
    api.post('/growth', data),
  getByPond: (pondId) =>
    api.get(`/growth/pond/${pondId}`),
  getLatest: (pondId) =>
    api.get(`/growth/pond/${pondId}/latest`),
};

// ========== EXPENSE APIs ==========
export const expenseAPI = {
  add: (farmId, data) =>
    api.post(`/expenses?farmId=${farmId}`, data),
  getAll: (farmId) =>
    api.get(`/expenses?farmId=${farmId}`),
};

// ========== DASHBOARD API ==========
export const dashboardAPI = {
  get: (farmId) =>
    api.get(`/dashboard?farmId=${farmId}`),
};

export default api;