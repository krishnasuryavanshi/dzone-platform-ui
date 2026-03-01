import { JobTitleTokenType } from '../enums';
import { getRecommendedJobTitlesAnalytics } from './recommended-job-titles-analytics';

export const getAnalyticsJobTitleData = () => {
  const analyticsJobTitlesData = getRecommendedJobTitlesAnalytics();

  const aiSuggestedAcceptedJobtitles = analyticsJobTitlesData?.jtList
    ?.filter(
      ({ type }: Record<string, any>) =>
        type === JobTitleTokenType.AIRecommended,
    )
    ?.map(({ text }: Record<string, any>) => text);

  const jobTitleRecommendationAnalytics = (
    analyticsJobTitlesData?.recommendedJobTitles || []
  ).map(({ name: originalJobTitle, children }: Record<string, any>) => {
    const suggestedJobTitles = children.map(
      ({ label }: Record<string, string>) => {
        return label;
      },
    );
    const acceptedJobTitles: string[] = aiSuggestedAcceptedJobtitles.filter(
      (jobTitle: string) => suggestedJobTitles.includes(jobTitle),
    );
    return { originalJobTitle, suggestedJobTitles, acceptedJobTitles };
  });

  return jobTitleRecommendationAnalytics;
};
