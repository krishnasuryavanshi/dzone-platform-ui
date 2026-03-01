import {
  LineItemFields,
  LineItemFileUploadTypes,
  LineItemSections,
  LineItemSteps,
} from '../enums';

export const LineItemFileUploadMap = {
  [LineItemFields.JobTitleListUpload]: {
    step: LineItemSteps.Targeting,
    section: LineItemSections.JobTitleDetails,
    field: LineItemFields.JobTitleListUpload,
    checkField: LineItemFields.JobTitles,
    checkFieldType: 'text',
    uploadType: LineItemFileUploadTypes.JobTitlesList,
  },
  [LineItemFields.DeliveryTemplate]: {
    step: LineItemSteps.DeliveryAndPacing,
    section: LineItemSections.DeliveryFileUpload,
    field: LineItemFields.DeliveryTemplate,
    checkField: LineItemFields.LeadDeliveryTemplateFileIncluded,
    checkFieldType: 'checkbox',
    uploadType: LineItemFileUploadTypes.DeliveryTemplate,
  },
  [LineItemFields.SuppressionListUpload]: {
    step: LineItemSteps.Targeting,
    section: LineItemSections.SuppressionFileUpload,
    field: LineItemFields.SuppressionListUpload,
    checkField: LineItemFields.SuppressionListIncluded,
    checkFieldType: 'checkbox',
    uploadType: LineItemFileUploadTypes.SuppressionsList,
  },
  [LineItemFields.IntentKeywordsList]: {
    step: LineItemSteps.Targeting,
    section: LineItemSections.Intent,
    field: LineItemFields.IntentKeywordsList,
    checkField: LineItemFields.IntentTargeting,
    checkFieldType: 'checkbox',
    uploadType: LineItemFileUploadTypes.IntentKeywordsList,
  },
  [LineItemFields.TargetAccountListTALUpload]: {
    step: LineItemSteps.Targeting,
    section: LineItemSections.TALFileUpload,
    field: LineItemFields.TargetAccountListTALUpload,
    checkField: LineItemFields.TargetAccountListTALIncluded,
    checkFieldType: 'checkbox',
    uploadType: LineItemFileUploadTypes.TargetAccountsList,
  },
  [LineItemFields.TechnologyListUpload]: {
    step: LineItemSteps.Targeting,
    section: LineItemSections.Technographics,
    field: LineItemFields.TechnologyListUpload,
    checkField: LineItemFields.TechnographicTargeting,
    checkFieldType: 'checkbox',
    uploadType: LineItemFileUploadTypes.TechnologiesList,
  },
};
