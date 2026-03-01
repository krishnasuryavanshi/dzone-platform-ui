import { pick } from 'lodash-es';
import { UnsavedLineItemSourceFields } from '../constants';

export const getFormattedLineItemSourceObject = (lineItem: any) => {
  const sourceObject = pick(lineItem, UnsavedLineItemSourceFields);

  sourceObject.product = lineItem?.product?.name;
  sourceObject.deliveryMethod = lineItem?.deliveryMethod?.name;
  sourceObject.pacing = lineItem?.pacing?.name;

  sourceObject.deliveryDays = lineItem?.deliveryDays?.map(
    ({ name }: any) => name,
  );
  sourceObject.jobFunctions = lineItem?.jobFunctions?.map(
    ({ name }: any) => name,
  );
  sourceObject.jobLevels = lineItem?.jobLevels?.map(({ name }: any) => name);
  sourceObject.companySizeCount = lineItem?.companySizeCount?.map(
    ({ name }: any) => name,
  );
  sourceObject.companySizeRevenue = lineItem?.companySizeRevenue?.map(
    ({ name }: any) => name,
  );
  sourceObject.industries = [];
  lineItem?.industries?.forEach(({ industries }: any) => {
    industries.forEach(({ name, type }: any) => {
      sourceObject.industries.push(`${name}#${type}`);
    });
  });

  sourceObject.regions = lineItem?.regions?.map(({ name }: any) => name);
  sourceObject.countries = lineItem?.countries?.map(({ name }: any) => name);

  sourceObject.deliveryTemplateId = lineItem?.deliveryTemplate?.id;
  sourceObject.talUploadId = lineItem?.talFileDetails?.id;
  sourceObject.suppressionUploadId = lineItem?.suppressionFileDetails?.id;
  sourceObject.jobTitleListUploadId = lineItem?.jobTitleFileDetails?.id;
  sourceObject.intentKeywordsUploadId = lineItem?.intentKeywordFileDetails?.id;
  sourceObject.technologyUploadId = lineItem?.technologyFileDetails?.id;

  sourceObject.assignedTo = lineItem?.collaborators?.assignedTo?.id;

  return sourceObject;
};
