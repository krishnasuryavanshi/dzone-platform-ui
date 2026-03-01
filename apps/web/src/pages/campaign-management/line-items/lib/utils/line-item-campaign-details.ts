import { fetchCampaignDetails } from '../../../campaigns/services';

export const campaignDetails = async (campaignId: string, _step: number) => {
  try {
    const { data } = await fetchCampaignDetails(campaignId);
    let campaignList = {
      label: data.name,
      value: data.id,
      campaignId: data.campaignId,
      id: data.id,
    };

    return {
      campaign: campaignList,
      collaborators: data?.collaborators,
      targetStartDate: data?.targetStartDate,
      targetEndDate: data?.targetEndDate,
      actualStartDate: data?.actualStartDate,
      actualEndDate: data?.actualEndDate,
    };
  } catch (error) {
    throw error;
  }
};
