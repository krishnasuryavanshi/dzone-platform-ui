import { FC } from 'react';
import { Flex } from 'antd';
import { ShowLineItemTabs } from './show-line-item-tabs';

interface ILeadsContainerProps {
  lineItemId: string;
  tenantCode?: string;
  sessionTenantCode?: string | string[];
}

export const LeadsContainer: FC<ILeadsContainerProps> = ({
  lineItemId,
  tenantCode,
  sessionTenantCode,
}) => {
  return (
    <Flex vertical gap='0.75rem'>
      <ShowLineItemTabs
        lineItemId={lineItemId}
        tenantCode={tenantCode}
        sessionTenantCode={sessionTenantCode}
      />
    </Flex>
  );
};
