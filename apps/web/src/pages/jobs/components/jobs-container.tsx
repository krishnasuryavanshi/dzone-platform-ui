import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Flex } from 'antd';
import { SimplePagination, Hideable } from '@dzone/shared-ui';
import { useQueryState, ApiHost } from '@dzone/shared-lib';
import { connectSSE, disconnectSSE, disconnectAllSSE } from '@dzone/shared-auth';
import { useJobsStore } from '../stores/use-jobs-store';
import { fetchJobs } from '../services';
import { PAGE_SIZE, TERMINAL_STATUSES } from '../lib/constants';
import { JobsHeader } from './jobs-header';
import { JobsList } from './jobs-list';
import { JobStepsDrawer } from './job-steps-drawer';
import type { IJob, IJobSSEUpdate, IJobFilters, IJobSorter } from '../lib/types';

interface JobsContainerProps {
  lineItemId?: string;
  showHeader?: boolean;
  hideLineItemColumn?: boolean;
}

export const JobsContainer: FC<JobsContainerProps> = ({
  lineItemId,
  showHeader = true,
  hideLineItemColumn = false,
}) => {
  const {
    jobs,
    total: totalRecords,
    setJobs,
    setTotal,
    updateJobWithSteps,
    reset: resetStore,
  } = useJobsStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState<IJobFilters>({});
  const [sorter, setSorter] = useState<IJobSorter>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedJob = selectedJobId
    ? jobs.find((j) => j.jobId === selectedJobId) || null
    : null;

  const filtersRef = useRef(filters);
  const sorterRef = useRef(sorter);
  const initialFetchDoneRef = useRef(false);
  const filterSorterMountRef = useRef(true);
  const connectedJobsRef = useRef<Set<string>>(new Set());
  const prevQueryRef = useRef<{ page: string; pageSize: string } | null>(null);

  const useUrlState = !lineItemId;
  const { queryState, setQueryState } = useQueryState();

  const fetchJobsList = useCallback(
    async (
      page: number,
      size: number,
      overrideFilters?: IJobFilters,
      overrideSorter?: IJobSorter,
    ) => {
      try {
        const currentFilters =
          overrideFilters !== undefined ? overrideFilters : filtersRef.current;
        const sorterRaw =
          overrideSorter !== undefined ? overrideSorter : sorterRef.current;

        const params: Record<string, unknown> = {};

        if (sorterRaw?.field && sorterRaw?.order) {
          params.sort = `${sorterRaw.field},${sorterRaw.order === 'ascend' ? 'ASC' : 'DESC'}`;
        }

        Object.entries(currentFilters).forEach(([key, value]) => {
          if (key === 'lineItemId' && lineItemId) return;

          if (key === 'startedAt' || key === 'completedAt') {
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              typeof value[0] === 'object'
            ) {
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

        const response = await fetchJobs(page - 1, size, lineItemId, params);
        if (response?.data) {
          const jobsWithKeys = response.data.map((job: IJob) => ({
            ...job,
            key: job.id,
          }));
          setJobs(jobsWithKeys);
          setTotal(response.total || 0);
        }
      } catch {
        // Error handled by apiClient interceptor
      }
    },
    [lineItemId, setJobs, setTotal],
  );

  // Initial fetch
  useEffect(() => {
    if (initialFetchDoneRef.current) return;
    initialFetchDoneRef.current = true;

    if (useUrlState) {
      const page = Number(queryState?.page) || 1;
      const size = Number(queryState?.pageSize) || PAGE_SIZE;
      setCurrentPage(page);
      setPageSize(size);
      prevQueryRef.current = { page: String(page), pageSize: String(size) };

      if (!queryState?.page || !queryState?.pageSize) {
        setQueryState([
          { name: 'page', value: page },
          { name: 'pageSize', value: size },
        ]);
      }
      fetchJobsList(page, size);
    } else {
      fetchJobsList(1, PAGE_SIZE);
    }
  }, []);

  // URL query state changes
  useEffect(() => {
    if (!useUrlState || !initialFetchDoneRef.current) return;

    const page = queryState?.page;
    const size = queryState?.pageSize;

    if (
      page &&
      size &&
      (page !== prevQueryRef.current?.page ||
        size !== prevQueryRef.current?.pageSize)
    ) {
      prevQueryRef.current = { page, pageSize: size };
      const pageNum = Number(page);
      const sizeNum = Number(size);
      setCurrentPage(pageNum);
      setPageSize(sizeNum);
      fetchJobsList(pageNum, sizeNum);
    }
  }, [queryState?.page, queryState?.pageSize, useUrlState, fetchJobsList]);

  // Filter/sorter changes
  useEffect(() => {
    if (filterSorterMountRef.current) {
      filterSorterMountRef.current = false;
      return;
    }

    fetchJobsList(1, pageSize, filters, sorter);
    setCurrentPage(1);
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  }, [filters, sorter]);

  const handlePageChange = (page: number, size: number) => {
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: page },
        { name: 'pageSize', value: size },
      ]);
    } else {
      setCurrentPage(page);
      setPageSize(size);
      fetchJobsList(page, size);
    }
  };

  const handleFiltersChange = useCallback((newFilters: IJobFilters) => {
    filtersRef.current = newFilters;
    setFilters(newFilters);
  }, []);

  const handleSorterChange = useCallback((newSorter: IJobSorter) => {
    sorterRef.current = newSorter;
    setSorter(newSorter);
  }, []);

  const handleRowClick = (job: IJob) => {
    setSelectedJobId(job.jobId);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedJobId(null);
  };

  // SSE connections for active jobs
  useEffect(() => {
    const currentJobIds = new Set(jobs.map((job) => job.jobId));

    // Disconnect jobs no longer in the list
    connectedJobsRef.current.forEach((connectedJobId) => {
      if (!currentJobIds.has(connectedJobId)) {
        disconnectSSE(connectedJobId);
        connectedJobsRef.current.delete(connectedJobId);
      }
    });

    // Disconnect terminal jobs
    jobs.forEach((job) => {
      if (
        TERMINAL_STATUSES.includes(job.status) &&
        connectedJobsRef.current.has(job.jobId)
      ) {
        disconnectSSE(job.jobId);
        connectedJobsRef.current.delete(job.jobId);
      }
    });

    // Connect active jobs
    jobs.forEach((job) => {
      const isActive = !TERMINAL_STATUSES.includes(job.status);
      const alreadyTracked = connectedJobsRef.current.has(job.jobId);

      if (isActive && !alreadyTracked) {
        connectedJobsRef.current.add(job.jobId);
        const endpoint = `${ApiHost.JobMonitoringService}/sse/jobs/${job.jobId}/stream`;

        connectSSE<IJobSSEUpdate>(job.jobId, endpoint, {
          onMessage: (data) => {
            updateJobWithSteps(data);
            if (data.status && TERMINAL_STATUSES.includes(data.status)) {
              disconnectSSE(data.jobId);
              connectedJobsRef.current.delete(data.jobId);
            }
          },
        });
      }
    });
  }, [jobs, updateJobWithSteps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectAllSSE();
      connectedJobsRef.current.clear();
      resetStore();
    };
  }, []);

  return (
    <Flex vertical gap="1rem" style={{ height: '100%' }}>
      <JobsHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        showHeader={showHeader}
      />
      <Flex vertical style={{ flex: 1 }}>
        <JobsList
          jobs={jobs}
          filters={filters}
          sorter={sorter}
          onFiltersChange={handleFiltersChange}
          onSorterChange={handleSorterChange}
          onRowClick={handleRowClick}
          hideLineItemColumn={hideLineItemColumn}
        />
      </Flex>
      <Hideable show={totalRecords > 0}>
        <SimplePagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={handlePageChange}
        />
      </Hideable>
      <JobStepsDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
    </Flex>
  );
};
