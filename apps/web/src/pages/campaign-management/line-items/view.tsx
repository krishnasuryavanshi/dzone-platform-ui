import { useParams, useSearchParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { ShowLineItemContainer } from './components/show-line-item';

export default function ViewLineItemPage() {
  const { lineItemId } = useParams<{ lineItemId: string }>();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId') || '';
  const { tenantCode } = useAuthStore();

  return (
    <ShowLineItemContainer
      lineItemId={lineItemId!}
      campaignId={campaignId}
      sessionTenantCode={tenantCode}
    />
  );
}
