import { ShowSupplier } from '../../../components/show-supplier';
import { ILineItem } from '../../types';

export const supplierAssignmentRenderer = (
  _val: unknown,
  lineItem: ILineItem,
) => {
  return <ShowSupplier lineItem={lineItem} />;
};
