import { StorageKey } from '@dzone/shared-lib';
import { createCookieForExistingRecord } from '@/services/cookie-stepper-form';
import { FC, useEffect, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { LineItemFormContainer } from './line-item-form-container';
import { ICampaign } from '../../../campaigns/lib/types';
import { fetchCampaignDetails } from '../../../campaigns/services';
import { useLineItemStore } from '../../stores';

interface ICreateLineItemProps {
  userDetails?: any;
  tenantCode?: string | string[];
  isDzoneUser?: boolean;
}

export const CreateLineItem: FC<ICreateLineItemProps> = ({
  userDetails,
  isDzoneUser,
  tenantCode,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { queryState, updateQueryParams } = useUpdateQueryState();
  const { setSourceObject } = useLineItemStore();
  const [campaignData, setCampaignData] = useState<ICampaign>({} as ICampaign);
  const fetchCampaignId = async () => {
    try {
      const data = await fetchCampaignDetails(queryState?.campaignId);
      setCampaignData(data?.data as ICampaign);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setSourceObject({});
    createCookieForExistingRecord(StorageKey.LineItemForm, {});
    updateQueryParams(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (queryState?.campaignId) {
      fetchCampaignId();
    }
  }, [queryState?.campaignId]);

  if (loading) {
    return null;
  }

  return (
    <LineItemFormContainer
      campaignData={campaignData}
      tenantCode={campaignData?.tenantCode || tenantCode}
      userId={userDetails?.userId}
      isDzoneUser={isDzoneUser}
    />
  );
};
