import { Roles, RestrictedAccessKeys } from '../enums';

type AccessKeysValues = {
  [key in RestrictedAccessKeys]: Roles[];
};

const {
  OperationsManager,
  QAManager,
  DeliveryManager,
  TeamLeaderCampaignCoordinator,
  CampaignCoordinator,
  CampaignDeliveryCoordinator,
  MISTeamLeader,
  QATeamLeader,
  CustomerSuccessManager,
  CustomerSuccessRep,
  CCDTeamLeader,
  Admin,
  User,
  Agent,
} = Roles;

const RestrictedRoles = [
  OperationsManager,
  QAManager,
  DeliveryManager,
  TeamLeaderCampaignCoordinator,
  CampaignCoordinator,
  CampaignDeliveryCoordinator,
  MISTeamLeader,
  QATeamLeader,
];

export const AllRoles = [
  ...RestrictedRoles,
  Admin,
  User,
  Agent,
  CustomerSuccessManager,
  CustomerSuccessRep,
  CCDTeamLeader,
];

export const RestrictedAccessPermissions: AccessKeysValues = {
  [RestrictedAccessKeys.ExecutiveDashboard]: [...RestrictedRoles],
  [RestrictedAccessKeys.BillingDashboard]: [...AllRoles],
  [RestrictedAccessKeys.ReachDashboard]: [...AllRoles],

  [RestrictedAccessKeys.ScheduledInExecutiveDasboard]: [...AllRoles],
  [RestrictedAccessKeys.DeliveredInExecutiveDasboard]: [...AllRoles],
  [RestrictedAccessKeys.InvoicedInExecutiveDasboard]: [...AllRoles],

  [RestrictedAccessKeys.AverageTimeinPacingReserved]: [...AllRoles],
  [RestrictedAccessKeys.DetailsofInaccurateData]: [...AllRoles],
  [RestrictedAccessKeys.ClientRejectionReasons]: [...AllRoles],

  [RestrictedAccessKeys.CplColumnInLineItemList]: [...RestrictedRoles],
  [RestrictedAccessKeys.CplFieldInLineItemDetails]: [...RestrictedRoles],
  [RestrictedAccessKeys.CplFieldInLineItemCreate]: [...RestrictedRoles],
  [RestrictedAccessKeys.CplFieldInLineItemEdit]: [...RestrictedRoles],

  [RestrictedAccessKeys.BookedRevenueFieldInCampaignDetails]: [
    ...RestrictedRoles,
  ],
  [RestrictedAccessKeys.BookedRevenueFieldInCampaignCreate]: [
    ...RestrictedRoles,
  ],
  [RestrictedAccessKeys.BookedRevenueFieldInCampaignEdit]: [...RestrictedRoles],

  [RestrictedAccessKeys.IONumberColumnInCampaignList]: [...RestrictedRoles],
  [RestrictedAccessKeys.IONumberFieldInCampaignDetails]: [...RestrictedRoles],
  [RestrictedAccessKeys.IONumberFieldInCampaignCreate]: [...RestrictedRoles],
  [RestrictedAccessKeys.IONumberFieldInCampaignEdit]: [...RestrictedRoles],

  [RestrictedAccessKeys.UploadIOFileFieldInCampaignDetails]: [
    ...RestrictedRoles,
  ],
  [RestrictedAccessKeys.UploadIOFileFieldInCampaignCreate]: [
    ...RestrictedRoles,
  ],
  [RestrictedAccessKeys.UploadIOFileFieldInCampaignEdit]: [...RestrictedRoles],
};
