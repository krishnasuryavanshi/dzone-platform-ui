import { FieldType, OptionsKeys, OptionsType } from '@dzone/shared-lib';
import { LineItemSections, LineItemFields } from '../../lib/enums';
import { LineItemStepSectionsType } from '../../lib/types';
import {
  CreateLineItemPermissions,
  EditLineItemPermissions,
  ViewLineItemPermissions,
} from '@dzone/shared-lib';

export const DeliveryConfig: LineItemStepSectionsType = [
  {
    key: LineItemSections.Delivery,
    viewPermissions: [
      ViewLineItemPermissions.TargetDeliveryStartDate,
      ViewLineItemPermissions.DeliveryMethod,
      ViewLineItemPermissions.IntegrateConverterId,
    ],
    fields: [
      {
        field: LineItemFields.TargetDeliveryStartDate,
        fieldType: FieldType.Date,
        format: 'DD MMM YYYY',
        viewOrder: 1,
        permissions: {
          view: ViewLineItemPermissions.TargetDeliveryStartDate,
          edit: EditLineItemPermissions.TargetDeliveryStartDate,
          create: CreateLineItemPermissions.TargetDeliveryStartDate,
        },
      },
      {
        field: LineItemFields.DeliveryMethod,
        fieldType: FieldType.Select,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.DeliveryMethod,
        viewOrder: 2,
        permissions: {
          view: ViewLineItemPermissions.DeliveryMethod,
          edit: EditLineItemPermissions.DeliveryMethod,
          create: CreateLineItemPermissions.DeliveryMethod,
        },
      },
      {
        field: LineItemFields.IntegrateConverterID,
        fieldType: FieldType.Text,
        maxLength: 255,
        viewOrder: 3,
        permissions: {
          view: ViewLineItemPermissions.IntegrateConverterId,
          edit: EditLineItemPermissions.IntegrateConverterId,
          create: CreateLineItemPermissions.IntegrateConverterId,
        },
      },
    ],
  },
  {
    key: LineItemSections.DeliveryFileUpload,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.LeadDeliveryTemplateFileIncluded,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        customHelpText: 'Check this box to upload Delivery Template.',
        valuePropName: 'checked',
        viewOrder: 4,
        permissions: {
          view: ViewLineItemPermissions.DeliveryTemplate,
          edit: EditLineItemPermissions.DeliveryTemplate,
          create: CreateLineItemPermissions.DeliveryTemplate,
        },
      },
      {
        field: LineItemFields.DeliveryTemplate,
        fieldType: FieldType.FileUpload,
        viewOrder: 5,
        permissions: {
          view: ViewLineItemPermissions.DeliveryTemplate,
          edit: EditLineItemPermissions.DeliveryTemplate,
          create: CreateLineItemPermissions.DeliveryTemplate,
        },
      },
    ],
  },
  {
    key: LineItemSections.Pacing,
    viewPermissions: [
      ViewLineItemPermissions.DeliveryDays,
      ViewLineItemPermissions.Pacing,
      ViewLineItemPermissions.PacingChartLink,
    ],
    fields: [
      {
        field: LineItemFields.DeliveryDays,
        fieldType: FieldType.Multiselect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.DeliveryDays,
        viewOrder: 6,
        permissions: {
          view: ViewLineItemPermissions.DeliveryDays,
          edit: EditLineItemPermissions.DeliveryDays,
          create: CreateLineItemPermissions.DeliveryDays,
        },
      },
      {
        field: LineItemFields.Pacing,
        fieldType: FieldType.Select,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.Pacing,
        columnOrder: 9,
        viewOrder: 7,
        permissions: {
          view: ViewLineItemPermissions.Pacing,
          edit: EditLineItemPermissions.Pacing,
          create: CreateLineItemPermissions.Pacing,
        },
      },
      {
        field: LineItemFields.PacingChartLink,
        fieldType: FieldType.TextArea,
        maxLength: 64000,
        viewOrder: 8,
        permissions: {
          view: ViewLineItemPermissions.PacingChartLink,
          edit: EditLineItemPermissions.PacingChartLink,
          create: CreateLineItemPermissions.PacingChartLink,
        },
      },
    ],
  },
];
