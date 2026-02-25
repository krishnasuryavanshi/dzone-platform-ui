export interface IOrganization {
  id?: string;
  key?: string;
  name: string;
  code?: string;
  status?: { name: string; value: string };
  businessDomain?: string;
  organizationType?: { id: string; name: string };
  managedByDigitalzone?: boolean;
  crmId?: string;
  financeId?: string;
  createdAt?: string;
}

export interface IOrgType {
  id: string;
  name: string;
}

export interface IOrganizationFilters {
  name?: string[] | null;
  code?: string[] | null;
  createdAt?: [string, string] | null;
  status?: string[] | null;
}

export interface IOrganizationSorter {
  field?: string;
  order?: 'ascend' | 'descend';
}
