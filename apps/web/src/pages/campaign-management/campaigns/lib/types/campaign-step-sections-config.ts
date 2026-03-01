import { IStepSectionConfig } from '@dzone/shared-lib';
import { CampaignField, CampaignFormSection } from '../enums';
import { ICampaign } from './campaign';

export type CampaignStepSectionsType = IStepSectionConfig<
  CampaignFormSection,
  CampaignField,
  ICampaign
>[];
