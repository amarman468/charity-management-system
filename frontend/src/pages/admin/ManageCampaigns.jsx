// Manage campaigns page: admin can create, edit and delete campaigns
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { adminService } from '../../services/adminService.js';

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', targetAmount: 0, startDate: '', endDate: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Use the public campaign endpoint for list (small duplication for simplicity)
    const load = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error('Failed to load campaigns', error);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateCampaign(editingId, form);
      } else {
        await adminService.createCampaign(form);
      }
      // Reload list
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      setForm({ title: '', description: '', targetAmount: 0, startDate: '', endDate: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save campaign', error);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ title: c.title, description: c.description, targetAmount: c.targetAmount, startDate: c.startDate?.slice(0,10), endDate: c.endDate?.slice(0,10) });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await adminService.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Failed to delete campaign', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Manage Campaigns</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Campaigns</h2>
            <ul className="space-y-2">
              {campaigns.map((c) => (
                <li key={c._id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-500">Target: {c.targetAmount}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => startEdit(c)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">{editingId ? 'Edit' : 'Create'} Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-2 py-1 border rounded" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-2 py-1 border rounded" required />
              <input name="targetAmount" type="number" value={form.targetAmount} onChange={handleChange} placeholder="Target Amount" className="w-full px-2 py-1 border rounded" required />
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full px-2 py-1 border rounded" required />
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full px-2 py-1 border rounded" required />
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageCampaigns;
