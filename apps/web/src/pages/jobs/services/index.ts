import { apiClient } from '@dzone/shared-auth';
import { ApiHost } from '@dzone/shared-lib';
import type { IJob } from '../lib/types';

const BASE = ApiHost.JobMonitoringService;

export interface JobMonitoringListResponse {
  data: IJob[];
  total: number;
}

export async function fetchJobs(
  page: number = 0,
  size: number = 25,
  lineItemId?: string,
  params?: Record<string, unknown>,
): Promise<JobMonitoringListResponse> {
  const { data } = await apiClient.get(`${BASE}/jobs`, {
    params: { page, size, ...(lineItemId && { lineItemId }), ...params },
  });
  return data;
}

export async function fetchJob(jobId: string): Promise<IJob> {
  const { data } = await apiClient.get(`${BASE}/jobs/${jobId}`);
  return data?.data ?? data;
}
