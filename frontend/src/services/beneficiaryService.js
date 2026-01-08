import api from './api.js';

export const beneficiaryService = {
  getBeneficiaries: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/beneficiaries', { params });
    return response.data;
  },

  getBeneficiary: async (id) => {
    const response = await api.get(`/beneficiaries/${id}`);
    return response.data;
  },

  createBeneficiary: async (beneficiaryData) => {
    const response = await api.post('/beneficiaries', beneficiaryData);
    return response.data;
  },

  reviewBeneficiary: async (id, status, reviewNotes) => {
    const response = await api.patch(`/beneficiaries/${id}/review`, {
      status,
      reviewNotes
    });
    return response.data;
  },

  distributeAid: async (id, aidData) => {
    const response = await api.patch(`/beneficiaries/${id}/distribute`, aidData);
    return response.data;
  }
};
