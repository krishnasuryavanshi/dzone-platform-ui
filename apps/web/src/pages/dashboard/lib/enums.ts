export enum ReportType {
  Performance = 'performance',
  Reach = 'reach',
  Billing = 'billing',
  Executive = 'executive',
}

export enum PerformanceReportType {
  InternalRejectRate = 'internalRejectRate',
  MarketerReturnRate = 'marketerReturnRate',
  InternalRejectionReasons = 'internalRejectionReasons',
  ClientRejectionReasons = 'clientRejectionReasons',
  DetailsOfInaccurateData = 'detailsOfInaccurateData',
  LeadStatus = 'leadStatus',
}

export enum PerformanceCountsType {
  NumberOfContactsGenerated = 'numberOfContactsGenerated',
  NumberOfLeadsDelivered = 'numberOfLeadsDelivered',
  PercentageOfContactsThatBecomeDeliverableLeads = 'percentageOfContactsThatBecomeDeliverableLeads',
  AverageTimeFromCampaignCreationToFirstLeadDelivery = 'averageTimeFromCampaignCreationToFirstLeadDelivery',
  AverageTimeFromContactResearchToQualityAudit = 'averageTimeFromContactResearchToQualityAudit',
  AverageTimeFromQaReadyToLeadDelivery = 'averageTimeFromQaReadyToLeadDelivery',
  AverageTimeInPacingReserved = 'averageTimeInPacingReserved',
}

export enum BillingReportType {
  NoOfBillableLeads = 'numberOfBilledLeads',
  DollarAmountForBillableLeads = 'dollarAmountForBilledLeads',
}

export enum ReachReportType {
  LeadsByJobTitle = 'leadsByJobTitle',
  LeadsByCountry = 'leadsByCountry',
  Pacing = 'pacing',
}

export enum ReachCountsType {
  LeadsDelivered = 'leadsDelivered',
  UniqueAccountsReached = 'uniqueAccountsReached',
}

export enum ExecutiveReportType {
  Bookings = 'bookings',
  WaitingToGoLive = 'waitingToGoLive',
  Scheduled = 'scheduled',
  Delivered = 'delivered',
  Invoiced = 'invoiced',
}

export enum ExecutiveUnitType {
  Revenue = 'Revenue',
  Leads = 'Leads',
  LineItems = 'LineItems',
  Campaigns = 'Campaigns',
}

export enum TimeFrameType {
  MTD = 'MTD',
  LM = 'LM',
  QTD = 'QTD',
  LQ = 'LQ',
  YTD = 'YTD',
}
