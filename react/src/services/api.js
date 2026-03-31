import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
};

export const busAPI = {
  getAll: () => api.get('/buses/'),
  getById: (id) => api.get(`/buses/${id}/`),
  getSeats: (busId) => api.get(`/buses/${busId}/seats/`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings/', data),
  getUserBookings: (userId) => api.get(`/users/${userId}/bookings/`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard/'),
  getAllBookings: () => api.get('/admin/bookings/'),
  getAllBuses: () => api.get('/admin/buses/'),
  createBus: (data) => api.post('/admin/buses/', data),
  updateBus: (id, data) => api.put(`/admin/buses/${id}/`, data),
  deleteBus: (id) => api.delete(`/admin/buses/${id}/`),
  getBusDetail: (id) => api.get(`/admin/buses/${id}/`),
};

export default api;
