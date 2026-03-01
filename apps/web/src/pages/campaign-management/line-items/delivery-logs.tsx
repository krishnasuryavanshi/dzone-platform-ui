import { useParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { DeliveryLogsContainer } from './components/delivery-schedules-logs';

export default function DeliveryLogsPage() {
  const { lineItemId } = useParams<{ lineItemId: string }>();
  const { tenantCode } = useAuthStore();

  return (
    <DeliveryLogsContainer
      lineItemId={lineItemId!}
      sessionTenantCode={tenantCode}
    />
  );
}
