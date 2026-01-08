import api from './api.js';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getReports: async (period = 'monthly') => {
    const response = await api.get('/analytics/reports', {
      params: { period }
    });
    return response.data;
  }
};
