import { useParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { ViewCampaignContainer } from './show-campaign/view-campaign-container';

export default function ViewCampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { isDzoneUser } = useAuthStore();
  return (
    <ViewCampaignContainer
      campaignId={campaignId!}
      isDzoneUser={isDzoneUser}
    />
  );
}
