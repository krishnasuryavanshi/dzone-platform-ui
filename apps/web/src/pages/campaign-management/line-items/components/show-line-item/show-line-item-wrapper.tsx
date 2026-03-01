import { FC, useEffect } from 'react';
import { useLineItemStore } from '../../stores';
import { IShowLineItemContainerProps } from './show-line-item-container';

export const ShowLineItemWrapper: FC<IShowLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  lineItemDetails,
  children,
}) => {
  const { setValue, setLineItem } = useLineItemStore();

  useEffect(() => {
    setValue({
      lineItemId,
      campaignId,
    });
  }, [lineItemId, campaignId]);

  useEffect(() => {
    if (lineItemDetails) {
      setLineItem(lineItemDetails);
    }
  }, [lineItemDetails]);

  return <>{children}</>;
};
