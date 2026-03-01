import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import { LeadActionsEnum } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { Button, Flex, Tooltip } from 'antd';
import {
  DownloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { FC } from 'react';

interface ILeadsActionsProps {
  onExport: () => void;
  onClearFilters: () => void;
  isExporting: boolean;
  isSearchDisabled: boolean;
  isFilterDisabled: boolean;
  isRefreshDisabled: boolean;
  hasActiveFilters?: boolean;
}

export const LeadsActions: FC<ILeadsActionsProps> = ({
  onExport,
  onClearFilters,
  isExporting,
  hasActiveFilters = false,
}) => {
  const { t } = useTranslation();
  const hasDownloadPermission = usePermissionCheck([LeadActionsEnum.DownloadLead]);

  return (
    <Flex gap={'0.75rem'}>
      <Hideable show={hasActiveFilters}>
        <Tooltip title={t('pages.clearFilters')}>
          <Button className='dz-btn-action-1' onClick={onClearFilters}>
            {t('Clear Filters')}
          </Button>
        </Tooltip>
      </Hideable>
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<SearchOutlined />}
        className='dz-btn-action-1'
        disabled={isSearchDisabled}
      />
      <Button
        icon={<FilterFilled />}
        className='dz-btn-action-1'
        disabled={isFilterDisabled}
      /> */}
      <Hideable show={hasDownloadPermission}>
        <Button
          onClick={onExport}
          icon={isExporting ? <LoadingOutlined /> : <DownloadOutlined />}
          className='dz-btn-action-1'
          disabled={isExporting}
        />
      </Hideable>
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<ReloadOutlined />}
        className='dz-btn-action-1'
        disabled={isRefreshDisabled}
      /> */}
    </Flex>
  );
};
