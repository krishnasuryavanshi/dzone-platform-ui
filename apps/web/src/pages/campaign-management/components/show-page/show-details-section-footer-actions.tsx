import { FC, useState } from 'react';
import { Typography, Flex, Space, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { usePermissionCheck } from '@dzone/shared-auth';
import { HistoryDrawer } from './history-drawer';

const { Text, Link } = Typography;

// TODO: Import actual permission enums from @dzone/shared-lib when available
const CampaignActionsPermissions = { Edit: 'Campaign.EDIT' };
const LineItemActionsPermissions = { Edit: 'LineItem.EDIT' };

interface ShowDetailsSectionFooterActionProps {
  isCollapsed: boolean;
  handleCollapse: (collapsedState: boolean) => void;
  formConfig?: any;
  updateLink: string;
  itemUuid?: string;
  marketerCode?: string;
  type: 'campaign' | 'lineItem';
}

export const ShowDetailsSectionFooterAction: FC<ShowDetailsSectionFooterActionProps> = ({
  isCollapsed,
  handleCollapse,
  updateLink,
  itemUuid,
  marketerCode,
  type,
  formConfig,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const editPermission =
    type === 'campaign' ? CampaignActionsPermissions.Edit : LineItemActionsPermissions.Edit;
  const hasEditPermission = usePermissionCheck(editPermission);

  const validateAndNavigate = async () => {
    setIsLoading(true);
    try {
      if (type === 'campaign') {
        const { validateCampaign } = await import('../../campaigns/services');
        const data = await validateCampaign(itemUuid as string);
        if (data?.data) navigate(updateLink);
      } else {
        const { validateLineItem } = await import('../../line-items/services');
        const data = await validateLineItem(itemUuid as string);
        if (data?.data) navigate(updateLink);
      }
    } catch (error) {
      notification.error({ message: error as string });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justify="space-between" align="center">
      <Space style={{ margin: '0.5rem 0 0.25rem 0' }}>
        <Text strong>{t('Basic Details')}</Text>
      </Space>
      <Flex justify="end" gap="0.75rem" style={{ marginTop: '0.5rem' }}>
        {type !== 'campaign' && (
          <Link onClick={() => setIsHistoryDrawerOpen(true)}>{t('History')}</Link>
        )}
        {hasEditPermission && (
          <Link
            onClick={(e) => {
              e.stopPropagation();
              validateAndNavigate();
            }}
          >
            {isLoading ? <LoadingOutlined style={{ color: '#000' }} /> : t('Edit')}
          </Link>
        )}
        {!isCollapsed ? (
          <Link onClick={() => handleCollapse(true)}>{t('View Less')}</Link>
        ) : (
          <Link onClick={() => handleCollapse(false)}>{t('View More')}</Link>
        )}
      </Flex>
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        marketerCode={marketerCode}
        formConfig={formConfig}
        onClose={() => setIsHistoryDrawerOpen(false)}
        lineItemId={itemUuid as string}
      />
    </Flex>
  );
};
