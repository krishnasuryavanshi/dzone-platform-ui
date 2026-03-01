import { useParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { CreateNewLineItem } from './components/create-new-line-item';

export default function CreateLineItemPage() {
  const { lineItemId } = useParams<{ lineItemId?: string }>();
  const { tenantCode, user, isDzoneUser } = useAuthStore();

  return (
    <CreateNewLineItem
      tenantCode={tenantCode}
      userDetails={user}
      isDzoneUser={isDzoneUser}
      lineItemId={lineItemId}
    />
  );
}
