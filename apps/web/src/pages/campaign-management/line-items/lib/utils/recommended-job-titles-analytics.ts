import { StorageKey } from '@dzone/shared-lib';

// Local storage wrapper for recommended job titles analytics
const Store = {
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silent fail
    }
  },
  get: (key: string) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};

export const storeRecommendedJobTitlesAnalytics = (
  recommendedJobTitles: Record<string, any>[],
  jtList: Record<string, any>[],
) => {
  Store.set(StorageKey.JobTitleRecommendationAnalytics, {
    recommendedJobTitles,
    jtList,
  });
};

export const getRecommendedJobTitlesAnalytics = () => {
  return Store.get(StorageKey.JobTitleRecommendationAnalytics);
};
