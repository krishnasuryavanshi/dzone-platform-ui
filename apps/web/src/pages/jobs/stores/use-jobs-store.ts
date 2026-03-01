import { create } from 'zustand';
import type { IJob, IJobSSEUpdate } from '../lib/types';

interface JobsStore {
  jobs: IJob[];
  total: number;
  setJobs: (jobs: IJob[]) => void;
  setTotal: (total: number) => void;
  updateJob: (job: IJob) => void;
  updateJobWithSteps: (update: IJobSSEUpdate) => void;
  reset: () => void;
}

export const useJobsStore = create<JobsStore>((set) => ({
  jobs: [],
  total: 0,

  setJobs: (jobs) => set({ jobs }),
  setTotal: (total) => set({ total }),

  updateJob: (updatedJob) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === updatedJob.id ? { ...job, ...updatedJob } : job,
      ),
    })),

  updateJobWithSteps: (update) =>
    set((state) => {
      const { jobId, step: newStep } = update;

      const updatedJobs = state.jobs.map((job) => {
        if (job.jobId !== jobId) return job;

        const updatedJob: IJob = {
          ...job,
          status: update.status ?? job.status,
          totalSteps: update.totalSteps ?? job.totalSteps,
          totalCount: update.totalCount ?? job.totalCount,
          successCount: update.successCount ?? job.successCount,
          skippedCount: update.skippedCount ?? job.skippedCount,
          invalidCount: update.invalidCount ?? job.invalidCount,
          startedAt: update.startedAt ?? job.startedAt,
          completedAt: update.completedAt ?? job.completedAt,
          updatedAt: update.updatedAt ?? job.updatedAt,
          errorMessage: update.errorMessage ?? job.errorMessage,
        };

        if (newStep) {
          const existingSteps = [...(job.steps || [])];
          const existingIndex = existingSteps.findIndex(
            (s) => s.stepId === newStep.stepId,
          );

          if (existingIndex >= 0) {
            existingSteps[existingIndex] = {
              ...existingSteps[existingIndex],
              ...newStep,
            };
          } else {
            existingSteps.unshift(newStep);
          }

          updatedJob.steps = existingSteps;
        }

        return updatedJob;
      });

      return { jobs: updatedJobs };
    }),

  reset: () => set({ jobs: [], total: 0 }),
}));
