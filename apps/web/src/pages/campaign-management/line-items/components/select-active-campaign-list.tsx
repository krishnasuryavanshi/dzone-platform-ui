import { Flex, Input, Select, Space, Tooltip, Typography } from 'antd';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CLR_BLUE_LIGHT } from '@dzone/shared-lib';
import { IActiveCampaignList } from '../lib/types';
import { FC, useState } from 'react';
import './select-active-campaign-list.css';

const { Text } = Typography;

interface ISelectActiveCampaignListProps {
  activeCampaignList?: IActiveCampaignList[];
  selectedActiveCampaign: string;
  selectCampaign: (campaign: any) => void;
}
export const SelectActiveCampaignList: FC<ISelectActiveCampaignListProps> = ({
  activeCampaignList,
  selectedActiveCampaign,
  selectCampaign,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);

  const filteredCampaignList = activeCampaignList?.filter((campaign) =>
    `${campaign.campaignId} ${campaign.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleChange = (value: string) => {
    selectCampaign(value);
  };

  return (
    <Flex vertical style={{ paddingLeft: '2.5rem' }} gap='0.5rem'>
      <Flex gap='0.5rem' align='center'>
        <Text style={{ margin: 0, fontWeight: 500 }}>
          {t('pages.lineItems.label.selectCampaign')}
        </Text>
        <Tooltip
          placement='right'
          overlayStyle={{ whiteSpace: 'nowrap', maxWidth: 'none' }}
          overlayInnerStyle={{
            fontSize: '12px',
            textAlign: 'center',
          }}
          title={t('pages.associateClonedItemWithCampaign')}>
          <InfoCircleOutlined />
        </Tooltip>
      </Flex>
      <Select
        style={{ width: '100%' }}
        className='select-active-campaing-list'
        size='large'
        value={selectedActiveCampaign || undefined}
        placeholder='Select Campaign'
        onClick={(e) => e.stopPropagation()}
        onChange={handleChange}
        onDropdownVisibleChange={(open) => setDropdownVisible(open)}
        dropdownRender={(menu) => (
          <Flex vertical>
            <Input
              placeholder='Type Campaign ID or Name'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '8px', padding: '8px' }}
            />
            <Space style={{ padding: '8px 16px', fontWeight: 'bold' }}>
              Active Campaigns {filteredCampaignList?.length}
            </Space>
            {menu}
          </Flex>
        )}
        options={filteredCampaignList?.map((campaign) => ({
          label: (
            <Flex
              align='center'
              justify='space-between'
              style={{ width: '100%' }}>
              {`${campaign.campaignId} - ${campaign.name}`}
              {campaign.id === selectedActiveCampaign && dropdownVisible && (
                <CheckOutlined
                  style={{
                    display: 'inline-block',
                    color: `${CLR_BLUE_LIGHT}`,
                  }}
                />
              )}
            </Flex>
          ),
          value: campaign.id,
        }))}
      />
    </Flex>
  );
};
