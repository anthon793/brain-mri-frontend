import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';
import Overview from './pages/dashboard/Overview';
import UploadMRI from './pages/dashboard/UploadMRI';
import ModelTraining from './pages/dashboard/ModelTraining';
import DatasetManager from './pages/dashboard/DatasetManager';
import EvaluationMetrics from './pages/dashboard/EvaluationMetrics';
import Reports from './pages/dashboard/Reports';
import UserManagement from './pages/dashboard/UserManagement';
import SystemSettings from './pages/dashboard/SystemSettings';
import PatientRecords from './pages/dashboard/PatientRecords';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ─── Public Routes ──────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* ─── Protected Dashboard Routes ─────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Overview — All authenticated users */}
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'radiologist', 'researcher']}>
                  <Overview />
                </ProtectedRoute>
              }
            />

            {/* Upload MRI — Admin + Radiologist */}
            <Route
              path="upload"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'radiologist']}>
                  <UploadMRI />
                </ProtectedRoute>
              }
            />

            {/* Model Training — Admin only */}
            <Route
              path="training"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ModelTraining />
                </ProtectedRoute>
              }
            />

            {/* Dataset Manager — Admin only */}
            <Route
              path="datasets"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DatasetManager />
                </ProtectedRoute>
              }
            />

            {/* Evaluation Metrics — Admin + Researcher */}
            <Route
              path="metrics"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'researcher']}>
                  <EvaluationMetrics />
                </ProtectedRoute>
              }
            />

            {/* Reports — All authenticated users */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'radiologist', 'researcher']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Patient Records — Admin only */}
            <Route
              path="patients"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <PatientRecords />
                </ProtectedRoute>
              }
            />

            {/* User Management — Admin only */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* System Settings — Admin only */}
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SystemSettings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ─── Catch-all ──────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
