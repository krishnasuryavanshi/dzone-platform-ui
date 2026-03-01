import { FieldType, OptionsType } from '@dzone/shared-lib';
import { OptionsKeys } from '@dzone/shared-lib';
import { ReactNode } from 'react';
import { dateRenderer } from '../../../lib/utils/renderers';
import { CampaignField, CampaignFormSection } from '../../lib/enums';
import { CampaignStepSectionsType } from '../../lib/types';
import {
  ViewCampaignPermissions,
  EditCampaignPermissions,
  CreateCampaignPermissions,
} from '@dzone/shared-lib';

export const CreateCampaignGoals: CampaignStepSectionsType = [
  {
    key: CampaignFormSection.Goals,
    viewPermissions: [
      ViewCampaignPermissions.BookedRevenue,
      ViewCampaignPermissions.CampaignGoals,
      ViewCampaignPermissions.TargetStartDate,
      ViewCampaignPermissions.TargetEndDate,
    ],
    fields: [
      {
        field: CampaignField.BookedRevenue,
        fieldType: FieldType.Number,
        rules: [{ pattern: /^\d*\.?\d*$/ }],
        viewOrder: 1,
        permissions: {
          view: ViewCampaignPermissions.BookedRevenue,
          edit: EditCampaignPermissions.BookedRevenue,
          create: CreateCampaignPermissions.BookedRevenue,
        },
      },
      {
        field: CampaignField.CampaignGoals,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.CampaignGoals,
        viewOrder: 2,
        permissions: {
          view: ViewCampaignPermissions.CampaignGoals,
          edit: EditCampaignPermissions.CampaignGoals,
          create: CreateCampaignPermissions.CampaignGoals,
        },
      },
      {
        field: CampaignField.TargetStartDate,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        rules: [{ required: true }],
        renderer: dateRenderer as () => ReactNode,
        columnOrder: 10,
        viewOrder: 3,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: ViewCampaignPermissions.TargetStartDate,
          edit: EditCampaignPermissions.TargetStartDate,
          create: CreateCampaignPermissions.TargetStartDate,
        },
      },
      {
        field: CampaignField.TargetEndDate,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        rules: [{ required: true }],
        renderer: dateRenderer as () => ReactNode,
        columnOrder: 11,
        viewOrder: 4,
        columnMetadata: { isDateFilter: true },
        permissions: {
          view: ViewCampaignPermissions.TargetEndDate,
          edit: EditCampaignPermissions.TargetEndDate,
          create: CreateCampaignPermissions.TargetEndDate,
        },
      },
      {
        field: CampaignField.CampaignDuration,
        fieldType: FieldType.Number,
        disabled: true,
        viewOrder: 5,
        permissions: {
          view: ViewCampaignPermissions.TargetStartDate,
        },
      },
    ],
  },
];
