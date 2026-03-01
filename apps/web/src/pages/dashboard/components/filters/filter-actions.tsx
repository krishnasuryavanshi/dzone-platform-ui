import { type FC, useEffect, useState } from 'react';
import { Button, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from '../../stores/use-dashboard-store';
import {
  BillingReportType,
  ExecutiveReportType,
  PerformanceCountsType,
  ReachReportType,
  ReportType,
} from '../../lib/enums';

interface FilterActionsProps {
  reset?: () => void;
  submit?: () => void;
  activeTab: string;
}

export const FilterActions: FC<FilterActionsProps> = ({ reset, submit, activeTab }) => {
  const { t } = useTranslation();
  const { progress } = useDashboardStore();
  const [loading, setLoading] = useState(true);

  const isReportTypeKey = (key: string): boolean => {
    switch (activeTab) {
      case ReportType.Executive:
        return (Object.values(ExecutiveReportType) as string[]).includes(key);
      case ReportType.Performance:
        return (Object.values(PerformanceCountsType) as string[]).includes(key);
      case ReportType.Billing:
        return (Object.values(BillingReportType) as string[]).includes(key);
      case ReportType.Reach:
        return (Object.values(ReachReportType) as string[]).includes(key);
      default:
        return false;
    }
  };

  useEffect(() => {
    const isLoading = Object.keys(progress)
      .filter((key) => isReportTypeKey(key))
      .some((key) => progress[key] === 'loading');
    setLoading(isLoading);
  }, [progress, activeTab]);

  return (
    <Flex gap="0.75rem" justify="flex-start">
      <Button disabled={loading} onClick={submit}>
        {t('form.actions.submit')}
      </Button>
      <Button disabled={loading} onClick={reset}>
        {t('form.actions.reset')}
      </Button>
    </Flex>
  );
};
