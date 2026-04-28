import apiClient from './api';

const authService = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

export default authService;
