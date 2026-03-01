export interface ITemplateInfo {
  id?: string;
  templateId?: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  status: string;
  type: 'default' | 'custom' | 'Zaps' | 'Interfaces';
  lineItemId?: string;
  lineItemName?: string;
  lineItems?: number;
  marketers?: number;
  marketerCode?: string;
  marketer?: string;
  deliveryType?: string;
  integrationId?: string;
  integrationName?: string;
  deliveryObject?: {
    id: string;
    name: string;
  } | null;
  customFields?: any[];
  lineItem?: { id: string; name: string };
}

export interface ITemplateAssociationCount {
  lineItems: number;
  marketers: number;
  campaigns?: number;
}

export interface ITemplateRow extends ITemplateInfo {
  count: ITemplateAssociationCount;
  visbileFields: number;
}
