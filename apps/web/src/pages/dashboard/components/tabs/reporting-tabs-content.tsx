import { type FC } from 'react';
import { useAuthStore } from '@dzone/shared-store';
import { RestrictedAccessKeys } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { ReportType } from '../../lib/enums';
import { PerformanceReports } from './performance/performance-reports';
import { BillingReports } from './billing/billing-reports';
import { ReachReports } from './reach/reach-reports';
import { ExecutiveReports } from './executive/executive-reports';

interface ReportingTabsContentProps {
  report: string;
}

export const ReportingTabsContent: FC<ReportingTabsContentProps> = ({ report }) => {
  const { user } = useAuthStore();
  const restrictedKeys = user?.restrictedAccessKeys || [];

  const hasBillingAccess = restrictedKeys.includes(RestrictedAccessKeys.BillingDashboard);
  const hasReachAccess = restrictedKeys.includes(RestrictedAccessKeys.ReachDashboard);
  const hasExecutiveAccess = restrictedKeys.includes(RestrictedAccessKeys.ExecutiveDashboard);

  return (
    <>
      <PerformanceReports show={report === ReportType.Performance} />
      <Hideable show={hasBillingAccess}>
        <BillingReports show={report === ReportType.Billing} />
      </Hideable>
      <Hideable show={hasReachAccess}>
        <ReachReports show={report === ReportType.Reach} />
      </Hideable>
      <Hideable show={hasExecutiveAccess}>
        <ExecutiveReports show={report === ReportType.Executive} />
      </Hideable>
    </>
  );
};
