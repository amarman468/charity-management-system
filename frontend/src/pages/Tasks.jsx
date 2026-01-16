import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTranslation } from '../utils/translations.js';
import Layout from '../components/Layout.jsx';
import { volunteerService } from '../services/volunteerService.js';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateText, setUpdateText] = useState('');

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await volunteerService.getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await volunteerService.updateTaskStatus(taskId, status, updateText);
      toast.success('Task status updated');
      setSelectedTask(null);
      setUpdateText('');
      loadTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDownloadCertificate = async (taskId) => {
    try {
      const blob = await volunteerService.downloadCertificate(taskId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${taskId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificate downloaded');
    } catch (error) {
      toast.error('Failed to download certificate');
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
        <h1 className="text-3xl font-bold">{t('tasks')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>

              <div className="mb-4">
                <span className={`px-2 py-1 rounded text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {task.status}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Assigned: {new Date(task.assignedDate).toLocaleDateString()}
                </p>
              </div>

              {task.updates && task.updates.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Updates:</h4>
                  {task.updates.map((update, idx) => (
                    <div key={idx} className="text-sm text-gray-600 mb-1">
                      {new Date(update.updateDate).toLocaleDateString()}: {update.updateText}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                {task.status !== 'completed' && (
                  <>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      {t('updateStatus')}
                    </button>
                    {task.status === 'assigned' && (
                      <button
                        onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Start
                      </button>
                    )}
                  </>
                )}
                {task.status === 'completed' && (
                  <button
                    onClick={() => handleDownloadCertificate(task._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    {t('downloadCertificate')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks assigned yet
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{t('updateTaskStatus')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('updateText')} ({t('optional')})
                </label>
                <textarea
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('uploadPhoto')}</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => {
                    // Mock upload immediately for simplicity in this demo
                    if (e.target.files[0]) {
                      toast.success('Photo uploaded (simulated)');
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">{t('proofOfWork')}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate(selectedTask._id, 'in-progress')}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {t('markInProgress')}
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTask._id, 'completed')}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {t('markCompleted')}
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setUpdateText('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tasks;
