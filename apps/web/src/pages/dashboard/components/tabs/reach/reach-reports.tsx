import { type FC } from 'react';
import { Flex } from 'antd';
import { ReachCountsContainer } from './counts-container';
import { ReachChartsContainer } from './charts-container';

interface ReachReportsProps {
  show: boolean;
}

export const ReachReports: FC<ReachReportsProps> = ({ show }) => {
  if (!show) return null;
  return (
    <Flex vertical>
      <ReachCountsContainer />
      <ReachChartsContainer />
    </Flex>
  );
};
