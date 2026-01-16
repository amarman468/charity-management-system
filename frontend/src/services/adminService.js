import api from './api.js';

// Simple admin service wrapping admin endpoints
export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createCampaign: async (data) => {
    const response = await api.post('/admin/campaigns', data);
    return response.data;
  },

  updateCampaign: async (id, data) => {
    const response = await api.put(`/admin/campaigns/${id}`, data);
    return response.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/admin/campaigns/${id}`);
    return response.data;
  },

  getDonations: async () => {
    const response = await api.get('/admin/donations');
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Admin approval flow
  getAdminRequests: async () => {
    const response = await api.get('/admin/admin-requests');
    return response.data;
  },

  approveAdmin: async (id) => {
    const response = await api.post(`/admin/admin-requests/${id}/approve`);
    return response.data;
  },

  rejectAdmin: async (id) => {
    const response = await api.delete(`/admin/admin-requests/${id}`);
    return response.data;
  }
  ,

  // User management
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserActivity: async (id) => {
    const response = await api.get(`/users/${id}/activity`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }
};
