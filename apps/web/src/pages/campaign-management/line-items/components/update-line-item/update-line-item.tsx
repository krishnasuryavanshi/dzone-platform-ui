import { FC } from 'react';
import { CreateNewLineItem } from '../create-new-line-item';

interface IUpdateLineItemProps {
  lineItemId: string;
  userDetails?: any;
  tenantCode?: string | string[];
}
const UpdateLineItem: FC<IUpdateLineItemProps> = ({
  lineItemId,
  userDetails,
  tenantCode,
}) => {
  return (
    <CreateNewLineItem
      lineItemId={lineItemId}
      userDetails={userDetails}
      tenantCode={tenantCode}
    />
  );
};

export default UpdateLineItem;
