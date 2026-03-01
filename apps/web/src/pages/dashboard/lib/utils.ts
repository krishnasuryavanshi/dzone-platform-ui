import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { IDateRange } from './types';

dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);

// Date range helpers
function getCurrentWeek(): IDateRange {
  return {
    startDate: dayjs().startOf('isoWeek').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('isoWeek').format('YYYY-MM-DD'),
  };
}

function getCurrentMonth(): IDateRange {
  return {
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
}

function getCurrentQuarter(): IDateRange {
  return {
    startDate: dayjs().startOf('quarter').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('quarter').format('YYYY-MM-DD'),
  };
}

function getCurrentYear(): IDateRange {
  return {
    startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
  };
}

export function calculateDateRanges(range: string): IDateRange {
  const dateRange: Record<string, () => IDateRange> = {
    week: getCurrentWeek,
    month: getCurrentMonth,
    quarter: getCurrentQuarter,
    year: getCurrentYear,
  };
  return dateRange[range]();
}

// Selection helpers
export const getSelectedItems = (
  preSelection: string[],
  currentSelection: string[],
): string[] => {
  if (preSelection.includes('all') && currentSelection.includes('all')) {
    return currentSelection.filter((key) => key !== 'all');
  } else if (!preSelection.includes('all') && currentSelection.includes('all')) {
    return ['all'];
  }
  return currentSelection;
};

export const mapSelectedItems = (
  selectedItems: string[],
  availableItems: { key: string }[],
): string[] => {
  if (selectedItems.includes('all')) {
    return availableItems.filter((item) => item.key !== 'all').map((item) => item.key);
  }
  return selectedItems;
};

// Transform filter data payload
interface SelectedFilters {
  selectedCampaigns: { campaignId: string }[];
  selectedLineItems: { lineItemId: string; campaignId: string }[];
}

interface FilterCampaign {
  uuid: string;
  lineItems: { uuid: string }[];
}

export const transformFilterDataPayload = (data: SelectedFilters): FilterCampaign[] => {
  const campaignsMap: Record<string, FilterCampaign> = {};

  data.selectedCampaigns.forEach((campaign) => {
    campaignsMap[campaign.campaignId] = {
      uuid: campaign.campaignId,
      lineItems: [],
    };
  });

  data.selectedLineItems.forEach((lineItem) => {
    const campaign = campaignsMap[lineItem.campaignId];
    if (campaign) {
      campaign.lineItems.push({ uuid: lineItem.lineItemId });
    }
  });

  return Object.values(campaignsMap);
};
