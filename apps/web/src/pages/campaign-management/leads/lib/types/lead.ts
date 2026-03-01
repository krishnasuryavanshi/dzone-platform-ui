export interface ILead {
  id: number;
  batchId: string;
  contactResearchDate: string;
  marketingQualificationDate: string;
  marketingQualificationStatus: string;
  leadEnrichmentDate: string;
  leadEnrichmentStatus: string;
  qualityAuditDate: string;
  qualityAuditStatus: string;
  pacingDate: string;
  leadStatus: string;
  pacingStatus: string;
  formatForDeliveryDate: string;
  formatForDeliveryStatus: string;
  deliveredDate: string;
  deliveryStatus: string;
  clientFeedbackDate: string;
  clientFeedbackStatus: string;
  invoiceDate: string;
  invoiceStatus: string;
  paymentDate: string;
  paymentStatus: string;
  revalidationAllowed: boolean;
  trackingId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  linkedinLink: string;
  country: string;
  phone: string;
  jobTitle: string;
  deleted: boolean;
  leadValidationStatus: string;
  client: {
    id: string;
    clientId: string;
  };
  campaign: {
    id: string;
    campaignId: string;
  };
  lineItem: {
    id: string;
    lineItemId: string;
  };
}

export interface ILeadStatus {
  name: string;
  value: string;
  description: string;
  type: string;
}

export interface IRejectReasons {
  id: string;
  value: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
}
