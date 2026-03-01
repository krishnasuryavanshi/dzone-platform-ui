import {
  extractFieldNamesForValidation,
  fieldValidationHandler,
} from '../../../lib/utils';
import { CreateCampaignBasicInfo } from '../../config/form/create-campaign-basic-info';
import { CreateCampaignStepConfig } from '../../config/form/create-campaign-step-config';
import { CampaignFormSection, CampaignField, CampaignStep } from '../enums';

export const attachFieldHandlers = (
  step: CampaignStep,
  updateFormStepDetails: (
    sectionName: string,
    fieldName: string,
    partialField: any,
  ) => void,
  patchFormValues: (values: any) => void,
  isEditing: boolean,
) => {
  switch (step) {
    case CampaignStep.BasicInfo:
      updateFormStepDetails(
        CampaignFormSection.MarketerDetails,
        CampaignField.MarketerCode,
        {
          onChange: (_val: string, option: Record<string, string>) => {
            patchFormValues({
              [CampaignField.MarketerCode]: option.tenantCode,
              [CampaignField.Marketer]: option.label,
              [CampaignField.TenantCode]: option.tenantCode,
            });
          },
        },
      );
      if (isEditing) {
        updateFormStepDetails(
          CampaignFormSection.CampaignDetails,
          CampaignField.Status,
          {
            onChange: (val: string, _option: Record<string, string>) => {
              patchFormValues({
                [CampaignField.Status]: val,
              });
            },
          },
        );
      }

      const requiredFieldsForValidationBasicInfo =
        extractFieldNamesForValidation(CreateCampaignBasicInfo);
      for (const field of Object.values(requiredFieldsForValidationBasicInfo)) {
        fieldValidationHandler(
          patchFormValues,
          updateFormStepDetails,
          CampaignFormSection.CampaignDetails,
          field,
        );
      }
      break;
    case CampaignStep.Campaign:
      const requiredFieldsForValidationCampaignStep =
        extractFieldNamesForValidation(CreateCampaignStepConfig);
      for (const field of Object.values(
        requiredFieldsForValidationCampaignStep,
      )) {
        fieldValidationHandler(
          patchFormValues,
          updateFormStepDetails,
          CampaignFormSection.Connections,
          field,
        );
      }
      break;
    case CampaignStep.Delivery:
      fieldValidationHandler(
        patchFormValues,
        updateFormStepDetails,
        CampaignFormSection.Delivery,
        CampaignField.DeliveryContact,
      );
      break;
    default:
      break;
  }
};
