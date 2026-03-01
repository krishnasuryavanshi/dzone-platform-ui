import { useParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import UpdateLineItem from './components/update-line-item/update-line-item';

export default function EditLineItemPage() {
  const { lineItemId } = useParams<{ lineItemId: string }>();
  const { tenantCode, user } = useAuthStore();

  return (
    <UpdateLineItem
      lineItemId={lineItemId!}
      userDetails={user}
      tenantCode={tenantCode}
    />
  );
}
