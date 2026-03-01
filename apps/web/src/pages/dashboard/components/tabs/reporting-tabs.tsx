import { type FC, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { usePermissionCheck } from '@dzone/shared-auth';
import { DashboardPermissions } from '@dzone/shared-lib';
import { ReportType } from '../../lib/enums';
import { ReportingTabsContent } from './reporting-tabs-content';

interface ReportingTabsProps {
  activeTab: string;
  handleTabChange: (key: string) => void;
}

export const ReportingTabs: FC<ReportingTabsProps> = ({
  activeTab,
  handleTabChange,
}) => {
  const { t } = useTranslation();
  const isExecutiveAvailable = usePermissionCheck(DashboardPermissions.DashboardExecutive);
  const isBillingAvailable = usePermissionCheck(DashboardPermissions.DashboardBilling);
  const isPerformanceAvailable = usePermissionCheck(DashboardPermissions.DashboardPerformance);
  const isReachAvailable = usePermissionCheck(DashboardPermissions.DashboardReach);

  const items = [
    { key: ReportType.Executive, label: t('Executive'), permissions: isExecutiveAvailable },
    { key: ReportType.Performance, label: t('Performance'), permissions: isPerformanceAvailable },
    { key: ReportType.Billing, label: t('Billing'), permissions: isBillingAvailable },
    { key: ReportType.Reach, label: t('Reach'), permissions: isReachAvailable },
  ];

  const [allowedItems, setAllowedItems] = useState<typeof items>([]);

  useEffect(() => {
    const filtered = items.filter((item) => item.permissions);
    setAllowedItems(filtered);
    if (filtered.length > 0) {
      const isActiveTabAllowed = filtered.some((item) => item.key === activeTab);
      if (!isActiveTabAllowed) {
        handleTabChange(filtered[0].key);
      }
    }
  }, [isExecutiveAvailable, isBillingAvailable, isPerformanceAvailable, isReachAvailable, activeTab]);

  if (allowedItems.length === 0) return null;

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={allowedItems.map((item) => ({ key: item.key, label: item.label }))}
      />
      <ReportingTabsContent report={activeTab} />
    </div>
  );
};
