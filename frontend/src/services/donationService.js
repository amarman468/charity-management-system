import api from './api.js';

export const donationService = {
  createDonation: async (donationData) => {
    const response = await api.post('/donations', donationData);
    return response.data;
  },

  getDonations: async () => {
    const response = await api.get('/donations');
    return response.data;
  },

  getDonation: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  downloadReceipt: async (donationId) => {
    const response = await api.get(`/pdf/receipt/${donationId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
