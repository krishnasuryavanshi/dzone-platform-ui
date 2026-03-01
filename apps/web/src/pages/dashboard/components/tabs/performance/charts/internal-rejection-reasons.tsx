import { type FC } from 'react';
import { DzPieChart } from '@dzone/shared-ui';
import { PerformanceReportType } from '../../../../lib/enums';
import { useFetchReportData } from '../../../../hooks';
import type { IReportRow } from '../../../../lib/types';
import { ChartColumn } from '../../shared/chart-column';

export const InternalRejectionReasons: FC = () => {
  const [chartData, isLoaded] = useFetchReportData<IReportRow>(
    [],
    PerformanceReportType.InternalRejectionReasons,
  );
  return (
    <ChartColumn chartTitle="pages.dashboard.label.internalRejectionReasons">
      <DzPieChart data={chartData as IReportRow[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
