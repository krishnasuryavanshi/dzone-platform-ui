import { type FC, type PropsWithChildren } from 'react';
import { Col } from 'antd';
import { ChartCard } from './chart-card';
import { ChartsAdditional } from './charts-additional';

interface ChartColumnProps extends PropsWithChildren {
  chartTitle: string;
  hasExtra?: boolean;
  extraTitle?: string;
}

export const ChartColumn: FC<ChartColumnProps> = ({
  chartTitle,
  hasExtra = false,
  extraTitle,
  children,
}) => {
  return (
    <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
      <ChartCard
        title={chartTitle}
        extra={hasExtra ? <ChartsAdditional label={extraTitle as string} /> : undefined}>
        {children}
      </ChartCard>
    </Col>
  );
};
