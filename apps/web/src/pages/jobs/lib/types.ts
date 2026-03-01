export interface IJobStep {
  stepId: string;
  stepName: string;
  stepOrder: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  totalCount: number;
  successCount: number;
  skippedCount: number;
  invalidCount: number;
  startedAt: string | null;
  completedAt: string | null;
  details: Record<string, any> | null;
}

export interface IJob {
  id: string;
  key?: string;
  jobId: string;
  jobType: 'UPSERT' | 'VALIDATION' | 'PUBLISH' | 'REVALIDATION';
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  totalSteps: number;
  totalCount: number;
  successCount: number;
  skippedCount: number;
  invalidCount: number;
  startedAt: string;
  completedAt: string;
  updatedAt: string;
  userId: string;
  email: string;
  lineItemId: string;
  tenantCode: string;
  errorMessage: string;
  steps: IJobStep[];
}

export interface IJobSSEUpdate {
  jobId: string;
  lineItemId?: string;
  jobType?: string;
  status?: IJob['status'];
  totalSteps?: number;
  totalCount?: number;
  successCount?: number;
  skippedCount?: number;
  invalidCount?: number;
  startedAt?: string;
  completedAt?: string | null;
  updatedAt?: string;
  userId?: string;
  tenantCode?: string;
  errorMessage?: string | null;
  step?: IJobStep;
}

export interface IJobFilters {
  jobType?: string[] | null;
  status?: string[] | null;
  lineItemId?: string[] | null;
  email?: string[] | null;
  startedAt?: any[] | null;
  completedAt?: any[] | null;
}

export interface IJobSorter {
  field?: string;
  order?: 'ascend' | 'descend';
}
