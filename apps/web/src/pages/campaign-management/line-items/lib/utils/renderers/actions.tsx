import { LineItemRecordActions } from '../../../components';
import { ILineItem } from '../../types';

export const lineItemActionsRenderer = (_val: unknown, lineItem: ILineItem) => {
  return (
    <LineItemRecordActions
      {...{
        lineItemId: lineItem.id,
        campaignId: lineItem.campaign.id,
        tenantCode: lineItem.tenantCode,
        stepId: lineItem.stepId,
        marketerCode: lineItem.marketerCode,
      }}
    />
  );
};
