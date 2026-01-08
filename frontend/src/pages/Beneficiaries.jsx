import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import { beneficiaryService } from '../services/beneficiaryService.js';
import toast from 'react-hot-toast';

const Beneficiaries = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [aidData, setAidData] = useState({
    aidType: 'financial',
    aidAmount: '',
    aidDescription: ''
  });

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const response = await beneficiaryService.getBeneficiaries();
      setBeneficiaries(response.data);
    } catch (error) {
      toast.error('Failed to load beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status) => {
    try {
      await beneficiaryService.reviewBeneficiary(
        selectedBeneficiary._id,
        status,
        reviewNotes
      );
      toast.success(`Beneficiary ${status}`);
      setSelectedBeneficiary(null);
      setReviewNotes('');
      loadBeneficiaries();
    } catch (error) {
      toast.error('Failed to review beneficiary');
    }
  };

  const handleDistributeAid = async () => {
    try {
      await beneficiaryService.distributeAid(selectedBeneficiary._id, {
        ...aidData,
        aidAmount: parseFloat(aidData.aidAmount)
      });
      toast.success('Aid distribution recorded');
      setSelectedBeneficiary(null);
      setAidData({
        aidType: 'financial',
        aidAmount: '',
        aidDescription: ''
      });
      loadBeneficiaries();
    } catch (error) {
      toast.error('Failed to record aid distribution');
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
        <h1 className="text-3xl font-bold">{t('beneficiaries')}</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{beneficiary.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{beneficiary.phone}</td>
                  <td className="px-6 py-4">{beneficiary.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-sm ${
                      beneficiary.status === 'approved' ? 'bg-green-100 text-green-800' :
                      beneficiary.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      beneficiary.status === 'aid-distributed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {beneficiary.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(beneficiary.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedBeneficiary(beneficiary)}
                      className="text-blue-600 hover:underline"
                    >
                      {t('view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {beneficiaries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No beneficiaries found
          </div>
        )}
      </div>

      {selectedBeneficiary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Beneficiary Details</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <strong>Name:</strong> {selectedBeneficiary.name}
              </div>
              <div>
                <strong>Phone:</strong> {selectedBeneficiary.phone}
              </div>
              <div>
                <strong>Email:</strong> {selectedBeneficiary.email || 'N/A'}
              </div>
              <div>
                <strong>Address:</strong> {selectedBeneficiary.address}
              </div>
              <div>
                <strong>NID:</strong> {selectedBeneficiary.nid || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong> {selectedBeneficiary.status}
              </div>
              {selectedBeneficiary.reviewNotes && (
                <div>
                  <strong>Review Notes:</strong> {selectedBeneficiary.reviewNotes}
                </div>
              )}
            </div>

            {selectedBeneficiary.status === 'pending' && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Review Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReview('approved')}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview('rejected')}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {selectedBeneficiary.status === 'approved' && (
              <div className="space-y-4">
                <h3 className="font-bold">Record Aid Distribution</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Aid Type</label>
                  <select
                    value={aidData.aidType}
                    onChange={(e) => setAidData({ ...aidData, aidType: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="financial">Financial</option>
                    <option value="food">Food</option>
                    <option value="medical">Medical</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Aid Amount</label>
                  <input
                    type="number"
                    value={aidData.aidAmount}
                    onChange={(e) => setAidData({ ...aidData, aidAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={aidData.aidDescription}
                    onChange={(e) => setAidData({ ...aidData, aidDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <button
                  onClick={handleDistributeAid}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Record Distribution
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedBeneficiary(null);
                setReviewNotes('');
                setAidData({
                  aidType: 'financial',
                  aidAmount: '',
                  aidDescription: ''
                });
              }}
              className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Beneficiaries;
