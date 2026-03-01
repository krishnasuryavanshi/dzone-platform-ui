import { StorageKey, StepsProgress, normalizeDates, sanitizeData } from '@dzone/shared-lib';
import { notification } from 'antd';
import { FormInstance } from 'antd/es/form';
import { formatLineItemFormData, getChangedData } from '../../../lib/utils';
import { createLineItem } from '../../services';
import { updateLineItem } from '../../services';
import { lineItemDateFields } from '../constants';
import { RemoveNotRequiredKeys } from '../enums';
import { UploadFiles } from '../enums';
import { ILineItem } from '../types';
import { transformIndustriesRequest } from './transform-industry-request';
import { transformJobTitles } from './transform-job-titles';
import { validateCombinedData } from './validate-combined-data';

// TODO: getCombinedDataFromCookies, saveFormDataInCookie, deleteFormDataFromCookie need migration
// These cookie/session storage utilities need to be adapted for the platform
const getCombinedDataFromCookies = (values: any, _step: number, _key: string) => {
  // TODO: Implement session storage based combined data retrieval
  return values;
};

const saveFormDataInCookie = (_key: string, _data: any, _step: number) => {
  // TODO: Implement session storage based form data saving
};

const deleteFormDataFromCookie = (_key: string) => {
  // TODO: Implement session storage based form data deletion
};

const transformIndustries = (data: any) => {
  // TODO: fix any type
  // convert industries ans subindustries
  if (data?.industries) {
    data.industries = transformIndustriesRequest(data?.industries);
  }
};

const setDefaultCustomRangeValues = (
  values: any,
  isCustom: boolean,
  minField: string,
  maxField: string,
) => {
  if (isCustom) {
    values[minField] =
      values[minField] === undefined || values[minField] === null
        ? -2
        : values[minField];
    values[maxField] =
      values[maxField] === undefined || values[maxField] === null
        ? -1
        : values[maxField];
  } else {
    values[minField] = -2;
    values[maxField] = -1;
  }
};

export const handleSave = async (
  navigate: (path: string) => void,
  form: FormInstance<any>,
  step: number,
  existingLineItemDetails: Record<string, any> | undefined,
  requiredFields: string[],
  campaignId?: string,
  lineItemDetails?: ILineItem,
) => {
  try {
    const values = await form.validateFields();
    values.campaignId = campaignId;
    const dateFormFields = normalizeDates(lineItemDateFields, values);
    const combinedData = getCombinedDataFromCookies(
      { ...values, ...dateFormFields },
      step,
      StorageKey.LineItemForm,
    );
    setDefaultCustomRangeValues(
      combinedData,
      combinedData.isCompanySizeRevenueCustom,
      'companySizeRevenueCustomRangeMin',
      'companySizeRevenueCustomRangeMax',
    );

    setDefaultCustomRangeValues(
      combinedData,
      combinedData.isCompanySizeEmployeeCountCustom,
      'companySizeEmployeeCountCustomRangeMin',
      'companySizeEmployeeCountCustomRangeMax',
    );
    for (const [key, idField] of Object.entries(UploadFiles)) {
      if (combinedData[key]) {
        combinedData[idField] = combinedData[key].id || undefined;
      }
    }

    const keysToRemove = Object.values(RemoveNotRequiredKeys);

    let cleanedData = Object.fromEntries(
      Object.entries(combinedData).filter(
        ([key]) =>
          !keysToRemove.includes(key as unknown as RemoveNotRequiredKeys),
      ),
    );
    let changedData = { ...combinedData };
    if (!validateCombinedData(changedData, requiredFields)) {
      return;
    }
    if (existingLineItemDetails?.id) {
      // Retrieve previous data for the current step
      const previousStepId = existingLineItemDetails?.finishedStepId;
      const previousData = formatLineItemFormData(lineItemDetails!);
      // Extract changed data if we are editing
      changedData = getChangedData(combinedData, previousData);
      for (const [key, idField] of Object.entries(UploadFiles)) {
        if (changedData[key]) {
          changedData[idField] = changedData[key].id || undefined;
        }
      }
      // Include stepId only if the current step is greater than or equal to the previous step
      if (step > 0 && (previousStepId === undefined || step > previousStepId)) {
        changedData.stepId = step + 1;
      } else {
        changedData.stepId = null;
      }
    }
    // convert industries ans subindustries
    transformIndustries(
      existingLineItemDetails?.id ? changedData : cleanedData,
    );
    // convert job titles
    transformJobTitles(existingLineItemDetails?.id ? changedData : cleanedData);
    changedData = { ...changedData, assignedTo: undefined };
    cleanedData = { ...cleanedData, assignedTo: undefined };
    const id = existingLineItemDetails?.id;
    const data = id
      ? await updateLineItem(sanitizeData(changedData), id)
      : await createLineItem(sanitizeData(cleanedData));
    if (data.data) {
      notification.success({ message: data.message });
      handleCancel(navigate);
      return true;
    } else {
      notification.error({ message: data.message });
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

export const handleClose = (navigate: (path: string) => void) => {
  navigate('/campaign-management/line-items');
};

export const handleCancel = (navigate: (path: string) => void) => {
  deleteFormDataFromCookie(StorageKey.LineItemForm);
  handleClose(navigate);
};

export const handleNext = async (
  navigate: (path: string) => void,
  form: FormInstance<any>,
  step: number,
  updateQueryParams: (step: number) => void,
  campaignId?: string,
) => {
  try {
    const values = await form.validateFields();
    values.campaignId = campaignId;
    setDefaultCustomRangeValues(
      values,
      values.isCompanySizeRevenueCustom,
      'companySizeRevenueCustomRangeMin',
      'companySizeRevenueCustomRangeMax',
    );

    setDefaultCustomRangeValues(
      values,
      values.isCompanySizeEmployeeCountCustom,
      'companySizeEmployeeCountCustomRangeMin',
      'companySizeEmployeeCountCustomRangeMax',
    );
    const dateFormFields = normalizeDates(lineItemDateFields, values);
    saveFormDataInCookie(
      StorageKey.LineItemForm,
      {
        status: StepsProgress.Processed,
        fields: { ...values, ...dateFormFields },
      },
      step,
    );
    handleClose(navigate);
    updateQueryParams(Number(step) + 1);
  } catch (error) {}
};
