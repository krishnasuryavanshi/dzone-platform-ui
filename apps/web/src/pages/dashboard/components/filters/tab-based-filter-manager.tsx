import { type FC, type ReactNode } from 'react';
import { ReportType } from '../../lib/enums';
import type { IUseFilterDropdowns } from '../../hooks';
import { FilterDropdowns } from './filter-dropdowns';
import { ExecutiveFilterDropdowns } from './executive-filter-dropdowns';

interface TabBasedFilterManagerProps extends IUseFilterDropdowns {
  allDurations?: { key: string; label: ReactNode }[];
  allUnits?: { key: string; label: ReactNode }[];
  allTimeFrame?: { key: string; label: ReactNode }[];
  activeTab: string;
}

export const TabBasedFilterManager: FC<TabBasedFilterManagerProps> = ({
  activeTab,
  allCampaigns,
  allLineItems,
  allDurations,
  allTimeFrame,
  allUnits,
  handleSelection,
  reset,
  submit,
}) => {
  if (activeTab === ReportType.Executive) {
    return (
      <ExecutiveFilterDropdowns
        reset={reset}
        submit={submit}
        handleSelection={handleSelection}
        allUnits={allUnits}
        allTimeFrame={allTimeFrame}
        activeTab={activeTab}
      />
    );
  }
  return (
    <FilterDropdowns
      allLineItems={allLineItems}
      allCampaigns={allCampaigns}
      allDurations={allDurations}
      handleSelection={handleSelection}
      reset={reset}
      submit={submit}
      activeTab={activeTab}
    />
  );
};
