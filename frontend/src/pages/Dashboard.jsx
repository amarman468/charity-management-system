import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import DonorDashboard from './donor/DonorDashboard.jsx';
import VolunteerDashboard from './volunteer/VolunteerDashboard.jsx';

import AdminDashboard from './admin/AdminDashboard.jsx';
import Layout from '../components/Layout.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user.role === 'donor') {
    return <DonorDashboard />;
  }

  if (user.role === 'volunteer') {
    return <VolunteerDashboard />;
  }

  if (user.role === 'staff') {
    return <div className="p-8 text-center text-xl">Staff Dashboard unavailable. Please use the navigation menu.</div>;
  }

  return (
    <Layout>
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>Your role ({user.role}) does not have a dashboard assigned.</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
