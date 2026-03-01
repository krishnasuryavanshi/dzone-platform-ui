import { type FC } from 'react';
import { DzLineChart } from '@dzone/shared-ui';
import { ReachReportType } from '../../../../lib/enums';
import { useFetchReportData } from '../../../../hooks';
import type { ILineReportRow } from '../../../../lib/types';
import { ChartColumn } from '../../shared/chart-column';

export const Pacing: FC = () => {
  const [chartData, isLoaded] = useFetchReportData<ILineReportRow>(
    [],
    ReachReportType.Pacing,
  );
  const lines = [
    { dataKey: 'pacing', stroke: '#235AED', name: 'Pacing' },
    { dataKey: 'released', stroke: '#90BE6D', name: 'Released' },
    { dataKey: 'reserved', stroke: '#F9C74F', name: 'Reserved' },
  ];
  return (
    <ChartColumn chartTitle="pages.dashboard.label.pacing">
      <DzLineChart data={chartData as ILineReportRow[]} lines={lines} loaded={isLoaded} />
    </ChartColumn>
  );
};
