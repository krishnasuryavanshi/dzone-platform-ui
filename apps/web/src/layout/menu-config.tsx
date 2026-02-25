import type { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  permissions?: string[];
  children?: MenuItem[];
}

const MenuIcon = ({ src }: { src: string }) => (
  <img src={src} alt="" width={24} height={24} />
);

export const menuConfig: MenuItem[] = [
  {
    key: 'organizations',
    label: 'pages.organizations.title',
    icon: <MenuIcon src="/icons/menus/organizations.svg" />,
    path: '/organizations',
    permissions: ['Organizations.VIEW'],
  },
  {
    key: 'dashboard',
    label: 'pages.dashboard.title',
    icon: <MenuIcon src="/icons/menus/dashboard-outline.svg" />,
    path: '/dashboard',
    permissions: ['Dashboard.VIEW'],
  },
  {
    key: 'dzent',
    label: 'pages.dzent.title',
    icon: <MenuIcon src="/icons/menus/dzent.svg" />,
    path: '/dzent',
    permissions: ['Dzent.VIEW'],
  },
  {
    key: 'campaignManagement',
    label: 'pages.campaignManagement.title',
    icon: <MenuIcon src="/icons/menus/campaign.svg" />,
    permissions: ['Client.VIEW', 'Campaign.VIEW', 'Line Item.VIEW', 'Leads.VIEW'],
    children: [
      {
        key: 'campaigns',
        label: 'pages.campaignManagement.campaigns.title',
        path: '/campaign-management/campaigns',
        permissions: ['Campaign.VIEW'],
      },
      {
        key: 'lineItems',
        label: 'pages.campaignManagement.lineItems.title',
        path: '/campaign-management/line-items',
        permissions: ['Line Item.VIEW'],
      },
      {
        key: 'leads',
        label: 'pages.leads.title',
        path: '/campaign-management/leads',
        permissions: ['Leads.VIEW'],
      },
    ],
  },
  {
    key: 'searchData',
    label: 'pages.searchData.title',
    icon: <MenuIcon src="/icons/menus/audience-db.svg" />,
    children: [
      {
        key: 'searchDatabase',
        label: 'pages.searchData.searchDatabase.title',
        path: '/search-database',
      },
    ],
  },
  {
    key: 'integrationHub',
    label: 'pages.integrationHub.title',
    icon: <MenuIcon src="/icons/menus/delivery.svg" />,
    permissions: ['Delivery Templates.VIEW', 'Integrations.VIEW'],
    children: [
      {
        key: 'templates',
        label: 'pages.templates.title',
        path: '/integrations-hub/templates',
        permissions: ['Delivery Templates.VIEW'],
      },
      {
        key: 'integrations',
        label: 'pages.integrations.title',
        path: '/integrations-hub/integrations',
        permissions: ['Integrations.VIEW'],
      },
    ],
  },
  {
    key: 'lead-validation-settings',
    label: 'pages.leadValidationSettings.title',
    icon: <MenuIcon src="/icons/menus/validation-settings.svg" />,
    path: '/lead-validation-settings',
    permissions: ['Validation Settings.VIEW'],
  },
  {
    key: 'adminConsole',
    label: 'pages.adminConsole.title',
    icon: <MenuIcon src="/icons/menus/ums-icon.svg" />,
    permissions: ['Roles and Permissions.VIEW', 'Users.VIEW'],
    children: [
      {
        key: 'rolesAndPermissions',
        label: 'pages.rolesAndPermissions.title',
        path: '/ums/roles',
        permissions: ['Roles and Permissions.VIEW'],
      },
      {
        key: 'users',
        label: 'pages.users.title',
        path: '/ums/users',
        permissions: ['Users.VIEW'],
      },
    ],
  },
  {
    key: 'analytics',
    label: 'pages.analytics.title',
    icon: <MenuIcon src="/icons/menus/dashboard-outline.svg" />,
    path: '/analytics',
    permissions: ['Analytics.VIEW'],
  },
  {
    key: 'jobs',
    label: 'Jobs',
    icon: <MenuIcon src="/icons/menus/jobs.svg" />,
    path: '/jobs',
    permissions: ['Jobs.VIEW'],
  },
];
