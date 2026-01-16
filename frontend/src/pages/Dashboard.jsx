import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
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

  // Staff users are redirected to Reports page
  if (user.role === 'staff') {
    return <Navigate to="/reports" replace />;
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
