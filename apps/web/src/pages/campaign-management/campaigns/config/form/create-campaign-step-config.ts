import { FieldType } from '@dzone/shared-lib';
import { CampaignField, CampaignFormSection } from '../../lib/enums';
import { CampaignStepSectionsType } from '../../lib/types';
import {
  ViewCampaignPermissions,
  EditCampaignPermissions,
  CreateCampaignPermissions,
} from '@dzone/shared-lib';

export const CreateCampaignStepConfig: CampaignStepSectionsType = [
  {
    key: CampaignFormSection.Connections,
    viewPermissions: [
      ViewCampaignPermissions.SalesforceOpportunityId,
      ViewCampaignPermissions.SalesforceOpportunityName,
      ViewCampaignPermissions.SalesforceOpportunityLink,
      ViewCampaignPermissions.BillingSystemReferenceId,
    ],
    fields: [
      {
        field: CampaignField.SalesforceOpportunityId,
        fieldType: FieldType.Text,
        maxLength: 255,
        viewOrder: 1,
        permissions: {
          view: ViewCampaignPermissions.SalesforceOpportunityId,
          edit: EditCampaignPermissions.SalesforceOpportunityId,
          create: CreateCampaignPermissions.SalesforceOpportunityId,
        },
      },
      {
        field: CampaignField.SalesforceOpportunityName,
        fieldType: FieldType.Text,
        maxLength: 255,
        viewOrder: 2,
        permissions: {
          view: ViewCampaignPermissions.SalesforceOpportunityName,
          edit: EditCampaignPermissions.SalesforceOpportunityName,
          create: CreateCampaignPermissions.SalesforceOpportunityName,
        },
      },
      {
        field: CampaignField.SalesforceOpportunityLink,
        fieldType: FieldType.Text,
        maxLength: 255,
        viewOrder: 3,
        permissions: {
          view: ViewCampaignPermissions.SalesforceOpportunityLink,
          edit: EditCampaignPermissions.SalesforceOpportunityLink,
          create: CreateCampaignPermissions.SalesforceOpportunityLink,
        },
      },
      {
        field: CampaignField.BillingSystemReferenceId,
        fieldType: FieldType.Text,
        maxLength: 255,
        viewOrder: 4,
        permissions: {
          view: ViewCampaignPermissions.BillingSystemReferenceId,
          edit: EditCampaignPermissions.BillingSystemReferenceId,
          create: CreateCampaignPermissions.BillingSystemReferenceId,
        },
      },
    ],
  },
  {
    key: CampaignFormSection.CampaignDetails,
    viewPermissions: [
      ViewCampaignPermissions.OpportunityCloseDate,
      ViewCampaignPermissions.RetainerContract,
    ],
    fields: [
      {
        field: CampaignField.OpportunityCloseDate,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        viewOrder: 5,
        permissions: {
          view: ViewCampaignPermissions.OpportunityCloseDate,
          edit: EditCampaignPermissions.OpportunityCloseDate,
          create: CreateCampaignPermissions.OpportunityCloseDate,
        },
      },
      {
        field: CampaignField.RetainerContract,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        valuePropName: 'checked',
        viewOrder: 6,
        permissions: {
          view: ViewCampaignPermissions.RetainerContract,
          edit: EditCampaignPermissions.RetainerContract,
          create: CreateCampaignPermissions.RetainerContract,
        },
      },
    ],
  },
];
