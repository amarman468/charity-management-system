import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import { donationService } from '../services/donationService.js';
import { campaignService } from '../services/campaignService.js';
import toast from 'react-hot-toast';

const Donations = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateForm, setDonateForm] = useState({
    campaignId: '',
    amount: '',
    paymentMethod: 'bKash',
    phoneNumber: ''
  });

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadDonations();
    if (user?.role === 'donor') {
      loadCampaigns();
    }
  }, [user]);

  const loadDonations = async () => {
    try {
      const response = await donationService.getDonations();
      setDonations(response.data);
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getCampaigns('active');
      setCampaigns(response.data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      await donationService.createDonation({
        campaignId: donateForm.campaignId,
        amount: parseFloat(donateForm.amount),
        paymentMethod: donateForm.paymentMethod,
        paymentDetails: {
          phoneNumber: donateForm.phoneNumber
        }
      });
      toast.success('Donation successful!');
      setShowDonateModal(false);
      setDonateForm({
        campaignId: '',
        amount: '',
        paymentMethod: 'bKash',
        phoneNumber: ''
      });
      loadDonations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation failed');
    }
  };

  const handleDownloadReceipt = async (donationId) => {
    try {
      const blob = await donationService.downloadReceipt(donationId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${donationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Receipt downloaded');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('donations')}</h1>
          {user?.role === 'donor' && (
            <button
              onClick={() => setShowDonateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {t('donate')}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.campaign?.title || 'N/A'}</td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap">{donation.donor?.name || 'N/A'}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">{donation.amount} BDT</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-sm ${donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.status === 'completed' && (
                        <button
                          onClick={() => handleDownloadReceipt(donation._id)}
                          className="text-blue-600 hover:underline mr-4"
                        >
                          {t('downloadReceipt')}
                        </button>
                      )}
                      {donation.campaign?.type === 'orphan_sponsorship' && (
                        <button
                          onClick={() => {
                            setDonateForm({ ...donateForm, campaignId: donation.campaign._id });
                            setShowDonateModal(true);
                          }}
                          className="text-purple-600 hover:underline font-semibold"
                        >
                          Renew
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {donations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No donations found
          </div>
        )}
      </div>

      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{t('donate')}</h2>
            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign</label>
                <select
                  value={donateForm.campaignId}
                  onChange={(e) => setDonateForm({ ...donateForm, campaignId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign._id} value={campaign._id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('donationAmount')}</label>
                <input
                  type="number"
                  value={donateForm.amount}
                  onChange={(e) => setDonateForm({ ...donateForm, amount: e.target.value })}
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('paymentMethod')}</label>
                <select
                  value={donateForm.paymentMethod}
                  onChange={(e) => setDonateForm({ ...donateForm, paymentMethod: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank">Bank</option>
                  <option value="Card">Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone/Account Number</label>
                <input
                  type="text"
                  value={donateForm.phoneNumber}
                  onChange={(e) => setDonateForm({ ...donateForm, phoneNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                Note: This is a simulated payment. No actual money will be charged.
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {t('donate')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Donations;
