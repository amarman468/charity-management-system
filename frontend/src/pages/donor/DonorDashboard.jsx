import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getTranslation } from '../../utils/translations.js';
import Layout from '../../components/Layout.jsx';
import { donationService } from '../../services/donationService.js';

const DonorDashboard = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [stats, setStats] = useState({ donations: [] });
    const [loading, setLoading] = useState(true);

    const t = (key) => getTranslation(key, language);

    useEffect(() => {
        const loadData = async () => {
            try {
                const donations = await donationService.getDonations();
                setStats({ donations: donations.data });
            } catch (error) {
                console.error('Error loading donor dashboard:', error);
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

    const donations = stats.donations || [];
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
};

export default DonorDashboard;
