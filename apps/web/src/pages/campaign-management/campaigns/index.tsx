import { useAuthStore } from '@dzone/shared-store';
import { CampaignListContainer } from './components/campaign-list-container';

export default function CampaignsPage() {
  const { isDzoneUser } = useAuthStore();
  return <CampaignListContainer isDzoneUser={isDzoneUser} />;
}
