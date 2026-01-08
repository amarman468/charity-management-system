import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import { analyticsService } from '../services/analyticsService.js';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [period, setPeriod] = useState('monthly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await analyticsService.getReports(period);
      setReport(response.data);
    } catch (error) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    let csv = 'Donations Report\n\n';
    csv += 'Campaign,Donor,Amount,Date,Status\n';
    
    report.donations.list.forEach(d => {
      csv += `"${d.campaign?.title || ''}","${d.donor?.name || ''}",${d.amount},"${new Date(d.createdAt).toLocaleDateString()}",${d.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${period}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Report exported to CSV');
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
          <h1 className="text-3xl font-bold">{t('reports')}</h1>
          <div className="flex space-x-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {report && (
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('exportCSV')}
              </button>
            )}
          </div>
        </div>

        {report && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600">Total Donations</h3>
                <p className="text-2xl font-bold">{report.donations.total} BDT</p>
                <p className="text-sm text-gray-500">{report.donations.count} donations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600">Beneficiaries</h3>
                <p className="text-2xl font-bold">{report.beneficiaries.count}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600">Tasks</h3>
                <p className="text-2xl font-bold">{report.tasks.count}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="text-xl font-bold p-4">Donations</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.donations.list.map((donation) => (
                      <tr key={donation._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.campaign?.title || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.donor?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.amount} BDT</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-sm ${
                            donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!report && !loading && (
          <div className="text-center py-12 text-gray-500">
            No report data available
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
