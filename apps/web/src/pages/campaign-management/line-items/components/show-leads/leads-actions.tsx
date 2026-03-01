import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import { LeadActionsEnum, DZONE_CLR_BLACK, saveFileFromBlob } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { Button, Flex, Typography } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { FC, useEffect, useState, useRef } from 'react';
import { UploadLeads } from '../upload-leads';
// TODO: Re-enable once validation is active
// import { ValidateLeads } from './validate-leads';
import { useLeadsStore } from '../../stores';
import { useLineItemStore } from '../../stores';
import { PublishLeads } from './publish-leads';
import { ReturnLeads } from './return-leads';
import {
  fetchLeadUploadProcessingStatus,
  checkLeadUpsertTaskStatus,
  downloadLeadUploadTemplate,
} from '../../services';
import { LeadValidationProgress } from './lead-validation-progress';
import { BulkStatusUpdateDropdown } from '../bulk-status-update-dropdown';
import { ArchiveLeads } from './archive-leads';
// TODO: Import from leads module once migrated
// import { exportLeadsFilteredByLeadAndValidationStatuses } from '../../../leads/services/export-filtered-leads-by-leads-and-validation-statuses';

const { Link } = Typography;

interface ILeadsActionsProps {
  lineItemId: string;
  totalFilteredLeads: number;
  leadStatus: string[];
  validationStatus: string[];
  refreshLeadsList: () => void;
  tenantCode?: string;
  filteredInfo?: Record<string, any>;
}
export const LeadsActions: FC<ILeadsActionsProps> = ({
  lineItemId,
  totalFilteredLeads: _totalFilteredLeads,
  leadStatus: _leadStatus,
  validationStatus: _validationStatus,
  refreshLeadsList,
  tenantCode,
  filteredInfo,
}) => {
  const { t } = useTranslation();
  const { lineItem } = useLineItemStore();
  const selectedIds = useLeadsStore((state) => state.selectedIds);
  const leadsList = useLeadsStore((state) => state.leadsList);
  // TODO: Re-enable once leads export is migrated
  // const leadsData = useLeadsStore((state) => state.leadsData);
  const isExporting = useLeadsStore((state) => state.isExporting);
  const setIsExporting = useLeadsStore((state) => state.setIsExporting);
  const [isUploadAllowed, setIsUploadAllowed] = useState<boolean>(false);
  const [isPublishAllowed, setIsPublishAllowed] = useState<boolean>(false);
  const hasUploadViewPermission = usePermissionCheck(
    [LeadActionsEnum.View, LeadActionsEnum.Upload],
    true,
  );
  const hasUpdateViewPermission = usePermissionCheck(
    [LeadActionsEnum.View, LeadActionsEnum.Update],
    true,
  );
  const hasPublishPermission = usePermissionCheck(
    [LeadActionsEnum.PublishLead],
    true,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [leadUploadProcessStatus, setLeadUploadProcessStatus] = useState<{
    inValidationCount: number;
    validInvalidCount: number;
  } | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const taskIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshLeadsListRef = useRef(refreshLeadsList);

  // Keep the ref updated
  useEffect(() => {
    refreshLeadsListRef.current = refreshLeadsList;
  }, [refreshLeadsList]);

  // localStorage utilities for requestId
  const getStoredRequestId = (lineItemId: string) => {
    return localStorage.getItem(`leadUploadRequestId_${lineItemId}`);
  };

  const storeRequestId = (lineItemId: string, requestId: string) => {
    localStorage.setItem(`leadUploadRequestId_${lineItemId}`, requestId);
  };

  const clearStoredRequestId = (lineItemId: string) => {
    localStorage.removeItem(`leadUploadRequestId_${lineItemId}`);
  };

  const handleDownloadtemplate = async () => {
    try {
      setIsLoading(true);
      const { data, headers } = await downloadLeadUploadTemplate(
        lineItemId,
        lineItem?.validationSettingsId as string,
        lineItem?.marketerCode || '',
      );
      if (data) {
        const contentDisposition = (headers as Record<string, any>)['content-disposition'] as string;
        const fileName = contentDisposition?.split('filename=')[1];
        const contentType = (headers as Record<string, any>)['content-type'] as string;
        saveFileFromBlob(
          data,
          fileName?.replaceAll('"', ''),
          contentType,
        );
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lineItem) {
      setIsUploadAllowed(lineItem.uploadAllowed as boolean);
      setIsPublishAllowed(lineItem.uploadAllowed as boolean);
    } else {
      setIsUploadAllowed(false);
    }
  }, [lineItem]);

  // Calculate bulk status update disabled state
  const selectedLeadsStatuses = selectedIds
    .map((id: number) => leadsList.find((lead: any) => lead.id === id)?.leadStatus)
    .filter(Boolean);
  const uniqueStatuses = Array.from(new Set(selectedLeadsStatuses));
  const isBulkStatusUpdateDisabled =
    uniqueStatuses.length > 1 || selectedIds.length === 0;

  // TODO: Re-enable once leads export is migrated
  // const createFilters = () => {
  //   const filters: Record<string, any>[] = [];
  //   const addFilter = (key: string, value: any) => {
  //     if (value.length) {
  //       filters.push({ key, value });
  //     }
  //   };
  //   addFilter('leadStatus', leadsData.selectedLeadsStatus);
  //   addFilter('leadValidationStatus', leadsData.selectedValidationStatus);
  //   return filters;
  // };

  const onExport = async () => {
    // TODO: Re-enable once leads export is migrated
    // const filters = createFilters();
    try {
      setIsExporting(true);
      // TODO: Import from leads module once migrated
      // const { data, headers } =
      //   await exportLeadsFilteredByLeadAndValidationStatuses(
      //     lineItemId,
      //     filters,
      //   );
      // if (data) {
      //   notification.success({
      //     message: 'Leads downloaded successfully.',
      //   });
      //   const fileName = headers
      //     .get('content-disposition')
      //     .split('filename=')[1];
      //   saveFileFromBlob(
      //     data,
      //     fileName.replaceAll('"', ''),
      //     headers.get('content-type'),
      //   );
      // }
    } catch (e) {
    } finally {
      setIsExporting(false);
    }
  };

  // Polling effect for task status
  useEffect(() => {
    if (!requestId) return;

    const pollTaskStatus = async () => {
      try {
        const res = await checkLeadUpsertTaskStatus(requestId);
        const statusData = res?.data || res;

        if (statusData && statusData.status) {
          setTaskStatus(statusData.status);

          // If task is successful, start polling lead upload processing status
          if (statusData.status === 'Success') {
            if (taskIntervalRef.current) clearInterval(taskIntervalRef.current);
            // Store the requestId for validation monitoring
            storeRequestId(`validation_${lineItemId}`, requestId);
            clearStoredRequestId(lineItemId); // Clear task requestId from localStorage
            setRequestId(null);
            setTaskStatus(null); // Clear task status immediately
            // Immediately fetch validation status with requestId
            fetchLeadUploadProcessingStatus(lineItemId, requestId).then(
              (res) => {
                const validationData = res?.data || res;
                if (
                  validationData &&
                  typeof validationData.inValidationCount === 'number'
                ) {
                  setLeadUploadProcessStatus({
                    inValidationCount: validationData.inValidationCount,
                    validInvalidCount: validationData.validInvalidCount,
                  });

                  // Only start validation monitoring if there are items to validate
                  if (validationData.inValidationCount > 0) {
                    setIsValidating(true); // Start validation monitoring
                  } else {
                    // Validation already complete, clear storage and refresh
                    clearStoredRequestId(`validation_${lineItemId}`);
                    refreshLeadsListRef.current();
                  }
                }
              },
            );
          } else if (statusData.status === 'Failed') {
            // Task failed, stop polling
            if (taskIntervalRef.current) clearInterval(taskIntervalRef.current);
            clearStoredRequestId(lineItemId); // Clear from localStorage
            setRequestId(null);
            setTaskStatus(null);
            setLeadUploadProcessStatus(null);
            refreshLeadsListRef.current();
          }
          // Continue polling for QUEUED, RETRY, IN_PROGRESS statuses
        }
      } catch (e) {
        // Handle error if needed
      }
    };

    pollTaskStatus();
    taskIntervalRef.current = setInterval(pollTaskStatus, 3000);

    return () => {
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
        taskIntervalRef.current = null;
      }
    };
  }, [requestId, lineItemId]);

  // Polling effect for validation status (after task success)
  useEffect(() => {
    if (!isValidating || !lineItemId) return;

    const pollStatus = async () => {
      try {
        // Get stored requestId for this polling session
        const storedRequestId = getStoredRequestId(`validation_${lineItemId}`);
        const res = await fetchLeadUploadProcessingStatus(
          lineItemId,
          storedRequestId || undefined,
        );
        // Handle both response formats (with or without data wrapper)
        const statusData = res?.data || res;

        if (statusData && typeof statusData.inValidationCount === 'number') {
          setLeadUploadProcessStatus({
            inValidationCount: statusData.inValidationCount,
            validInvalidCount: statusData.validInvalidCount,
          });

          // If validation is complete (inValidationCount is 0)
          if (statusData.inValidationCount === 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsValidating(false);
            setLeadUploadProcessStatus(null);
            // Clear the stored validation requestId
            clearStoredRequestId(`validation_${lineItemId}`);
            refreshLeadsListRef.current();
          }
        }
      } catch (e) {
        // Handle error if needed
      }
    };

    pollStatus();
    intervalRef.current = setInterval(pollStatus, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isValidating, lineItemId]);

  // Function to start validation monitoring with requestId
  const startValidationMonitoring = (uploadRequestId?: string) => {
    if (uploadRequestId) {
      storeRequestId(lineItemId, uploadRequestId); // Store in localStorage
      setRequestId(uploadRequestId);
      setTaskStatus('QUEUED');
    } else {
      setIsValidating(true);
    }
  };

  // Check for task status or validation status on mount
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (!lineItemId) return;

      try {
        // First check if we have a stored task requestId
        const storedTaskRequestId = getStoredRequestId(lineItemId);
        // Also check for stored validation requestId
        const storedValidationRequestId = getStoredRequestId(
          `validation_${lineItemId}`,
        );

        if (storedTaskRequestId) {
          // If we have task requestId, check task status first
          setRequestId(storedTaskRequestId);
          setTaskStatus('QUEUED'); // Show initial status while we check

          const taskRes = await checkLeadUpsertTaskStatus(storedTaskRequestId);
          const taskData = taskRes?.data || taskRes;

          if (taskData && taskData.status) {
            if (taskData.status === 'Success') {
              // Task already completed, transition to validation monitoring
              storeRequestId(`validation_${lineItemId}`, storedTaskRequestId);
              clearStoredRequestId(lineItemId);
              setRequestId(null);
              setTaskStatus(null);

              const res = await fetchLeadUploadProcessingStatus(
                lineItemId,
                storedTaskRequestId,
              );
              const statusData = res?.data || res;

              if (statusData && statusData.inValidationCount > 0) {
                setLeadUploadProcessStatus({
                  inValidationCount: statusData.inValidationCount,
                  validInvalidCount: statusData.validInvalidCount,
                });
                setIsValidating(true);
              } else {
                // Validation already complete, just refresh the list
                refreshLeadsListRef.current();
              }
            } else if (taskData.status === 'Failed') {
              // Task failed, clear everything
              clearStoredRequestId(lineItemId);
              setRequestId(null);
              setTaskStatus(null);
            } else {
              // Task still in progress, continue monitoring
              setTaskStatus(taskData.status);
            }
          }
        } else if (storedValidationRequestId) {
          // No task requestId, but we have validation requestId - continue validation monitoring
          const res = await fetchLeadUploadProcessingStatus(
            lineItemId,
            storedValidationRequestId,
          );
          const statusData = res?.data || res;

          if (statusData && statusData.inValidationCount > 0) {
            setLeadUploadProcessStatus({
              inValidationCount: statusData.inValidationCount,
              validInvalidCount: statusData.validInvalidCount,
            });
            setIsValidating(true);
          } else {
            // Validation completed but localStorage wasn't cleared, clean it up
            clearStoredRequestId(`validation_${lineItemId}`);
            refreshLeadsListRef.current();
          }
        } else {
          // No stored requestIds, check validation status without requestId
          const res = await fetchLeadUploadProcessingStatus(lineItemId);
          const statusData = res?.data || res;

          if (statusData && statusData.inValidationCount > 0) {
            // If there are leads in validation on mount, start monitoring
            setLeadUploadProcessStatus({
              inValidationCount: statusData.inValidationCount,
              validInvalidCount: statusData.validInvalidCount,
            });
            setIsValidating(true);
          }
        }
      } catch (e) {
        // Handle error if needed
      }
    };

    checkInitialStatus();
  }, [lineItemId]);

  const canUploadLeads =
    isUploadAllowed && (hasUploadViewPermission || hasUpdateViewPermission);

  // Show progress bar if task is in progress or validation is in progress
  if (
    taskStatus ||
    isValidating ||
    (leadUploadProcessStatus && leadUploadProcessStatus.inValidationCount > 0)
  ) {
    return (
      <LeadValidationProgress
        inValidationCount={leadUploadProcessStatus?.inValidationCount || 0}
        validInvalidCount={leadUploadProcessStatus?.validInvalidCount || 0}
        taskStatus={taskStatus}
      />
    );
  }

  return (
    <Flex gap='1rem' align='center'>
      {/* <Link href={viewMoreLeadsLink}> // Not needed now might be in future, so commented it
        {t('viewMore')}
      </Link> */}
      {/* Validation might be used later, so commenting it out for now. Currently, validation is performed during upload. */}
      {/* <Hideable show={usePermissionCheck(LeadActionsEnum.ValidateLead)}>
        <ValidateLeads
          lineItemId={lineItemId}
          totalFilteredLeads={totalFilteredLeads}
          leadStatus={leadStatus}
          validationStatus={validationStatus}
        />
      </Hideable> */}
      <Hideable show={usePermissionCheck([LeadActionsEnum.ReturnLeads])}>
        <ReturnLeads
          leadIds={selectedIds}
          lineItemId={lineItemId}
          onSuccess={refreshLeadsList}
        />
      </Hideable>

      <Hideable show={usePermissionCheck([LeadActionsEnum.DownloadLead, LeadActionsEnum.View])}>
        {/* DZONE-5739 | changed to DownloadLead from Transform And Export */}
        {/* DZONE-4475 | point - 5 given a role has both 'View Leads' &
            'Download Leads' permissions; when user (mapped to the role)
            downloads leads */}
        <Button
          style={{
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.25rem',
            border: `1px solid ${DZONE_CLR_BLACK}`,
          }}
          onClick={onExport}
          icon={isExporting ? <LoadingOutlined /> : <DownloadOutlined />}
          className='dz-btn-action-1'
          disabled={isExporting}
        />
      </Hideable>
      <Hideable show={usePermissionCheck([LeadActionsEnum.StatusUpdate])}>
        <BulkStatusUpdateDropdown
          leadIds={selectedIds}
          disabled={isBulkStatusUpdateDisabled}
          tenantCode={tenantCode}
          lineItemId={lineItemId}
          filteredInfo={filteredInfo}
        />
      </Hideable>
      <Hideable show={usePermissionCheck([LeadActionsEnum.ArchiveLead])}>
        <ArchiveLeads
          leadIds={selectedIds}
          tenantCode={tenantCode}
          lineItemId={lineItemId}
          filteredInfo={filteredInfo}
        />
      </Hideable>
      <Hideable show={canUploadLeads}>
        <Link
          className='dz-link'
          style={{
            width: '12rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={isLoading}
          onClick={handleDownloadtemplate}>
          {isLoading ? (
            <LoadingOutlined style={{ color: DZONE_CLR_BLACK }} />
          ) : (
            t('Download Lead Template')
          )}
        </Link>
      </Hideable>
      <Hideable
        show={
          isPublishAllowed && leadsList?.length > 0 && hasPublishPermission
        }>
        <PublishLeads
          lineItemId={lineItemId}
          onSuccess={refreshLeadsList}
          selectedLeads={selectedIds}
        />
      </Hideable>
      <Hideable show={canUploadLeads}>
        <UploadLeads
          lineItemId={lineItemId}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
          validationSettingsId={lineItem?.validationSettingsId as string}
          onUploadStart={startValidationMonitoring}
        />
      </Hideable>
    </Flex>
  );
};
