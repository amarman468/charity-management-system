import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService.js';

const Users = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('User deleted');
        loadUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  // activity preview
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [activityUser, setActivityUser] = useState(null);

  const handleViewActivity = async (user) => {
    setActivityUser(user);
    setActivityLoading(true);
    setActivityOpen(true);
    try {
      const res = await adminService.getUserActivity(user._id);
      // res may be { success, data }
      const payload = res.data || res;
      setActivityList(payload);
    } catch (err) {
      toast.error('Failed to load activity');
      console.error(err);
      setActivityList([]);
    } finally {
      setActivityLoading(false);
    }
  };

  const closeActivity = () => {
    setActivityOpen(false);
    setActivityList([]);
    setActivityUser(null);
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
        <h1 className="text-3xl font-bold">{t('users')}</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-sm ${
                      u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {u.role === 'staff' && (
                        <button
                          onClick={() => handleViewActivity(u)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                          Preview
                        </button>
                      )}

                      {u._id !== user.id && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="text-red-600 hover:underline"
                        >
                          {t('delete')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found
          </div>
        )}

        {/* Activity preview modal */}
        {activityOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">{activityUser ? `${activityUser.name}'s activity` : 'Activity'}</h2>
                <button onClick={closeActivity} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>

              <div className="mt-4 max-h-96 overflow-auto">
                {activityLoading && <div>Loading...</div>}
                {!activityLoading && activityList.length === 0 && <div className="text-gray-500">No recent activity</div>}

                <ul className="space-y-3">
                  {activityList.map((a, idx) => (
                    <li key={idx} className="p-3 border rounded">
                      {a.type === 'notification' && (
                        <div>
                          <div className="text-sm text-gray-600">Notification</div>
                          <div className="font-medium">{a.payload.title || a.payload.message}</div>
                          <div className="text-xs text-gray-500">{new Date(a.date).toLocaleString()}</div>
                        </div>
                      )}

                      {a.type === 'task_assigned' && (
                        <div>
                          <div className="text-sm text-gray-600">Assigned Task</div>
                          <div className="font-medium">{a.payload.title}</div>
                          <div className="text-xs text-gray-500">To: {a.payload.volunteer?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{new Date(a.date).toLocaleString()}</div>
                        </div>
                      )}

                      {a.type === 'task_for_user' && (
                        <div>
                          <div className="text-sm text-gray-600">Task</div>
                          <div className="font-medium">{a.payload.title}</div>
                          <div className="text-xs text-gray-500">Assigned by: {a.payload.assignedBy?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{new Date(a.date).toLocaleString()}</div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={closeActivity} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
