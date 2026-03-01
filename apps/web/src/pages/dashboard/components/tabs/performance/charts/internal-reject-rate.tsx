import { type FC } from 'react';
import { DzPieChart } from '@dzone/shared-ui';
import { PerformanceReportType } from '../../../../lib/enums';
import { useFetchReportData } from '../../../../hooks';
import type { IReportRow } from '../../../../lib/types';
import { ChartColumn } from '../../shared/chart-column';

export const InternalRejectRate: FC = () => {
  const [chartData, isLoaded] = useFetchReportData<IReportRow>(
    [],
    PerformanceReportType.InternalRejectRate,
  );
  return (
    <ChartColumn chartTitle="pages.dashboard.label.internalRejectRate">
      <DzPieChart data={chartData as IReportRow[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
