import { IIndustries } from '../types';

export const transformIndustriesResponse = (industries: IIndustries[]) => {
  if (!industries || industries.length === 0) {
    return [];
  }
  return industries.flatMap((industry) =>
    industry.industries.map(
      (subIndustry) => `${subIndustry.value}#${subIndustry.type}`
    )
  );
};
