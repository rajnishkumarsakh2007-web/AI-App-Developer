import apiClient from './api';

const projectService = {
  getProjects: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/projects', { params: { page, limit } });
    return response.data;
  },

  getProject: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, updates) => {
    const response = await apiClient.put(`/projects/${id}`, updates);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  }
};

export default projectService;
