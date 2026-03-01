import { usePolling, getDeltaOfObjects, hasUnsavedChanges } from '@dzone/shared-lib';
import { notification } from 'antd';
import { Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { LeadValidationStatus } from '../../../lib/enums';
import {
  LEAD_IN_VALIDATION_ERROR_MESSAGE,
  LEAD_VALIDATION_SKIPPED_DUE_TO_NO_CHANGES,
} from '../../../../lib/constants';
import {
  fetchLeadDetailsById,
  fetchLeadReviewFormConfig,
  fetchLeadValidationHistory,
  fetchReviewLeadsList,
  updateLeadDetails,
} from '../../../services';
import { LeadInfo } from './lead-info';
import { LeadMeta } from './lead-meta';
import { Navigation } from './navigation';
import { IGNORE_VALIDATION_ERRORS_STATUSES } from '../../../lib/constants';
import {
  transformJobTitles,
  formatDateFieldsForPayload,
} from '../../../lib/utils';

// TODO: Import ILead from leads module once migrated
// import { ILead } from '../../../../leads/lib/types';
type ILead = Record<string, any>;

interface ILeadReviewContainerProps {
  show: boolean;
  selectedLeadTrackingId: string;
  selectedCurrentLeadId: number;
  lineItemId: string;
  leadStatuses: string[];
  validationStatuses: string[];
  tenantCode?: string;
}
export interface LeadError {
  field: string;
  message: string;
}

const PollingWaitTime = 15;

export const LeadReviewContainer: FC<ILeadReviewContainerProps> = ({
  show,
  selectedLeadTrackingId,
  selectedCurrentLeadId,
  lineItemId,
  leadStatuses,
  validationStatuses,
  tenantCode,
}) => {
  const { updatePollingDetails, stopPolling, startPolling, pollingResult } =
    usePolling<{ leadValidationStatus: string }>();
  const [leadTrackingIds, setLeadTrackingIds] = useState<string[]>([]);
  const [leadIds, setLeadIds] = useState<number[]>([]);
  const [currentLeadTrackingId, setCurrentLeadTrackingId] =
    useState<string>('');
  const [currentLeadId, setCurrentLeadId] = useState<number>(0);
  const [currentLeadNumber, setCurrentLeadNumber] = useState(0);
  const [leadDetails, setLeadDetails] = useState<ILead | null>(null);
  const [leadValidationStatus, setLeadValidationStatus] = useState<string>('');
  const [initialFormValue, setInitialFormValue] = useState<Record<string, any>>(
    {},
  );
  const [formValue, setFormValue] = useState<Record<string, any>>({});
  const [leadErrorMessages, setLeadErrorMessages] = useState<LeadError[]>([]);
  const [disableRevalidate, setDisableRevalidate] = useState(false);
  const [leadReviewFormConfig, setLeadReviewFormConfig] = useState<Record<string, any>[]>(
    [],
  );

  useEffect(() => {
    fetchLeadTrackingIdsToReview();
    fetchFormConfig();
  }, []);

  useEffect(() => {
    if (pollingResult) {
      setLeadValidationStatus(pollingResult.leadValidationStatus);
      handlePolling(pollingResult.leadValidationStatus);
    }
  }, [pollingResult]);

  useEffect(() => {
    handlePolling(leadValidationStatus);
  }, [leadValidationStatus]);

  useEffect(() => {
    if (selectedLeadTrackingId && leadTrackingIds.length > 0) {
      setCurrentLeadTrackingId(selectedLeadTrackingId);
      setCurrentLeadId(selectedCurrentLeadId);
      setCurrentLeadNumber(leadIds.indexOf(selectedCurrentLeadId) + 1);
    }
  }, [selectedLeadTrackingId, leadTrackingIds, leadIds, selectedCurrentLeadId]);

  useEffect(() => {
    setLeadDetails(null);
    setLeadValidationStatus('');
    if (currentLeadId) {
      fetchLeadDetails(currentLeadId, tenantCode);
      updatePollingDetails({
        pollWaitTime: PollingWaitTime,
        pollFunction: refreshLeadValidationStatus,
        pollFunctionArgs: { lineItemId, currentLeadId },
      });
    }
  }, [currentLeadTrackingId]);

  const handlePolling = (leadValidationStatus: string) => {
    if (
      leadValidationStatus &&
      [
        LeadValidationStatus.NotStarted,
        LeadValidationStatus.InValidation,
        LeadValidationStatus.Scheduled,
      ].includes(leadValidationStatus as LeadValidationStatus)
    ) {
      startPolling();
    } else {
      stopPolling();
    }
  };

  const fetchLeadDetails = async (
    currentLeadId: number,
    tenantCode?: string,
  ) => {
    const leadData = await fetchLeadDetailsById(currentLeadId, tenantCode);
    if (leadData) {
      setLeadValidationStatus(leadData.leadValidationStatus);
      setLeadDetails(leadData);
      fetchLeadErrorMessagesFromValidationHistory(
        leadData.leadValidationStatus,
      );
    }
  };

  const refreshLeadValidationStatus = async (params: Record<string, any>) => {
    const { currentLeadId } = params || {};
    fetchLeadDetails(currentLeadId, tenantCode);
  };

  const fetchLeadTrackingIdsToReview = async () => {
    const filters = [];
    if (leadStatuses.length > 0) {
      filters.push({
        key: 'leadStatus',
        value: leadStatuses,
      });
    }
    if (validationStatuses.length > 0) {
      filters.push({
        key: 'leadValidationStatus',
        value: validationStatuses,
      });
    }

    const { data } = await fetchReviewLeadsList(lineItemId, filters);
    const ids = data.map((item: { id: number }) => item.id);
    const trackingIds = data.map(
      (item: { trackingId: string }) => item.trackingId,
    );
    setLeadTrackingIds(trackingIds);
    setLeadIds(ids);
  };

  const fetchFormConfig = async () => {
    const { data } = await fetchLeadReviewFormConfig('panel', lineItemId);
    if (data) {
      setLeadReviewFormConfig(data);
    }
  };

  const handlePrevNavigation = () => {
    const newCurrentLeadNumber = currentLeadNumber - 1;
    handleLeadChange(newCurrentLeadNumber);
  };

  const handleNextNavigation = () => {
    const newCurrentLeadNumber = currentLeadNumber + 1;
    handleLeadChange(newCurrentLeadNumber);
  };

  const handleLeadChange = (newCurrentLeadNumber: number) => {
    const newCurrentLeadId = leadIds[newCurrentLeadNumber - 1];
    const newCurrentLeadTrackingId = leadTrackingIds[newCurrentLeadNumber - 1];
    setCurrentLeadNumber(newCurrentLeadNumber);
    setCurrentLeadId(newCurrentLeadId);
    setCurrentLeadTrackingId(newCurrentLeadTrackingId);
  };

  const handleRevalidateDisability = (status: boolean) => {
    setDisableRevalidate(status);
  };

  const handleSaveAndRevalidate = async () => {
    const hasUnsavedData = hasUnsavedChanges(initialFormValue, formValue);
    if (hasUnsavedData) {
      if (leadValidationStatus === LeadValidationStatus.InValidation) {
        notification.error({
          message: LEAD_IN_VALIDATION_ERROR_MESSAGE,
        });
        return;
      }

      const reviewLeadDifference = getDeltaOfObjects(
        initialFormValue,
        formValue,
      );

      const leadDifferenceWithJobGroup = transformJobTitles(
        reviewLeadDifference,
        formValue,
      );

      // Format date fields to strings before sending to API
      const formattedPayload = formatDateFieldsForPayload(
        leadDifferenceWithJobGroup,
        leadReviewFormConfig,
      );

      await handleSave(formattedPayload);
    } else {
      notification.error({
        message: LEAD_VALIDATION_SKIPPED_DUE_TO_NO_CHANGES,
      });
    }
  };

  const fetchLeadErrorMessagesFromValidationHistory = async (
    leadValidationStatus: LeadValidationStatus,
  ) => {
    setLeadErrorMessages([]);
    if (IGNORE_VALIDATION_ERRORS_STATUSES.includes(leadValidationStatus)) {
      return;
    }
    const data = await fetchLeadValidationHistory(
      lineItemId,
      currentLeadTrackingId,
      currentLeadId,
    );
    const errors = data?.data.map((error: { field: any; message: any }) => ({
      field: error.field,
      message: error.message,
    }));
    setLeadErrorMessages(errors);
  };

  const handleSave = async (reviewLeadDifference: Record<string, any>) => {
    try {
      const { data } = await updateLeadDetails(
        currentLeadId,
        reviewLeadDifference,
        tenantCode,
      );
      if (data) {
        setLeadValidationStatus(data.leadValidationStatus);
        setLeadDetails(data);
        notification.success({
          message: 'Lead details updated successfully and being validated.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to update lead details. Please try again.',
      });
    }
  };

  const updateInitialFormValues = (initialValues: Record<string, any>) => {
    setInitialFormValue(initialValues);
    setFormValue(initialValues);
  };

  const updateFormValues = (formValue: Record<string, any>) => {
    setFormValue(formValue);
  };

  if (!show) return null;

  if (
    !currentLeadNumber ||
    !currentLeadTrackingId ||
    !leadTrackingIds?.length
  ) {
    return <LoadingOutlined />;
  }

  return (
    <Flex style={{ height: '100%' }}>
      <LeadMeta
        validationStatus={leadValidationStatus}
        trackingId={currentLeadTrackingId}
        revalidationAllowed={leadDetails?.revalidationAllowed}
        disableRevalidate={disableRevalidate}
        handleSaveAndRevalidate={handleSaveAndRevalidate}>
        <Navigation
          totalLeads={leadTrackingIds.length}
          currentLeadNumber={currentLeadNumber}
          handleNext={handleNextNavigation}
          handlePrev={handlePrevNavigation}
        />
      </LeadMeta>
      <LeadInfo
        leadDetails={leadDetails}
        updateInitialFormValue={updateInitialFormValues}
        handleFormValueChange={updateFormValues}
        leadErrorMessages={leadErrorMessages}
        leadValidationStatus={leadValidationStatus}
        handleRevalidateDisability={handleRevalidateDisability}
        leadReviewFormConfig={leadReviewFormConfig}
      />
    </Flex>
  );
};
