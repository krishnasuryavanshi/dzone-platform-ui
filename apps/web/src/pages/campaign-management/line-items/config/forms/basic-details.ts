import { FieldType, OptionsKeys, OptionsType } from '@dzone/shared-lib';
import { LineItemFields, LineItemSections } from '../../lib/enums';
import {
  statusRenderer,
  completionProgressIndicator,
  assignedToNamesRenderer,
  dateRenderer,
} from '../../../lib/utils/renderers';
import { ReactNode } from 'react';
import {
  lineItemActionsRenderer,
  supplierAssignmentRenderer,
} from '../../lib/utils/renderers';
import { LineItemStepSectionsType } from '../../lib/types';
import {
  CreateLineItemPermissions,
  EditLineItemPermissions,
  ViewLineItemPermissions,
  LineItemActionsEnum,
} from '@dzone/shared-lib';

export const BasicDetails: LineItemStepSectionsType = [
  {
    key: LineItemSections.MarketerDetails,
    viewPermissions: [ViewLineItemPermissions.Marketer],
    fields: [
      {
        field: LineItemFields.MarketerCode,
        fieldType: FieldType.SearchableSelect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.Marketers,
        permissions: {
          view: ViewLineItemPermissions.Marketer,
          edit: EditLineItemPermissions.Marketer,
          create: CreateLineItemPermissions.Marketer,
        },
      },
      {
        field: LineItemFields.TenantCode,
        fieldType: FieldType.Text,
        disabled: true,
        dataIndex: 'tenantCode',
        columnOrder: 1,
        viewOrder: 3,
        columnMetadata: { isSearchable: true },
        permissions: {
          view: ViewLineItemPermissions.Marketer,
        },
      },
      {
        field: LineItemFields.Marketer,
        fieldType: FieldType.Text,
        dataIndex: 'marketer',
        columnOrder: 2,
        viewOrder: 4,
        hidden: true,
        columnMetadata: { isSearchable: true },
        permissions: {
          view: ViewLineItemPermissions.Marketer,
          edit: EditLineItemPermissions.Marketer,
          create: CreateLineItemPermissions.Marketer,
        },
      },
    ],
  },
  {
    key: LineItemSections.CampaignDetails,
    viewPermissions: [
      ViewLineItemPermissions.CampaignName,
      ViewLineItemPermissions.CampaignId,
    ],
    fields: [
      {
        field: LineItemFields.CampaignId,
        fieldType: FieldType.SearchableSelect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.Campaigns,
        dataIndex: 'campaignId',
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        permissions: {
          view: ViewLineItemPermissions.CampaignName,
          edit: EditLineItemPermissions.CampaignName,
          create: CreateLineItemPermissions.CampaignName,
        },
      },
      {
        field: LineItemFields.CampaignName,
        fieldType: FieldType.Text,
        dataIndex: 'campaign.name',
        columnOrder: 2,
        viewOrder: 6,
        hidden: true,
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        permissions: {
          view: ViewLineItemPermissions.CampaignName,
          edit: EditLineItemPermissions.CampaignName,
          create: CreateLineItemPermissions.CampaignName,
        },
      },
      {
        field: LineItemFields.CampaignIdNumber,
        fieldType: FieldType.Text,
        disabled: true,
        dataIndex: 'campaign.campaignId',
        columnMetadata: { isSearchable: true },
        columnOrder: 4,
        viewOrder: 5,
        viewField: 'campaign.campaignId',
        permissions: {
          view: ViewLineItemPermissions.CampaignId,
          edit: EditLineItemPermissions.CampaignId,
          create: CreateLineItemPermissions.CampaignId,
        },
      },
    ],
  },
  // {
  //   key: LineItemSections.ClientDetails,
  //   viewPermissions: [
  //     ViewLineItemPermissions.ClientName,
  //     ViewLineItemPermissions.ClientId,
  //   ],
  //   fields: [
  //     {
  //       field: LineItemFields.ClientName,
  //       fieldType: FieldType.Text,
  //       rules: [{ required: true }],
  //       disabled: true,
  //       dataIndex: 'clientName',
  //       columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
  //       columnOrder: 2,
  //       viewOrder: 4,
  //       viewField: 'campaign.client.name',
  //       permissions: {
  //         view: ViewLineItemPermissions.ClientName,
  //         edit: EditLineItemPermissions.ClientName,
  //         create: CreateLineItemPermissions.ClientName,
  //       },
  //     },
  //     {
  //       field: LineItemFields.ClientIdNumber,
  //       fieldType: FieldType.Text,
  //       disabled: true,
  //       dataIndex: 'campaign.client.clientId',
  //       columnOrder: 1,
  //       columnMetadata: { isSearchable: true },
  //       viewOrder: 3,
  //       viewField: 'campaign.client.clientId',
  //       permissions: {
  //         view: ViewLineItemPermissions.ClientId,
  //         edit: EditLineItemPermissions.ClientId,
  //         create: CreateLineItemPermissions.ClientId,
  //       },
  //     },
  //   ],
  // },
  {
    key: LineItemSections.LineItemDetails,
    viewPermissions: [
      ViewLineItemPermissions.LineItemName,
      ViewLineItemPermissions.LineItemId,
      ViewLineItemPermissions.Status,
      ViewLineItemPermissions.PoNumber,
    ],
    fields: [
      {
        field: LineItemFields.LineItemName,
        fieldType: FieldType.Text,
        maxLength: 255,
        rules: [{ required: true }, { pattern: /^[a-zA-Z0-9 _-]*$/ }],
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        columnOrder: 7,
        viewOrder: 2,
        permissions: {
          view: ViewLineItemPermissions.LineItemName,
          edit: EditLineItemPermissions.LineItemName,
          create: CreateLineItemPermissions.LineItemName,
        },
      },
      {
        field: LineItemFields.LineItemIdNumber,
        hidden: true,
        fieldType: FieldType.Text,
        columnOrder: 6,
        columnMetadata: { isSearchable: true },
        viewOrder: 1,
        permissions: {
          view: ViewLineItemPermissions.LineItemId,
          edit: EditLineItemPermissions.LineItemId,
          create: CreateLineItemPermissions.LineItemId,
        },
      },
      {
        field: LineItemFields.PONumber,
        fieldType: FieldType.Text,
        maxLength: 255,
        viewOrder: 11,
        permissions: {
          view: ViewLineItemPermissions.PoNumber,
          edit: EditLineItemPermissions.PoNumber,
          create: CreateLineItemPermissions.PoNumber,
        },
      },
      {
        field: LineItemFields.Status,
        fieldType: FieldType.Text,
        hidden: true,
        columnMetadata: { width: 300, isFilterable: true },
        renderer: statusRenderer as () => ReactNode,
        columnOrder: 8,
        viewOrder: 12,
        permissions: {
          view: ViewLineItemPermissions.Status,
          edit: EditLineItemPermissions.Status,
          create: CreateLineItemPermissions.Status,
        },
      },
      {
        field: LineItemFields.ActualStartDate,
        fieldType: FieldType.Date,
        renderer: dateRenderer as () => ReactNode,
        format: 'DD MMM YYYY',
        columnOrder: 15,
        viewOrder: 15,
        columnMetadata: { isDateFilter: true },
        hidden: true,
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.ActualEndDate,
        fieldType: FieldType.Date,
        renderer: dateRenderer as () => ReactNode,
        format: 'DD MMM YYYY',
        columnOrder: 16,
        viewOrder: 16,
        hidden: true,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.CreatedOn,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        renderer: dateRenderer as () => ReactNode,
        columnOrder: 15,
        hidden: true,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.CreatedBy,
        columnOrder: 16,
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.UpdatedOn,
        fieldType: FieldType.Date,
        renderer: dateRenderer as () => ReactNode,
        format: 'DD MMM YYYY',
        columnOrder: 17,
        hidden: true,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.UpdatedBy,
        hidden: true,
        columnOrder: 18,
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.LineItemId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.LeadsDeliveryPercentage,
        columnTranslationKey: 'pages.lineItems.label.leadsDeliveryPercentage',
        columnMetadata: { width: 250 },
        columnOrder: 11,
        renderer: completionProgressIndicator as () => ReactNode,
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.LaunchCompletionPercentage,
        columnTranslationKey:
          'pages.lineItems.label.launchCompletionPercentage',
        columnMetadata: { width: 250 },
        columnOrder: 14,
        renderer: completionProgressIndicator as () => ReactNode,
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.Actions,
        columnMetadata: { fixed: 'right', width: 100 },
        renderer: lineItemActionsRenderer as () => ReactNode,
        columnTranslationKey: 'label.actions',
        columnOrder: 21,
        permissions: {
          view: LineItemActionsEnum.View,
        },
      },
      {
        field: LineItemFields.AssignedTo,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.AssignedTo,
        hasMultiselectSearch: true,
        hidden: true,
        dataIndex: 'collaborators.assignedTo',
        columnMetadata: { ellipsis: true, width: 300, isFilterable: true },
        renderer: assignedToNamesRenderer as () => ReactNode,
        columnOrder: 19,
        viewOrder: 9,
        viewField: 'collaborators.assignedTo',
        permissions: {
          view: ViewLineItemPermissions.AssignedTo,
        },
      },
      {
        field: LineItemFields.SupplierName,
        columnTranslationKey: 'pages.lineItems.label.supplierName',
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        renderer: supplierAssignmentRenderer as () => ReactNode,
        columnOrder: 3,
        viewOrder: 8,
        viewField: 'supplier',
        permissions: {
          view: ViewLineItemPermissions.Supplier,
        },
      },
      {
        field: LineItemFields.SupplierCode,
        columnTranslationKey: 'pages.lineItems.label.supplierCode',
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        columnOrder: 4,
        viewOrder: 7,
        viewField: 'supplierCode',
        permissions: {
          view: ViewLineItemPermissions.SupplierCode,
        },
      },
    ],
  },
  {
    key: LineItemSections.Assets,
    viewPermissions: [
      ViewLineItemPermissions.NeedLandingPageBuilt,
      ViewLineItemPermissions.ProofLinks,
    ],
    fields: [
      {
        field: LineItemFields.NeedLandingPageBuilt,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        valuePropName: 'checked',
        viewOrder: 13,
        permissions: {
          view: ViewLineItemPermissions.NeedLandingPageBuilt,
          edit: EditLineItemPermissions.NeedLandingPageBuilt,
          create: CreateLineItemPermissions.NeedLandingPageBuilt,
        },
      },
      {
        field: LineItemFields.ProofLinks,
        fieldType: FieldType.TextArea,
        maxLength: 64000,
        viewOrder: 14,
        permissions: {
          view: ViewLineItemPermissions.ProofLinks,
          edit: EditLineItemPermissions.ProofLinks,
          create: CreateLineItemPermissions.ProofLinks,
        },
      },
    ],
  },
];
