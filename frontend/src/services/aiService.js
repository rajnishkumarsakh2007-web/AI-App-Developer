import apiClient from './api';

const aiService = {
  generateCode: async (prompt, language, framework = '') => {
    const response = await apiClient.post('/ai/generate', {
      prompt,
      language,
      framework
    });
    return response.data;
  },

  optimizeCode: async (code, language) => {
    const response = await apiClient.post('/ai/optimize', {
      code,
      language
    });
    return response.data;
  },

  fixCode: async (code, language, error) => {
    const response = await apiClient.post('/ai/fix', {
      code,
      language,
      error
    });
    return response.data;
  }
};

export default aiService;
