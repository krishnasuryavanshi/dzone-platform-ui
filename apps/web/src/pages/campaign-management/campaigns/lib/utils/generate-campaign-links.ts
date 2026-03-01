import { ICampaign } from '../types';

export const generateCampaignLinks = (
  campaign: ICampaign,
  type?: 'lineItems' | 'createLineItems' | 'editCampaign',
) => {
  const baseLink = `/campaign-management/campaigns/${campaign.id}`;
  switch (type) {
    case 'lineItems':
      return `/campaign-management/line-items?campaignId=${campaign.id}`;
    case 'createLineItems':
      return `/campaign-management/line-items/create?campaignId=${campaign.id}`;
    case 'editCampaign':
      return `${baseLink}/edit?step=0`;
    default:
      return baseLink;
  }
};
