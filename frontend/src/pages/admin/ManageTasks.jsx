import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { adminService } from '../../services/adminService.js';
import { volunteerService } from '../../services/volunteerService.js';
import toast from 'react-hot-toast';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    volunteer: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tasksRes = await volunteerService.getTasks();
      setTasks(tasksRes.data || []);
      
      const usersRes = await adminService.getUsers();
      const volunteers = usersRes.users.filter(u => u.role === 'volunteer');
      setUsers(volunteers);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (!formData.volunteer || !formData.title || !formData.description) {
        toast.error('Please fill in all fields');
        return;
      }
      
      await volunteerService.createTask(formData);
      toast.success('Task assigned successfully');
      setShowCreateForm(false);
      setFormData({
        volunteer: '',
        title: '',
        description: ''
      });
      loadData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const getVolunteerName = (volunteerId) => {
    const volunteer = users.find(u => u._id === volunteerId);
    return volunteer ? volunteer.name : 'Unknown';
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
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Tasks</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Assign New Task
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No tasks assigned yet.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Volunteer</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{task.title}</td>
                    <td className="px-4 py-2">{task.volunteer?.name || 'Unknown'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(task.assignedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Assign New Task</h2>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Volunteer *</label>
                  <select
                    value={formData.volunteer}
                    onChange={(e) => setFormData({ ...formData, volunteer: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Choose a volunteer</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Task Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Task description"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Assign Task
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({
                        volunteer: '',
                        title: '',
                        description: ''
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
  );
};

export default ManageTasks;
