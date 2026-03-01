import { Flex } from 'antd';
import { RestrictedAccessKeys } from '@dzone/shared-lib';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { BasicDetails } from '../../config/forms/basic-details';
// TODO: Re-enable once custom questions are shown in details
// import { CustomQuestionsConfig } from '../../config/forms/custom-questions';
// import { useLineItemStore } from '../../stores';
import { LineItemSummaryViewFields } from '../../lib/constants';
import { LineItemFields } from '../../lib/enums';
import { ILineItem } from '../../lib/types';
import { prepareViewData } from '../../lib/utils/prepare-view-data';
import {
  fetchFileDetails,
  fetchLineItem,
  fetchMultipleFileDetails,
} from '../../services';
import { LeadsContainer } from '../leads-container';
import { ShowLineItemBreadcrumb } from './../show-line-item-breadcrumb';
import { ShowLineItemWrapper } from './show-line-item-wrapper';
import { ShowLineItemDetails } from '../show-page/show-line-item-details';
import { IShowItemDetailsProps } from '../../../lib/types';
import { useRestrictedAccess } from '../../../campaigns/lib/hooks/use-restricted-access';

export interface IShowLineItemContainerProps extends PropsWithChildren {
  lineItemId: string;
  campaignId: string;
  lineItemDetails?: ILineItem;
  sessionTenantCode?: string | string[];
}

export const ShowLineItemContainer: FC<IShowLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  sessionTenantCode,
}) => {
  const isTargetCplRestricted = useRestrictedAccess(
    RestrictedAccessKeys.CplFieldInLineItemDetails,
  );
  const [lineItemDetails, setLineItemDetails] = useState<ILineItem>();
  const [detailsSectionProps, setDetailsSectionProps] =
    useState<IShowItemDetailsProps>({
      pageLabel: 'pages.lineItems.label.lineItemDetails',
      formConfig: [...BasicDetails],
      summaryViewFields: LineItemSummaryViewFields,
      updateUrl: 'edit',
    } as IShowItemDetailsProps);

  useEffect(() => {
    if (lineItemId) {
      fetchLineItemDetails();
    }
  }, [lineItemId]);

  const fetchLineItemDetails = async () => {
    const data = await fetchLineItem(lineItemId);
    let assetFileIds = [];
    if (data?.data?.assetFileIds?.length > 0) {
      const assetFileResponse = await fetchMultipleFileDetails(
        data?.data?.assetFileIds,
      );
      assetFileIds = assetFileResponse?.data;
    }
    let deliveryTemplateDetails = {};
    if (data?.data?.deliveryTemplateId) {
      const deliveryTemplateResponse = await fetchFileDetails(
        data?.data?.deliveryTemplateId,
      );
      deliveryTemplateDetails = deliveryTemplateResponse;
    }
    const viewData = prepareViewData(data?.data, {
      restrictedFields: [
        isTargetCplRestricted && LineItemFields.TargetCostPerLead,
      ],
    });

    const updatedLineItemDetails = {
      ...viewData,
      assetFileIds: assetFileIds,
      deliveryTemplateId: deliveryTemplateDetails,
    };

    setLineItemDetails(updatedLineItemDetails);

    setDetailsSectionProps({
      ...detailsSectionProps,
      itemDetails: updatedLineItemDetails,
    });
  };

  return (
    <ShowLineItemWrapper
      lineItemId={lineItemId}
      campaignId={campaignId}
      lineItemDetails={lineItemDetails}>
      <Flex vertical>
        <Flex vertical style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
          <ShowLineItemBreadcrumb
            {...{
              campaignId: lineItemDetails?.campaign?.campaignId,
              lineItemId: lineItemDetails?.lineItemId,
              campaignUuid: campaignId,
            }}
          />
        </Flex>
        <Flex vertical style={{ padding: '0.5rem', paddingTop: '0rem' }}>
          <ShowLineItemDetails {...detailsSectionProps} type='lineItem' />
          <LeadsContainer
            lineItemId={lineItemId}
            tenantCode={lineItemDetails?.sourceTenantCode}
            sessionTenantCode={sessionTenantCode}
          />
        </Flex>
      </Flex>
    </ShowLineItemWrapper>
  );
};
