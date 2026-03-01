import { type FC } from 'react';
import { DzFunnelChart } from '@dzone/shared-ui';
import { PerformanceReportType } from '../../../../lib/enums';
import { useFetchReportData } from '../../../../hooks';
import type { IReportRowWithPercentage } from '../../../../lib/types';
import { ChartColumn } from '../../shared/chart-column';

export const LeadStatus: FC = () => {
  const [chartData, isLoaded] = useFetchReportData<IReportRowWithPercentage>(
    [],
    PerformanceReportType.LeadStatus,
  );
  return (
    <ChartColumn chartTitle="pages.dashboard.label.leadStatus">
      <DzFunnelChart data={chartData as IReportRowWithPercentage[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
