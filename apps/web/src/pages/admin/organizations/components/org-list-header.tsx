import { type FC } from 'react';
import { Button, Flex, Tooltip, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import { hasActiveFilters } from '@dzone/shared-lib';
import type { IOrganizationFilters } from '../lib/types';

const { Text } = Typography;

interface IOrgListHeaderProps {
  filters: IOrganizationFilters;
  onClearFilters: () => void;
}

export const OrgListHeader: FC<IOrgListHeaderProps> = ({
  filters,
  onClearFilters,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Flex gap="0.75rem" justify="space-between" align="center">
      <Text strong>{t('Organizations')}</Text>
      <Flex gap="0.75rem">
        <Hideable show={hasActiveFilters(filters)}>
          <Tooltip title={t('Clear Filters')}>
            <Button onClick={onClearFilters}>{t('Clear Filters')}</Button>
          </Tooltip>
        </Hideable>
        <Button type="primary" onClick={() => navigate('/organizations/create')}>
          {t('Create New')}
        </Button>
      </Flex>
    </Flex>
  );
};
