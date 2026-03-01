interface TransformedIndustry {
  industry: string;
  subIndustry: string;
}

export const transformIndustriesRequest = (
  industries: string[]
): TransformedIndustry[] | null => {
  if (!industries || industries.length === 0) {
    return null;
  }
  const transformedIndustries: TransformedIndustry[] = industries.map(
    (industryString: string) => {
      const [subIndustry = '', industry = ''] = industryString.split('#');
      return {
        industry,
        subIndustry,
      };
    }
  );

  return transformedIndustries;
};
