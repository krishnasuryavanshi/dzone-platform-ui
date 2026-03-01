import { type FC } from 'react';
import { Flex, Typography, Button } from 'antd';
import { Hideable } from '@dzone/shared-ui';
import { hasActiveFilters } from '@dzone/shared-lib';
import type { IJobFilters } from '../lib/types';

const { Title } = Typography;

interface JobsHeaderProps {
  filters?: IJobFilters;
  onFiltersChange?: (filters: IJobFilters) => void;
  showHeader?: boolean;
}

export const JobsHeader: FC<JobsHeaderProps> = ({
  filters,
  onFiltersChange,
  showHeader = true,
}) => {
  const showClearFilters = hasActiveFilters(filters ?? {});

  if (!showHeader && !showClearFilters) return null;

  return (
    <Flex
      gap="0.75rem"
      justify={showHeader ? 'space-between' : 'end'}
      align="center">
      <Hideable show={showHeader}>
        <Title level={4} style={{ margin: 0 }}>
          Jobs
        </Title>
      </Hideable>
      <Button
        onClick={() => onFiltersChange?.({})}
        style={{ visibility: showClearFilters ? 'visible' : 'hidden' }}>
        Clear Filters
      </Button>
    </Flex>
  );
};
