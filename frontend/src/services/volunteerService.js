import api from './api.js';

export const volunteerService = {
  getTasks: async () => {
    const response = await api.get('/volunteer/tasks');
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/volunteer/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/volunteer/tasks', taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status, updateText) => {
    const response = await api.patch(`/volunteer/tasks/${id}/status`, {
      status,
      updateText
    });
    return response.data;
  },

  downloadCertificate: async (taskId) => {
    const response = await api.get(`/pdf/certificate/${taskId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
