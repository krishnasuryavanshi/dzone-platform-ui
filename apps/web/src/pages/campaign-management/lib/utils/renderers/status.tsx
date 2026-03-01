import { CampaignStatus } from '../../../components/campaign-status';
import { StatusAction } from '../../../components/show-page/status-action';

export const statusRenderer = (_val: unknown, record: Record<string, any>) => {
  if ('lineItemId' in record) {
    return <StatusAction record={record} />;
  } else if ('campaignId' in record && record.status?.name === 'DRAFT') {
    // TODO: Import CampaignStatusAction from campaigns/components when available in 5B
    return <CampaignStatus status={record.status} />;
  } else {
    return <CampaignStatus status={record.status} />;
  }
};
