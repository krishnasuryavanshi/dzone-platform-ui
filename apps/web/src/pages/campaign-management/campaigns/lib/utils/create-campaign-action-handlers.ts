import { StepsProgress, normalizeDates } from '@dzone/shared-lib';
import { notification } from 'antd';
import { cloneDeep } from 'lodash-es';
import { FormInstance } from 'antd';
import {
  formatCampaignFormData,
  getChangedData,
  StorageKey,
} from '../../../lib/utils';
import { createCampaign, putCreateCampaign } from '../../services';
import { CampaignField } from '../enums';
import { ICampaign } from '../types';
import { campaignDateFields } from '../constants/campaign-date-fields';
import { validateCombinedData } from './validate-combined-data';
import { CreateCampaignConfig } from '../../config/form';
import type { NavigateFunction } from 'react-router';

export const handleClose = (navigate: NavigateFunction) => {
  navigate('/campaign-management/campaigns');
};

export const onHandleCancel = (navigate: NavigateFunction) => {
  sessionStorage.removeItem(StorageKey.CampaignForm);
  handleClose(navigate);
};

export const onHandleNext = async (
  navigate: NavigateFunction,
  form: { validateFields: () => any },
  step: number,
  updateQueryParams: (step: number) => void,
  isDzoneUser?: boolean,
) => {
  const { steps } = cloneDeep(CreateCampaignConfig(isDzoneUser));
  const stepnums = Object.keys(steps).map(Number);
  const currentStepIndex = stepnums.indexOf(step);
  const nextStepIndex = currentStepIndex + 1;
  const nextStep = stepnums[nextStepIndex];
  try {
    const values = await form.validateFields();
    const dateFormFields = normalizeDates(campaignDateFields, values);

    // Save step data to sessionStorage
    const storageKey = StorageKey.CampaignForm;
    const existing = (() => {
      try {
        const stored = sessionStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : { steps: {} };
      } catch {
        return { steps: {} };
      }
    })();
    if (!existing.steps) existing.steps = {};
    existing.steps[step] = {
      status: StepsProgress.Processed,
      fields: { ...values, ...dateFormFields },
    };
    sessionStorage.setItem(storageKey, JSON.stringify(existing));

    handleClose(navigate);
    updateQueryParams(nextStep);
  } catch (errorInfo) {}
};

export const onHandleSave = async (
  form: FormInstance<any>,
  navigate: NavigateFunction,
  existingCampaignDetails: Record<string, any> | undefined,
  step: number,
  requiredFormFields: string[],
  campaign?: ICampaign,
) => {
  try {
    // Validate form fields
    const values = await form.validateFields();

    const dateFormFields = normalizeDates(campaignDateFields, values);

    // Combine form values and normalize fields
    const storageKey = StorageKey.CampaignForm;
    const formDataFromStorage = (() => {
      try {
        const stored = sessionStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : { steps: {} };
      } catch {
        return { steps: {} };
      }
    })();

    // Merge all step data
    const combinedData: Record<string, any> = {};
    const steps = formDataFromStorage?.steps || {};
    for (const stepKey of Object.keys(steps)) {
      if (Number(stepKey) < step) {
        Object.assign(combinedData, steps[stepKey]?.fields || {});
      }
    }
    Object.assign(combinedData, values, dateFormFields);

    combinedData[CampaignField.UploadIoFile] =
      combinedData[CampaignField.UploadIoFile]?.id;

    let changedData = combinedData;

    if (existingCampaignDetails?.id) {
      // Retrieve previous data for the current step
      const previousStepId = existingCampaignDetails?.finishedStepId;
      const previousData = formatCampaignFormData(campaign!);

      // Extract changed data if we are editing
      changedData = getChangedData(combinedData, previousData);

      // Include stepId only if the current step is greater than or equal to the previous step
      if (step > 0 && (previousStepId === undefined || step > previousStepId)) {
        changedData.stepId = step + 1;
      } else {
        changedData.stepId = null;
      }
    }

    // Validate combined data for required fields
    if (!validateCombinedData(combinedData, requiredFormFields)) {
      return;
    }
    Object.keys(combinedData).forEach((key) => {
      if (combinedData[key] === '') {
        combinedData[key] = undefined;
      }
    });
    const id = existingCampaignDetails?.id;
    const data = id
      ? await putCreateCampaign(changedData, id)
      : await createCampaign(combinedData);

    if (data.data) {
      notification.success({ message: data.message });
      onHandleCancel(navigate);
      return true;
    } else {
      notification.error({ message: data.message });
    }
  } catch (errorInfo) {}
};
