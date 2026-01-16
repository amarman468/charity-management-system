import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getTranslation } from '../../utils/translations.js';
import Layout from '../../components/Layout.jsx';
import { analyticsService } from '../../services/analyticsService.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await analyticsService.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center p-8">Loading...</div>
      </Layout>
    );
  }

  const donationsByMethod = stats?.donations?.byMethod || [];
  const campaignStats = stats?.campaigns || [];
  const userStats = stats?.users || [];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('dashboard')} - Admin</h1>

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
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationsByMethod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Campaign Status</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
