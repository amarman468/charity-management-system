import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import { campaignService } from '../services/campaignService.js';
import toast from 'react-hot-toast';

const Campaigns = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    image: '',
    type: 'general'
  });

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await campaignService.createCampaign({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount)
      });
      toast.success('Campaign created successfully');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        startDate: '',
        endDate: '',
        image: '',
        type: 'general'
      });
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Are you sure you want to close this campaign?')) {
      try {
        await campaignService.closeCampaign(id);
        toast.success('Campaign closed');
        loadCampaigns();
      } catch (error) {
        toast.error('Failed to close campaign');
      }
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
          <h1 className="text-3xl font-bold">{t('campaigns')}</h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {t('createCampaign')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progress = (campaign.currentAmount / campaign.targetAmount) * 100;
            return (
              <div key={campaign._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {campaign.image && (
                  <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                  <div className="mb-2">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full uppercase font-semibold">
                      {campaign.type?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{campaign.currentAmount} BDT</span>
                      <span>{campaign.targetAmount} BDT</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-1 rounded text-sm ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {campaign.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Ends: {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      {t('view')}
                    </Link>
                    {user?.role === 'admin' && campaign.status === 'active' && (
                      <button
                        onClick={() => handleClose(campaign._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No campaigns found
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{t('createCampaign')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('campaignTitle')}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('targetAmount')}</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('startDate')}</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('endDate')}</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="general">General</option>
                  <option value="zakat">Zakat</option>
                  <option value="sadaqah">Sadaqah</option>
                  <option value="disaster_relief">Disaster Relief</option>
                  <option value="orphan_sponsorship">Orphan Sponsorship</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default Campaigns;
