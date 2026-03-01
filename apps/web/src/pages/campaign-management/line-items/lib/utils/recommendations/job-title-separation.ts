export const separateJobTitles = (
  selectedRecommendedJobTitles: string[],
  jobTitles: Record<string, string>[],
) => {
  const mappedRecommendedJobTitles = selectedRecommendedJobTitles.map((jt) => {
    return jt.split('###');
  });

  const [existing, newJobTitles] = [[] as string[], [] as any[]];

  mappedRecommendedJobTitles.forEach(([jt, tag]) => {
    const isExisting = jobTitles.some(
      (t) => t.text.toLowerCase() === jt.toLowerCase(),
    );
    if (isExisting) {
      existing.push(jt);
    } else {
      newJobTitles.push([jt, tag]);
    }
  });

  return { existing, newJobTitles };
};
