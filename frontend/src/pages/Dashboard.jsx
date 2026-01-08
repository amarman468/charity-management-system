import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { campaignService } from '../services/campaignService.js';
import { donationService } from '../services/donationService.js';
import { volunteerService } from '../services/volunteerService.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (user?.role === 'admin') {
        const response = await analyticsService.getDashboard();
        setStats(response.data);
      } else if (user?.role === 'donor') {
        const donations = await donationService.getDonations();
        setStats({ donations: donations.data });
      } else if (user?.role === 'volunteer') {
        const tasks = await volunteerService.getTasks();
        setStats({ tasks: tasks.data });
      } else if (user?.role === 'staff') {
        const response = await analyticsService.getDashboard();
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  if (user?.role === 'admin') {
    const donationsByMethod = stats?.donations?.byMethod || [];
    const campaignStats = stats?.campaigns || [];
    const userStats = stats?.users || [];

    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Total Donations</h3>
              <p className="text-2xl font-bold">{stats?.donations?.total || 0} BDT</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Total Campaigns</h3>
              <p className="text-2xl font-bold">{campaignStats.reduce((sum, c) => sum + c.count, 0)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Total Users</h3>
              <p className="text-2xl font-bold">{userStats.reduce((sum, u) => sum + u.count, 0)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Recent Donations</h3>
              <p className="text-2xl font-bold">{stats?.donations?.recent?.count || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Donations by Payment Method</h3>
              <BarChart width={400} height={300} data={donationsByMethod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Campaign Status</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={campaignStats}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {campaignStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#ef4444'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (user?.role === 'donor') {
    const donations = stats?.donations || [];
    const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Total Donated</h3>
              <p className="text-2xl font-bold">{totalDonated} BDT</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Total Donations</h3>
              <p className="text-2xl font-bold">{donations.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Welcome</h3>
              <p className="text-xl font-bold">{user.name}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Recent Donations</h3>
            {donations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.slice(0, 5).map((donation) => (
                      <tr key={donation._id} className="border-b">
                        <td className="p-2">{donation.campaign?.title || 'N/A'}</td>
                        <td className="p-2">{donation.amount} BDT</td>
                        <td className="p-2">{new Date(donation.createdAt).toLocaleDateString()}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No donations yet</p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (user?.role === 'volunteer') {
    const tasks = stats?.tasks || [];
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Total Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">Completed</h3>
              <p className="text-2xl font-bold">{completedTasks}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600">In Progress</h3>
              <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'in-progress').length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">My Tasks</h3>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task._id} className="border p-4 rounded">
                    <h4 className="font-bold">{task.title}</h4>
                    <p className="text-gray-600">{task.description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tasks assigned yet</p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <p>Staff dashboard content</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
