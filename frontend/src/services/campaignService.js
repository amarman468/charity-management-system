import api from './api.js';

export const campaignService = {
  getCampaigns: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  getCampaign: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },

  updateCampaign: async (id, campaignData) => {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  closeCampaign: async (id) => {
    const response = await api.patch(`/campaigns/${id}/close`);
    return response.data;
  }
};
