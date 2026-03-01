import { type ReactNode } from 'react';

// Filter types
export interface IFilterItem {
  label: ReactNode | string;
  value: string;
  key: string;
}

export interface IFilterLineItem extends IFilterItem {
  lineItemId: string;
  name: string;
  campaignId: string;
}

export interface IFilterCampaign extends IFilterItem {
  campaignId: string;
  name: string;
}

export interface IFilterClient extends IFilterItem {
  clientId: string;
  name: string;
}

export interface ILineItem {
  id: string;
  lineItemId: string;
  name: string;
  campaign: {
    id: string;
    campaignId: string;
    name: string;
    client: {
      id: string;
      clientId: string;
      name: string;
    };
  };
}

// Selection state
export interface ISelectedIds {
  selectedClients?: string[];
  selectedLineItems?: string[];
  selectedCampaigns?: string[];
  selectedDuration?: string[];
  selectedUnit?: string[];
  selectedTimeFrame?: string[];
}

// Filter payloads
export interface IDateRange {
  startDate: string;
  endDate: string;
}

interface FilterLineItem {
  uuid: string;
}

interface FilterCampaign {
  uuid: string;
  lineItems: FilterLineItem[];
}

export interface IFilterDataPayload {
  range: IDateRange;
  campaigns: FilterCampaign[];
}

export interface IExecutiveFilterDataPayload {
  unit?: string;
  timeframe?: string;
}

// Chart data types
export interface IRow {
  name: string;
}

export interface ILineReportRow extends IRow {
  pacing: number;
  released: number;
  reserved: number;
}

export interface IBaseReportRow extends IRow {
  value: number;
}

export interface IReportRowWithColor extends IBaseReportRow {
  color: string;
}

export interface IReportRowWithPercentage extends IBaseReportRow {
  percent: string;
}

export interface IReportRow extends IReportRowWithColor, IReportRowWithPercentage {}

export interface IPerformanceChart {
  internalRejectRate: IReportRow[];
  marketerReturnRate: IReportRow[];
  internalRejectionReason: IReportRow[];
  detailsOfInaccurateData: IBaseReportRow[];
  clientRejectionReason: IBaseReportRow[];
  leadStatus: IReportRowWithPercentage[];
}

// Counts
export interface IPerformanceCounts {
  numberOfContactsGenerated: number | null;
  numberOfLeadsDelivered: number | null;
  percentageOfContactsThatBecomeDeliverableLeads: string;
  averageTimeFromCampaignCreationToFirstLeadDelivery: string;
  averageTimeFromContactResearchToQualityAudit: string;
  averageTimeFromQaReadyToLeadDelivery: string;
  averageTimeInPacingReserved: string;
}

// Executive grid
export interface IExecutiveGridStatus {
  name: string;
  color?: string;
}

export interface IExcecutiveGrids {
  clientName: string;
  campaignName: string;
  ioNumber: string;
  clientUUID: string;
  campaignUUID: string;
  status: IExecutiveGridStatus;
  bookedRevenue: number;
  leadsGoal: number;
  leadsDelivered: number;
  valueAddLeads: number;
  invoiced: number;
}
