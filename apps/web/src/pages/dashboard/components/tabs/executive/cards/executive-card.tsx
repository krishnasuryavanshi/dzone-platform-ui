import { type FC, type ReactNode } from 'react';
import { Flex } from 'antd';
import { ExecutiveCardTitle } from './executive-card-title';
import { ExecutiveCardMetrics } from './executive-card-metrics';
import { ExecutiveIconRenderer } from './executive-icon-renderer';
import { PercentDisplay } from './executive-card-percent-display';

interface IRecord {
  name: string;
  value: string;
}

interface ExecutiveCardProps {
  title: string | ReactNode;
  current: IRecord;
  previous: IRecord;
  percent: string;
  isPositive: boolean | null;
  waitingToGoLiveData: IRecord;
}

export const ExecutiveCard: FC<ExecutiveCardProps> = ({
  waitingToGoLiveData,
  title,
  current,
  previous,
  percent,
  isPositive,
}) => {
  const hasCurrentData = current && current.value;

  return (
    <Flex
      vertical
      style={{
        padding: '0.875rem 1.2rem',
        height: '8rem',
        minWidth: '12.5rem',
        background: '#f5f5f5',
        borderRadius: '6px',
      }}
    >
      <ExecutiveCardTitle title={title || waitingToGoLiveData?.name} />
      <Flex
        gap="0.5rem"
        justify="space-between"
        style={{ paddingTop: '0.5rem' }}
      >
        <Flex vertical>
          <ExecutiveCardMetrics data={current} record={waitingToGoLiveData} />
          {previous && <ExecutiveCardMetrics data={previous} isPrevious />}
        </Flex>
        <Flex gap="0.25rem" vertical>
          {hasCurrentData && <ExecutiveIconRenderer isPositive={isPositive} />}
          <PercentDisplay isPositive={isPositive} percent={percent} />
        </Flex>
      </Flex>
    </Flex>
  );
};
