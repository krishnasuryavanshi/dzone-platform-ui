import { useEffect, useState } from 'react';
import { useDashboardStore } from '../stores/use-dashboard-store';
import { fetchReportChartsData, fetchReportCountsData } from '../services';
import { ExecutiveReportType } from '../lib/enums';
import type { IFilterCampaign, IFilterLineItem, ISelectedIds } from '../lib/types';
import { mapSelectedItems } from '../lib/utils';

// Generic hook for fetching report chart or count data
export function useFetchReportData<T>(
  initialValue: T | T[],
  type: string,
  category: 'chart' | 'count' = 'chart',
): [T | T[], boolean] {
  const [reportData, setReportData] = useState<T | T[]>(initialValue);
  const { filters, progress, updateProgress } = useDashboardStore();

  useEffect(() => {
    updateProgress({ [type]: 'loading' });
    if (filters && Object.keys(filters).length > 0) {
      fetchData();
    }
  }, [filters]);

  function createFilteredData(filters: Record<string, unknown>, type: string) {
    if (
      type === ExecutiveReportType.Bookings ||
      type === ExecutiveReportType.WaitingToGoLive
    ) {
      return {
        unit: (filters as Record<string, string>).unit || '',
        timeframe: (filters as Record<string, string>).timeframe || '',
      };
    }
    return {
      campaigns: (filters as Record<string, unknown>).campaigns,
      range: (filters as Record<string, unknown>).range,
    };
  }

  const fetchData = async () => {
    try {
      const filteredData = createFilteredData(
        filters as Record<string, unknown>,
        type,
      );
      let data;
      if (category === 'chart') {
        data = await fetchReportChartsData(filteredData as any, type);
      } else {
        data = await fetchReportCountsData(filteredData as any, type);
      }
      if (data !== null) {
        setReportData(data);
      }
      updateProgress({ [type]: 'loaded' });
    } catch {
      updateProgress({ [type]: 'loaded' });
    }
  };

  return [reportData, progress[type] === 'loaded'];
}

// Hook for managing filter dropdown state
export interface IUseFilterDropdowns {
  allLineItems?: IFilterLineItem[];
  allCampaigns?: IFilterCampaign[];
  submit: number;
  reset: number;
  handleSelection: (data: ISelectedIds) => void;
  activeTab: string;
}

export function useFilterDropdowns({
  allLineItems,
  allCampaigns,
  submit,
  reset,
  handleSelection,
}: IUseFilterDropdowns) {
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>(['all']);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(['all']);
  const [selectedDuration, setSelectedDuration] = useState<string[]>(['week']);
  const [selectedUnit, setSelectedUnit] = useState<string[]>(['Revenue']);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string[]>(['MTD']);
  const [availableCampaigns, setAvailableCampaigns] = useState<IFilterCampaign[]>([]);
  const [availableLineItems, setAvailableLineItems] = useState<IFilterLineItem[]>([]);

  const submitAction = (initialState = false) => {
    handleSelection?.({
      selectedLineItems: mapSelectedItems(
        initialState ? ['all'] : selectedLineItems,
        availableLineItems,
      ),
      selectedCampaigns: mapSelectedItems(
        initialState ? ['all'] : selectedCampaigns,
        availableCampaigns,
      ),
      selectedDuration: initialState ? ['week'] : selectedDuration,
      selectedUnit: initialState ? ['Revenue'] : selectedUnit,
      selectedTimeFrame: initialState ? ['MTD'] : selectedTimeFrame,
    });
  };

  useEffect(() => {
    setSelectedUnit(['Revenue']);
    setSelectedTimeFrame(['MTD']);
    setSelectedDuration(['week']);
    setSelectedCampaigns(['all']);
    setSelectedLineItems(['all']);
    submitAction(true);
  }, [reset]);

  useEffect(submitAction, [submit]);

  useEffect(() => {
    if (allCampaigns?.length) {
      setAvailableCampaigns(allCampaigns);
    }
  }, [allCampaigns]);

  useEffect(() => {
    if (allLineItems?.length) {
      setAvailableLineItems(allLineItems);
    }
  }, [allLineItems]);

  useEffect(() => {
    if (allLineItems) {
      let filtered = [...allLineItems];
      if (!selectedCampaigns.includes('all')) {
        filtered = allLineItems.filter(
          (lineItem) =>
            selectedCampaigns.includes(lineItem.campaignId) || lineItem.key === 'all',
        );
      }
      setAvailableLineItems(filtered);
    }
  }, [selectedCampaigns]);

  const handleSelectionChange = (data: { type: string; selectedItems: string[] }) => {
    const setters: Record<string, (v: string[]) => void> = {
      selectedLineItems: setSelectedLineItems,
      selectedCampaigns: setSelectedCampaigns,
      selectedTimeFrame: setSelectedTimeFrame,
      selectedUnit: setSelectedUnit,
      selectedDurations: setSelectedDuration,
    };
    const setter = setters[data.type] || setSelectedDuration;
    setter(data.selectedItems?.length ? data.selectedItems : ['all']);
  };

  return {
    selectedLineItems,
    selectedCampaigns,
    selectedDuration,
    availableCampaigns,
    availableLineItems,
    handleSelectionChange,
    selectedTimeFrame,
    selectedUnit,
  };
}
