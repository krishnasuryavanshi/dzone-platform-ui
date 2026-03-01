import { create } from 'zustand';

// TODO: Import from leads module once migrated
// import { ILead } from '../../leads/lib/types';
// import { fetchLeadsList } from '../../leads/services';

interface ILead {
  id: number;
  batchId: string;
  contactResearchDate: string;
  marketingQualificationDate: string;
  marketingQualificationStatus: string;
  leadEnrichmentDate: string;
  leadEnrichmentStatus: string;
  qualityAuditDate: string;
  qualityAuditStatus: string;
  pacingDate: string;
  leadStatus: string;
  pacingStatus: string;
  formatForDeliveryDate: string;
  formatForDeliveryStatus: string;
  deliveredDate: string;
  deliveryStatus: string;
  clientFeedbackDate: string;
  clientFeedbackStatus: string;
  invoiceDate: string;
  invoiceStatus: string;
  paymentDate: string;
  paymentStatus: string;
  revalidationAllowed: boolean;
  trackingId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  linkedinLink: string;
  country: string;
  phone: string;
  jobTitle: string;
  deleted: boolean;
  leadValidationStatus: string;
  client: {
    id: string;
    clientId: string;
  };
  campaign: {
    id: string;
    campaignId: string;
  };
  lineItem: {
    id: string;
    lineItemId: string;
  };
}

interface LeadsData {
  currentPage: number;
  pageSize: number;
  selectedLeadsStatus: string[];
  selectedValidationStatus: string[];
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
}

interface LeadsStore {
  leadsList: ILead[];
  setLeadsList: (leads: ILead[]) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;

  // Leads data state
  leadsData: LeadsData;
  updateLeadsData: (data: Partial<LeadsData>) => void;
  resetLeadsData: () => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  // Export state
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;

  // Filter state
  totalFilteredLeads: number;
  setTotalFilteredLeads: (total: number) => void;

  // Fetch function
  fetchLeads: (
    tenantCode: string,
    lineItemId: string,
    filteredInfo?: Record<string, any>,
    onTotalUpdate?: (total: number) => void,
  ) => Promise<void>;
}

const initialLeadsData: LeadsData = {
  currentPage: 1,
  pageSize: 25,
  selectedLeadsStatus: [],
  selectedValidationStatus: [],
  sortBy: null,
  sortOrder: null,
};

export const useLeadsStore = create<LeadsStore>((set, get) => ({
  leadsList: [],
  setLeadsList: (leads) => set({ leadsList: leads }),
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),

  // Leads data state
  leadsData: initialLeadsData,
  updateLeadsData: (data) =>
    set((state) => ({
      leadsData: { ...state.leadsData, ...data },
    })),
  resetLeadsData: () =>
    set({
      leadsData: initialLeadsData,
      leadsList: [],
      totalFilteredLeads: 0,
      selectedIds: [],
    }),

  // Loading state
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),

  // Export state
  isExporting: false,
  setIsExporting: (value) => set({ isExporting: value }),

  // Filter state
  totalFilteredLeads: 0,
  setTotalFilteredLeads: (total) => set({ totalFilteredLeads: total }),

  // Fetch function
  // TODO: Re-enable fetchLeadsList import once leads module is migrated
  fetchLeads: async (
    _tenantCode,
    _lineItemId,
    filteredInfo = {},
    _onTotalUpdate,
  ) => {
    const { leadsData } = get();
    const params: Record<string, any> = {};

    // Create filters
    const filters: Record<string, any>[] = [];
    const addFilter = (key: string, value: any) => {
      if (value.length) {
        filters.push({ key, value });
      }
    };

    addFilter('leadStatus', leadsData.selectedLeadsStatus);
    addFilter('leadValidationStatus', leadsData.selectedValidationStatus);

    // Process filters for params
    if (filters.length > 0) {
      ['leadStatus', 'leadValidationStatus'].forEach((key) => {
        const values = filters
          .filter((filter) => filter.key === key)
          .map((filter) => String(filter.value));
        if (values.length > 0) {
          params[key] = values.toString();
        }
      });
    }

    // Add filteredInfo to params
    if (filteredInfo && Object.keys(filteredInfo).length) {
      Object.keys(filteredInfo).forEach((key) => {
        const values = filteredInfo[key] ?? [];
        if (values[0]) {
          // Handle date range objects (from DateTimeRangeFilter or DateRangeObjectFilter)
          if (
            typeof values[0] === 'object' &&
            values[0] !== null &&
            ('from' in values[0] || 'to' in values[0])
          ) {
            const dateRange = values[0] as { from?: string; to?: string };
            if (dateRange.from) params[`${key}From`] = dateRange.from;
            if (dateRange.to) params[`${key}To`] = dateRange.to;
          } else {
            params[key] = values[0];
          }
        }
      });
    }

    // Add sorting parameters
    if (leadsData.sortBy) {
      params.sortBy = leadsData.sortBy;
    }
    if (leadsData.sortOrder) {
      params.sortOrder = leadsData.sortOrder;
    }

    // Set loading state
    set({ isLoading: true });

    try {
      // TODO: Uncomment once leads services are migrated
      // const data = await fetchLeadsList(
      //   leadsData.currentPage - 1,
      //   leadsData.pageSize,
      //   tenantCode,
      //   lineItemId,
      //   params,
      // );
      //
      // set({
      //   leadsList: data.data as ILead[],
      //   totalFilteredLeads: data.total,
      //   isLoading: false,
      // });
      //
      // if (onTotalUpdate) {
      //   onTotalUpdate(data.total);
      // }

      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
