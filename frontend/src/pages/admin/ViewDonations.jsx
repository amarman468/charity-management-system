// View donations page - list donations and show total donated
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { adminService } from '../../services/adminService.js';

const ViewDonations = () => {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getDonations();
        setDonations(res.donations || []);
        setTotal(res.total || 0);
      } catch (error) {
        console.error('Failed to fetch donations', error);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Donations</h1>

        <div className="bg-white p-4 rounded shadow mb-4">
          <strong>Total Donated:</strong> <span className="ml-2">{total} BDT</span>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Donor</th>
                <th className="px-4 py-2 text-left">Campaign</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="px-4 py-2">{d.donor?.name || d.donor?.email}</td>
                  <td className="px-4 py-2">{d.campaign?.title}</td>
                  <td className="px-4 py-2">{d.amount}</td>
                  <td className="px-4 py-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ViewDonations;
