import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Campaigns from './pages/Campaigns.jsx';
import Donations from './pages/Donations.jsx';
import Tasks from './pages/Tasks.jsx';
import Beneficiaries from './pages/Beneficiaries.jsx';
import Reports from './pages/Reports.jsx';
import Users from './pages/Users.jsx';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/donations"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <Donations />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/tasks"
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'admin', 'staff']}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/beneficiaries"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Beneficiaries />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
