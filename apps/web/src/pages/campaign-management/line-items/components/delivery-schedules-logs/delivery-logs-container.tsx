import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Flex } from 'antd';
import { Hideable, SimplePagination } from '@dzone/shared-ui';
import { DeliveryLogsHeader } from './delivery-logs-header';
import { DeliveryLogsList } from './delivery-logs-list';
import { useDeliveryLogsStore } from './use-delivery-logs-store';

interface DeliveryLogsContainerProps {
  lineItemId: string;
  sessionTenantCode?: string[];
}

export const DeliveryLogsContainer = ({
  lineItemId,
}: DeliveryLogsContainerProps) => {
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');
  const { fetchLogs, resetFilters, pagination, setPagination } =
    useDeliveryLogsStore();

  useEffect(() => {
    if (scheduleId) {
      resetFilters();
      fetchLogs(scheduleId);
    }
  }, [scheduleId, resetFilters, fetchLogs]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      currentPage: page,
      ...(pageSize && { perPage: pageSize }),
    });
    if (scheduleId) {
      fetchLogs(scheduleId);
    }
  };

  return (
    <Flex vertical gap='1rem'>
      <DeliveryLogsHeader scheduleId={scheduleId} lineItemId={lineItemId} />
      <DeliveryLogsList scheduleId={scheduleId} />
      <Hideable show={pagination.total > 0}>
        <SimplePagination
          current={pagination.currentPage}
          total={pagination.total}
          pageSize={pagination.perPage}
          onChange={handlePageChange}
        />
      </Hideable>
    </Flex>
  );
};
