import { getAnalyticsJobTitleData } from './get-analytics-job-title-data';

export const transformJobTitles = (data: Record<string, any>) => {
  if (data.jobTitles?.length) {
    const jobTitles = data.jobTitles.map(
      ({ text }: Record<string, any>) => text,
    );
    data.jobTitles = jobTitles.join(', ');
    data.jobTitleRecommendation = getAnalyticsJobTitleData();
    data.isJobTitleListIncluded = false;
    data.jobTitleListUploadId = null;
  } else if (data.jobTitleListUploadId) {
    data.isJobTitleListIncluded = true;
    data.jobTitles = '';
    data.jobTitleRecommendation = null;
  } else {
    data.hasJobTitles = false;
    data.isJobTitleListIncluded = false;
    data.jobTitles = '';
    data.jobTitleRecommendation = null;
  }
};
