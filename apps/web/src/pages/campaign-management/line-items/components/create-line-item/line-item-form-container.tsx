import { FC } from 'react';
import { LineItemBreadCrumbContainer } from './line-item-breadcrumb-container';
import { LineItemFormWrapper } from './line-item-form-wrapper';
import { Flex } from 'antd';
import { ICreateLineItemBreadcrumbsProps } from './line-item-breadcrumbs';
import { ICustomRangeDetails } from '../../lib/types';
import { ICampaign } from '../../../campaigns/lib/types';

interface ILineItemFormContainer extends ICreateLineItemBreadcrumbsProps {
  customRangeLimit?: ICustomRangeDetails;
  campaignData?: ICampaign;
  tenantCode?: string | string[];
  userId?: string;
  campaignName?: string;
  isDzoneUser?: boolean;
}

export const LineItemFormContainer: FC<ILineItemFormContainer> = ({
  isDzoneUser,
  id,
  tenantCode,
  lineItemId,
  lineItemDetails,
  customRangeLimit,
  campaignData,
  userId,
}) => {
  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Flex style={{ flexShrink: 0 }}>
        <LineItemBreadCrumbContainer {...{ campaignData, id, lineItemId }} />
      </Flex>
      <Flex style={{ flex: 1, overflow: 'auto' }}>
        <LineItemFormWrapper
          campaignUuid={campaignData?.id as string}
          campaignData={campaignData}
          tenantCode={tenantCode}
          lineItemDetails={lineItemDetails}
          customRangeLimit={customRangeLimit!}
          userId={userId}
          isDzoneUser={isDzoneUser}
        />
      </Flex>
    </Flex>
  );
};
