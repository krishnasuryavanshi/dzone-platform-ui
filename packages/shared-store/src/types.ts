/**
 * Shared types for auth and permission state.
 */

export interface AnalyticsAction {
  name: string;
  type: 'DZOne' | 'External';
  url?: string;
  dashboardId?: string;
}

export interface ModuleAccess {
  module: {
    name: string;
    access: string[];
  };
  actions?: AnalyticsAction[];
}

export interface IFieldDataProps {
  moduleName: string;
  attributes: { name: string; accesses: string[] }[];
}

export interface IUser {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  name?: string;
  image?: string;
  restrictedAccessKeys?: string[];
  tenantCode?: string[];
}

export interface IRole {
  id: string;
  name: string;
  [key: string]: unknown;
}
