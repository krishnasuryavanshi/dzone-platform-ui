import { apiClient } from '@dzone/shared-auth';
import { ApiHost, ApiResources } from '@dzone/shared-lib';
import {
  PerformanceReportType,
  BillingReportType,
  ReachReportType,
  PerformanceCountsType,
  ReachCountsType,
  ExecutiveReportType,
} from '../lib/enums';
import type {
  IFilterDataPayload,
  IExecutiveFilterDataPayload,
  IFilterLineItem,
  IFilterCampaign,
  ILineItem,
} from '../lib/types';

// Chart type → API resource mapping
const ReportChartsResources: Record<string, string> = {
  [PerformanceReportType.InternalRejectRate]: ApiResources.DashboardChartsInternalRejectRate,
  [PerformanceReportType.MarketerReturnRate]: ApiResources.DashboardChartsClientRejectRate,
  [PerformanceReportType.LeadStatus]: ApiResources.DashboardChartsLeadStatus,
  [PerformanceReportType.InternalRejectionReasons]: ApiResources.DashboardChartsInternalRejectReasons,
  [BillingReportType.NoOfBillableLeads]: ApiResources.DashboardChartsNoOfBillableLeads,
  [BillingReportType.DollarAmountForBillableLeads]: ApiResources.DashboardChartsDollarAmountForBillableLeads,
  [ReachReportType.LeadsByJobTitle]: ApiResources.DashboardChartsLeadsByJobTitle,
  [ReachReportType.LeadsByCountry]: ApiResources.DashboardChartsLeadsByCountry,
  [ReachReportType.Pacing]: ApiResources.DashboardChartsPacing,
};

// Count type → API resource mapping
const ReportCountResources: Record<string, string> = {
  [PerformanceCountsType.NumberOfContactsGenerated]: ApiResources.DashboardStatsNoOfCantacts,
  [PerformanceCountsType.NumberOfLeadsDelivered]: ApiResources.DashboardStatsNoOfLeadsDelivered,
  [PerformanceCountsType.PercentageOfContactsThatBecomeDeliverableLeads]: ApiResources.DashboardStatsDeliverableLeadsPercentage,
  [PerformanceCountsType.AverageTimeFromCampaignCreationToFirstLeadDelivery]: ApiResources.DashboardStatsAvgTimeFirstLeadDelivery,
  [PerformanceCountsType.AverageTimeFromContactResearchToQualityAudit]: ApiResources.DashboardStatsAvgTimeResearchToAudit,
  [PerformanceCountsType.AverageTimeFromQaReadyToLeadDelivery]: ApiResources.DashboardStatsAvgTimeQaToDelivery,
  [ReachCountsType.LeadsDelivered]: ApiResources.DashboardStatsLeadsDelivered,
  [ReachCountsType.UniqueAccountsReached]: ApiResources.DashboardStatsUniqueAccountReached,
  [ExecutiveReportType.Bookings]: ApiResources.DashboardExecutiveBookings,
  [ExecutiveReportType.WaitingToGoLive]: ApiResources.DashboardExecutiveWatingToGoLive,
};

export async function fetchReportChartsData(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string,
) {
  try {
    const resource = ReportChartsResources[type];
    if (!resource) return null;
    const { data } = await apiClient.post(
      `${ApiHost.ReportingService}/${resource}`,
      { ...filters, type },
    );
    return data;
  } catch {
    return null;
  }
}

export async function fetchReportCountsData(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string,
) {
  try {
    const resource = ReportCountResources[type];
    if (!resource) return null;
    const { data } = await apiClient.post(
      `${ApiHost.ReportingService}/${resource}`,
      { ...filters, type },
    );
    return data;
  } catch {
    return null;
  }
}

export async function fetchExecutiveGrid(
  page: number,
  size: number,
  status: Record<string, unknown> | null | undefined,
) {
  try {
    const requestData: Record<string, unknown> = { page, size };
    if (status && Object.keys(status).length > 0) {
      requestData.status = status;
    }
    const { data } = await apiClient.post(
      `${ApiHost.ReportingService}/${ApiResources.DashboardExecutiveGrid}`,
      requestData,
    );
    return data;
  } catch {
    return null;
  }
}

export async function fetchFilterData(): Promise<{
  lineItems: IFilterLineItem[];
  campaigns: IFilterCampaign[];
}> {
  try {
    const { data } = await apiClient.get(
      `${ApiHost.CampaignService}/${ApiResources.AllLineItems}`,
    );

    const lineItems: IFilterLineItem[] = [
      { key: 'all', label: 'All Line Items', value: 'all', lineItemId: '', name: '', campaignId: '' },
    ];
    const campaigns: Record<string, IFilterCampaign> = {
      all: { key: 'all', label: 'All Campaigns', value: 'all', campaignId: '', name: '' },
    };

    (data?.data || data || []).forEach((item: ILineItem) => {
      const campaign = item.campaign;

      lineItems.push({
        key: item.id,
        label: item.name,
        value: item.id,
        lineItemId: item.lineItemId,
        name: item.name,
        campaignId: campaign.id,
      });

      if (!campaigns[campaign.id]) {
        campaigns[campaign.id] = {
          key: campaign.id,
          label: campaign.name,
          value: campaign.id,
          campaignId: campaign.campaignId,
          name: campaign.name,
        };
      }
    });

    return { lineItems, campaigns: Object.values(campaigns) };
  } catch {
    return { lineItems: [], campaigns: [] };
  }
}
