import { Flex, Typography } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LineItemsActions } from './line-items-actions';
import { CLR_BLACK } from '@dzone/shared-lib';

const { Text } = Typography;

interface ILineItemsFiltersProps {
  clearFilters: () => void;
  isSearchDisabled: boolean;
  isRefreshDisabled: boolean;
  isDownloadDisabled: boolean;
  assignedToFilterSelectedValue: string;
  handleAssignedToFilterChange: (assignedTo: string) => void;
  hasActiveFilters?: boolean;
}

export const LineItemsFiltersManager: FC<ILineItemsFiltersProps> = ({
  clearFilters,
  isDownloadDisabled,
  isRefreshDisabled,
  isSearchDisabled,
  assignedToFilterSelectedValue,
  handleAssignedToFilterChange,
  hasActiveFilters = false,
}) => {
  const { t } = useTranslation();

  return (
    <Flex gap='0.75rem' align='center' justify='space-between'>
      <Text style={{ color: CLR_BLACK, fontWeight: 600, fontSize: '1.125rem' }}>
        {t('Line Items')}
      </Text>

      <Flex align='center' gap='0.75rem'>
        <LineItemsActions
          clearFilters={clearFilters}
          isSearchDisabled={isSearchDisabled}
          isRefreshDisabled={isRefreshDisabled}
          isDownloadDisabled={isDownloadDisabled}
          assignedToFilterSelectedValue={assignedToFilterSelectedValue}
          handleAssignedToFilterChange={handleAssignedToFilterChange}
          hasActiveFilters={hasActiveFilters}
        />
      </Flex>
    </Flex>
  );
};
