import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getTranslation } from '../../utils/translations.js';
import Layout from '../../components/Layout.jsx';
import { volunteerService } from '../../services/volunteerService.js';

const VolunteerDashboard = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const t = (key) => getTranslation(key, language);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await volunteerService.getTasks();
                setTasks(response.data);
            } catch (error) {
                console.error('Error loading volunteer dashboard:', error);
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
                                    <span className={`inline-block mt-2 px-2 py-1 rounded ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {task.status}
                                    </span>
                                    {task.status === 'completed' && (
                                        <button className="block mt-2 text-sm text-blue-600 hover:underline">
                                            Download Certificate
                                        </button>
                                    )}
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
};

export default VolunteerDashboard;
