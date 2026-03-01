import { Flex, Modal, Tooltip, Pagination, Typography, notification } from 'antd';
import { FC, useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { saveFileFromBlob } from '@dzone/shared-lib';
import { DeliveryFilterManager } from './delivery-filter-manager';
import { ITemplateInfo } from '../../lib/types/template';
import { ExportAndTransformModal } from './export-and-transform-modal';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';
import {
  SUCCESS_HEADER_MESSAGE,
  templateSelectedSuccessMessage,
  TRANSFORM_AND_EXPORT_SUCCESS_MESSAGE,
} from '../../lib/constants';
import { transformAndExportLeads } from '../../services';
import {
  fetchTotalFilteredLeadsCount,
  fetchTotalLeadsCount,
} from '../../services';
import { DeliveryTransformAndExportButton } from './delivery-transform-and-export-button';
import { Refresh } from '../show-leads/refresh';
import {
  TransformHistoryTable,
  TransformHistoryTableRef,
} from './transform-history-table';

const { Text } = Typography;

interface IDeliveryPanel {
  show: boolean;
  lineItemId: string;
  tenantCode?: string;
}

export const DeliveryPanel: FC<IDeliveryPanel> = ({
  show,
  lineItemId,
  tenantCode,
}) => {
  const { t } = useTranslation();
  const exportLogsTableRef = useRef<TransformHistoryTableRef>(null);
  const [selectedLeadStatuses, setSelectedLeadStatuses] = useState<string[]>(
    [],
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<ITemplateInfo | null>(null);
  const [totalFilteredLeads, setTotalFilteredLeads] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tablePagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const updateSelectedTemplate = (template: ITemplateInfo) => {
    setSelectedTemplate(template);
    notification.success({
      message: t(templateSelectedSuccessMessage(template?.name)),
      duration: 1,
    });
  };

  const updateSelectedLeadStatuses = (statuses: string[]) => {
    setSelectedLeadStatuses(statuses);
  };

  const createFilters = useCallback(() => {
    const filters: Record<string, any>[] = [];
    if (selectedLeadStatuses.length) {
      filters.push({ key: 'leadStatus', value: selectedLeadStatuses });
    }
    return filters;
  }, [selectedLeadStatuses]);

  const fetchFilteredLeads = useCallback(async () => {
    const filters = createFilters();
    const data = await fetchTotalFilteredLeadsCount(lineItemId, filters);
    setTotalFilteredLeads(data?.leadCount);
  }, [lineItemId, createFilters]);

  const fetchLeads = useCallback(async () => {
    const data = await fetchTotalLeadsCount(lineItemId);
    setTotalFilteredLeads(data?.count);
  }, [lineItemId]);

  useEffect(() => {
    if (selectedLeadStatuses.length > 0) {
      fetchFilteredLeads();
    } else {
      fetchLeads();
    }
  }, [selectedLeadStatuses, fetchFilteredLeads, fetchLeads]);
  if (!show) {
    return null;
  }

  const handleProceed = async () => {
    try {
      setIsLoading(true);

      const filters = createFilters();
      const requestPayload = {
        lineItemId: lineItemId,
        templateId: selectedTemplate?.id,
        filters,
      };
      const { data, headers, error } =
        await transformAndExportLeads(requestPayload);
      if (data) {
        // Check if it's a 202 response (async processing)
        if (
          data.statusCode === 202 ||
          (typeof data === 'object' && data.message && data.requestId)
        ) {
          // Handle async processing response - use exact message from backend
          notification.success({
            message: 'Processing',
            description: data.message,
            duration: 7,
          });

          // Refresh the export logs table to show the processing status
          setTimeout(() => {
            exportLogsTableRef.current?.refreshData();
          }, 1000);

          closeModal();
        } else {
          // Handle direct file download response
          const contentDisposition =
            typeof headers?.get === 'function'
              ? headers.get('content-disposition')
              : (headers as any)?.['content-disposition'];
          const fileName = contentDisposition?.split('filename=')[1];
          if (fileName) {
            const contentType =
              typeof headers?.get === 'function'
                ? headers.get('content-type')
                : (headers as any)?.['content-type'];
            saveFileFromBlob(
              data,
              fileName.replaceAll('"', ''),
              contentType,
            );
          }

          // Refresh the export logs table to show the latest export
          setTimeout(() => {
            exportLogsTableRef.current?.refreshData();
          }, 1000);

          notification.success({
            message: SUCCESS_HEADER_MESSAGE,
            description: TRANSFORM_AND_EXPORT_SUCCESS_MESSAGE,
            duration: 3,
          });
          closeModal();
        }
      }
      if (error) {
        const errorMessage = error?.message;
        const errorHeader = error?.messageHeader;
        notification.error({
          message: errorHeader || 'Error',
          description: errorMessage,
          duration: 3,
        });
      }
    } catch (error: any) {
      // Error handled above
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Flex
        vertical
        gap='1rem'
        style={{
          width: '100%',
          minHeight: '8rem',
          height: 'calc(100vh - 24rem)',
        }}>
        <DeliveryFilterManager
          updateSelectedLeadStatuses={updateSelectedLeadStatuses}
          updateSelectedTemplate={updateSelectedTemplate}
          selectedLeadStatuses={selectedLeadStatuses}
          selectedTemplate={selectedTemplate}
          tenantCode={tenantCode}
          lineItemId={lineItemId}
        />
        <Flex justify='end' style={{ width: '100%' }}>
          <Tooltip
            placement='top'
            title={
              selectedTemplate
                ? t('pages.delivery.enabledTooltipMessage')
                : t('pages.delivery.disabledTooltipMessage')
            }
            arrow={{ pointAtCenter: true }}>
            <Flex>
              <DeliveryTransformAndExportButton
                openModal={openModal}
                selectedTemplate={selectedTemplate}
              />
            </Flex>
          </Tooltip>
        </Flex>
        <Flex vertical gap='1rem' style={{ width: '100%' }}>
          <Flex
            justify='space-between'
            align='center'
            style={{ width: '100%' }}>
            <Flex gap='0.5rem' align='center'>
              <Text strong style={{ fontSize: '1rem' }}>
                Logs
              </Text>
              <Refresh
                onRefresh={() => exportLogsTableRef.current?.refreshData()}
              />
            </Flex>
            <Pagination
              showSizeChanger
              showLessItems
              current={tablePagination.current}
              total={tablePagination.total}
              pageSize={tablePagination.pageSize}
              onChange={(page, pageSize) =>
                exportLogsTableRef.current?.handlePageChange(
                  page,
                  pageSize || tablePagination.pageSize,
                )
              }
            />
          </Flex>
          <TransformHistoryTable
            ref={exportLogsTableRef}
            lineItemId={lineItemId}
            onPaginationChange={setTablePagination}
          />
        </Flex>
      </Flex>
      <Modal
        width={'50%'}
        open={isOpen}
        onCancel={closeModal}
        closable={!isLoading}
        maskClosable={false}
        title={<ModalHeader title='pages.transformAndExportLeads' />}
        footer={
          <ModalFooter
            isLoading={isLoading}
            onCancel={closeModal}
            handleProceed={handleProceed}
            filterLeadsCount={totalFilteredLeads}
          />
        }>
        <ExportAndTransformModal filterLeadsCount={totalFilteredLeads} />
      </Modal>
    </>
  );
};
