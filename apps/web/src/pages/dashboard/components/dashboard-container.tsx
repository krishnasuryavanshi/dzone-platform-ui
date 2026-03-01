import { type FC, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { useQueryState } from '@dzone/shared-lib';
import { useDashboardStore } from '../stores/use-dashboard-store';
import { ReportType } from '../lib/enums';
import type { IFilterDataPayload, IExecutiveFilterDataPayload } from '../lib/types';
import { ReportingFiltersManager } from './filters/reporting-filters-manager';
import { ReportingTabs } from './tabs/reporting-tabs';

export const DashboardContainer: FC = () => {
  const { updateFilters, resetProgress, reset } = useDashboardStore();
  const { queryState, setQueryState } = useQueryState();
  const initialTab = (queryState.report as string) || ReportType.Executive;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const activeTabName = (queryState.report as string) || ReportType.Executive;
    setActiveTab(activeTabName);
  }, [queryState]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const handleTabChange = (key: string) => {
    resetProgress();
    setQueryState([{ name: 'report', value: key }]);
  };

  const handleSubmit = (
    filterData: IFilterDataPayload | IExecutiveFilterDataPayload,
  ) => {
    updateFilters(filterData);
  };

  return (
    <Flex vertical gap="1rem">
      <ReportingFiltersManager activeTab={activeTab} onSubmit={handleSubmit} />
      <ReportingTabs activeTab={activeTab} handleTabChange={handleTabChange} />
    </Flex>
  );
};
