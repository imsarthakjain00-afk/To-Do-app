import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://to-do-app-epe4.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject Authorization token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('todo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('todo_token', response.data.token);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('todo_token');
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/is_auth');
    return response.data;
  }
};

export const taskAPI = {
  getAll: async () => {
    const response = await api.get('/tasks/all_tasks');
    return response.data;
  },
  create: async (title, description) => {
    const response = await api.post('/tasks/create', { title, description });
    return response.data;
  },
  update: async (taskId, title, description) => {
    const response = await api.put(`/tasks/update_task/${taskId}`, { title, description });
    return response.data;
  },
  delete: async (taskId) => {
    const response = await api.delete(`/tasks/delete_task/${taskId}`);
    return response.data;
  }
};

export default api;
