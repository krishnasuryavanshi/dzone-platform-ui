import { FC } from 'react';
import { Flex } from 'antd';
import { LineItemForm } from './line-item-form';
import { LineItemStepsControl } from './line-item-steps-control';
import { StorageKey } from '@dzone/shared-lib';
import { useSavedSteps } from '../../../lib/hooks';
import { useUpdateQueryState } from '../../../lib/hooks/use-update-query-state';
import { ICustomRangeDetails, ILineItem } from '../../lib/types';
import { ICampaign } from '../../../campaigns/lib/types';

interface ILineItemFormWrapper {
  campaignUuid?: string;
  campaignData?: ICampaign;
  tenantCode?: string | string[];
  lineItemDetails?: ILineItem;
  customRangeLimit: ICustomRangeDetails;
  userId?: string;
  isDzoneUser?: boolean;
}
export const LineItemFormWrapper: FC<ILineItemFormWrapper> = ({
  campaignUuid,
  campaignData,
  isDzoneUser,
  tenantCode,
  lineItemDetails,
  customRangeLimit,
  userId,
}) => {
  const { queryState, updateQueryParams } = useUpdateQueryState();

  const step = Number(queryState.step);

  const savedSteps = useSavedSteps(StorageKey.LineItemForm, step);
  const handleStepperChange = (key: number) => {
    if (key >= savedSteps.length) {
      return;
    }
    updateQueryParams(key);
  };

  return (
    <Flex vertical gap='0.75rem' style={{ width: '100%' }}>
      <LineItemStepsControl
        currentStep={step}
        savedSteps={savedSteps}
        handleStepperChange={handleStepperChange}
      />
      <LineItemForm
        step={step}
        campaignUuid={campaignUuid}
        campaignData={campaignData}
        tenantCode={tenantCode}
        lineItemDetails={lineItemDetails}
        customRangeLimit={customRangeLimit}
        userId={userId}
        isDzoneUser={isDzoneUser}
      />
    </Flex>
  );
};
