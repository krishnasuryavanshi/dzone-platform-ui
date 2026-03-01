import { FC, useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ICampaign } from '../lib/types';
import { CampaignStep } from '../lib/enums';
import { ShowDetailsSectionFooterAction } from '../../components/show-page';

const { Text } = Typography;

interface IShowCampaignDetailsProps {
  campaignDetails?: ICampaign;
}

export const ShowCampaignDetails: FC<IShowCampaignDetailsProps> = ({
  campaignDetails,
}) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [campaignUpdateLink, setCampaignUpdateLink] = useState('');

  useEffect(() => {
    if (campaignDetails) {
      const stepId = campaignDetails.stepId;
      const campaignFormStepCount = Object.keys(CampaignStep).length / 2;
      const updateCampaignLink = `${location.pathname}/edit?step=${
        stepId < campaignFormStepCount ? stepId : 0
      }`;
      setCampaignUpdateLink(updateCampaignLink);
    }
  }, [campaignDetails]);

  const handleCollapse = (collapsedState: boolean) => {
    setIsCollapsed(collapsedState);
  };

  return (
    <Flex vertical gap="0.75rem">
      <Text strong style={{ marginBottom: '0' }}>
        {t('pages.campaigns.label.campaignDetails')}
      </Text>

      <div>
        <ShowDetailsSectionFooterAction
          type="campaign"
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          updateLink={campaignUpdateLink}
        />
      </div>
    </Flex>
  );
};
