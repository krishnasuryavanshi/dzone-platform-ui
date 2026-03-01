import { CampaignField, CampaignStep } from '../enums';

export const UnsavedCampaignTargetFields = {
  [CampaignStep.BasicInfo]: [
    CampaignField.MarketerCode,
    CampaignField.Name,
    CampaignField.CampaignDescription,
    CampaignField.IoNumber,
    CampaignField.IsCustRepresentedByAgency,
    CampaignField.UploadIoFile,
  ],
  [CampaignStep.Campaign]: [
    CampaignField.SalesforceOpportunityId,
    CampaignField.SalesforceOpportunityName,
    CampaignField.SalesforceOpportunityLink,
    CampaignField.BillingSystemReferenceId,
    CampaignField.OpportunityCloseDate,
    CampaignField.RetainerContract,
  ],
  [CampaignStep.Goals]: [
    CampaignField.BookedRevenue,
    CampaignField.CampaignGoals,
    CampaignField.TargetStartDate,
    CampaignField.TargetEndDate,
  ],
  [CampaignStep.Delivery]: [
    CampaignField.InvoicingTerm,
    CampaignField.PaymentTerm,
    CampaignField.DeliveryContact,
    CampaignField.DeliveryMethod,
    CampaignField.DeliveryDays,
  ],
};
