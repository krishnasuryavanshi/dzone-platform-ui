import { CreateCampaignForm } from './create/create-campaign-form';

// Edit reuses CreateCampaignForm — it reads campaignUUId from useParams internally
export default function EditCampaignPage() {
  return <CreateCampaignForm />;
}
