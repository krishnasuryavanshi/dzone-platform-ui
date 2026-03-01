import { getCollaboratorsToShow } from '../../../lib/utils';
import { ILineItem } from '../types';

export const prepareViewData = (
  data: ILineItem,
  options?: Record<string, any>,
) => {
  return {
    ...data,
    targetCostPerLead: options?.restrictedFields?.includes('targetCostPerLead')
      ? null
      : data?.targetCostPerLead,
    collaborators: getCollaboratorsToShow(data),
    deliveryDays: data?.deliveryDays?.map(({ value }) => value),
    deliveryMethod: data?.deliveryMethod?.value,
    pacing: data?.pacing?.value,
    product: data?.product?.value,
    hasCustomQuestions: data?.customQuestions?.length > 0,
    status: data?.status?.value,

    sourceTenantCode: data?.tenantCode,
    tenantCode: data?.marketerCode,
    //When line item gets assigned to supplier, tenantCode points to supplier's tenant code, and in UI tenantCode shown as Marketer Id
    //TODO: make proper fix
  } as any; // TODO: fix type
};
