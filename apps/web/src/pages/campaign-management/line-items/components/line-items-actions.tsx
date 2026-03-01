import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import { Button, Flex, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  LineItemActionsEnum,
  ViewLineItemPermissions,
} from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { useAuthStore } from '@dzone/shared-store';
import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import { useNavigate } from 'react-router';
import { FC, useEffect } from 'react';
import { FilterDropdownAssignedUser } from '../../components';

const { Text } = Typography;

interface ILineItemsActionsProps {
  clearFilters: () => void;
  isSearchDisabled: boolean;
  isRefreshDisabled: boolean;
  isDownloadDisabled: boolean;
  assignedToFilterSelectedValue: string;
  handleAssignedToFilterChange: (assignedTo: string) => void;
  hasActiveFilters?: boolean;
}

export const LineItemsActions: FC<ILineItemsActionsProps> = ({
  clearFilters,
  assignedToFilterSelectedValue,
  handleAssignedToFilterChange,
  hasActiveFilters = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAssignedToAll = usePermissionCheck(
    ViewLineItemPermissions.AllLineItems,
  );
  const isAssignedToMe = usePermissionCheck(
    ViewLineItemPermissions.LineItemsAssignedToMe,
  );

  useEffect(() => {
    if (isAssignedToMe && !isAssignedToAll) {
      handleAssignedToFilterChange(user?.userId || '');
    }
  }, [isAssignedToMe, isAssignedToAll]);

  const handleAssigneToOptionChange = (assignedTo: string) => {
    if (assignedTo === 'me') {
      handleAssignedToFilterChange(user?.userId || '');
      return;
    }
    handleAssignedToFilterChange(assignedTo);
  };

  const items: MenuProps['items'] = [
    isAssignedToAll && {
      label: (
        <Text>
          {t('pages.lineItems.label.viewAll')}
        </Text>
      ),
      key: 'all',
      onClick: () => handleAssigneToOptionChange('all'),
    },
    isAssignedToMe && {
      label: (
        <Text>
          {t('pages.lineItems.label.viewOnlyAssignedToMe')}
        </Text>
      ),
      key: 'me',
      onClick: () => handleAssigneToOptionChange('me'),
    },
  ].filter(Boolean) as MenuProps['items'];

  const hasCreatePermission = usePermissionCheck(LineItemActionsEnum.Create);

  return (
    <Flex gap={'0.75rem'}>
      <Hideable show={hasActiveFilters}>
        <Tooltip title={t('pages.clearFilters')}>
          <Button className='dz-btn-action-1' onClick={clearFilters}>
            {t('Clear Filters')}
          </Button>
        </Tooltip>
      </Hideable>
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<SearchOutlined />}
        className='dz-btn-action-1'
        disabled={isSearchDisabled}
      /> */}
      <FilterDropdownAssignedUser
        items={items}
        assignedToFilterSelectedValue={assignedToFilterSelectedValue}
      />
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<DownloadOutlined />}
        className='dz-btn-action-1'
        disabled={isDownloadDisabled}
      />
      <Button
        icon={<ReloadOutlined />}
        className='dz-btn-action-1'
        disabled={isRefreshDisabled}
      /> */}
      <Flex gap='0.75rem' align='center'>
        {hasCreatePermission && (
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '0.3125rem',
              background:
                'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
              border: '1.5px solid transparent',
              height: '2.25rem',
              color: DZONE_CLR_BLACK,
            }}
            onClick={() =>
              navigate('/campaign-management/line-items/create')
            }>
            {t('pages.lineItems.label.newLineItem')}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
