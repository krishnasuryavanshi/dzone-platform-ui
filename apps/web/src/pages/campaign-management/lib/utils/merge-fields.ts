import { forEach, reduce } from 'lodash-es';

export const mergeFields = (data: any) => {
  return reduce(
    data,
    (result, sections) => {
      forEach(sections, (section) => {
        result.push(...section.fields);
      });
      return result;
    },
    [] as any[]
  );
};
