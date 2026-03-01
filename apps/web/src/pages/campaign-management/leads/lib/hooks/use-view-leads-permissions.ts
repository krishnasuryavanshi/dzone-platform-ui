import { usePermissionCheck } from '@dzone/shared-auth';
import { LeadActionsEnum, ViewLeadPermissions } from '@dzone/shared-lib';

export const useViewLeadsPermissions = () => {
  return {
    // Using LeadActionsEnum for View as part of transition to action-based permissions
    View: usePermissionCheck(LeadActionsEnum.View),
    // Using ViewLeadPermissions for View as part of transition to field-based permissions
    ClientId: usePermissionCheck(ViewLeadPermissions.ClientId),
    CampaignId: usePermissionCheck(ViewLeadPermissions.CampaignId),
    LineItemId: usePermissionCheck(ViewLeadPermissions.LineItemId),
    LineItemName: usePermissionCheck(ViewLeadPermissions.LineItemName),
    Product: usePermissionCheck(ViewLeadPermissions.Product),
    TrackingId: usePermissionCheck(ViewLeadPermissions.TrackingId),
    Status: usePermissionCheck(ViewLeadPermissions.Status),
    FirstName: usePermissionCheck(ViewLeadPermissions.FirstName),
    LastName: usePermissionCheck(ViewLeadPermissions.LastName),
    CompanyName: usePermissionCheck(ViewLeadPermissions.CompanyName),
    Email: usePermissionCheck(ViewLeadPermissions.Email),
    Domain: usePermissionCheck(ViewLeadPermissions.Domain),
    CountryCode: usePermissionCheck(ViewLeadPermissions.CountryCode),
    Phone: usePermissionCheck(ViewLeadPermissions.Phone),
    ActualJobTitle: usePermissionCheck(ViewLeadPermissions.ActualJobTitle),
    RfpJobTitle: usePermissionCheck(ViewLeadPermissions.RfpJobTitle),
    JobFunction: usePermissionCheck(ViewLeadPermissions.JobFunction),
    JobLevel: usePermissionCheck(ViewLeadPermissions.JobLevel),
    Industry: usePermissionCheck(ViewLeadPermissions.Industry),
    RfpIndustry: usePermissionCheck(ViewLeadPermissions.RfpIndustry),
    EmployeeSizeDistinct: usePermissionCheck(
      ViewLeadPermissions.EmployeeSizeDistinct,
    ),
    RfpEmployeeSize: usePermissionCheck(ViewLeadPermissions.RfpEmployeeSize),
    RevenueSizeDistinct: usePermissionCheck(
      ViewLeadPermissions.RevenueSizeDistinct,
    ),
    RfpRevenueSize: usePermissionCheck(ViewLeadPermissions.RfpRevenueSize),
    StreetAddress: usePermissionCheck(ViewLeadPermissions.StreetAddress),
    City: usePermissionCheck(ViewLeadPermissions.City),
    State: usePermissionCheck(ViewLeadPermissions.State),
    Country: usePermissionCheck(ViewLeadPermissions.Country),
    PostalCode: usePermissionCheck(ViewLeadPermissions.PostalCode),
    AssetNames: usePermissionCheck(ViewLeadPermissions.AssetNames),
    AssetDownloadDates: usePermissionCheck(
      ViewLeadPermissions.AssetDownloadDates,
    ),
    LinkedInLink: usePermissionCheck(ViewLeadPermissions.LinkedInLink),
    EmployeeSizeLink: usePermissionCheck(ViewLeadPermissions.EmployeeSizeLink),
    RevenueSizeLink: usePermissionCheck(ViewLeadPermissions.RevenueSizeLink),
    AddressLink: usePermissionCheck(ViewLeadPermissions.AddressLink),
    OptIn: usePermissionCheck(ViewLeadPermissions.OptIn),
    DoubleOptIn: usePermissionCheck(ViewLeadPermissions.DoubleOptIn),
    EmailMarketingTools: usePermissionCheck(
      ViewLeadPermissions.EmailMarketingTools,
    ),
    EngagementTypes: usePermissionCheck(ViewLeadPermissions.EngagementTypes),
    EmailVerificationStatus: usePermissionCheck(
      ViewLeadPermissions.EmailVerificationStatus,
    ),
    CustomQuestions: usePermissionCheck(ViewLeadPermissions.CustomQuestions),
    CustomAnswers: usePermissionCheck(ViewLeadPermissions.CustomAnswers),
    TenureAsPerLinkedIn: usePermissionCheck(
      ViewLeadPermissions.TenureAsPerLinkedIn,
    ),
    RaComment: usePermissionCheck(ViewLeadPermissions.RaComment),
    RaNotes: usePermissionCheck(ViewLeadPermissions.RaNotes),
    QaComments: usePermissionCheck(ViewLeadPermissions.QaComments),
    QaDisqualificationReason: usePermissionCheck(
      ViewLeadPermissions.QaDisqualificationReason,
    ),
    QaNotes: usePermissionCheck(ViewLeadPermissions.QaNotes),
    ContactSource: usePermissionCheck(ViewLeadPermissions.ContactSource),
    ContactResearchDate: usePermissionCheck(
      ViewLeadPermissions.ContactResearchDate,
    ),
    MarketingQualificationDate: usePermissionCheck(
      ViewLeadPermissions.MarketingQualificationDate,
    ),
    LeadEnrichmentDate: usePermissionCheck(
      ViewLeadPermissions.LeadEnrichmentDate,
    ),
    QualityAuditDate: usePermissionCheck(ViewLeadPermissions.QualityAuditDate),
    PacingDate: usePermissionCheck(ViewLeadPermissions.PacingDate),
    FormatForDeliveryDate: usePermissionCheck(
      ViewLeadPermissions.FormatForDeliveryDate,
    ),
    DeliveredDate: usePermissionCheck(ViewLeadPermissions.DeliveredDate),
    ClientFeedbackDate: usePermissionCheck(
      ViewLeadPermissions.ClientFeedbackDate,
    ),
    InvoiceDate: usePermissionCheck(ViewLeadPermissions.InvoiceDate),
    PaymentDate: usePermissionCheck(ViewLeadPermissions.PaymentDate),
    Prospect: usePermissionCheck(ViewLeadPermissions.Prospect),
    MarketingQualificationEmailQualified: usePermissionCheck(
      ViewLeadPermissions.MarketingQualificationEmailQualified,
    ),
    MarketingQualificationEmailDisqualified: usePermissionCheck(
      ViewLeadPermissions.MarketingQualificationEmailDisqualified,
    ),
    EnrichmentComplete: usePermissionCheck(
      ViewLeadPermissions.EnrichmentComplete,
    ),
    EnrichmentIncomplete: usePermissionCheck(
      ViewLeadPermissions.EnrichmentIncomplete,
    ),
    QualityAuditQualified: usePermissionCheck(
      ViewLeadPermissions.QualityAuditQualified,
    ),
    QualityAuditDisqualified: usePermissionCheck(
      ViewLeadPermissions.QualityAuditDisqualified,
    ),
    FormatForDeliveryComplete: usePermissionCheck(
      ViewLeadPermissions.FormatForDeliveryComplete,
    ),
    FormatForDeliveryIncomplete: usePermissionCheck(
      ViewLeadPermissions.FormatForDeliveryIncomplete,
    ),
    DeliveryComplete: usePermissionCheck(ViewLeadPermissions.DeliveryComplete),
    DeliveryIncomplete: usePermissionCheck(
      ViewLeadPermissions.DeliveryIncomplete,
    ),
    ClientFeedbackClientAccepted: usePermissionCheck(
      ViewLeadPermissions.ClientFeedbackClientAccepted,
    ),
    ClientFeedbackClientRejected: usePermissionCheck(
      ViewLeadPermissions.ClientFeedbackClientRejected,
    ),
    InvoiceComplete: usePermissionCheck(ViewLeadPermissions.InvoiceComplete),
    InvoiceIncomplete: usePermissionCheck(
      ViewLeadPermissions.InvoiceIncomplete,
    ),
    PaymentComplete: usePermissionCheck(ViewLeadPermissions.PaymentComplete),
    PaymentIncomplete: usePermissionCheck(
      ViewLeadPermissions.PaymentIncomplete,
    ),
    PacingReserved: usePermissionCheck(ViewLeadPermissions.PacingReserved),
    PacingReleased: usePermissionCheck(ViewLeadPermissions.PacingReleased),
    Supplier: usePermissionCheck(ViewLeadPermissions.Supplier),
    CampaignName: usePermissionCheck(ViewLeadPermissions.CampaignName),
    ReturnedReason: usePermissionCheck(LeadActionsEnum.View), //ViewLeadPermissions.ReturnedReason),
    EmployeeSize: usePermissionCheck(ViewLeadPermissions.EmployeeSizeDistinct),
    RevenueSize: usePermissionCheck(ViewLeadPermissions.RevenueSizeDistinct),
    Asset1Name: usePermissionCheck(ViewLeadPermissions.AssetNames),
    Asset1DownloadDate: usePermissionCheck(
      ViewLeadPermissions.AssetDownloadDates,
    ),
    Asset2Name: usePermissionCheck(ViewLeadPermissions.AssetNames),
    Asset2DownloadDate: usePermissionCheck(
      ViewLeadPermissions.AssetDownloadDates,
    ),
    PublishedOn: usePermissionCheck(ViewLeadPermissions.PublishedOn),
    ReturnedOn: usePermissionCheck(ViewLeadPermissions.ReturnedOn),
    CreatedOn: usePermissionCheck(ViewLeadPermissions.CreatedOn),
    UpdatedOn: usePermissionCheck(ViewLeadPermissions.UpdatedOn),
    UpdatedBy: usePermissionCheck(ViewLeadPermissions.UpdatedBy),
  };
};
