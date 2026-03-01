import { type FC, useEffect, useState } from 'react';
import { Button, Flex } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { usePermissionCheck } from '@dzone/shared-auth';
import { DashboardActionsEnum } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { useDashboardStore } from '../../stores/use-dashboard-store';
import {
  BillingReportType,
  ExecutiveReportType,
  PerformanceCountsType,
  ReachReportType,
  ReportType,
} from '../../lib/enums';

interface ActionsProps {
  refresh: () => void;
  activeTab: string;
  isDownloadDisabled: boolean;
}

export const Actions: FC<ActionsProps> = ({ refresh, activeTab, isDownloadDisabled }) => {
  const { progress } = useDashboardStore();
  const [loading, setLoading] = useState(true);
  const canDownload = usePermissionCheck(DashboardActionsEnum.Download);

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
    <Flex gap="0.75rem" justify="flex-end">
      <Hideable show={canDownload}>
        <Button
          disabled={loading || isDownloadDisabled}
          icon={<DownloadOutlined />}
        />
      </Hideable>
      <Button disabled={loading} onClick={refresh} icon={<ReloadOutlined />} />
    </Flex>
  );
};
