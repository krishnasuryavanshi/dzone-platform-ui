import { CampaignStep } from '../enums';

export const CampaignValues = Object.values(CampaignStep).filter(
  (value) => typeof value === 'number'
) as CampaignStep[];

export const getCampaignStepName = (key: any): string | undefined => {
  const numericKey = parseInt(key, 10);
  if (CampaignValues.includes(numericKey)) {
    return CampaignStep[numericKey];
  }
};
