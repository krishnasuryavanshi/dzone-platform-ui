import { FC, useState } from 'react';
import { Flex, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';
import { ShowCampaignTabsType } from '../lib/enums';
import { ShowCampaignTabsContent } from './show-campaign-tabs-content';

interface IShowCampaignTabsProps {
  campaignId: string;
  campaignUuId: string;
}

export const ShowCampaignTabs: FC<IShowCampaignTabsProps> = ({
  campaignId,
  campaignUuId,
}) => {
  const { t } = useTranslation();
  const isLineItemViewAllowed = usePermissionCheck(LineItemActionsEnum.View);
  const [activeTab, setActiveTab] = useState<string>(
    isLineItemViewAllowed
      ? ShowCampaignTabsType.LineItems
      : ShowCampaignTabsType.Files,
  );

  const items: TabsProps['items'] = [
    isLineItemViewAllowed && {
      key: ShowCampaignTabsType.LineItems,
      label: t('Line Items'),
    },
    {
      key: ShowCampaignTabsType.Files,
      label: t('Files'),
    },
  ].filter(Boolean) as TabsProps['items'];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Flex vertical style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '4px 4px 10px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
        />
      </div>
      <ShowCampaignTabsContent
        activeKey={activeTab}
        campaignId={campaignId}
        campaignUuId={campaignUuId}
      />
    </Flex>
  );
};
