import { IFormConfig } from '@dzone/shared-lib';
import {
  CampaignField,
  CampaignFormSection,
  CampaignStep,
} from '../../lib/enums';
import { ICampaign } from '../../lib/types';
import { CreateCampaignBasicInfo } from './create-campaign-basic-info';
import { CreateCampaignDelivery } from './create-campaign-delivery';
import { CreateCampaignGoals } from './create-campaign-goals';
import { CreateCampaignStepConfig } from './create-campaign-step-config';

export type ICreateCampaignConfig = IFormConfig<
  CampaignStep,
  CampaignFormSection,
  CampaignField,
  ICampaign
>;

export const CreateCampaignConfig = (
  isDzoneUser?: boolean,
): ICreateCampaignConfig => ({
  meta: {
    name: 'createCampaign',
    className: 'create-campaign',
    formLayout: 'vertical',
  },
  translation: 'form.createCampaign',
  steps: {
    [CampaignStep.BasicInfo]: CreateCampaignBasicInfo,
    ...(isDzoneUser && { [CampaignStep.Campaign]: CreateCampaignStepConfig }),
    [CampaignStep.Goals]: CreateCampaignGoals,
    [CampaignStep.Delivery]: CreateCampaignDelivery,
  },
});

export type CreateCampaignConfigType = typeof CreateCampaignConfig;
