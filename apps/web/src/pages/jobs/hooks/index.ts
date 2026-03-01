import { useQuery } from '@tanstack/react-query';
import { fetchJobs, fetchJob } from '../services';
import type { IJobFilters, IJobSorter } from '../lib/types';

const QUERY_KEYS = {
  jobs: 'jobs',
  job: 'job',
} as const;

export const useJobs = (
  page: number,
  size: number,
  lineItemId?: string,
  filters?: IJobFilters,
  sorter?: IJobSorter,
) => {
  const params: Record<string, unknown> = {};

  if (sorter?.field && sorter?.order) {
    params.sort = `${sorter.field},${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`;
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'lineItemId' && lineItemId) return;

      if (key === 'startedAt' || key === 'completedAt') {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          const dateRange = value[0] as { from?: string; to?: string };
          if (dateRange.from) params[`${key}From`] = String(dateRange.from);
          if (dateRange.to) params[`${key}To`] = String(dateRange.to);
        }
        return;
      }

      if (Array.isArray(value) && value.length > 0) {
        if (value.length === 1 && typeof value[0] === 'string') {
          params[key] = value[0];
        } else {
          params[key] = value.join(',');
        }
      }
    });
  }

  return useQuery({
    queryKey: [QUERY_KEYS.jobs, page, size, lineItemId, filters, sorter],
    queryFn: () => fetchJobs(page, size, lineItemId, params),
  });
};

export const useJob = (jobId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.job, jobId],
    queryFn: () => fetchJob(jobId!),
    enabled: !!jobId,
  });
