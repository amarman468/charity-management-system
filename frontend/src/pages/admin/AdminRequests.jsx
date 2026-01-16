// Admin Requests page - view pending admin registration requests, approve or reject
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { adminService } from '../../services/adminService.js';
import toast from 'react-hot-toast';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    try {
      const res = await adminService.getAdminRequests();
      setRequests(res.requests || []);
    } catch (error) {
      console.error('Failed to load admin requests', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveAdmin(id);
      toast.success('Admin approved');
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectAdmin(id);
      toast.success('Admin request rejected');
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Registration Requests</h1>

        <div className="bg-white p-4 rounded shadow">
          {requests.length === 0 && <div>No pending requests.</div>}

          <ul className="space-y-2">
            {requests.map((r) => (
              <li key={r._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{r.name} ({r.email})</div>
                  <div className="text-sm text-gray-500">Submitted: {new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleApprove(r._id)} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>
                  <button onClick={() => handleReject(r._id)} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>

  );
};

export default AdminRequests;
