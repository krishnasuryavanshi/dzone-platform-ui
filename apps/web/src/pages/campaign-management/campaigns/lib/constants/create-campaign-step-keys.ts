import { CampaignStep, StepKeys } from '../enums';

export const StepKeysList = {
  [CampaignStep.BasicInfo]: StepKeys.BasicInfo,
  [CampaignStep.Campaign]: StepKeys.Campaign,
  [CampaignStep.Goals]: StepKeys.Goals,
  [CampaignStep.Delivery]: StepKeys.Delivery,
};
