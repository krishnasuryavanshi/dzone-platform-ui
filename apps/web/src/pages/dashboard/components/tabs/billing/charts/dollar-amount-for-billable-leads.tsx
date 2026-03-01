import { type FC } from 'react';
import { DzPieChart } from '@dzone/shared-ui';
import { BillingReportType } from '../../../../lib/enums';
import { useFetchReportData } from '../../../../hooks';
import type { IReportRow } from '../../../../lib/types';
import { ChartColumn } from '../../shared/chart-column';

export const DollarAmountForBillableLeads: FC = () => {
  const [chartData, isLoaded] = useFetchReportData<IReportRow>(
    [],
    BillingReportType.DollarAmountForBillableLeads,
  );
  return (
    <ChartColumn chartTitle="pages.dashboard.label.dollarAmount">
      <DzPieChart data={chartData as IReportRow[]} loaded={isLoaded} prependDollarInLabel />
    </ChartColumn>
  );
};
