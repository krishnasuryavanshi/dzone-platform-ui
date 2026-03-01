import { FieldType, OptionsType } from '@dzone/shared-lib';
import { OptionsKeys } from '@dzone/shared-lib';
import { ReactNode } from 'react';
import {
  assignedToNamesRenderer,
  completionProgressIndicator,
  dateRenderer,
  statusRenderer,
} from '../../../lib/utils/renderers';
import { CampaignField, CampaignFormSection } from '../../lib/enums';
import { CampaignStepSectionsType } from '../../lib/types';
import { actionsRenderer } from '../../lib/utils/renderers';
import {
  CampaignActionsEnum,
  CreateCampaignPermissions,
  EditCampaignPermissions,
  ViewCampaignPermissions,
} from '@dzone/shared-lib';

export const CreateCampaignBasicInfo: CampaignStepSectionsType = [
  {
    key: CampaignFormSection.MarketerDetails,
    viewPermissions: [ViewCampaignPermissions.Marketer],
    fields: [
      {
        field: CampaignField.MarketerCode,
        fieldType: FieldType.SearchableSelect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.Marketers,
        permissions: {
          view: ViewCampaignPermissions.Marketer,
          edit: EditCampaignPermissions.Marketer,
          create: CreateCampaignPermissions.Marketer,
        },
      },
      {
        field: CampaignField.TenantCode,
        fieldType: FieldType.Text,
        disabled: true,
        dataIndex: 'tenantCode',
        columnOrder: 1,
        viewOrder: 3,
        columnMetadata: { isSearchable: true },
        permissions: {
          view: ViewCampaignPermissions.Marketer,
        },
      },
      {
        field: CampaignField.Marketer,
        fieldType: FieldType.Text,
        dataIndex: 'marketer',
        columnOrder: 2,
        viewOrder: 4,
        hidden: true,
        columnMetadata: { isSearchable: true },
        permissions: {
          view: ViewCampaignPermissions.Marketer,
          edit: EditCampaignPermissions.Marketer,
          create: CreateCampaignPermissions.Marketer,
        },
      },
    ],
  },
  {
    key: CampaignFormSection.CampaignDetails,
    viewPermissions: [
      ViewCampaignPermissions.CampaignName,
      ViewCampaignPermissions.CampaignId,
      ViewCampaignPermissions.CampaignDescription,
      ViewCampaignPermissions.IoNumber,
      ViewCampaignPermissions.UploadIoFile,
      ViewCampaignPermissions.Status,
    ],
    fields: [
      {
        field: CampaignField.Name,
        fieldType: FieldType.Text,
        maxLength: 255,
        rules: [{ required: true }, { pattern: /^[a-zA-Z0-9 _-]*$/ }],
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        columnOrder: 4,
        viewOrder: 1,
        permissions: {
          view: ViewCampaignPermissions.CampaignName,
          edit: EditCampaignPermissions.CampaignName,
          create: CreateCampaignPermissions.CampaignName,
        },
      },
      {
        field: CampaignField.CampaignId,
        fieldType: FieldType.Text,
        hidden: true,
        columnOrder: 3,
        columnMetadata: { isSearchable: true },
        viewOrder: 2,
        permissions: {
          view: ViewCampaignPermissions.CampaignId,
          edit: EditCampaignPermissions.CampaignId,
          create: CreateCampaignPermissions.CampaignId,
        },
      },
      {
        field: CampaignField.CampaignDescription,
        fieldType: FieldType.TextArea,
        maxLength: 64000,
        viewOrder: 5,
        permissions: {
          view: ViewCampaignPermissions.CampaignDescription,
          edit: EditCampaignPermissions.CampaignDescription,
          create: CreateCampaignPermissions.CampaignDescription,
        },
      },
      {
        field: CampaignField.IoNumber,
        fieldType: FieldType.Text,
        maxLength: 255,
        columnMetadata: { ellipsis: true, isSearchable: true },
        columnOrder: 5,
        viewOrder: 6,
        permissions: {
          view: ViewCampaignPermissions.IoNumber,
          edit: EditCampaignPermissions.IoNumber,
          create: CreateCampaignPermissions.IoNumber,
        },
      },
      {
        field: CampaignField.UploadIoFile,
        fieldType: FieldType.FileUpload,
        uploadLabel: 'Upload File',
        viewOrder: 7,
        viewField: 'ioFileDetails',
        permissions: {
          view: ViewCampaignPermissions.UploadIoFile,
          edit: EditCampaignPermissions.UploadIoFile,
          create: CreateCampaignPermissions.UploadIoFile,
        },
      },
      {
        field: CampaignField.Id,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: CampaignField.Status,
        fieldType: FieldType.Text,
        hidden: true,
        columnMetadata: { width: 300, isFilterable: true },
        renderer: statusRenderer as () => ReactNode,
        columnOrder: 7,
        viewOrder: 8,
        permissions: {
          view: ViewCampaignPermissions.Status,
          edit: EditCampaignPermissions.Status,
          create: CreateCampaignPermissions.Status,
        },
      },
      {
        field: CampaignField.TotalLineItems,
        columnOrder: 6,
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.LineItemsDeliveryPercentage,
        columnMetadata: { width: 300 },
        columnOrder: 8,
        renderer: completionProgressIndicator as () => ReactNode,
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.StepsCompletedPercentage,
        columnMetadata: { width: 300 },
        columnOrder: 9,
        renderer: completionProgressIndicator as () => ReactNode,
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.Actions,
        columnMetadata: { fixed: 'right', width: 100 },
        renderer: actionsRenderer as () => ReactNode,
        columnTranslationKey: 'label.actions',
        columnOrder: 20,
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.ActualStartDate,
        fieldType: FieldType.Date,
        renderer: dateRenderer as () => ReactNode,
        format: 'DD MMM YYYY',
        columnOrder: 13,
        viewOrder: 9,
        columnMetadata: { isDateFilter: true },
        hidden: true,
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.ActualEndDate,
        fieldType: FieldType.Date,
        renderer: dateRenderer as () => ReactNode,
        format: 'DD MMM YYYY',
        columnOrder: 14,
        viewOrder: 10,
        hidden: true,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.CreatedOn,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        renderer: dateRenderer as () => ReactNode,
        columnOrder: 15,
        hidden: true,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.CreatedBy,
        columnOrder: 16,
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.UpdatedOn,
        fieldType: FieldType.Date,
        renderer: dateRenderer as () => ReactNode,
        format: 'DD MMM YYYY',
        columnOrder: 17,
        hidden: true,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.UpdatedBy,
        hidden: true,
        columnOrder: 18,
        columnMetadata: { ellipsis: true, width: 300, isSearchable: true },
        permissions: {
          view: CampaignActionsEnum.View,
        },
      },
      {
        field: CampaignField.AssignedTo,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        hasMultiselectSearch: true,
        optionsKey: OptionsKeys.AssignedTo,
        dataIndex: 'collaborators.assignedTo',
        columnMetadata: { ellipsis: true, width: 300, isFilterable: true },
        renderer: assignedToNamesRenderer as () => ReactNode,
        columnOrder: 19,
        viewOrder: 11,
        viewField: 'collaborators.assignedTo',
        hidden: true,
        permissions: {
          view: ViewCampaignPermissions.AssignedTo,
        },
      },
    ],
  },
];
