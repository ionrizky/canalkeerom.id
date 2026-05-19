
import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import TribalLeaderDetailPage from './pages/TribalLeaderDetailPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout.jsx';
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx';
import DistrictManagementPage from './pages/admin/DistrictManagementPage.jsx';
import TribeManagementPage from './pages/admin/TribeManagementPage.jsx';
import VocabularyManagementPage from './pages/admin/VocabularyManagementPage.jsx';
import TribalLeadersManagementPage from './pages/admin/TribalLeadersManagementPage.jsx';
import LanguageExpertsManagementPage from './pages/admin/LanguageExpertsManagementPage.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx';
import { AdminDataProvider } from './contexts/AdminDataContext.jsx';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AdminAuthProvider>
        <AdminDataProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Task 1: Route is properly registered here ensuring the correct mapping to the component */}
            <Route path="/tribal-leader/:id" element={<TribalLeaderDetailPage />} />
            
            {/* Public Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="dashboard" element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="districts" element={<DistrictManagementPage />} />
              <Route path="tribes" element={<TribeManagementPage />} />
              <Route path="vocabulary" element={<VocabularyManagementPage />} />
              <Route path="tribal-leaders" element={<TribalLeadersManagementPage />} />
              <Route path="language-experts" element={<LanguageExpertsManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </AdminDataProvider>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
