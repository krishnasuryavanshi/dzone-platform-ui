import { FC, useEffect, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { ICampaign } from '../../../campaigns/lib/types';
import { fetchCampaignDetails } from '../../../campaigns/services';
import { Flex } from 'antd';
import { LineItemBreadCrumbContainer } from '../create-line-item/line-item-breadcrumb-container';
import { FormContainer } from './form-container';
import { ICreateLineItemBreadcrumbsProps } from '../create-line-item/line-item-breadcrumbs';
import { fetchLineItem } from '../../services';
import { ILineItem } from '../../lib/types';

interface ICreateNewLineItemProps extends ICreateLineItemBreadcrumbsProps {
  userDetails?: any;
  tenantCode?: string | string[];
  isDzoneUser?: boolean;
  lineItemId?: string;
}

export const CreateNewLineItem: FC<ICreateNewLineItemProps> = ({
  userDetails,
  isDzoneUser,
  tenantCode,
  lineItemId,
  lineItemDetails,
}) => {
  const { queryState } = useUpdateQueryState();
  const [loading, setLoading] = useState<boolean>(true);
  const [campaignData, setCampaignData] = useState<ICampaign>({} as ICampaign);
  const [localLineItemId, setLocalLineItemId] = useState<string | undefined>(
    lineItemId,
  );
  const [fetchedLineItemDetails, setFetchedLineItemDetails] = useState<any>(
    lineItemDetails || {},
  );

  const fetchCampaignId = async () => {
    const data = await fetchCampaignDetails(queryState?.campaignId);
    setCampaignData(data?.data as ICampaign);
  };

  const handleLineItemCreated = async (newLineItemId: string) => {
    setLocalLineItemId(newLineItemId);
    setLoading(true);
    const details = await fetchLineItem(newLineItemId);
    if (details?.data) {
      setFetchedLineItemDetails((prevDetails: ILineItem) => ({
        ...prevDetails,
        ...details.data,
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    const shouldFetch = !lineItemDetails && localLineItemId;
    if (shouldFetch) {
      const fetchDetails = async () => {
        const details = await fetchLineItem(localLineItemId);
        if (details?.data) {
          setFetchedLineItemDetails((prevDetails: ILineItem) => ({
            ...prevDetails,
            ...details.data,
          }));
        }
        setLoading(false);
      };
      fetchDetails();
    } else {
      setFetchedLineItemDetails(lineItemDetails || {});
      setLoading(false);
    }
  }, [localLineItemId]);

  useEffect(() => {
    if (queryState?.campaignId) {
      fetchCampaignId();
    }
  }, [queryState?.campaignId]);

  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Flex style={{ flexShrink: 0 }}>
        <LineItemBreadCrumbContainer
          {...{
            campaignData,
            id: fetchedLineItemDetails?.id,
            lineItemId: fetchedLineItemDetails?.lineItemId,
          }}
        />
      </Flex>
      <Flex style={{ flex: 1, overflow: 'auto' }}>
        <FormContainer
          campaignUuid={campaignData?.id as string}
          campaignData={campaignData}
          tenantCode={tenantCode}
          lineItemDetails={fetchedLineItemDetails}
          lineItemId={localLineItemId}
          userId={userDetails?.userId}
          isDzoneUser={isDzoneUser}
          onCreateSuccess={handleLineItemCreated}
          loading={loading}
        />
      </Flex>
    </Flex>
  );
};
