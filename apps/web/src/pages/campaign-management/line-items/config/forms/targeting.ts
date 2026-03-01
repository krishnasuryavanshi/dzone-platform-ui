import { FieldType, OptionsKeys, OptionsType } from '@dzone/shared-lib';
import { CustomInput } from '../../components/create-line-item/custom-input';
import { LineItemFields, LineItemSections } from '../../lib/enums';
// TODO: Move TextView to @dzone/shared-ui once migrated
import { TextView } from '../../components/shared/text';
import { BeforeFileUpload } from '../../components/create-line-item/additional-content';
import { AfterFileUpload } from '../../components/create-line-item/additional-content';
// TODO: Move JobTitle to @dzone/shared-ui once migrated
import { JobTitle } from '../../components/job-title';
import {
  CreateLineItemPermissions,
  EditLineItemPermissions,
  ViewLineItemPermissions,
} from '@dzone/shared-lib';

export const TargetingConfig: Record<string, any>[] = [
  {
    key: LineItemSections.Contact,
    fields: [
      {
        field: LineItemFields.JobFunctions,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.JobFunctions,
        viewOrder: 1,
        permissions: {
          view: ViewLineItemPermissions.JobFunction,
          edit: EditLineItemPermissions.JobFunction,
          create: CreateLineItemPermissions.JobFunction,
        },
      },
      {
        field: LineItemFields.JobLevels,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.JobLevels,
        viewOrder: 2,
        permissions: {
          view: ViewLineItemPermissions.JobLevel,
          edit: EditLineItemPermissions.JobLevel,
          create: CreateLineItemPermissions.JobLevel,
        },
      },
    ],
  },
  {
    key: LineItemSections.JobTitleCheck,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.HasJobTitles,
        fieldType: FieldType.RadioButton,
        viewOrder: 3,
        layout: 'horizontal',
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
        permissions: {
          view: ViewLineItemPermissions.EnterJobTitles,
          edit: EditLineItemPermissions.EnterJobTitles,
          create: CreateLineItemPermissions.EnterJobTitles,
        },
      },
    ],
  },
  {
    key: LineItemSections.JobTitleDetails,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.JobTitles,
        fieldType: FieldType.CustomComponent,
        component: JobTitle,
        viewComponent: TextView,
        viewOrder: 4,
        permissions: {
          view: ViewLineItemPermissions.WouldYouLikeToAddJobTitle,
          edit: EditLineItemPermissions.WouldYouLikeToAddJobTitle,
          create: CreateLineItemPermissions.WouldYouLikeToAddJobTitle,
        },
      },
      {
        field: LineItemFields.JobTitleListUpload,
        fieldType: FieldType.FileUpload,
        beforeContent: BeforeFileUpload,
        viewOrder: 5,
        showLabel: false,
        inputContainerStyles: { paddingTop: '2rem' },
        afterContent: AfterFileUpload,
        afterContentProps: {
          field: 'Job Title',
          fileTypeName: 'CSV',
          extensions: '.csv',
        },
        permissions: {
          view: ViewLineItemPermissions.JobTitleListUpload,
          edit: EditLineItemPermissions.JobTitleListUpload,
          create: CreateLineItemPermissions.JobTitleListUpload,
        },
      },
    ],
  },
  {
    key: LineItemSections.Firmographics,
    fields: [
      {
        field: LineItemFields.Industries,
        fieldType: FieldType.GroupedSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.Industries,
        viewOrder: 6,
        permissions: {
          view: ViewLineItemPermissions.Industry,
          edit: EditLineItemPermissions.Industry,
          create: CreateLineItemPermissions.Industry,
        },
      },
    ],
  },
  {
    key: LineItemSections.CompanySizeCount,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.IsCompanySizeEmployeeCountCustom,
        fieldType: FieldType.RadioButton,
        viewOrder: 7,
        options: [
          { value: false, label: 'Predefined Range' },
          { value: true, label: 'Custom Range' },
        ],
        permissions: {
          view: ViewLineItemPermissions.CompanySizeEmployeeCountRadioButton,
          edit: EditLineItemPermissions.CompanySizeEmployeeCountRadioButton,
          create: CreateLineItemPermissions.CompanySizeEmployeeCountRadioButton,
        },
      },
      {
        field: LineItemFields.CompanySizesEmployeeCount,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.CompanySizesEmployeeCount,
        viewOrder: 8,
        permissions: {
          view: ViewLineItemPermissions.CompanySizeEmployeeCountPredefinedRange,
          edit: EditLineItemPermissions.CompanySizeEmployeeCountPredefinedRange,
          create:
            CreateLineItemPermissions.CompanySizeEmployeeCountPredefinedRange,
        },
      },
      {
        field: LineItemFields.EmployeeCountCustomRange,
        viewOrder: 9,
        permissions: {
          view: ViewLineItemPermissions.CompanySizeEmployeeCountCustomRange,
          edit: EditLineItemPermissions.CompanySizeEmployeeCountCustomRange,
          create: CreateLineItemPermissions.CompanySizeEmployeeCountCustomRange,
        },
      },
      {
        field: LineItemFields.EmployeeCountCustomRange,
        fieldType: FieldType.CustomComponent,
        component: CustomInput,
        children: [
          {
            field: LineItemFields.CompanySizeEmployeeCountCustomRangeMin,
            fieldType: FieldType.Number,
            showLabel: false,
            permissions: {
              view: ViewLineItemPermissions.CompanySizeEmployeeCountCustomRange,
              edit: EditLineItemPermissions.CompanySizeEmployeeCountCustomRange,
              create:
                CreateLineItemPermissions.CompanySizeEmployeeCountCustomRange,
            },
          },
          {
            field: LineItemFields.CompanySizeEmployeeCountCustomRangeMax,
            fieldType: FieldType.Number,
            showLabel: false,
            permissions: {
              view: ViewLineItemPermissions.CompanySizeEmployeeCountCustomRange,
              edit: EditLineItemPermissions.CompanySizeEmployeeCountCustomRange,
              create:
                CreateLineItemPermissions.CompanySizeEmployeeCountCustomRange,
            },
          },
        ],
        permissions: {
          view: ViewLineItemPermissions.CompanySizeEmployeeCountCustomRange,
          edit: EditLineItemPermissions.CompanySizeEmployeeCountCustomRange,
          create: CreateLineItemPermissions.CompanySizeEmployeeCountCustomRange,
        },
      },
    ],
  },
  {
    key: LineItemSections.CompanySizeRevenue,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.IsCompanySizeRevenueCustom,
        fieldType: FieldType.RadioButton,
        viewOrder: 9,
        options: [
          { value: false, label: 'Predefined Range' },
          { value: true, label: 'Custom Range' },
        ],
        permissions: {
          view: ViewLineItemPermissions.CompanySizeRevenueRadioButton,
          edit: EditLineItemPermissions.CompanySizeRevenueRadioButton,
          create: CreateLineItemPermissions.CompanySizeRevenueRadioButton,
        },
      },
      {
        field: LineItemFields.CompanySizesRevenue,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.CompanySizesRevenue,
        viewOrder: 10,
        permissions: {
          view: ViewLineItemPermissions.CompanySizeRevenuePredefinedRange,
          edit: EditLineItemPermissions.CompanySizeRevenuePredefinedRange,
          create: CreateLineItemPermissions.CompanySizeRevenuePredefinedRange,
        },
      },
      {
        field: LineItemFields.RevenueCustomRange,
        viewOrder: 11,
        permissions: {
          view: ViewLineItemPermissions.CompanySizeRevenueCustomRange,
          edit: EditLineItemPermissions.CompanySizeRevenueCustomRange,
          create: CreateLineItemPermissions.CompanySizeRevenueCustomRange,
        },
      },
      {
        field: LineItemFields.RevenueCustomRange,
        fieldType: FieldType.CustomComponent,
        component: CustomInput,
        permissions: {
          view: ViewLineItemPermissions.CompanySizeRevenueCustomRange,
          edit: EditLineItemPermissions.CompanySizeRevenueCustomRange,
          create: CreateLineItemPermissions.CompanySizeRevenueCustomRange,
        },
        children: [
          {
            field: LineItemFields.CompanySizeRevenueCustomRangeMin,
            fieldType: FieldType.Number,
            showLabel: false,
            permissions: {
              view: ViewLineItemPermissions.CompanySizeRevenueCustomRange,
              edit: EditLineItemPermissions.CompanySizeRevenueCustomRange,
              create: CreateLineItemPermissions.CompanySizeRevenueCustomRange,
            },
          },
          {
            field: LineItemFields.CompanySizeRevenueCustomRangeMax,
            fieldType: FieldType.Number,
            showLabel: false,
            permissions: {
              view: ViewLineItemPermissions.CompanySizeRevenueCustomRange,
              edit: EditLineItemPermissions.CompanySizeRevenueCustomRange,
              create: CreateLineItemPermissions.CompanySizeRevenueCustomRange,
            },
          },
        ],
      },
    ],
  },
  {
    key: LineItemSections.TALFileUpload,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.TargetAccountListTALIncluded,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        customHelpText: 'Check this box to upload TAL.',
        valuePropName: 'checked',
        viewOrder: 12,
        permissions: {
          view: ViewLineItemPermissions.TargetAccountListIncluded,
          edit: EditLineItemPermissions.TargetAccountListIncluded,
          create: CreateLineItemPermissions.TargetAccountListIncluded,
        },
      },
      {
        field: LineItemFields.TargetAccountListTALUpload,
        fieldType: FieldType.FileUpload,
        viewOrder: 13,
        afterContent: AfterFileUpload,
        afterContentProps: {
          field: 'Domain, Company Name',
          fileTypeName: 'CSV',
          extensions: '.csv',
        },
        permissions: {
          view: ViewLineItemPermissions.TargetAccountListUpload,
          edit: EditLineItemPermissions.TargetAccountListUpload,
          create: CreateLineItemPermissions.TargetAccountListUpload,
        },
      },
    ],
  },
  {
    key: LineItemSections.SuppressionFileUpload,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.SuppressionListIncluded,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        customHelpText: 'Check this box to upload Suppression List.',
        valuePropName: 'checked',
        viewOrder: 14,
        permissions: {
          view: ViewLineItemPermissions.SuppressionListIncluded,
          edit: EditLineItemPermissions.SuppressionListIncluded,
          create: CreateLineItemPermissions.SuppressionListIncluded,
        },
      },
      {
        field: LineItemFields.SuppressionListUpload,
        fieldType: FieldType.FileUpload,
        viewOrder: 15,
        afterContent: AfterFileUpload,
        afterContentProps: {
          field: 'Domain, Company Name, Email',
          fileTypeName: 'CSV',
          extensions: '.csv',
        },
        permissions: {
          view: ViewLineItemPermissions.SuppressionListUpload,
          edit: EditLineItemPermissions.SuppressionListUpload,
          create: CreateLineItemPermissions.SuppressionListUpload,
        },
      },
    ],
  },
  {
    key: LineItemSections.Geography,
    fields: [
      {
        field: LineItemFields.GeographyByRegion,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.GeographyByRegion,
        viewOrder: 16,
        permissions: {
          view: ViewLineItemPermissions.GeographyByRegion,
          edit: EditLineItemPermissions.GeographyByRegion,
          create: CreateLineItemPermissions.GeographyByRegion,
        },
      },
      {
        field: LineItemFields.GeographyByCountry,
        fieldType: FieldType.Multiselect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.GeographyByCountry,
        viewOrder: 17,
        permissions: {
          view: ViewLineItemPermissions.GeographyByCountry,
          edit: EditLineItemPermissions.GeographyByCountry,
          create: CreateLineItemPermissions.GeographyByCountry,
        },
      },
    ],
  },
  {
    key: LineItemSections.Intent,
    fields: [
      {
        field: LineItemFields.IntentTargeting,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        customHelpText: 'Check this box to upload Intent Keywords.',
        valuePropName: 'checked',
        viewOrder: 18,
        permissions: {
          view: ViewLineItemPermissions.IntentTargeting,
          edit: EditLineItemPermissions.IntentTargeting,
          create: CreateLineItemPermissions.IntentTargeting,
        },
      },
      {
        field: LineItemFields.IntentKeywordsList,
        fieldType: FieldType.FileUpload,
        viewOrder: 19,
        afterContent: AfterFileUpload,
        afterContentProps: {
          field: 'Intent Keyword',
          fileTypeName: 'CSV',
          extensions: '.csv',
        },
        permissions: {
          view: ViewLineItemPermissions.IntentKeywordsList,
          edit: EditLineItemPermissions.IntentKeywordsList,
          create: CreateLineItemPermissions.IntentKeywordsList,
        },
      },
    ],
  },
  {
    key: LineItemSections.Technographics,
    fields: [
      {
        field: LineItemFields.TechnographicTargeting,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        customHelpText: 'Check this box to upload Technology List.',
        valuePropName: 'checked',
        viewOrder: 20,
        permissions: {
          view: ViewLineItemPermissions.TechnographicTargeting,
          edit: EditLineItemPermissions.TechnographicTargeting,
          create: CreateLineItemPermissions.TechnographicTargeting,
        },
      },
      {
        field: LineItemFields.TechnologyListUpload,
        fieldType: FieldType.FileUpload,
        viewOrder: 21,
        afterContent: AfterFileUpload,
        afterContentProps: {
          field: 'Technology',
          fileTypeName: 'CSV',
          extensions: '.csv',
        },
        permissions: {
          view: ViewLineItemPermissions.TechnologyListUpload,
          edit: EditLineItemPermissions.TechnologyListUpload,
          create: CreateLineItemPermissions.TechnologyListUpload,
        },
      },
    ],
  },
  {
    key: LineItemSections.AdditionalInstructions,
    fields: [
      {
        field: LineItemFields.AdditionalInstructions,
        fieldType: FieldType.TextArea,
        maxLength: 64000,
        viewOrder: 22,
        permissions: {
          view: ViewLineItemPermissions.AdditionalInstructions,
          edit: EditLineItemPermissions.AdditionalInstructions,
          create: CreateLineItemPermissions.AdditionalInstructions,
        },
      },
    ],
  },
];
