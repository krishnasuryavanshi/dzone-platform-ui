import { FC } from 'react';
import { Flex, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ShowCampaignBreadcrumb } from './show-create-campaign-breadcrumbs';

const { Text } = Typography;

interface CreateCampaignBreadCrumbContainer {
  campaignId?: string;
  id?: string;
}

export const BreadCrumbContainer: FC<CreateCampaignBreadCrumbContainer> = ({
  campaignId,
  id,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const backToListPage = () => {
    navigate('/campaign-management/campaigns');
  };

  return (
    <Flex
      vertical
      gap="0.5rem"
      style={{ padding: '0.5rem', paddingBottom: '0rem', width: '100%' }}
    >
      <ShowCampaignBreadcrumb campaignId={campaignId} id={id} />
      <Flex gap="0.5rem" align="center">
        <Flex
          onClick={backToListPage}
          align="center"
          justify="center"
          style={{
            borderRadius: '17px',
            background: '#d9d9d9',
            height: '1.5rem',
            width: '1.5rem',
            cursor: 'pointer',
            paddingTop: '0.25rem',
          }}
        >
          <ArrowLeftOutlined />
        </Flex>
        <Text strong>
          {t(
            campaignId
              ? 'form.createCampaign.editFormHeader'
              : 'form.createCampaign.formHeader',
          )}
        </Text>
      </Flex>
    </Flex>
  );
};
