// Manage users page - admin can view users and roles
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { adminService } from '../../services/adminService.js';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getUsers();
        setUsersFromResponse(res);
      } catch (error) {
        console.error('Failed to load users', error);
      }
    };

    const onUsersUpdated = (e) => {
      setUsersFromResponse(e.detail);
    };

    const onShowUserActivity = (e) => {
      setSelectedUser(e.detail);
      setShowActivity(true);
    };

    window.addEventListener('usersUpdated', onUsersUpdated);
    window.addEventListener('showUserActivity', onShowUserActivity);

    load();

    return () => {
      window.removeEventListener('usersUpdated', onUsersUpdated);
      window.removeEventListener('showUserActivity', onShowUserActivity);
    };
  }, []);

  // helper to normalize API response shapes
  const setUsersFromResponse = (res) => {
    if (!res) return;
    if (res.data) return setUsers(res.data);
    if (res.users) return setUsers(res.users);
    return setUsers(res);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>

        <div className="bg-white shadow rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={async (e) => {
                          const newRole = e.target.value;
                          try {
                            await adminService.updateUser(u._id, { role: newRole });
                            toast.success('Role updated');
                            // update local state
                            const ev = new CustomEvent('usersUpdated', { detail: users.map(x => x._id === u._id ? { ...x, role: newRole } : x) });
                            window.dispatchEvent(ev);
                          } catch (err) {
                            toast.error('Failed to update role');
                            console.error(err);
                          }
                        }}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="admin">admin</option>
                        <option value="staff">staff</option>
                        <option value="volunteer">volunteer</option>
                        <option value="donor">donor</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewActivity(u._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                          Activity
                        </button>
                        <button
                          onClick={() => handleRemove(u._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showActivity && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">User Activity / Details</h2>
            <div className="space-y-2">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Role:</strong> {selectedUser.role}</div>
              <div><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</div>
              <div><strong>Address:</strong> {selectedUser.address || 'N/A'}</div>
              <div><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => { setShowActivity(false); setSelectedUser(null); }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// handlers
async function handleRemove(id) {
  const confirmed = window.confirm('Are you sure you want to delete this user?');
  if (!confirmed) return;

  try {
    await adminService.deleteUser(id);
    toast.success('User removed');
    // refresh the users list
    const res = await adminService.getUsers();
    // server returns { success, count, data }
    if (res.data) {
      // some endpoints return data array under `data`
      // but previous code expected res.users - handle both
      // replace users state by data
      // note: this file-scope helper cannot call setUsers; we'll dispatch an event
      const ev = new CustomEvent('usersUpdated', { detail: res.data });
      window.dispatchEvent(ev);
    } else if (res.users) {
      const ev = new CustomEvent('usersUpdated', { detail: res.users });
      window.dispatchEvent(ev);
    } else {
      const ev = new CustomEvent('usersUpdated', { detail: res });
      window.dispatchEvent(ev);
    }
  } catch (error) {
    toast.error('Failed to remove user');
    console.error(error);
  }
}

async function handleViewActivity(id) {
  try {
    const res = await adminService.getUser(id);
    const payload = res.data || res.user || res;
    const ev = new CustomEvent('showUserActivity', { detail: payload });
    window.dispatchEvent(ev);
  } catch (error) {
    toast.error('Failed to load user details');
    console.error(error);
  }
}

export default ManageUsers;
