import { type FC } from 'react';
import { Flex } from 'antd';
import { PerformanceCountsContainer } from './counts-container';
import { PerformanceChartsContainer } from './charts-container';

interface PerformanceReportsProps {
  show: boolean;
}

export const PerformanceReports: FC<PerformanceReportsProps> = ({ show }) => {
  if (!show) return null;
  return (
    <Flex vertical>
      <PerformanceCountsContainer />
      <PerformanceChartsContainer />
    </Flex>
  );
};
