import { Hideable } from '@dzone/shared-ui';
import { GradientButton } from '@dzone/shared-ui';
import { usePermissionCheck } from '@dzone/shared-auth';
import { useAuthStore } from '@dzone/shared-store';
import {
  CampaignActionsEnum,
  ViewCampaignPermissions,
  DZONE_CLR_BLACK,
} from '@dzone/shared-lib';
import { Button, Flex, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterDropdownAssignedUser } from '../../components/filter-dropdown-assigned-user';

const { Text } = Typography;

interface ICampaignFiltersProps {
  handleAssignedToFilterChange: (assignedTo: string) => void;
  clearFilters?: () => void;
  isSearchDisabled: boolean;
  isRefreshDisabled: boolean;
  isDownloadDisabled: boolean;
  assignedToFilterSelectedValue: string;
  hasActiveFilters?: boolean;
}

export const CampaignFilters: FC<ICampaignFiltersProps> = ({
  clearFilters,
  handleAssignedToFilterChange,
  assignedToFilterSelectedValue,
  hasActiveFilters = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const isAssignedToAll = usePermissionCheck(
    ViewCampaignPermissions.AllCampaigns,
  );
  const isAssignedToMe = usePermissionCheck(
    ViewCampaignPermissions.CampaignsAssignedToMe,
  );

  useEffect(() => {
    if (isAssignedToMe && !isAssignedToAll) {
      handleAssignedToFilterChange(user?.userId ?? '');
    }
  }, [isAssignedToMe, isAssignedToAll]);

  const handleAssigneToOptionChange = (assignedTo: string) => {
    if (assignedTo === 'me') {
      handleAssignedToFilterChange(user?.userId ?? '');
      return;
    }
    handleAssignedToFilterChange(assignedTo);
  };

  const items: MenuProps['items'] = [
    isAssignedToAll && {
      label: <Text>{t('pages.campaigns.label.viewAll')}</Text>,
      key: 'all',
      onClick: () => handleAssigneToOptionChange('all'),
    },
    isAssignedToMe && {
      label: (
        <Text>{t('pages.campaigns.label.viewOnlyAssignedToMe')}</Text>
      ),
      key: 'me',
      onClick: () => handleAssigneToOptionChange('me'),
    },
  ].filter(Boolean) as MenuProps['items'];

  const isCreateCampaignAllowed = usePermissionCheck(
    CampaignActionsEnum.Create,
  );

  return (
    <Flex
      gap='0.75rem'
      justify={isCreateCampaignAllowed ? 'space-between' : 'end'}
      align='center'>
      <Flex gap='0.75rem' align='center'>
        <Text
          style={{
            fontWeight: 600,
            paddingLeft: '0.5rem',
            paddingTop: '0.5rem',
            height: '2.25rem',
            color: DZONE_CLR_BLACK,
          }}>
          {t('pages.campaigns.title')}
        </Text>
      </Flex>

      <Flex gap='0.75rem' align='center'>
        <Hideable show={hasActiveFilters}>
          <Tooltip title={t('pages.clearFilters')}>
            <Button className='dz-btn-action-1' onClick={clearFilters}>
              {t('Clear Filters')}
            </Button>
          </Tooltip>
        </Hideable>
        <FilterDropdownAssignedUser
          items={items}
          assignedToFilterSelectedValue={assignedToFilterSelectedValue}
        />
        <Hideable show={!!isCreateCampaignAllowed}>
          <GradientButton
            onClick={() =>
              navigate('/campaign-management/campaigns/create?step=0')
            }>
            {t('pages.campaigns.label.newCampaign')}
          </GradientButton>
        </Hideable>
      </Flex>
    </Flex>
  );
};
