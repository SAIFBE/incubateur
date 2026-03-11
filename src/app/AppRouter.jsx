import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Shared
import LoginPage from '../features/auth/LoginPage';
import UnauthorizedPage from '../features/shared/UnauthorizedPage';

// Trainee
import TraineeDashboardPage from '../features/trainee/TraineeDashboardPage';
import NewSubmissionPage from '../features/trainee/NewSubmissionPage';
import MySubmissionsPage from '../features/trainee/MySubmissionsPage';
import SubmissionDetailPage from '../features/trainee/SubmissionDetailPage';

// Admin
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import AdminSubmissionsPage from '../features/admin/AdminSubmissionsPage';
import AdminSubmissionDetailPage from '../features/admin/AdminSubmissionDetailPage';
import AdminStatisticsPage from '../features/admin/AdminStatisticsPage';

// Admin CMS
import AdminEventsPage from '../features/admin/AdminEventsPage';
import AdminEventFormPage from '../features/admin/AdminEventFormPage';
import AdminOpportunitiesPage from '../features/admin/AdminOpportunitiesPage';
import AdminOpportunityFormPage from '../features/admin/AdminOpportunityFormPage';
import AdminHighlightsPage from '../features/admin/AdminHighlightsPage';
import AdminHighlightFormPage from '../features/admin/AdminHighlightFormPage';

/**
 * AppRouter handles all routing logic for the Dashboard module.
 * It is designed to be injected into the main App or run standalone.
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Root redirect to login or dashboard based on auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />

      {/* Trainee Protected Routes (Stagiaire) */}
      <Route 
        path="/dashboard/trainee" 
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="trainee">
              <DashboardLayout role="trainee" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<TraineeDashboardPage />} />
        <Route path="new-submission" element={<NewSubmissionPage />} />
        <Route path="my-submissions" element={<MySubmissionsPage />} />
        <Route path="my-submissions/:id" element={<SubmissionDetailPage />} />
      </Route>

      {/* Admin Protected Routes (Administrateur) */}
      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <DashboardLayout role="admin" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="submissions" element={<AdminSubmissionsPage />} />
        <Route path="submissions/:id" element={<AdminSubmissionDetailPage />} />
        
        {/* Admin CMS Routes */}
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="events/new" element={<AdminEventFormPage />} />
        <Route path="events/:id/edit" element={<AdminEventFormPage />} />

        <Route path="opportunities" element={<AdminOpportunitiesPage />} />
        <Route path="opportunities/new" element={<AdminOpportunityFormPage />} />
        <Route path="opportunities/:id/edit" element={<AdminOpportunityFormPage />} />

        <Route path="highlights" element={<AdminHighlightsPage />} />
        <Route path="highlights/new" element={<AdminHighlightFormPage />} />
        <Route path="highlights/:id/edit" element={<AdminHighlightFormPage />} />

        <Route path="statistics" element={<AdminStatisticsPage />} />
      </Route>

      {/* Legacy/Other route catch-all (Optional alignment with main app) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
