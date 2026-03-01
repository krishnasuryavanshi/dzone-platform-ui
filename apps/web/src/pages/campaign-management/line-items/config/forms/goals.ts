import { FieldType, OptionsKeys, OptionsType } from '@dzone/shared-lib';
import { LineItemSections, LineItemFields } from '../../lib/enums';
import { dateRenderer } from '../../../lib/utils/renderers';
import { ReactNode } from 'react';
import { LineItemStepSectionsType } from '../../lib/types';
import {
  ViewLineItemPermissions,
  EditLineItemPermissions,
  CreateLineItemPermissions,
} from '@dzone/shared-lib';

export const GoalsConfig: LineItemStepSectionsType = [
  {
    key: LineItemSections.Goals,
    viewPermissions: [
      ViewLineItemPermissions.Product,
      ViewLineItemPermissions.DoubleOptIn,
      ViewLineItemPermissions.TargetLeadGoal,
      ViewLineItemPermissions.IsValueAddLineItem,
      ViewLineItemPermissions.TargetCostPerLead,
      ViewLineItemPermissions.LineItemTargetStartDate,
      ViewLineItemPermissions.LineItemTargetEndDate,
      ViewLineItemPermissions.LeadCapPerDomain,
    ],
    fields: [
      {
        field: LineItemFields.Product,
        fieldType: FieldType.Select,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.Products,
        viewOrder: 1,
        permissions: {
          view: ViewLineItemPermissions.Product,
          edit: EditLineItemPermissions.Product,
          create: CreateLineItemPermissions.Product,
        },
      },
      {
        field: LineItemFields.DoubleOptIn,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        valuePropName: 'checked',
        viewOrder: 2,
        permissions: {
          view: ViewLineItemPermissions.DoubleOptIn,
          edit: EditLineItemPermissions.DoubleOptIn,
          create: CreateLineItemPermissions.DoubleOptIn,
        },
      },
      {
        field: LineItemFields.TargetLeadGoal,
        fieldType: FieldType.Number,
        rules: [
          { required: true },
          {
            pattern: /^\d*\.?\d*$/,
          },
        ],
        columnTranslationKey: 'pages.lineItems.label.targetLeadGoal',
        columnOrder: 12,
        viewOrder: 3,
        permissions: {
          view: ViewLineItemPermissions.TargetLeadGoal,
          edit: EditLineItemPermissions.TargetLeadGoal,
          create: CreateLineItemPermissions.TargetLeadGoal,
        },
      },
      {
        field: LineItemFields.IsValueAddedLineItem,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        valuePropName: 'checked',
        viewOrder: 4,
        permissions: {
          view: ViewLineItemPermissions.IsValueAddLineItem,
          edit: EditLineItemPermissions.IsValueAddLineItem,
          create: CreateLineItemPermissions.IsValueAddLineItem,
        },
      },
      {
        field: LineItemFields.TargetCostPerLead,
        fieldType: FieldType.Number,
        columnTranslationKey: 'pages.lineItems.label.cpl',
        columnMetadata: { width: 150 },
        columnOrder: 11,
        viewOrder: 5,
        permissions: {
          view: ViewLineItemPermissions.TargetCostPerLead,
          edit: EditLineItemPermissions.TargetCostPerLead,
          create: CreateLineItemPermissions.TargetCostPerLead,
        },
      },
      {
        field: LineItemFields.LineItemTargetStartDate,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        rules: [{ required: true }],
        columnTranslationKey: 'pages.lineItems.label.targetStartDate',
        renderer: dateRenderer as () => ReactNode,
        columnOrder: 13,
        columnMetadata: { isDateFilter: true },
        viewOrder: 6,
        permissions: {
          view: ViewLineItemPermissions.LineItemTargetStartDate,
          edit: EditLineItemPermissions.LineItemTargetStartDate,
          create: CreateLineItemPermissions.LineItemTargetStartDate,
        },
      },
      {
        field: LineItemFields.LineItemTargetEndDate,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        rules: [{ required: true }],
        columnTranslationKey: 'pages.lineItems.label.targetEndDate',
        renderer: dateRenderer as () => ReactNode,
        columnOrder: 14,
        columnMetadata: { isDateFilter: true },
        viewOrder: 7,
        permissions: {
          view: ViewLineItemPermissions.LineItemTargetEndDate,
          edit: EditLineItemPermissions.LineItemTargetEndDate,
          create: CreateLineItemPermissions.LineItemTargetEndDate,
        },
      },
      {
        field: LineItemFields.LeadCapPerDomain,
        fieldType: FieldType.Number,
        rules: [
          {
            pattern: /^\d*\.?\d*$/,
          },
        ],

        viewOrder: 8,
        permissions: {
          view: ViewLineItemPermissions.LeadCapPerDomain,
          edit: EditLineItemPermissions.LeadCapPerDomain,
          create: CreateLineItemPermissions.LeadCapPerDomain,
        },
      },
    ],
  },
];
