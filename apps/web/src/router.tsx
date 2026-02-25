import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';
import { AuthGuard, PermissionGuard } from '@dzone/shared-auth';
import { AppLayout } from './layout';
import { AuthLayout } from './pages/auth/layout';

// Auth pages (not lazy — critical path)
import LoginPage from './pages/auth/login';
import ForgotPasswordPage from './pages/auth/forgot-password';
import SetPasswordPage from './pages/auth/set-password';

// Lazy-loaded page modules
const DashboardPage = lazy(() => import('./pages/dashboard'));
const OrganizationsPage = lazy(() => import('./pages/admin/organizations'));
const OrgFormPage = lazy(() => import('./pages/admin/organizations/components/org-form-page'));
const CampaignManagementPage = lazy(() => import('./pages/campaign-management'));
const AnalyticsPage = lazy(() => import('./pages/analytics'));
const UsersPage = lazy(() => import('./pages/ums/users'));
const UserFormPage = lazy(() => import('./pages/ums/users/components/user-form-page'));
const RolesPage = lazy(() => import('./pages/ums/roles'));
const RoleFormPage = lazy(() => import('./pages/ums/roles/components/role-form-page'));
const IntegrationsHubPage = lazy(() => import('./pages/integrations-hub'));
const LeadValidationPage = lazy(() => import('./pages/lead-validation'));
const DzentPage = lazy(() => import('./pages/dzent'));
const JobsPage = lazy(() => import('./pages/jobs'));
const ProfilePage = lazy(() => import('./pages/profile'));
const SearchDatabasePage = lazy(() => import('./pages/audience'));
const UnauthorizedPage = lazy(() => import('./pages/unauthorized'));
const NotFoundPage = lazy(() => import('./pages/not-found'));

export const router = createBrowserRouter([
  // Public auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/set-password', element: <SetPasswordPage /> },
    ],
  },

  // Protected routes
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // Dashboard
          {
            path: '/dashboard',
            element: <PermissionGuard required={['Dashboard.VIEW']} />,
            children: [{ index: true, element: <DashboardPage /> }],
          },

          // Organizations
          {
            path: '/organizations',
            element: <PermissionGuard required={['Organizations.VIEW']} />,
            children: [
              { index: true, element: <OrganizationsPage /> },
              { path: 'create', element: <OrgFormPage /> },
              { path: ':organizationId', element: <OrgFormPage /> },
            ],
          },

          // Campaign Management
          {
            path: '/campaign-management',
            element: (
              <PermissionGuard
                required={['Campaign.VIEW', 'Line Item.VIEW', 'Leads.VIEW']}
              />
            ),
            children: [
              { index: true, element: <CampaignManagementPage /> },
              { path: '*', element: <CampaignManagementPage /> },
            ],
          },

          // Analytics
          {
            path: '/analytics',
            element: <PermissionGuard required={['Analytics.VIEW']} />,
            children: [
              { index: true, element: <AnalyticsPage /> },
              { path: '*', element: <AnalyticsPage /> },
            ],
          },

          // UMS (Users, Roles) — standalone pages
          {
            path: '/ums',
            element: (
              <PermissionGuard
                required={['Users.VIEW', 'Roles and Permissions.VIEW']}
              />
            ),
            children: [
              { index: true, element: <Navigate to="/ums/users" replace /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'users/create', element: <UserFormPage /> },
              { path: 'users/:userId', element: <UserFormPage /> },
              { path: 'roles', element: <RolesPage /> },
              { path: 'roles/create', element: <RoleFormPage /> },
              { path: 'roles/:roleId', element: <RoleFormPage /> },
            ],
          },

          // Integrations Hub
          {
            path: '/integrations-hub',
            element: (
              <PermissionGuard
                required={['Delivery Templates.VIEW', 'Integrations.VIEW']}
              />
            ),
            children: [
              { index: true, element: <IntegrationsHubPage /> },
              { path: '*', element: <IntegrationsHubPage /> },
            ],
          },

          // Lead Validation Settings
          {
            path: '/lead-validation-settings',
            element: <PermissionGuard required={['Validation Settings.VIEW']} />,
            children: [
              { index: true, element: <LeadValidationPage /> },
              { path: '*', element: <LeadValidationPage /> },
            ],
          },

          // Dzent
          {
            path: '/dzent',
            element: <PermissionGuard required={['Dzent.VIEW']} />,
            children: [
              { index: true, element: <DzentPage /> },
              { path: '*', element: <DzentPage /> },
            ],
          },

          // Jobs
          {
            path: '/jobs',
            element: <PermissionGuard required={['Jobs.VIEW']} />,
            children: [{ index: true, element: <JobsPage /> }],
          },

          // Search Database (no permission guard)
          { path: '/search-database', element: <SearchDatabasePage /> },

          // Profile (all authenticated users)
          { path: '/profile', element: <ProfilePage /> },

          // Unauthorized
          { path: '/unauthorized', element: <UnauthorizedPage /> },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
]);
