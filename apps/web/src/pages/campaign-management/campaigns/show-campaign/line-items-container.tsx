import { FC } from 'react';
import { Flex } from 'antd';
import { ShowCampaignTabs } from './show-campaign-tabs';

interface ILineItemsContainerProps {
  campaignId?: string;
  campaignUuId: string;
}

export const LineItemsContainer: FC<ILineItemsContainerProps> = ({
  campaignId,
  campaignUuId,
}) => {
  return (
    <Flex vertical gap="0.75rem">
      <ShowCampaignTabs campaignId={campaignId!} campaignUuId={campaignUuId} />
    </Flex>
  );
};
