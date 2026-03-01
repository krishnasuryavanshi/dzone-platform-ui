import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  fetchDeliveryLogs,
  DeliveryLog,
} from '../../services';

interface DeliveryLogsFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface DeliveryLogsStore {
  logs: DeliveryLog[];
  isLoading: boolean;
  filters: DeliveryLogsFilters;
  pagination: {
    currentPage: number;
    total: number;
    perPage: number;
  };

  setLogs: (logs: DeliveryLog[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<DeliveryLogsFilters>) => void;
  setPagination: (pagination: Partial<DeliveryLogsStore['pagination']>) => void;
  fetchLogs: (scheduleId: string) => Promise<void>;
  resetFilters: () => void;
}

export const useDeliveryLogsStore = create<DeliveryLogsStore>()(
  immer((set, get) => ({
    logs: [],
    isLoading: false,
    filters: {},
    pagination: {
      currentPage: 1,
      total: 0,
      perPage: 25,
    },

    setLogs: (logs) => set({ logs }),
    setLoading: (loading) => set({ isLoading: loading }),
    setFilters: (filters) =>
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      }),
    setPagination: (pagination) =>
      set((state) => {
        state.pagination = { ...state.pagination, ...pagination };
      }),

    fetchLogs: async (scheduleId: string) => {
      const { filters, pagination } = get();

      try {
        set({ isLoading: true, logs: [] });
        const response = await fetchDeliveryLogs({
          scheduleId,
          page: pagination.currentPage,
          perPage: pagination.perPage,
          ...filters,
        });

        if (response) {
          // Apply frontend filtering
          let filteredLogs = response.data || [];

          // Filter by status if set
          if (filters.status) {
            filteredLogs = filteredLogs.filter(
              (log) => log.status === filters.status,
            );
          }

          // Filter by date range if set
          if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);

            filteredLogs = filteredLogs.filter((log) => {
              const createdAt = new Date(log.createdAt);
              const updatedAt = new Date(log.updatedAt);

              // Log should be included if either createdAt or updatedAt falls within the range
              const createdInRange =
                createdAt >= startDate && createdAt <= endDate;
              const updatedInRange =
                updatedAt >= startDate && updatedAt <= endDate;

              return createdInRange || updatedInRange;
            });
          }

          const hasFiltersApplied =
            filters.status || (filters.startDate && filters.endDate);

          set({
            logs: filteredLogs,
            pagination: {
              currentPage: response.currentPage || pagination.currentPage,
              total: hasFiltersApplied ? filteredLogs.length : response.total,
              perPage: pagination.perPage,
            },
          });
        }
      } catch (error) {
        // Error is handled by the service
      } finally {
        set({ isLoading: false });
      }
    },

    resetFilters: () =>
      set((state) => ({
        filters: {},
        pagination: {
          currentPage: 1,
          total: 0,
          perPage: state.pagination.perPage,
        },
      })),
  })),
);
