import { type FC } from 'react';
import { DzBarChart } from '@dzone/shared-ui';
import { ReachReportType } from '../../../../lib/enums';
import { useFetchReportData } from '../../../../hooks';
import type { IBaseReportRow } from '../../../../lib/types';
import { ChartColumn } from '../../shared/chart-column';

export const LeadsByJobTitle: FC = () => {
  const [chartData, isLoaded] = useFetchReportData<IBaseReportRow>(
    [],
    ReachReportType.LeadsByJobTitle,
  );
  return (
    <ChartColumn
      chartTitle="pages.dashboard.label.leadsByJobTitle"
      extraTitle="pages.dashboard.label.count"
      hasExtra>
      <DzBarChart data={chartData as IBaseReportRow[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
