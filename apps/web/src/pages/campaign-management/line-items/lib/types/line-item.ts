import {
  ICampaignInfo,
  ICollaborators,
  IIndustries,
  IPicklistItem,
  IStatus,
} from '../../../lib/types';
import { ICustomQuestion } from './custom-question';

export interface ILineItemStatus extends IStatus {
  value: string;
}

export interface ILineItem {
  id: string;
  lineItemId: string;
  campaign: ICampaignInfo;
  campaignName?: string;
  clientName?: string;
  assetFileIds?: string[];
  deliveryTemplateId?: Record<string, any>;
  marketer?: string;
  marketerCode?: string;
  tenantCode?: string;
  supplier?: string;
  supplierCode?: string;
  name: string;
  pacing: IPicklistItem;
  deliveryDays: IPicklistItem[];
  product: IPicklistItem;
  deliveryMethod: IPicklistItem;
  targetCostPerLead: number;
  billableLeads: number;
  valueAddLeads: number;
  totalLeads: number;
  uploadAllowed?: boolean;
  status: ILineItemStatus;
  lineItemTargetStartDate: string;
  lineItemTargetEndDate: string;
  createdAt: string;
  stepId: number;
  companySizeCount: IPicklistItem[];
  companySizeRevenue: IPicklistItem[];
  jobFunctions: IPicklistItem[];
  jobLevels: IPicklistItem[];
  regions: IPicklistItem[];
  countries: IPicklistItem[];
  collaborators: ICollaborators;
  industries: IIndustries[];
  customQuestions: ICustomQuestion[];
  isIntentTargeting?: boolean;
  isTechnographicTargeting?: boolean;
  isSuppressionListIncluded?: boolean;
  isTalIncluded?: boolean;
  isJobTitleListIncluded?: boolean;
  jobTitles?: Record<string, any>;
  hasJobTitles?: boolean;
  isCompanySizeEmployeeCountCustom?: boolean;
  isCompanySizeRevenueCustom?: boolean;
  companySizeEmployeeCountCustomRangeMin?: number | null;
  companySizeEmployeeCountCustomRangeMax?: number | null;
  companySizeRevenueCustomRangeMin?: number | null;
  companySizeRevenueCustomRangeMax?: number | null;
  targetDeliveryStartDate: string;
  updatedAt: string;
  validationSettingsId?: string;
  customQuestionInstructions?: string;
  hasCustomQuestions?: boolean;
  actualEndDate?: string;
  actualStartDate?: string;
  additionalInstructions?: string;
  customFieldInstructions?: string;
  customFields?: Record<string, any>[];
  sourceTenantCode?: string;
}

export interface ICustomRangeDetails {
  employeeCountCustomRangeMax: number;
  employeeRevenueCustomRangeMax: number;
}
