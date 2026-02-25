export interface IRoles {
  id: string;
  key?: string;
  name: string;
  users: number;
  description?: string;
  status: IStatus;
  editable?: boolean;
  tenantType: string;
  updatedAt?: string;
}

export interface IModuleAttributes {
  moduleId: string;
  actionId: string;
  attributes?: { id: string }[];
}

export interface IRoleDetails {
  id: string;
  name: string;
  description?: string;
  users: number;
  groups: number;
  attributes: number;
  status: IStatus;
  moduleAttributes: IModuleAttributes[];
  tenantType: string;
}

export interface IStatus {
  name: string;
  value: string;
}

export interface IAction {
  id: string;
  name?: string;
  value: string;
  dependsOnAction: string;
  children: string[];
}

export interface IModule {
  id: string;
  name: string;
  actions: IAction[];
}

export interface IGroupPermissions {
  type: string;
  attributes: IPermission[];
}

export interface IPermission {
  id: string;
  name: string;
  label: string;
  mandatory: boolean | null;
  parent: string;
  children: string[];
  actionsMapping?: { parentAction?: string; childrenActions?: string[] };
  internal?: boolean;
}

export interface IRolePermissions {
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  selected: string[];
  deselected: string[] | null;
  tenantType?: string;
}

export enum RoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
